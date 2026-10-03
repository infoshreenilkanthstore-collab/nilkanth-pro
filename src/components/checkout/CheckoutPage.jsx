import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { ArrowLeft, ShieldCheck, Lock, Check } from "lucide-react";
import { useCart } from "../../context/CartContext";
import CheckoutCustomerStep from "./CheckoutCustomerStep";
import CheckoutShippingStep from "./CheckoutShippingStep";
import CheckoutPaymentStep from "./CheckoutPaymentStep";
import CheckoutSummary from "./CheckoutSummary";
import {
  fetchPaymentGateways,
  fetchShippingRates,
  fetchCustomerAddresses,
  fetchStoreInfo,
  validateCoupon,
  syncAbandonedCheckout,
  addCustomerAddress,
  initiatePayment,
  verifyPayment,
  syncFinalOrder,
  deleteAbandonedOrder,
  clearCartApi,
} from "../../services/api";
import { trackInitiateCheckout, trackPurchase } from "../../services/analytics";

// Dynamic script loader utility
function loadExternalScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = (err) => reject(err);
    document.body.appendChild(script);
  });
}

export default function CheckoutPage({
  onNavigate,
  currentUser,
  onOpenAuthModal,
  onOrderCompleted,
}) {
  const { cartItems, cartTotal, clearCart: clearCartContext, updateQuantity } = useCart();

  // Current Checkout Step: 1 = Contact/Customer, 2 = Shipping, 3 = Payment
  const [currentStep, setCurrentStep] = useState(1);

  // ── Fire InitiateCheckout once when user enters checkout with items ──
  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      const total = cartItems.reduce((s, it) => s + (Number(it.price) || 0) * (it.quantity || 1), 0);
      trackInitiateCheckout(cartItems, total);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Session ID for abandoned cart tracking
  const [sessionId] = useState(() => {
    let sid = sessionStorage.getItem("nilkanth_checkout_session_id");
    if (!sid) {
      sid = "session_chk_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);
      sessionStorage.setItem("nilkanth_checkout_session_id", sid);
    }
    return sid;
  });

  // Customer Contact Info
  const [customer, setCustomer] = useState(() => ({
    firstName: currentUser?.first_name || currentUser?.name?.split(" ")[0] || "",
    lastName: currentUser?.last_name || currentUser?.name?.split(" ").slice(1).join(" ") || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
  }));

  // Shipping Address Info
  const [shippingAddress, setShippingAddress] = useState({
    address1: "",
    address2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  // Saved Addresses (for logged-in customer)
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  // Gateways & Shipping Rates
  const [gateways, setGateways] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState("razorpay");
  const [shippingRates, setShippingRates] = useState([]);
  const [selectedShippingRate, setSelectedShippingRate] = useState(null);

  // Discounts
  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  // Server Synced Order Record (Abandoned Checkout ID)
  const [syncedOrderId, setSyncedOrderId] = useState(null);

  // Loading & Error States
  const [loading, setLoading] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Store Info (tax inclusive/exclusive settings, state origin, tax rates)
  const [storeInfo, setStoreInfo] = useState({
    tax_inclusive: true,
    state: "Gujarat",
    country: "India",
    default_tax_rate: {
      rate: "18.00",
      name: "GST",
    },
  });

  // -------------------------------------------------------------
  // Dynamic Tax (GST) and Price Calculations
  // -------------------------------------------------------------
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, it) => acc + (Number(it.price) || 0) * (it.quantity || 1), 0);
  }, [cartItems]);

  const shippingCost = useMemo(() => {
    if (selectedShippingRate) {
      const costVal = selectedShippingRate.cost !== undefined ? selectedShippingRate.cost : selectedShippingRate.rate;
      return Number(costVal) || 0;
    }
    return subtotal >= 999 ? 0 : 50;
  }, [selectedShippingRate, subtotal]);

  // Tax (GST) Calculations based on storeInfo.tax_inclusive, tax rate and destination state
  const taxCalculations = useMemo(() => {
    const rawTaxRate = Number(storeInfo?.default_tax_rate?.rate || 18.00);
    const isInclusive = storeInfo?.tax_inclusive ?? true;
    const baseSubtotal = Math.max(0, subtotal - discountAmount);

    let totalTax = 0;
    let taxableAmount = baseSubtotal;

    if (isInclusive) {
      // Product price includes tax:
      taxableAmount = baseSubtotal / (1 + rawTaxRate / 100);
      totalTax = baseSubtotal - taxableAmount;
    } else {
      // Tax is added on top:
      taxableAmount = baseSubtotal;
      totalTax = (baseSubtotal * rawTaxRate) / 100;
    }

    const storeState = (storeInfo?.state || "Gujarat").trim().toLowerCase();
    const destinationState = (shippingAddress.state || storeInfo?.state || "Gujarat").trim().toLowerCase();
    const isSameState = destinationState ? destinationState === storeState : true;

    let lines = [];
    if (isSameState) {
      const halfRate = rawTaxRate / 2;
      const halfAmount = totalTax / 2;
      lines = [
        { name: "CGST", rate: halfRate, amount: halfAmount },
        { name: "SGST", rate: halfRate, amount: halfAmount },
      ];
    } else {
      lines = [{ name: "IGST", rate: rawTaxRate, amount: totalTax }];
    }

    return {
      taxAmount: totalTax,
      taxRate: rawTaxRate,
      isInclusive,
      taxLines: lines,
      taxableAmount,
    };
  }, [subtotal, discountAmount, shippingAddress.state, storeInfo]);

  const grandTotal = useMemo(() => {
    const baseAmount = Math.max(0, subtotal - discountAmount);
    // When tax_inclusive is true, tax is already in subtotal, so don't add it again.
    // When tax_inclusive is false, add taxCalculations.taxAmount.
    const taxToAdd = taxCalculations.isInclusive ? 0 : taxCalculations.taxAmount;
    const tot = baseAmount + shippingCost + taxToAdd;
    return Math.max(0, tot);
  }, [subtotal, discountAmount, shippingCost, taxCalculations]);

  const handleSelectSavedAddress = (addr) => {
    setSelectedAddressId(addr.id);
    setShippingAddress({
      address1: addr.address_line1 || addr.address1 || "",
      address2: addr.address_line2 || addr.address2 || "",
      city: addr.city || "",
      state: addr.state || "",
      pincode: addr.pincode || "",
      country: addr.country || "India",
    });
    if (addr.first_name || addr.last_name) {
      setCustomer((prev) => ({
        ...prev,
        firstName: addr.first_name || prev.firstName,
        lastName: addr.last_name || prev.lastName,
        phone: addr.phone || prev.phone,
      }));
    }
  };

  // Sync profile data when currentUser changes + auto-fill default address
  useEffect(() => {
    if (!currentUser) return;

    // Pre-fill customer contact fields from logged-in user
    setCustomer((prev) => ({
      firstName: prev.firstName || currentUser.first_name || currentUser.name?.split(" ")[0] || "",
      lastName: prev.lastName || currentUser.last_name || currentUser.name?.split(" ").slice(1).join(" ") || "",
      email: prev.email || currentUser.email || "",
      phone: prev.phone || currentUser.phone || "",
    }));

    // Fetch saved addresses and auto-select the default one
    fetchCustomerAddresses().then((res) => {
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setSavedAddresses(res.data);

        // Pick is_default first, then fall back to first address
        const defaultAddr = res.data.find((a) => a.is_default) || res.data[0];
        if (defaultAddr) {
          // Auto-populate shipping address fields
          setSelectedAddressId(defaultAddr.id);
          setShippingAddress({
            address1: defaultAddr.address_line1 || defaultAddr.address1 || "",
            address2: defaultAddr.address_line2 || defaultAddr.address2 || "",
            city: defaultAddr.city || "",
            state: defaultAddr.state || "",
            pincode: defaultAddr.pincode || "",
            country: defaultAddr.country || "India",
          });
          // Also sync name/phone from address if present
          if (defaultAddr.first_name || defaultAddr.last_name || defaultAddr.phone) {
            setCustomer((prev) => ({
              ...prev,
              firstName: defaultAddr.first_name || prev.firstName,
              lastName: defaultAddr.last_name || prev.lastName,
              phone: defaultAddr.phone || prev.phone,
            }));
          }
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);


  // Load Active Gateways
  useEffect(() => {
    fetchPaymentGateways().then((res) => {
      if (res.success && res.data?.length > 0) {
        setGateways(res.data);
        const defaultGw = res.data.find((g) => g.provider === "razorpay") || res.data[0];
        if (defaultGw) setSelectedProvider(defaultGw.provider);
      }
    });
  }, []);

  // Fetch Shipping Rates with dynamic address, amount, and items payload
  useEffect(() => {
    const payload = {
      address: {
        country: shippingAddress.country || "",
        state: shippingAddress.state || "",
        pincode: shippingAddress.pincode || "",
        city: shippingAddress.city || "",
      },
      order_amount: subtotal,
      items: cartItems.map((it) => ({
        variant_id: it.variant_id || it.variantId || it.id || 0,
        quantity: it.quantity || 1,
      })),
    };

    fetchShippingRates(payload).then((res) => {
      if (res.success && res.data?.length > 0) {
        const sortedRates = [...res.data].sort((a, b) => {
          const costA = Number(a.cost !== undefined ? a.cost : (a.rate !== undefined ? a.rate : 0));
          const costB = Number(b.cost !== undefined ? b.cost : (b.rate !== undefined ? b.rate : 0));
          return costA - costB;
        });
        setShippingRates(sortedRates);
        setSelectedShippingRate((prev) => {
          const prevId = prev?.method_id || prev?.id;
          if (prevId) {
            const matched = sortedRates.find((r) => (r.method_id || r.id) === prevId);
            if (matched) return matched;
          }
          return sortedRates[0]; // Minimum cost rate selected by default
        });
      }
    });
  }, [shippingAddress.state, shippingAddress.pincode, shippingAddress.city, subtotal, cartItems]);

  // Coupon handling with validateCoupon API
  const handleApplyCoupon = async (code) => {
    try {
      const res = await validateCoupon({
        code: code,
        order_amount: subtotal,
      });

      if (res.success) {
        const disc = Number(res.discount_amount || 0);
        setDiscountCode(code.toUpperCase());
        setDiscountAmount(disc);
        return {
          success: true,
          message: res.message || `Coupon ${code.toUpperCase()} applied! â‚¹${disc.toFixed(2)} discount added.`,
        };
      }
      return {
        success: false,
        message: res.message || "Invalid or expired promo code.",
      };
    } catch (err) {
      return {
        success: false,
        message: err.message || "Failed to validate coupon code.",
      };
    }
  };

  const handleRemoveCoupon = () => {
    setDiscountCode("");
    setDiscountAmount(0);
  };

  // -------------------------------------------------------------
  // Abandoned Checkout Sync (Step 1 of checkout.md)
  // -------------------------------------------------------------
  const syncCheckoutSession = useCallback(async (stageOverride) => {
    if (!customer.email && !customer.phone) return null;

    const fullName = `${customer.firstName} ${customer.lastName}`.trim() || "Devoted Customer";
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const stage = stageOverride || (currentStep === 1 ? "customer_step" : currentStep === 2 ? "shipping_step" : "payment_step");

    const payload = {
      sessionId,
      first_name: customer.firstName || "",
      last_name: customer.lastName || "",
      customerName: fullName,
      customerPhone: customer.phone || "",
      customerEmail: customer.email || "",
      contact: {
        name: fullName,
        phone: customer.phone || "",
        email: customer.email || "",
      },
      shippingAddress: {
        name: fullName,
        line1: shippingAddress.address1 || "",
        line2: shippingAddress.address2 || "",
        city: shippingAddress.city || "",
        state: shippingAddress.state || "",
        pincode: shippingAddress.pincode || "",
        country: shippingAddress.country || "India",
        phone: customer.phone || "",
        email: customer.email || "",
      },
      customer: {
        name: fullName,
        phone: customer.phone || "",
        email: customer.email || "",
      },
      shipping_address: {
        address1: shippingAddress.address1 || "",
        address2: shippingAddress.address2 || "",
        city: shippingAddress.city || "",
        state: shippingAddress.state || "",
        pincode: shippingAddress.pincode || "",
        country: shippingAddress.country || "India",
      },
      items: cartItems.map((it) => ({
        productId: Number(it.product_id || it.productId || it.id || 0),
        variantId: Number(it.variant_id || it.variantId || 0) || null,
        title: it.title || it.product_title || "Sacred Item",
        sku: it.sku || "",
        price: Number(it.price) || 0,
        quantity: Number(it.quantity) || 1,
      })),
      subtotal: Number(subtotal.toFixed(2)),
      discountAmount: Number(discountAmount.toFixed(2)),
      shippingAmount: Number(shippingCost.toFixed(2)),
      tax: Number(taxCalculations.taxAmount.toFixed(2)),
      tax_lines: taxCalculations.taxLines,
      total: Number(grandTotal.toFixed(2)),
      currency: "INR",
      stage,
      device_type: "desktop",
      is_mobile: false,
    };

    try {
      const res = await syncAbandonedCheckout(payload);
      if (res.success && res.data?.id) {
        setSyncedOrderId(res.data.id);
        sessionStorage.setItem("nilkanth_pending_checkout", JSON.stringify({
          ...res.data,
          items: payload.items,
          customer: payload.customer,
          shipping_address: payload.shippingAddress,
          total: payload.total,
          discountAmount: payload.discountAmount,
          discountCode: discountCode || "",
          shippingAmount: payload.shippingAmount,
          shippingMethod: selectedShippingRate?.name || "Standard Shipping",
          taxAmount: taxCalculations.taxAmount,
        }));
        return res.data.id;
      }
    } catch (err) {
      console.error("Failed to sync abandoned checkout:", err);
    }
    return null;
  }, [
    sessionId,
    customer,
    shippingAddress,
    cartItems,
    subtotal,
    discountAmount,
    discountCode,
    shippingCost,
    taxCalculations,
    grandTotal,
    currentStep,
    selectedShippingRate,
  ]);

  // -------------------------------------------------------------
  // Real-Time Abandoned Checkout Auto-Sync (debounced 1.5s)
  // Fires automatically whenever customer info, address, cart,
  // or totals change — not just when stepping forward.
  // -------------------------------------------------------------
  const autoSyncTimerRef = useRef(null);

  useEffect(() => {
    // Guard: only sync once we have at least an email or phone
    if (!customer.email && !customer.phone) return;

    // Clear any pending debounce timer
    if (autoSyncTimerRef.current) {
      clearTimeout(autoSyncTimerRef.current);
    }

    // Schedule sync after 1.5s of inactivity
    autoSyncTimerRef.current = setTimeout(() => {
      syncCheckoutSession().catch((err) =>
        console.error("[AutoSync] Abandoned checkout sync failed:", err)
      );
    }, 1500);

    return () => {
      if (autoSyncTimerRef.current) {
        clearTimeout(autoSyncTimerRef.current);
      }
    };
  }, [
    customer.email,
    customer.phone,
    customer.firstName,
    customer.lastName,
    shippingAddress.address1,
    shippingAddress.city,
    shippingAddress.state,
    shippingAddress.pincode,
    shippingAddress.country,
    cartItems,
    subtotal,
    discountAmount,
    shippingCost,
    grandTotal,
    syncCheckoutSession,
  ]);

  // Sync session on moving forward

  const handleProceedToShipping = async () => {
    if (!customer.firstName || !customer.lastName || !customer.email || !customer.phone) {
      return;
    }
    setLoading(true);
    await syncCheckoutSession();
    setLoading(false);
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleProceedToPayment = async () => {
    if (!shippingAddress.address1 || !shippingAddress.city || !shippingAddress.pincode) {
      return;
    }
    setLoading(true);
    await syncCheckoutSession();
    setLoading(false);
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // -------------------------------------------------------------
  // Order Finalization Flow (Step 4 & 5 of checkout.md)
  // -------------------------------------------------------------
  const finalizeOfficialOrder = async ({
    abandonedCheckoutId,
    paymentMethod,
    paymentProvider,
    paymentStatus,
    transactionReference = "",
  }) => {
    const customerPayload = {
      name: `${customer.firstName} ${customer.lastName}`.trim() || "Devoted Customer",
      phone: customer.phone,
      email: customer.email,
    };

    const syncPayload = {
      customer_id: currentUser?.id || null,
      first_name: customer.firstName || "",
      last_name: customer.lastName || "",
      customerName: customerPayload.name,
      customerPhone: customer.phone,
      customerEmail: customer.email,
      abandoned_checkout_id: Number(abandonedCheckoutId) || null,
      items: cartItems.map((it) => ({
        productId: Number(it.product_id || it.id || 0),
        variantId: Number(it.variant_id || it.variantId || 0) || null,
        title: it.title || it.product_title || "Spiritual Product",
        sku: it.sku || "",
        price: Number(it.price || 0),
        quantity: Number(it.quantity || 1),
      })),
      shippingAddress: {
        name: customerPayload.name,
        line1: shippingAddress.address1 + (shippingAddress.address2 ? `, ${shippingAddress.address2}` : ""),
        city: shippingAddress.city,
        state: shippingAddress.state,
        pincode: shippingAddress.pincode,
        country: shippingAddress.country || "India",
        phone: customer.phone,
        email: customer.email,
      },
      subtotal: subtotal,
      discountAmount: discountAmount,
      discountCode: discountCode || "",
      shippingAmount: shippingCost,
      shippingMethod: selectedShippingRate?.name || "Standard Shipping",
      taxAmount: taxCalculations.taxAmount,
      total: grandTotal,
      currency: "INR",
      paymentMethod: paymentMethod,
      paymentProvider: paymentProvider,
      paymentStatus: paymentStatus,
      transactionReference: transactionReference || "",
      device_type: "desktop",
      is_mobile: false,
    };

    // 1. Phase 3: Convert Abandoned Draft to Official Placed Order (POST /checkout/sync)
    const syncRes = await syncFinalOrder(syncPayload);
    const officialOrderData = syncRes?.data || {
      id: abandonedCheckoutId,
      order_number: `ORD-${abandonedCheckoutId}`,
      total: grandTotal,
      financial_status: paymentStatus,
    };

    // 2. Phase 4: Cleanup Abandoned Draft (DELETE /orders/:id)
    if (abandonedCheckoutId) {
      await deleteAbandonedOrder(abandonedCheckoutId);
    }

    // 3. Clear server cart and local context
    await clearCartApi();
    clearCartContext();
    sessionStorage.removeItem("nilkanth_checkout_session_id");
    sessionStorage.removeItem("nilkanth_pending_checkout");

    const confirmedOrder = {
      ...officialOrderData,
      customer: customerPayload,
      shipping_address: shippingAddress,
      items: cartItems,
      total: Number(officialOrderData.total || grandTotal),
      provider: paymentProvider,
      payment_method: paymentMethod,
      financial_status: paymentStatus,
    };

    // 4. Fire GA4 purchase + Meta Pixel Purchase tracking
    trackPurchase(confirmedOrder);

    if (onOrderCompleted) onOrderCompleted(confirmedOrder);
    if (onNavigate) onNavigate("checkout-success", { orderData: confirmedOrder });
    return confirmedOrder;
  };

  // -------------------------------------------------------------
  // Order Initiation & Multi-Payment Gateway Flow
  // -------------------------------------------------------------
  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    setErrorMessage("");

    try {
      // 1. Ensure Abandoned Checkout is synced
      let orderId = syncedOrderId;
      if (!orderId) {
        orderId = await syncCheckoutSession();
      }

      if (!orderId) {
        orderId = Math.floor(100 + Math.random() * 900); // Fallback mock ID if test API rejects
      }

      const cleanPhone = String(customer.phone || "").replace(/\D/g, "").slice(-10);
      const cleanEmail = String(customer.email || "").trim();
      const cleanFirstName = String(customer.firstName || "Customer").replace(/[^a-zA-Z0-9]/g, "") || "Customer";
      const cleanLastName = String(customer.lastName || "").replace(/[^a-zA-Z0-9]/g, "");
      const cleanFullName = `${cleanFirstName} ${cleanLastName}`.trim();

      const customerPayload = {
        name: cleanFullName,
        firstName: cleanFirstName,
        lastName: cleanLastName,
        email: cleanEmail,
        phone: cleanPhone,
      };

      const productInfoStr = (cartItems && cartItems.length > 0
        ? cartItems.map((it) => it.title || "Sacred Item").join(", ")
        : `Order #${orderId}`
      ).replace(/[^a-zA-Z0-9, -]/g, "").slice(0, 90) || "Nilkanth Store Order";

      // 2. Initiate Payment with Gateway
      const initRes = await initiatePayment({
        order_id: orderId,
        provider: selectedProvider,
        return_url: `${window.location.origin}/api/checkout/callback/${selectedProvider}`,
        customer: customerPayload,
        amount: grandTotal,
        productinfo: productInfoStr,
        items: cartItems,
        shipping_address: shippingAddress,
      });

      if (!initRes.success && selectedProvider !== "cod") {
        setErrorMessage(initRes.message || "Failed to initiate payment gateway.");
        setIsPlacingOrder(false);
        return;
      }

      const gatewayData = initRes.data || {};

      // Save pending checkout for callback gateways
      sessionStorage.setItem(
        "nilkanth_pending_checkout",
        JSON.stringify({
          order_id: gatewayData.order_id || orderId,
          payment_id: gatewayData.payment_id,
          txnid: gatewayData.txnid || "",
          productinfo: productInfoStr,
          customer: customerPayload,
          shipping_address: shippingAddress,
          items: cartItems,
          total: grandTotal,
          subtotal: subtotal,
          discountAmount: discountAmount,
          discountCode: discountCode,
          shippingAmount: shippingCost,
          shippingMethod: selectedShippingRate?.name || "Standard Shipping",
          taxAmount: taxCalculations.taxAmount,
          provider: selectedProvider,
        })
      );

      // -----------------------------
      // Case A: Razorpay Checkout
      // -----------------------------
      if (selectedProvider === "razorpay") {
        await loadExternalScript("https://checkout.razorpay.com/v1/checkout.js");

        const options = {
          key: gatewayData.key_id || "rzp_test_1234567890abcdef",
          amount: gatewayData.amount || Math.round(grandTotal * 100),
          currency: gatewayData.currency || "INR",
          name: "Nilkanth Store",
          description: "Consecrated Spiritual Items Order",
          order_id: gatewayData.razorpay_order_id,
          prefill: {
            name: customerPayload.name,
            email: customerPayload.email,
            contact: customerPayload.phone,
          },
          theme: {
            color: "#700b10",
          },
          handler: async function (response) {
            // Verify payment
            const verifyPayload = {
              provider: "razorpay",
              order_id: orderId,
              payment_id: gatewayData.payment_id || 890,
              razorpay_order_id: response.razorpay_order_id || gatewayData.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };

            const verifyRes = await verifyPayment(verifyPayload);

            if (verifyRes.success) {
              await finalizeOfficialOrder({
                abandonedCheckoutId: orderId,
                paymentMethod: "online",
                paymentProvider: "razorpay",
                paymentStatus: "paid",
                transactionReference: response.razorpay_payment_id,
              });
            } else {
              setErrorMessage(verifyRes.message || "Payment verification failed.");
            }
            setIsPlacingOrder(false);
          },
          modal: {
            ondismiss: function () {
              setIsPlacingOrder(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }

      // -----------------------------
      // Case B: ICICI Bank Eazypay
      // -----------------------------
      else if (selectedProvider === "icici") {
        if (gatewayData.service_url && gatewayData.form_payload) {
          const form = document.createElement("form");
          form.method = "POST";
          form.action = gatewayData.service_url;
          Object.entries(gatewayData.form_payload).forEach(([k, v]) => {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = k;
            input.value = v;
            form.appendChild(input);
          });
          document.body.appendChild(form);
          form.submit();
        } else if (gatewayData.payment_url) {
          window.location.href = gatewayData.payment_url;
        } else {
          setErrorMessage("ICICI Eazypay gateway URL not returned.");
          setIsPlacingOrder(false);
        }
      }

      // -----------------------------
      // Case C: Easebuzz
      // -----------------------------
      else if (selectedProvider === "easebuzz") {
        if (gatewayData.checkout_url) {
          window.location.href = gatewayData.checkout_url;
        } else {
          setErrorMessage("Easebuzz checkout URL not returned.");
          setIsPlacingOrder(false);
        }
      }

      // -----------------------------
      // Case D: Cash on Delivery (COD)
      // -----------------------------
      else if (selectedProvider === "cod") {
        await finalizeOfficialOrder({
          abandonedCheckoutId: orderId,
          paymentMethod: "cod",
          paymentProvider: "cod",
          paymentStatus: "pending",
        });
        setIsPlacingOrder(false);
      }
    } catch (err) {
      console.error("Order placement error:", err);
      setErrorMessage(err.message || "An error occurred while initiating checkout.");
      setIsPlacingOrder(false);
    }
  };

  // If cart is completely empty, direct back to shop
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center font-nunito bg-[#fcfaf7]">
        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-[#700b10] mb-4">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-stone-900 mb-2">Your Cart is Empty</h2>
        <p className="text-stone-500 text-xs sm:text-sm max-w-sm mb-6">
          Explore our consecrated collection of sacred idols, malawalas, and pure silver jewelry.
        </p>
        <button
          type="button"
          onClick={() => onNavigate && onNavigate("shop")}
          className="bg-[#700b10] hover:bg-[#54060b] text-white py-3 px-8 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
        >
          Explore Collection
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfaf7] py-6 sm:py-12 px-4 sm:px-6 lg:px-8 font-nunito animate-fadeIn">
      <div className="max-w-6xl mx-auto">
        {/* Top Breadcrumb / Return to Cart */}
        <div className="flex items-center justify-between pb-6 border-b border-stone-200/80">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate("shop")}
            className="text-stone-500 hover:text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>

          <div className="flex items-center gap-1.5 text-stone-700 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">256-Bit SSL Encrypted Checkout</span>
            <span className="sm:hidden">SSL Secured</span>
          </div>
        </div>

        {/* Step Progress Stepper */}
        <div className="mb-4 max-w-lg mx-auto">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-full bg-stone-200 -z-0" />
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#700b10] transition-all duration-300 -z-0"
              style={{
                width: currentStep === 1 ? "0%" : currentStep === 2 ? "50%" : "100%",
              }}
            />

            {/* Step 1 */}
            <div className="flex flex-col items-center gap-1.5 z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${currentStep >= 1
                  ? "bg-[#700b10] text-white shadow-xs"
                  : "bg-stone-200 text-stone-500"
                  }`}
              >
                {currentStep > 1 ? <Check className="w-4 h-4" /> : "1"}
              </div>
              <span className="text-[11px] font-bold text-stone-700">Contact</span>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center gap-1.5 z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${currentStep >= 2
                  ? "bg-[#700b10] text-white shadow-xs"
                  : "bg-white border-2 border-stone-300 text-stone-500"
                  }`}
              >
                {currentStep > 2 ? <Check className="w-4 h-4" /> : "2"}
              </div>
              <span className="text-[11px] font-bold text-stone-700">Shipping</span>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center gap-1.5 z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${currentStep === 3
                  ? "bg-[#700b10] text-white shadow-xs"
                  : "bg-white border-2 border-stone-300 text-stone-500"
                  }`}
              >
                3
              </div>
              <span className="text-[11px] font-bold text-stone-700">Payment</span>
            </div>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Stepper Form Column */}
          <div className="lg:col-span-7 space-y-6">
            {currentStep === 1 && (
              <CheckoutCustomerStep
                customer={customer}
                onCustomerChange={setCustomer}
                currentUser={currentUser}
                savedAddresses={savedAddresses}
                selectedAddressId={selectedAddressId}
                onSelectSavedAddress={handleSelectSavedAddress}
                onOpenAuthModal={onOpenAuthModal}
                onNextStep={handleProceedToShipping}
                loading={loading}
              />
            )}

            {currentStep === 2 && (
              <CheckoutShippingStep
                shippingAddress={shippingAddress}
                onShippingAddressChange={setShippingAddress}
                shippingRates={shippingRates}
                selectedShippingRate={selectedShippingRate}
                onSelectShippingRate={setSelectedShippingRate}
                onBackStep={() => setCurrentStep(1)}
                onNextStep={handleProceedToPayment}
                loading={loading}
                currentUser={currentUser}
                savedAddresses={savedAddresses}
                selectedAddressId={selectedAddressId}
                onSelectSavedAddress={handleSelectSavedAddress}
                onSaveNewAddress={async (addrPayload) => {
                  // Attach customer name/phone from current customer state
                  const enriched = {
                    ...addrPayload,
                    first_name: customer.firstName || "",
                    last_name: customer.lastName || "",
                    phone: customer.phone || "",
                  };
                  return addCustomerAddress(enriched);
                }}
                onAddressListUpdated={() => {
                  // Re-fetch addresses to update the saved list
                  fetchCustomerAddresses().then((res) => {
                    if (res.success && Array.isArray(res.data)) {
                      setSavedAddresses(res.data);
                    }
                  });
                }}
              />
            )}

            {currentStep === 3 && (
              <CheckoutPaymentStep
                gateways={gateways}
                selectedProvider={selectedProvider}
                onSelectProvider={setSelectedProvider}
                grandTotal={grandTotal}
                isPlacingOrder={isPlacingOrder}
                onPlaceOrder={handlePlaceOrder}
                onBackStep={() => setCurrentStep(2)}
                errorMessage={errorMessage}
              />
            )}
          </div>

          {/* Sticky Order Summary Column */}
          <div className="lg:col-span-5">
            <CheckoutSummary
              items={cartItems}
              subtotal={subtotal}
              tax={taxCalculations.taxAmount}
              taxLines={taxCalculations.taxLines}
              shipping={shippingCost}
              discount={discountAmount}
              discountCode={discountCode}
              onApplyCoupon={handleApplyCoupon}
              onRemoveCoupon={handleRemoveCoupon}
              onUpdateQuantity={updateQuantity}
              grandTotal={grandTotal}
              loading={loading || isPlacingOrder}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
