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
  recoverAbandonedCheckout,
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
  const { cartItems, cartTotal, clearCart: clearCartContext, updateQuantity, restoreCartItems } = useCart();

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

  // Session ID for abandoned cart tracking (checking query params first)
  const [sessionId, setSessionId] = useState(() => {
    const urlParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    const urlSid = urlParams ? (urlParams.get("session_id") || urlParams.get("sessionId")) : null;
    if (urlSid) {
      sessionStorage.setItem("nilkanth_checkout_session_id", urlSid);
      return urlSid;
    }
    let sid = sessionStorage.getItem("nilkanth_checkout_session_id");
    if (!sid) {
      sid = "session_chk_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);
      sessionStorage.setItem("nilkanth_checkout_session_id", sid);
    }
    return sid;
  });

  // Recovery States
  const [recoveringSession, setRecoveringSession] = useState(() => {
    if (typeof window === "undefined") return false;
    const urlParams = new URLSearchParams(window.location.search);
    return Boolean(urlParams.get("session_id") || urlParams.get("sessionId"));
  });
  const [recoveryStatus, setRecoveryStatus] = useState(null);

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

  // Field-level Validation Errors & Touched States
  const [formErrors, setFormErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  const validateField = useCallback((field, value, customCustomer = customer, customShipping = shippingAddress) => {
    switch (field) {
      case "firstName": {
        const val = value !== undefined ? value : customCustomer.firstName;
        if (!val?.trim()) return "First name is required";
        if (val.trim().length < 2) return "First name must be at least 2 characters";
        return "";
      }
      case "lastName": {
        const val = value !== undefined ? value : customCustomer.lastName;
        if (!val?.trim()) return "Last name is required";
        return "";
      }
      case "email": {
        const val = value !== undefined ? value : customCustomer.email;
        if (!val?.trim()) return "Email address is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) return "Please enter a valid email address (e.g. name@example.com)";
        return "";
      }
      case "phone": {
        const val = value !== undefined ? value : customCustomer.phone;
        const clean = String(val || "").replace(/\D/g, "");
        if (!clean) return "Mobile phone number is required";
        if (clean.length !== 10) return "Please enter a valid 10-digit mobile number";
        return "";
      }
      case "address1": {
        const val = value !== undefined ? value : customShipping.address1;
        if (!val?.trim()) return "Delivery street address is required";
        return "";
      }
      case "city": {
        const val = value !== undefined ? value : customShipping.city;
        if (!val?.trim()) return "City is required";
        return "";
      }
      case "state": {
        const val = value !== undefined ? value : customShipping.state;
        if (!val?.trim()) return "State is required";
        return "";
      }
      case "pincode": {
        const val = value !== undefined ? value : customShipping.pincode;
        const clean = String(val || "").replace(/\D/g, "");
        if (!clean) return "PIN code is required";
        if (clean.length !== 6) return "Please enter a valid 6-digit PIN code";
        return "";
      }
      default:
        return "";
    }
  }, [customer, shippingAddress]);

  const handleBlurField = (field) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
    const errorMsg = validateField(field);
    setFormErrors((prev) => ({ ...prev, [field]: errorMsg }));
  };

  const handleCustomerChangeWithValidation = (updatedCustomer) => {
    setCustomer(updatedCustomer);
    setFormErrors((prev) => {
      const next = { ...prev };
      ["firstName", "lastName", "email", "phone"].forEach((f) => {
        if (touchedFields[f]) {
          next[f] = validateField(f, updatedCustomer[f], updatedCustomer);
        }
      });
      return next;
    });
  };

  const handleShippingChangeWithValidation = (updatedShipping) => {
    setShippingAddress(updatedShipping);
    setFormErrors((prev) => {
      const next = { ...prev };
      ["address1", "city", "state", "pincode"].forEach((f) => {
        if (touchedFields[f]) {
          next[f] = validateField(f, updatedShipping[f], undefined, updatedShipping);
        }
      });
      return next;
    });
  };

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

  // ── Recover Abandoned Checkout Session from URL query param (?session_id=... or ?sessionId=...) ──
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const targetSessionId = urlParams.get("session_id") || urlParams.get("sessionId");

    if (!targetSessionId) return;

    setRecoveringSession(true);
    recoverAbandonedCheckout(targetSessionId)
      .then((res) => {
        if (res.success && res.data) {
          const d = res.data;
          // 1. Session ID & Synced Order ID
          if (d.sessionId) {
            setSessionId(d.sessionId);
            sessionStorage.setItem("nilkanth_checkout_session_id", d.sessionId);
          }
          if (d.orderId || d.id) {
            setSyncedOrderId(d.orderId || d.id);
          }

          // 2. Customer Contact Info
          const contact = d.contact || d.customer || {};
          const fName = contact.firstName || (contact.name ? contact.name.split(" ")[0] : "") || d.first_name || "";
          const lName = contact.lastName || (contact.name ? contact.name.split(" ").slice(1).join(" ") : "") || d.last_name || "";
          const cPhone = contact.phone || d.customerPhone || d.phone || "";
          const cEmail = contact.email || d.customerEmail || d.email || "";

          setCustomer((prev) => ({
            firstName: fName || prev.firstName,
            lastName: lName || prev.lastName,
            phone: cPhone || prev.phone,
            email: cEmail || prev.email,
          }));

          // 3. Shipping Address Info
          const ship = d.shippingAddress || d.shipping_address || {};
          setShippingAddress((prev) => ({
            address1: ship.line1 || ship.address1 || prev.address1,
            address2: ship.line2 || ship.address2 || prev.address2,
            city: ship.city || prev.city,
            state: ship.state || prev.state,
            pincode: ship.pincode || prev.pincode,
            country: ship.country || prev.country || "India",
          }));

          // 4. Cart Items Recovery
          if (Array.isArray(d.items) && d.items.length > 0 && typeof restoreCartItems === "function") {
            restoreCartItems(d.items);
          }

          // 5. Applied Discount Info
          if (d.discountAmount !== undefined && Number(d.discountAmount) > 0) {
            setDiscountAmount(Number(d.discountAmount));
          }
          if (d.discountCode) {
            setDiscountCode(d.discountCode);
          }

          setRecoveryStatus({
            success: true,
            message: res.message || "Abandoned checkout session recovered successfully!",
          });
        } else {
          setRecoveryStatus({
            success: false,
            message: res.message || "Could not find an active checkout session for this link.",
          });
        }
      })
      .catch((err) => {
        console.error("Checkout recovery error:", err);
        setRecoveryStatus({
          success: false,
          message: "Failed to recover abandoned checkout session.",
        });
      })
      .finally(() => {
        setRecoveringSession(false);
      });
  }, [restoreCartItems]);

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
    const stage = stageOverride || "one_step_checkout";

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
    setErrorMessage("");

    // 1. Run full validation across customer & shipping fields
    const allErrors = {
      firstName: validateField("firstName", customer.firstName),
      lastName: validateField("lastName", customer.lastName),
      email: validateField("email", customer.email),
      phone: validateField("phone", customer.phone),
      pincode: validateField("pincode", shippingAddress.pincode),
      address1: validateField("address1", shippingAddress.address1),
      city: validateField("city", shippingAddress.city),
      state: validateField("state", shippingAddress.state),
    };

    const hasErrors = Object.values(allErrors).some(Boolean);
    if (hasErrors) {
      // Mark all fields as touched so validation highlights appear
      setTouchedFields({
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        pincode: true,
        address1: true,
        city: true,
        state: true,
      });
      setFormErrors(allErrors);

      // Find first error and scroll / focus smoothly
      const firstErrorKey = Object.keys(allErrors).find((k) => allErrors[k]);
      if (firstErrorKey) {
        setErrorMessage(allErrors[firstErrorKey]);
        const elem = document.getElementById(`checkout-${firstErrorKey}`);
        if (elem) {
          elem.focus();
          elem.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
      return;
    }

    if (!selectedProvider) {
      setErrorMessage("Please select a Payment Method.");
      return;
    }

    setIsPlacingOrder(true);

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

  // If we are currently recovering a session from URL, show an elegant spinner
  if (recoveringSession) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center font-nunito bg-[#fcfaf7]">
        <div className="w-12 h-12 border-3 border-stone-200 border-t-[#700b10] rounded-full animate-spin mb-4" />
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mb-2">
          Restoring Your Checkout Session...
        </h2>
        <p className="text-stone-500 text-xs sm:text-sm max-w-sm">
          Please wait while we retrieve your selected items and address details.
        </p>
      </div>
    );
  }

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
    <div className="min-h-screen bg-[#fcfaf7] py-6 sm:py-10 px-4 sm:px-6 lg:px-8 font-nunito animate-fadeIn">
      <div className="max-w-6xl mx-auto">
        {/* Top Header & Security Bar */}
        <div className="flex items-center justify-between pb-5 border-b border-stone-200/80 mb-6">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate("shop")}
            className="text-stone-500 hover:text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>

          <div className="flex items-center gap-2 text-stone-700 text-xs font-bold bg-amber-50/80 border border-amber-200/60 px-3 py-1.5 rounded-full">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">100% Encrypted &amp; Secure One-Step Checkout</span>
            <span className="sm:hidden">100% Secure Checkout</span>
          </div>
        </div>

        {/* Abandoned Recovery Status Alert */}
        {recoveryStatus && (
          <div
            className={`mb-6 p-4 rounded-2xl border flex items-start sm:items-center justify-between gap-3 text-xs sm:text-sm font-semibold transition-all shadow-sm animate-fadeIn ${
              recoveryStatus.success
                ? "bg-emerald-50/90 border-emerald-200 text-emerald-900"
                : "bg-amber-50/90 border-amber-200 text-amber-900"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base">{recoveryStatus.success ? "✨" : "ℹ️"}</span>
              <div>
                <p className="font-bold">
                  {recoveryStatus.success
                    ? "Checkout Session Recovered"
                    : "Checkout Session Notice"}
                </p>
                <p className="text-xs opacity-90 font-normal mt-0.5">
                  {recoveryStatus.message}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setRecoveryStatus(null)}
              className="text-stone-400 hover:text-stone-700 text-xs px-2 py-1 rounded cursor-pointer"
              aria-label="Dismiss notice"
            >
              ✕
            </button>
          </div>
        )}

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Single-Step Form Column (All 3 Sections stacked seamlessly) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Customer Information */}
            <CheckoutCustomerStep
              customer={customer}
              onCustomerChange={handleCustomerChangeWithValidation}
              currentUser={currentUser}
              savedAddresses={savedAddresses}
              selectedAddressId={selectedAddressId}
              onSelectSavedAddress={handleSelectSavedAddress}
              onOpenAuthModal={onOpenAuthModal}
              loading={loading}
              isOneStep={true}
              errors={formErrors}
              touched={touchedFields}
              onBlurField={handleBlurField}
            />

            {/* Step 2: Shipping & Delivery */}
            <CheckoutShippingStep
              shippingAddress={shippingAddress}
              onShippingAddressChange={handleShippingChangeWithValidation}
              shippingRates={shippingRates}
              selectedShippingRate={selectedShippingRate}
              onSelectShippingRate={setSelectedShippingRate}
              loading={loading}
              isOneStep={true}
              currentUser={currentUser}
              savedAddresses={savedAddresses}
              selectedAddressId={selectedAddressId}
              onSelectSavedAddress={handleSelectSavedAddress}
              onSaveNewAddress={async (addrPayload) => {
                const enriched = {
                  ...addrPayload,
                  first_name: customer.firstName || "",
                  last_name: customer.lastName || "",
                  phone: customer.phone || "",
                };
                return addCustomerAddress(enriched);
              }}
              onAddressListUpdated={() => {
                fetchCustomerAddresses().then((res) => {
                  if (res.success && Array.isArray(res.data)) {
                    setSavedAddresses(res.data);
                  }
                });
              }}
              errors={formErrors}
              touched={touchedFields}
              onBlurField={handleBlurField}
            />

            {/* Step 3: Payment Method & Place Order CTA */}
            <CheckoutPaymentStep
              gateways={gateways}
              selectedProvider={selectedProvider}
              onSelectProvider={setSelectedProvider}
              grandTotal={grandTotal}
              isPlacingOrder={isPlacingOrder}
              onPlaceOrder={handlePlaceOrder}
              errorMessage={errorMessage}
              isOneStep={true}
            />
          </div>

          {/* Sticky Order Summary Column */}
          <div className="lg:col-span-5 sticky top-24">
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
