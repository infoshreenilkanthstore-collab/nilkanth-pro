import React, { useEffect, useState } from "react";
import { CheckCircle2, Package, Truck, ShieldCheck, ArrowRight, MessageCircle, Download } from "lucide-react";
import { trackPurchase } from "../../services/analytics";

export default function CheckoutSuccessPage({ orderData: propOrderData, onNavigate }) {
  const [orderData, setOrderData] = useState(() => {
    if (propOrderData) return propOrderData;
    try {
      const saved = sessionStorage.getItem("nilkanth_last_placed_order");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    if (propOrderData) {
      setOrderData(propOrderData);
      trackPurchase(propOrderData);
    } else if (orderData) {
      trackPurchase(orderData);
    }
  }, [propOrderData]);

  const orderNumber = orderData?.order_number || orderData?.id || "ORD-" + Math.floor(100000 + Math.random() * 900000);
  const items = orderData?.items || [];
  const customer = orderData?.customer || {};
  const shippingAddress = orderData?.shipping_address || {};
  const total = orderData?.total || orderData?.amount || 0;
  const isCod = orderData?.provider === "cod" || orderData?.payment_method === "cod";

  return (
    <div className="min-h-screen bg-[#fcfaf7] py-10 sm:py-16 px-4 sm:px-6 lg:px-8 font-nunito animate-fadeIn">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Success Header */}
        <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-10 text-center shadow-xs">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-4 animate-bounce">
            <CheckCircle2 className="w-10 h-10 stroke-[2]" />
          </div>

          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#700b10] bg-amber-50 border border-amber-200 px-3 py-1 rounded-full inline-block mb-3">
            {isCod ? "Cash on Delivery Order Confirmed" : "Payment Verified & Order Confirmed"}
          </span>

          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            Jai Swaminarayan, {customer.name || customer.firstName || "Devoted Customer"}!
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm mt-2 max-w-md mx-auto leading-relaxed">
            Thank you for your blessed order. We have received your sacred items request and are preparing it with pure devotion.
          </p>

          <div className="mt-6 inline-flex items-center gap-3 bg-stone-50 border border-stone-200/80 px-4 py-2.5 rounded-2xl text-xs font-mono">
            <span className="text-stone-500 font-sans">Order Reference:</span>
            <strong className="text-stone-900 font-bold text-sm">{orderNumber}</strong>
          </div>
        </div>

        {/* Order Details & Summary Card */}
        <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="font-serif text-lg sm:text-xl font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
            <Package className="w-5 h-5 text-[#700b10]" />
            <span>Order Summary</span>
          </h2>

          {/* Items */}
          {items.length > 0 ? (
            <div className="divide-y divide-stone-100">
              {items.map((it, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-amber-50 rounded-xl border border-stone-200 flex items-center justify-center font-bold text-[#700b10] text-xs shrink-0 overflow-hidden">
                      {it.image ? <img src={it.image} alt={it.title} className="w-full h-full object-cover" /> : "NS"}
                    </div>
                    <div>
                      <p className="font-bold text-stone-900">{it.title || it.product_title}</p>
                      <p className="text-[11px] text-stone-500">Qty: {it.quantity || 1}</p>
                    </div>
                  </div>
                  <span className="font-bold text-stone-900">
                    ₹{((Number(it.price) || 0) * (it.quantity || 1)).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-stone-500">All purchased items confirmed.</p>
          )}

          {/* Total */}
          <div className="pt-4 border-t border-stone-200 flex justify-between items-baseline">
            <span className="font-bold text-stone-700 text-sm">Grand Total Amount</span>
            <span className="font-serif text-xl sm:text-2xl font-extrabold text-[#700b10]">
              ₹{Number(total).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Shipping Address & Status Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-stone-100 text-xs">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
              <h3 className="font-bold text-stone-900 mb-2 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#700b10]" />
                <span>Shipping Address</span>
              </h3>
              <p className="text-stone-700 font-medium leading-snug">
                {shippingAddress.address1 || "Delivery Destination"}
              </p>
              {shippingAddress.address2 && <p className="text-stone-600">{shippingAddress.address2}</p>}
              <p className="text-stone-600">
                {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}
              </p>
              <p className="text-stone-500 mt-1 font-mono">{customer.phone || shippingAddress.phone}</p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
              <h3 className="font-bold text-stone-900 mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Delivery &amp; Fulfillment</span>
              </h3>
              <p className="text-stone-600 leading-snug">
                Status: <strong className="text-emerald-700 uppercase">Processing Dispatch</strong>
              </p>
              <p className="text-stone-500 text-[11px] mt-1">
                Estimated Transit: <strong>3-5 Business Days</strong> across India with tracking details sent to your phone.
              </p>
            </div>
          </div>
        </div>

        {/* Support & Next Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <a
            href="https://wa.me/918999123868?text=Hello%20Nilkanth%20Store%2C%20I%20have%20an%20inquiry%20regarding%20my%20Order"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3.5 px-6 rounded-full transition-colors shadow-xs"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp Support</span>
          </a>

          <button
            type="button"
            onClick={() => onNavigate && onNavigate("shop")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#700b10] hover:bg-[#54060b] text-white font-bold text-xs py-3.5 px-8 rounded-full transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
