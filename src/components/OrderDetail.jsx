"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
    ArrowLeft, 
    Package, 
    Truck, 
    CreditCard, 
    MapPin, 
    CheckCircle2, 
    Clock, 
    Calendar, 
    ExternalLink, 
    ChevronRight,
    AlertCircle
} from "lucide-react";

export default function OrderDetail({ orderId }) {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!orderId) return;

        const token = typeof window !== "undefined" ? localStorage.getItem("ns_accessToken") : null;
        if (!token) {
            setError("Authentication token required. Please sign in.");
            setLoading(false);
            return;
        }

        setLoading(true);
        fetch(`/api/customer/orders/${orderId}?accessToken=${encodeURIComponent(token)}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then((r) => r.json())
            .then((d) => {
                if (d.success && d.order) {
                    setOrder(d.order);
                } else {
                    setError(d.error || "Order not found");
                }
            })
            .catch((err) => {
                console.error("Order detail fetch error:", err);
                setError("Failed to load order details");
            })
            .finally(() => setLoading(false));
    }, [orderId]);

    const formatDate = (dateString) => {
        if (!dateString) return "—";
        return new Date(dateString).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FDFBF7] py-12 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="animate-pulse space-y-6">
                        <div className="h-6 w-36 bg-gray-200 rounded-lg"></div>
                        <div className="h-28 bg-white border border-yellow-100/50 rounded-3xl"></div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="h-48 md:col-span-2 bg-white border border-yellow-100/50 rounded-3xl"></div>
                            <div className="h-48 bg-white border border-yellow-100/50 rounded-3xl"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-[#FDFBF7] py-16 px-4 sm:px-6">
                <div className="max-w-lg mx-auto bg-white border border-yellow-100/50 rounded-3xl p-8 text-center shadow-sm">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                        <AlertCircle size={28} />
                    </div>
                    <h2 className="text-xl font-nunito font-bold text-gray-900 mb-2">Unable to Load Order</h2>
                    <p className="text-gray-500 text-sm mb-6">{error || "The requested order could not be retrieved."}</p>
                    <Link
                        href="/profile"
                        className="inline-flex items-center gap-2 bg-[#700b10] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#5a090d] transition-all"
                    >
                        <ArrowLeft size={16} /> Back to Orders
                    </Link>
                </div>
            </div>
        );
    }

    const shippingAddr = order.shipping_address || order.shippingAddress;
    const billingAddr = order.billing_address || order.billingAddress;
    const shipment = order.latest_shipment || order.latestShipment;
    const payment = order.payment || (order.payments && order.payments[0]);
    const currency = order.currency === "INR" ? "₹" : (order.currency || "₹");

    return (
        <div className="min-h-screen bg-[#FDFBF7] py-8 md:py-14">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">

                {/* Back Navigation & Breadcrumb */}
                <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-500">
                    <Link 
                        href="/profile" 
                        className="inline-flex items-center gap-1.5 text-gray-600 hover:text-[#700b10] transition-colors group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                        <span>My Account</span>
                    </Link>
                    <ChevronRight size={14} className="text-gray-400" />
                    <span className="text-[#700b10]">Order {order.order_number || `#${order.id}`}</span>
                </div>

                {/* Order Header Card */}
                <div className="bg-white border border-yellow-100/50 rounded-3xl p-6 sm:p-8 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-2xl sm:text-3xl font-nunito font-bold text-[#700b10]">
                                    Order {order.order_number || `#${order.id}`}
                                </h1>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1.5 mt-1">
                                <Calendar size={14} className="text-[#cda25e]" />
                                Placed on {formatDate(order.placed_at || order.created_at)}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 sm:self-start">
                            {/* Financial Status Badge */}
                            <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                                order.financial_status === "paid" 
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60" 
                                    : "bg-amber-50 text-amber-700 border border-amber-200/60"
                            }`}>
                                {order.financial_status === "paid" ? "Paid" : (order.financial_status || "Pending")}
                            </span>

                            {/* Fulfillment / Shipping Status Badge */}
                            <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                                (order.fulfillment_status === "fulfilled" || order.status === "shipped" || order.status === "delivered")
                                    ? "bg-blue-50 text-blue-700 border border-blue-200/60"
                                    : "bg-amber-50 text-amber-700 border border-amber-200/60"
                            }`}>
                                {order.status === "shipped" ? "Shipped" : (order.fulfillment_status || order.status || "Processing")}
                            </span>
                        </div>
                    </div>

                    {/* Shipment Tracking Alert / Card if available */}
                    {shipment && (
                        <div className="mt-6 bg-[#FAF7F0] border border-[#EBE3D5] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-start sm:items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#700b10] text-white flex items-center justify-center shrink-0">
                                    <Truck size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-[#700b10]">
                                        Shipment Details {shipment.shipment_number ? `(${shipment.shipment_number})` : ""}
                                    </p>
                                    <p className="text-sm font-medium text-gray-700 mt-0.5">
                                        Tracking Number: <span className="font-bold text-gray-900">{shipment.tracking_number || "—"}</span>
                                        {shipment.carrier && <span className="text-gray-500 ml-2">via {shipment.carrier}</span>}
                                    </p>
                                </div>
                            </div>
                            {shipment.tracking_url && (
                                <a
                                    href={shipment.tracking_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-1.5 bg-[#700b10] text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#5a090d] transition-colors shrink-0 shadow-sm"
                                >
                                    Track Order <ExternalLink size={13} />
                                </a>
                            )}
                        </div>
                    )}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column: Items */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Items */}
                        <div className="bg-white border border-yellow-100/50 rounded-3xl p-6 sm:p-8 shadow-sm">
                            <h2 className="text-lg font-nunito font-bold text-[#700b10] mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                                <Package size={20} className="text-[#cda25e]" />
                                Order Items ({order.items?.length || 0})
                            </h2>

                            <div className="divide-y divide-gray-100">
                                {(order.items || []).map((item, idx) => {
                                    const img = item.image_url || item.product_image || item.product?.image_url;
                                    const productHandle = item.product?.handle;

                                    return (
                                        <div key={item.id || idx} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                                            {img ? (
                                                <img
                                                    src={img}
                                                    alt={item.title}
                                                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-2xl border border-gray-100 bg-gray-50 shrink-0"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 font-bold text-xs shrink-0">
                                                    {item.quantity}x
                                                </div>
                                            )}

                                            <div className="flex-1 min-w-0">
                                                {productHandle ? (
                                                    <Link 
                                                        href={`/products/${productHandle}`}
                                                        className="font-bold text-gray-900 text-sm sm:text-base hover:text-[#700b10] transition-colors line-clamp-2"
                                                    >
                                                        {item.title}
                                                    </Link>
                                                ) : (
                                                    <p className="font-bold text-gray-900 text-sm sm:text-base line-clamp-2">
                                                        {item.title}
                                                    </p>
                                                )}

                                                {item.variant?.title && item.variant.title !== "Default Title" && (
                                                    <p className="text-xs text-[#cda25e] font-semibold mt-0.5">
                                                        Variant: {item.variant.title}
                                                    </p>
                                                )}

                                                <p className="text-xs text-gray-500 mt-1">
                                                    Qty: <span className="font-bold text-gray-700">{item.quantity}</span> &times; {currency}{item.price}
                                                </p>
                                            </div>

                                            <div className="text-right shrink-0">
                                                <p className="font-bold text-[#700b10] text-base sm:text-lg font-nunito">
                                                    {currency}{item.total_amount || item.price}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Payment & Transaction Info */}
                        {payment && (
                            <div className="bg-white border border-yellow-100/50 rounded-3xl p-6 sm:p-8 shadow-sm">
                                <h2 className="text-lg font-nunito font-bold text-[#700b10] mb-4 flex items-center gap-2 border-b border-gray-100 pb-4">
                                    <CreditCard size={20} className="text-[#cda25e]" />
                                    Payment Information
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Method</p>
                                        <p className="text-gray-900 font-semibold uppercase">{payment.payment_method || payment.provider || "Online"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Payment Status</p>
                                        <span className="inline-block px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700">
                                            {payment.status || "Paid"}
                                        </span>
                                    </div>
                                    {payment.transaction_reference && (
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Transaction Ref</p>
                                            <p className="text-gray-700 font-mono text-xs break-all">{payment.transaction_reference}</p>
                                        </div>
                                    )}
                                    {payment.paid_at && (
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Paid At</p>
                                            <p className="text-gray-700 text-xs">{formatDate(payment.paid_at)}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Order Summary & Address */}
                    <div className="space-y-6">

                        {/* Order Summary */}
                        <div className="bg-white border border-yellow-100/50 rounded-3xl p-6 sm:p-8 shadow-sm">
                            <h2 className="text-lg font-nunito font-bold text-[#700b10] mb-6 border-b border-gray-100 pb-4">
                                Order Summary
                            </h2>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-semibold text-gray-900">{currency}{order.subtotal_amount || order.total_amount}</span>
                                </div>

                                {parseFloat(order.discount_amount) > 0 && (
                                    <div className="flex justify-between text-emerald-700 font-medium">
                                        <span>Discount</span>
                                        <span>-{currency}{order.discount_amount}</span>
                                    </div>
                                )}

                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="font-semibold text-gray-900">
                                        {parseFloat(order.shipping_amount) > 0 ? `${currency}${order.shipping_amount}` : "Free"}
                                    </span>
                                </div>

                                {parseFloat(order.tax_amount) > 0 && (
                                    <div className="flex justify-between text-gray-600">
                                        <span>Taxes</span>
                                        <span className="font-semibold text-gray-900">{currency}{order.tax_amount}</span>
                                    </div>
                                )}

                                <div className="border-t border-gray-100 pt-4 mt-2 flex justify-between items-center">
                                    <span className="font-bold text-gray-900 text-base">Total Amount</span>
                                    <span className="font-bold text-[#700b10] text-2xl font-nunito">{currency}{order.total_amount}</span>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Address */}
                        {shippingAddr && (
                            <div className="bg-white border border-yellow-100/50 rounded-3xl p-6 sm:p-8 shadow-sm">
                                <h2 className="text-lg font-nunito font-bold text-[#700b10] mb-4 flex items-center gap-2 border-b border-gray-100 pb-4">
                                    <MapPin size={20} className="text-[#cda25e]" />
                                    Delivery Address
                                </h2>

                                <div className="text-sm text-gray-600 space-y-1">
                                    <p className="font-bold text-gray-900 text-base mb-1.5">
                                        {[shippingAddr.first_name, shippingAddr.last_name].filter(Boolean).join(" ")}
                                    </p>
                                    <p>{shippingAddr.address_line1}</p>
                                    {shippingAddr.address_line2 && <p>{shippingAddr.address_line2}</p>}
                                    <p>{shippingAddr.city}, {shippingAddr.state} - {shippingAddr.pincode}</p>
                                    <p>{shippingAddr.country || "India"}</p>
                                    {shippingAddr.phone && (
                                        <p className="pt-2 text-gray-900 font-semibold text-xs">
                                            Phone: {shippingAddr.phone}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Need Help Card */}
                        <div className="bg-white border border-yellow-100/50 rounded-3xl p-6 shadow-sm text-center">
                            <p className="text-xs font-bold text-[#cda25e] uppercase tracking-widest mb-1">Need Assistance?</p>
                            <p className="text-sm text-gray-600 mb-4">Have any questions about this order?</p>
                            <Link
                                href="/contact"
                                className="inline-block w-full border border-gray-200 text-gray-700 hover:bg-gray-50 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors"
                            >
                                Contact Support
                            </Link>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
