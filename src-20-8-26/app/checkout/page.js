"use client";

import React, { useState, useEffect } from "react";
import { useCartSidebar } from "../../context/CartSidebarContext";
import { ChevronLeft, ShoppingBag, Truck, ShieldCheck, CreditCard, ChevronRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
    const { cart, isLoading, clearCart, openMegaCheckout } = useCartSidebar();
    // Form & UI States
    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        state: "",
        pincode: ""
    });
    const [paymentMethod, setPaymentMethod] = useState("cod"); // "cod" or "online"
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [autofilled, setAutofilled] = useState(false);
    const [isAutofilling, setIsAutofilling] = useState(false);

    // Shipping, Tax & Deliverability calculations
    const [shipping, setShipping] = useState(0); 
    const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
    const [shippingMessage, setShippingMessage] = useState("");
    const [isDeliverable, setIsDeliverable] = useState(true);

    const [tax, setTax] = useState(0);
    const [taxLines, setTaxLines] = useState([]);
    const [isCalculatingTax, setIsCalculatingTax] = useState(false);

    // Derived Values
    const subtotal = cart.reduce((acc, item) => acc + (Number(item.price) * item.qty), 0);
    
    const totalWeightGrams = React.useMemo(() => {
        return cart.reduce((acc, item) => {
            let weight = Number(item.weight) || 0;
            let unit = (item.weightUnit || "GRAMS").toUpperCase();
            if (unit === "KILOGRAMS" || unit === "KG") {
                weight = weight * 1000;
            }
            return acc + (weight * item.qty);
        }, 0);
    }, [cart]);

    const total = subtotal + shipping + tax;

    // Auto-fill from saved profile and default address
    useEffect(() => {
        const customerId = localStorage.getItem("ns_customerId");
        if (!customerId) return;

        Promise.all([
            fetch(`/api/customer/profile?customerId=${customerId}`).then(r => r.json()).catch(() => null),
            fetch(`/api/customer/addresses?customerId=${customerId}`).then(r => r.json()).catch(() => null)
        ]).then(([profileData, addressData]) => {
            let autofilledAny = false;
            setFormData(prev => {
                const next = { ...prev };
                if (profileData && profileData.success) {
                    if (profileData.firstName) next.firstName = profileData.firstName;
                    if (profileData.lastName) next.lastName = profileData.lastName;
                    if (profileData.phone) next.phone = profileData.phone;
                    if (profileData.email) next.email = profileData.email;
                    autofilledAny = true;
                }
                if (addressData && addressData.success && addressData.addresses?.length > 0) {
                    const defaultAddr = addressData.addresses[addressData.defaultIndex ?? 0];
                    if (defaultAddr) {
                        next.address = defaultAddr.address || next.address;
                        next.city = defaultAddr.city || next.city;
                        next.state = defaultAddr.state || next.state;
                        next.pincode = defaultAddr.pincode || next.pincode;
                        autofilledAny = true;
                    }
                }
                return next;
            });
            if (autofilledAny) setAutofilled(true);
        });
    }, []);



    // Pincode Autofill Logic
    useEffect(() => {
        const pincodeStr = String(formData.pincode).trim();
        if (pincodeStr.length === 6) {
            handlePincodeAutofill(pincodeStr);
        }
    }, [formData.pincode]);

    const handlePincodeAutofill = async (pincode) => {
        setIsAutofilling(true);
        try {
            const res = await fetch(`/api/pincode/${pincode}`);
            const data = await res.json();
            if (data.success) {
                setFormData(prev => ({
                    ...prev,
                    state: data.state || prev.state,
                    city: data.city || prev.city
                }));
            }
        } catch (err) {
            console.error("Internal Pincode API error:", err);
        } finally {
            setIsAutofilling(false);
        }
    };

    // Calculate dynamic shipping and tax when the pincode or state is valid
    useEffect(() => {
        const pincodeStr = String(formData.pincode).trim();
        if (pincodeStr.length === 6 && cart.length > 0) {
            calculateShipping(pincodeStr);
        } else {
            // Reset states if pincode is invalid/empty
            setShipping(0);
            setShippingMessage("");
            setIsDeliverable(true);
            setTax(0);
            setTaxLines([]);
        }
    }, [formData.pincode, formData.state, cart]); 

    // Abandoned Checkout Tracking (Lead Generation)
    useEffect(() => {
        const phone = formData.phone?.trim();
        if (!phone || phone.length < 10) return;

        const timer = setTimeout(async () => {
            try {
                await fetch("/api/checkout/draft", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ...formData,
                        cart: cart.map(item => ({
                            title: item.title,
                            variantTitle: item.variantTitle,
                            price: item.price,
                            qty: item.qty,
                            image: item.image
                        })),
                        subtotal: subtotal,
                        isDeliverable: isDeliverable
                    })
                });
            } catch (err) {
                console.error("Failed to sync checkout draft:", err);
            }
        }, 2000); // 2 second debounce

        return () => clearTimeout(timer);
    }, [formData, cart, subtotal, isDeliverable]);

    const calculateShipping = async (pincodeStr) => {
        setIsCalculatingShipping(true);
        setIsDeliverable(true); // Reset for new attempt
        try {
            const res = await fetch("/api/checkout/shipping", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    pincode: pincodeStr,
                    totalWeightInGrams: totalWeightGrams
                })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setShipping(data.shippingCost);
                setIsDeliverable(true);
                if (data.appliedSlab) {
                    setShippingMessage(`Applied Tier: ${data.appliedSlab}`);
                }
                
                // Auto-fill city and state from internal DB for consistency
                if (data.city || data.state) {
                    setFormData(prev => ({
                        ...prev,
                        city: data.city || prev.city,
                        state: data.state || prev.state
                    }));
                }

                // Fetch tax after shipping is calculated
                calculateTax(data.shippingCost, data.appliedSlab, formData);
            } else {
                setShipping(0);
                setIsDeliverable(false);
                setShippingMessage(data.message || "We currently do not deliver to this pincode. Please try a different location.");
                setTax(0);
                setTaxLines([]);
            }

        } catch (err) {
            console.error("Failed to calculate shipping:", err);
            setShipping(0);
            setIsDeliverable(false);
            setShippingMessage("We currently do not deliver to this pincode. Please try a different location.");
            setTax(0);
            setTaxLines([]);
        } finally {
            setIsCalculatingShipping(false);
        }
    };

    const calculateTax = async (currentShipping, currentShippingLabel, currentCustomerInfo) => {
        setTaxLines([]); // Clear old tax lines immediately to show loading or empty state
        setIsCalculatingTax(true);
        try {
            const res = await fetch("/api/checkout/calculate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    cart: cart.map(item => ({
                        variantId: item.variantId,
                        qty: item.qty
                    })),
                    customerInfo: currentCustomerInfo,
                    shipping: currentShipping,
                    shippingLabel: currentShippingLabel
                })
            });

            const data = await res.json();
            if (data.success) {
                setTax(data.totalTax);
                setTaxLines(data.taxLines || []);
            } else {
                console.error("Tax calculation error:", data.error);
                setTax(0);
                setTaxLines([]);
            }
        } catch (err) {
            console.error("Failed to calculate tax:", err);
            setTax(0);
            setTaxLines([]);
        } finally {
            setIsCalculatingTax(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (paymentMethod === "online") {
            if (!cart.length) {
                alert("Your cart is empty");
                return;
            }
            openMegaCheckout();
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    cart: cart.map(item => ({
                        variantId: item.variantId,
                        qty: item.qty
                    })),
                    customerInfo: formData,
                    shipping: shipping,
                    shippingLabel: shippingMessage,
                    paymentMethod: paymentMethod
                })
            });

            const text = await res.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error("Failed to parse JSON:", text);
                alert("Server error: " + text.substring(0, 500));
                return;
            }

            if (data.success && data.orderName) {
                // Mark draft as completed
                try {
                    await fetch("/api/checkout/draft", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            phone: formData.phone,
                            status: "completed"
                        })
                    });
                } catch (e) {
                    console.error("Failed to mark draft as completed:", e);
                }

                // Clear the cart
                await clearCart();
                // Redirect to local success page instead of Shopify
                window.location.href = `/checkout/success?orderName=${encodeURIComponent(data.orderName)}`;
            } else {
                const detailMsg = data.details ? JSON.stringify(data.details, null, 2) : "";
                console.error("Checkout Error Details:", data.details);
                alert(`${data.error || "Something went wrong"}\n\n${detailMsg}`);
            }
        } catch (err) {
            console.error("Checkout submission error:", err);
            alert("Connection error. Please check your internet and try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#700b10]"></div>
        </div>
    );

    if (cart.length === 0) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF7] p-4 text-center">
            <ShoppingBag size={64} className="text-gray-200 mb-6" />
            <h1 className="text-3xl font-nunito font-bold text-gray-900 mb-2">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Add some goodies to your cart before checking out!</p>
            <Link href="/" className="px-8 py-3 bg-[#700b10] text-white rounded-full font-bold hover:bg-[#5a090d] transition-all">
                Shop Now
            </Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FDFBF7] py-6 md:py-16">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8">

                {/* Header */}
                <div className="flex items-center justify-between mb-6 md:mb-12">
                    <Link href="/" className="flex items-center gap-1 md:gap-2 text-[#700b10] font-bold hover:translate-x-[-4px] transition-transform text-[10px] md:text-xs">
                        <ChevronLeft size={16} className="md:w-5 md:h-5" />
                        BACK TO STORE
                    </Link>
                    <h1 className="text-xl md:text-3xl font-nunito font-bold text-gray-900 tracking-tight">Checkout</h1>
                    <div className="hidden lg:flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                        <span className="text-[#700b10]">Information</span>
                        <ChevronRight size={14} />
                        <span>Shipping</span>
                        <ChevronRight size={14} />
                        <span>Payment</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12">

                    {/* LEFT - Form */}
                    <div className="lg:col-span-7 bg-white p-4 sm:p-6 md:p-10 rounded-2xl md:rounded-3xl shadow-sm border border-yellow-100/50 order-2 lg:order-1">
                        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">

                            {/* Contact Info */}
                            <div>
                                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2 font-nunito">
                                    <span className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#700b10] text-white flex items-center justify-center text-xs md:text-sm font-sans pt-0.5">1</span>
                                    Contact Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                                    <input
                                        required name="phone" type="tel" placeholder="Phone Number"
                                        readOnly={autofilled && !!formData.phone}
                                        className={`w-full px-4 md:px-5 py-3 md:py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#700b10]/20 focus:border-[#700b10] outline-none transition-all placeholder:text-gray-400 text-gray-900 text-sm md:text-base ${autofilled && formData.phone ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
                                        value={formData.phone} onChange={handleInputChange}
                                    />
                                    <input
                                        name="email" type="email" placeholder="Email Address (Optional)"
                                        className="w-full px-4 md:px-5 py-3 md:py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#700b10]/20 focus:border-[#700b10] outline-none transition-all placeholder:text-gray-400 text-gray-900 text-sm md:text-base"
                                        value={formData.email} onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            {/* Shipping Info */}
                            <div>
                                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2 font-nunito">
                                    <span className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#700b10] text-white flex items-center justify-center text-xs md:text-sm font-sans pt-0.5">2</span>
                                    Shipping Address
                                </h2>
                                {autofilled && (
                                    <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 md:px-4 py-2 md:py-2.5 mb-4 md:mb-5 text-[10px] md:text-sm font-semibold">
                                        <CheckCircle2 size={14} className="flex-shrink-0 md:w-4 md:h-4" />
                                        Address auto-filled from saved default. You can edit below.
                                    </div>
                                )}
                                <div className="space-y-3 md:space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                                        <input
                                            required name="firstName" placeholder="First Name"
                                            className="w-full px-4 md:px-5 py-3 md:py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#700b10]/20 focus:border-[#700b10] outline-none transition-all placeholder:text-gray-400 text-gray-900 text-sm md:text-base"
                                            value={formData.firstName} onChange={handleInputChange}
                                        />
                                        <input
                                            required name="lastName" placeholder="Last Name"
                                            className="w-full px-4 md:px-5 py-3 md:py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#700b10]/20 focus:border-[#700b10] outline-none transition-all placeholder:text-gray-400 text-gray-900 text-sm md:text-base"
                                            value={formData.lastName} onChange={handleInputChange}
                                        />
                                    </div>
                                    <input
                                        required name="address" placeholder="Complete Address (House No, Street, Area)"
                                        className="w-full px-4 md:px-5 py-3 md:py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#700b10]/20 focus:border-[#700b10] outline-none transition-all placeholder:text-gray-400 text-gray-900 text-sm md:text-base"
                                        value={formData.address} onChange={handleInputChange}
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                                        <input
                                            required name="city" placeholder="City"
                                            className="w-full px-4 md:px-5 py-3 md:py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#700b10]/20 focus:border-[#700b10] outline-none transition-all placeholder:text-gray-400 text-gray-900 text-sm md:text-base"
                                            value={formData.city} onChange={handleInputChange}
                                        />
                                        <div className="relative">
                                            <input
                                                required name="state" placeholder="State"
                                                className="w-full px-4 md:px-5 py-3 md:py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#700b10]/20 focus:border-[#700b10] outline-none transition-all placeholder:text-gray-400 text-gray-900 text-sm md:text-base"
                                                value={formData.state} onChange={handleInputChange}
                                            />
                                            {isAutofilling && (
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                    <div className="w-4 h-4 border-2 border-gray-200 border-t-[#700b10] rounded-full animate-spin"></div>
                                                </div>
                                            )}
                                        </div>
                                        <input
                                            required name="pincode" placeholder="Pincode"
                                            className="w-full px-4 md:px-5 py-3 md:py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#700b10]/20 focus:border-[#700b10] outline-none transition-all placeholder:text-gray-400 text-gray-900 text-sm md:text-base"
                                            value={formData.pincode} onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div>
                                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2 font-nunito">
                                    <span className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#700b10] text-white flex items-center justify-center text-xs md:text-sm font-sans pt-0.5">3</span>
                                    Payment Method
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div 
                                        onClick={() => setPaymentMethod("cod")}
                                        className={`cursor-pointer p-4 md:p-5 border-2 rounded-2xl transition-all flex items-center gap-4 ${paymentMethod === "cod" ? 'border-[#700b10] bg-red-50/30' : 'border-gray-100 bg-gray-50/50 hover:border-gray-200'}`}
                                    >
                                        <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === "cod" ? 'border-[#700b10]' : 'border-gray-300'}`}>
                                            {paymentMethod === "cod" && <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-[#700b10] rounded-full"></div>}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm md:text-base font-bold text-gray-900">Cash on Delivery (COD)</p>
                                            <p className="text-[10px] md:text-xs text-gray-500 font-medium lowercase italic">Pay when you receive your order</p>
                                        </div>
                                    </div>

                                    <div
                                        onClick={() => setPaymentMethod("online")}
                                        className={`cursor-pointer p-4 md:p-5 border-2 rounded-2xl transition-all flex items-center gap-4 ${paymentMethod === "online" ? 'border-[#700b10] bg-red-50/30' : 'border-gray-100 bg-gray-50/50 hover:border-gray-200'}`}
                                    >
                                        <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === "online" ? 'border-[#700b10]' : 'border-gray-300'}`}>
                                            {paymentMethod === "online" && <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-[#700b10] rounded-full"></div>}
                                        </div>
                                        <div className="flex-1 text-left">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm md:text-base font-bold text-gray-900">Online Payment</p>
                                                <span className="text-[8px] md:text-[9px] font-black bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded tracking-widest uppercase">Secure</span>
                                            </div>
                                            <p className="text-[10px] md:text-xs text-gray-500 font-medium">UPI, cards, net banking via Mega Checkout</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                disabled={isSubmitting || !isDeliverable || isCalculatingShipping || isCalculatingTax}
                                className="w-full bg-[#700b10] text-white py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-base md:text-lg shadow-xl shadow-[#700b10]/20 hover:bg-[#5a090d] transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 md:gap-3 disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wider"
                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 md:w-6 md:h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <ShieldCheck size={20} className="md:w-6 md:h-6" />
                                        {paymentMethod === "cod" ? 'PLACE ORDER (COD)' : 'PROCEED TO PAYMENT'}
                                    </>
                                )}
                            </button>

                            <p className="text-center text-[10px] md:text-xs text-gray-400 font-medium px-4 md:px-8">
                                By completing your order, you agree to our Terms of Service and Privacy Policy. Your data is encrypted and handled securely.
                            </p>
                        </form>
                    </div>

                    {/* RIGHT - Summary */}
                    <div className="lg:col-span-5 order-1 lg:order-2">
                        <div className="lg:sticky lg:top-8 space-y-4 md:space-y-6">

                            {/* Order Items */}
                            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-yellow-100/50">
                                <h3 className="text-base md:text-lg font-bold text-gray-900 mb-4 md:mb-6 font-nunito">Order Summary</h3>
                                <div className="space-y-4 md:space-y-6 max-h-[300px] md:max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                                    {cart.map((item) => (
                                        <div key={item.variantId} className="flex gap-3 md:gap-4">
                                            <div className="relative w-12 h-12 md:w-16 md:h-16 bg-gray-50 rounded-lg md:rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
                                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 md:w-6 md:h-6 bg-[#700b10] text-white text-[9px] md:text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                                    {item.qty}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-[11px] md:text-sm font-bold text-gray-900 line-clamp-1 truncate uppercase">{item.title}</h4>
                                                <div className="flex flex-col gap-0.5 mt-0.5">
                                                    {item.variantTitle && item.variantTitle !== "Default Title" && (
                                                        <p className="text-[9px] md:text-[10px] text-[#700b10] font-black uppercase tracking-wider">{item.variantTitle}</p>
                                                    )}
                                                    <p className="text-[8px] md:text-[10px] text-gray-500 font-medium uppercase tracking-widest">
                                                        {item.weight > 0 ? `${item.weight}${item.weightUnit === 'KILOGRAMS' || item.weightUnit === 'KG' ? 'kg' : 'g'}` : 'Premium Quality'}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="text-[12px] md:text-sm font-black text-gray-900">
                                                ₹{(Number(item.price) * item.qty).toLocaleString("en-IN")}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Calculation */}
                                <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-dashed border-gray-200 space-y-3 md:space-y-4">
                                    <div className="flex justify-between text-xs md:text-sm text-gray-600">
                                        <span>Subtotal</span>
                                        <span className="font-bold text-gray-900">₹{subtotal.toLocaleString("en-IN")}</span>
                                    </div>
                                    <div className="flex justify-between text-xs md:text-sm text-gray-600">
                                        <span>Total Weight</span>
                                        <span className="font-bold text-gray-900">
                                            {totalWeightGrams >= 1000 ? `${(totalWeightGrams / 1000).toFixed(2)} kg` : `${totalWeightGrams} g`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-xs md:text-sm text-gray-600">
                                        <div className="flex flex-col gap-0.5">
                                            <div className="flex items-center gap-1.5">
                                                <span>Shipping Charges</span>
                                                <Truck size={14} className="text-[#700b10]" />
                                            </div>
                                            {isCalculatingShipping ? (
                                                <span className="text-[8px] md:text-[10px] text-gray-400 italic animate-pulse">Calculating...</span>
                                            ) : shippingMessage && (
                                                <span className={`text-[8px] md:text-[10px] ${isDeliverable ? 'text-green-600' : 'text-red-600 font-black'} font-bold max-w-full leading-tight`}>{shippingMessage}</span>
                                            )}
                                        </div>
                                        {isCalculatingShipping ? (
                                            <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-gray-200 border-t-[#700b10] rounded-full animate-spin"></div>
                                        ) : (
                                            <span className="font-bold text-gray-900">
                                                {shipping === 0 ? (
                                                    isDeliverable ? <span className="text-green-600 uppercase text-[10px] md:text-xs font-black">FREE</span> : <span className="text-red-600 uppercase text-[10px] md:text-xs font-black">N/A</span>
                                                ) : `₹${shipping.toLocaleString("en-IN")}`}
                                            </span>
                                        )}
                                    </div>
                                    {taxLines.length > 0 ? (
                                        taxLines.map((line, idx) => (
                                            <div key={idx} className="flex justify-between text-xs md:text-sm text-gray-600">
                                                <span>{line.title} ({ (line.rate * 100).toFixed(1) }%)</span>
                                                <span className="font-bold text-gray-900">₹{parseFloat(line.price).toLocaleString("en-IN")}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex justify-between text-xs md:text-sm text-gray-600">
                                            <span>Estimated Taxes</span>
                                            {isCalculatingTax ? (
                                                <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-gray-200 border-t-[#700b10] rounded-full animate-spin"></div>
                                            ) : (
                                                <span className="font-bold text-gray-900">₹{tax.toLocaleString("en-IN")}</span>
                                            )}
                                        </div>
                                    )}
                                    <div className="flex justify-between text-lg md:text-xl font-black pt-2 border-t border-gray-100">
                                        <span className="text-gray-900">Grand Total</span>
                                        <span className="text-[#700b10]">₹{total.toLocaleString("en-IN")}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex flex-col items-center text-center gap-2">
                                    <ShieldCheck size={20} className="text-emerald-600" />
                                    <span className="text-[10px] font-black text-emerald-800 uppercase tracking-tighter">100% Secure Checkout</span>
                                </div>
                                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex flex-col items-center text-center gap-2">
                                    <CreditCard size={20} className="text-amber-600" />
                                    <span className="text-[10px] font-black text-amber-800 uppercase tracking-tighter">Multiple Pay Options</span>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
