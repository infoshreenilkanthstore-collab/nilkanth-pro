import React, { useEffect, useState } from "react";
import { Loader2, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { verifyPayment, syncFinalOrder, deleteAbandonedOrder, clearCartApi } from "../../services/api";
import { trackPurchase } from "../../services/analytics";

export default function GatewayCallbackPage({ provider = "icici", onNavigate, onPaymentVerified }) {
  const [status, setStatus] = useState("verifying"); // 'verifying' | 'success' | 'failed'
  const [errorMessage, setErrorMessage] = useState("");
  const [verifiedOrder, setVerifiedOrder] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function processCallback() {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.replace("#", "?"));

        // Helper to grab param from either search or hash
        const getParam = (key) => urlParams.get(key) || hashParams.get(key) || "";

        let payload = {};
        const savedSession = sessionStorage.getItem("nilkanth_pending_checkout");
        const pendingData = savedSession ? JSON.parse(savedSession) : {};

        let orderId = Number(getParam("order_id") || pendingData.order_id || pendingData.id || 0);
        let paymentId = Number(getParam("payment_id") || pendingData.payment_id || 0);
        const txnid = getParam("txnid") || pendingData.txnid || "";

        // Extract order_id & payment_id from txnid if missing (format: TXN_31271_371_timestamp)
        if (txnid && txnid.startsWith("TXN_")) {
          const parts = txnid.split("_");
          if (!orderId && parts.length >= 2 && !isNaN(parts[1])) {
            orderId = Number(parts[1]);
          }
          if (!paymentId && parts.length >= 3 && !isNaN(parts[2])) {
            paymentId = Number(parts[2]);
          }
        }

        if (provider === "icici") {
          payload = {
            provider: "icici",
            order_id: orderId,
            payment_id: paymentId,
            "Response Code": getParam("Response Code") || getParam("response_code") || "E000",
            "Unique Ref Number": getParam("Unique Ref Number") || getParam("unique_ref_number") || getParam("reference_no") || "",
            ReferenceNo: getParam("ReferenceNo") || getParam("reference_no") || "",
            "Transaction Amount": getParam("Transaction Amount") || getParam("amount") || "",
          };
        } else if (provider === "easebuzz") {
          const rawStatus = (getParam("status") || "").trim().toLowerCase();
          const isExplicitFailure = rawStatus && !["success", "successful"].includes(rawStatus);

          if (isExplicitFailure) {
            if (!isMounted) return;
            setStatus("failed");
            const errReason =
              getParam("error_Message") ||
              getParam("error_message") ||
              (rawStatus === "usercancelled" ? "Transaction was cancelled by the user." : `Payment status: ${getParam("status") || "Failed"}. Please retry.`);
            setErrorMessage(errReason);
            return;
          }

          payload = {
            provider: "easebuzz",
            order_id: orderId,
            payment_id: paymentId,
            status: getParam("status") || "success",
            txnid: txnid,
            amount: getParam("amount") || (pendingData.total ? String(Number(pendingData.total).toFixed(2)) : ""),
            firstname: getParam("firstname") || pendingData.customer?.firstName || pendingData.customer?.name?.split(" ")[0] || "Customer",
            email: getParam("email") || pendingData.customer?.email || "",
            phone: getParam("phone") || pendingData.customer?.phone || "",
            productinfo: getParam("productinfo") || pendingData.productinfo || (orderId ? `Order CHK-${orderId}` : "Order"),
            hash: getParam("hash") || "",
            easepayid: getParam("easepayid") || "",
            error_Message: getParam("error_Message") || "",
          };
        }

        const res = await verifyPayment(payload);

        if (!isMounted) return;

        if (res.success) {
          const abandonedId = Number(payload.order_id || pendingData.order_id || pendingData.id || 0);
          const items = pendingData.items || [];
          const customer = pendingData.customer || {
            name: payload.firstname || "Devoted Customer",
            email: payload.email || "",
            phone: payload.phone || "",
          };
          const shippingAddress = pendingData.shipping_address || {};
          const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

          // Phase 3: Convert Abandoned Draft to Official Placed Order (POST /checkout/sync)
          const syncPayload = {
            customer_id: null,
            first_name: customer.firstName || customer.name?.split(" ")[0] || "Customer",
            last_name: customer.lastName || customer.name?.split(" ").slice(1).join(" ") || "",
            customerName: customer.name || `${customer.firstName || ""} ${customer.lastName || ""}`.trim() || "Devoted Customer",
            customerPhone: customer.phone || payload.phone || "",
            customerEmail: customer.email || payload.email || "",
            abandoned_checkout_id: abandonedId || null,
            items: items.map((it) => ({
              productId: Number(it.product_id || it.productId || it.id || 0),
              variantId: Number(it.variant_id || it.variantId || 0) || null,
              title: it.title || it.product_title || "Sacred Item",
              sku: it.sku || "",
              price: Number(it.price || 0),
              quantity: Number(it.quantity || 1),
            })),
            shippingAddress: {
              name: customer.name || "Devoted Customer",
              line1: shippingAddress.address1 + (shippingAddress.address2 ? `, ${shippingAddress.address2}` : ""),
              city: shippingAddress.city || "",
              state: shippingAddress.state || "",
              pincode: shippingAddress.pincode || "",
              country: shippingAddress.country || "India",
              phone: customer.phone || payload.phone || "",
              email: customer.email || payload.email || "",
            },
            subtotal: Number(pendingData.total || payload.amount || 0),
            discountAmount: Number(pendingData.discountAmount || 0),
            discountCode: pendingData.discountCode || "",
            shippingAmount: Number(pendingData.shippingAmount || 0),
            shippingMethod: pendingData.shippingMethod || "Standard Shipping",
            taxAmount: Number(pendingData.taxAmount || 0),
            total: Number(pendingData.total || payload.amount || 0),
            currency: "INR",
            paymentMethod: "online",
            paymentProvider: provider,
            paymentStatus: "paid",
            transactionReference: payload["Unique Ref Number"] || payload.txnid || payload.easepayid || "",
            device_type: "desktop",
            is_mobile: false,
          };

          const syncRes = await syncFinalOrder(syncPayload);
          const officialOrderData = syncRes?.data || {
            id: abandonedId,
            order_number: `ORD-${abandonedId}`,
            total: pendingData.total || payload.amount,
            financial_status: "paid",
          };

          // Phase 4: Delete Abandoned Order Draft & Clean Cart
          if (abandonedId) {
            await deleteAbandonedOrder(abandonedId);
          }
          await clearCartApi();
          sessionStorage.removeItem("nilkanth_checkout_session_id");
          sessionStorage.removeItem("nilkanth_pending_checkout");

          const confirmedOrder = {
            ...officialOrderData,
            customer,
            shipping_address: shippingAddress,
            items,
            total: Number(officialOrderData.total || pendingData.total || payload.amount || 0),
            provider,
            payment_method: "online",
            financial_status: "paid",
          };

          // Persist confirmed order in session
          sessionStorage.setItem("nilkanth_last_placed_order", JSON.stringify(confirmedOrder));

          trackPurchase(confirmedOrder);
          setStatus("success");
          setVerifiedOrder(confirmedOrder);

          if (onPaymentVerified) {
            onPaymentVerified(confirmedOrder);
          }

          // Automatically transition to Success Page
          const timer = setTimeout(() => {
            if (onNavigate) {
              onNavigate("checkout-success", { orderData: confirmedOrder });
            }
          }, 1000);

          return () => clearTimeout(timer);
        } else {
          setStatus("failed");
          setErrorMessage(res.message || "Gateway signature or status verification failed");
        }
      } catch (err) {
        if (!isMounted) return;
        setStatus("failed");
        setErrorMessage(err.message || "An unexpected error occurred during verification");
      }
    }

    processCallback();

    return () => {
      isMounted = false;
    };
  }, [provider]);

  return (
    <div className="min-h-screen bg-[#fcfaf7] flex items-center justify-center py-16 px-4 font-nunito">
      <div className="max-w-md w-full bg-white border border-stone-200/90 rounded-3xl p-8 text-center shadow-xs">
        {status === "verifying" && (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-[#700b10]">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <h2 className="font-serif text-xl font-bold text-stone-900">Verifying Payment</h2>
            <p className="text-xs text-stone-500 leading-relaxed">
              Please wait while we confirm your payment securely with the bank gateway...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h2 className="font-serif text-xl font-bold text-stone-900">Payment Verified!</h2>
            <p className="text-xs text-stone-500 leading-relaxed">
              Your transaction has been securely confirmed. Proceeding to order summary...
            </p>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate("checkout-success", { orderData: verifiedOrder })}
              className="mt-4 w-full bg-[#700b10] hover:bg-[#54060b] text-white py-3 px-6 rounded-full font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>View Order Receipt</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {status === "failed" && (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-9 h-9" />
            </div>
            <h2 className="font-serif text-xl font-bold text-stone-900">Verification Failed</h2>
            <p className="text-xs text-rose-700 leading-relaxed bg-rose-50 p-3 rounded-xl border border-rose-200">
              {errorMessage}
            </p>
            <p className="text-xs text-stone-500">
              Your cart items are safe. You can retry with another payment method.
            </p>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate("checkout")}
              className="mt-4 w-full bg-stone-900 hover:bg-stone-800 text-white py-3 px-6 rounded-full font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              Return to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
