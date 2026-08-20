"use client";

import React, { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Package, Calendar, ArrowRight, ShoppingBag } from "lucide-react";

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderName = searchParams.get("orderName") || "#1001";
    const totalAmount = Number(searchParams.get("total") || searchParams.get("amount") || searchParams.get("price") || 0);
    
    useEffect(() => {
        if (typeof window !== "undefined") {
            if (window.fbq) {
                window.fbq('track', 'Purchase', { 
                    currency: 'INR', 
                    value: totalAmount,
                    content_type: 'product'
                });
            }
            if (window.gtag) {
                window.gtag('event', 'purchase', { 
                    transaction_id: orderName, 
                    currency: 'INR',
                    value: totalAmount
                });
            }
        }
    }, [orderName, totalAmount]);

    // Get current date for display
    const date = new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    return (
        <div className="min-h-screen bg-[#FDFBF7] py-12 md:py-24">
            <div className="max-w-3xl mx-auto px-6">
                
                {/* Success Card */}
                <div className="bg-white rounded-[40px] shadow-2xl shadow-yellow-900/5 p-8 md:p-16 text-center border border-yellow-100/50 overflow-hidden relative">
                    
                    {/* Background Accents */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-50 rounded-full translate-x-16 -translate-y-16 -z-10" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#700b10]/5 rounded-full -translate-x-24 translate-y-24 -z-10" />

                    {/* Animated Icon */}
                    <div className="flex justify-center mb-8">
                        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center animate-bounce">
                            <CheckCircle2 size={48} className="text-emerald-500" />
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-nunito font-black text-gray-900 mb-4">Order Confirmed!</h1>
                    <p className="text-gray-500 text-lg mb-12 max-w-md mx-auto">
                        Thank you for your purchase. Your premium Nilkanth Store treats are being prepared for shipment.
                    </p>

                    {/* Order Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 text-left">
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-[#700b10]">
                                <Package size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Number</p>
                                <p className="text-lg font-black text-gray-900">{orderName}</p>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-[#700b10]">
                                <Calendar size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Date</p>
                                <p className="text-lg font-black text-gray-900">{date}</p>
                            </div>
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="border-t border-dashed border-gray-200 pt-12 text-left mb-12">
                        <h3 className="text-sm font-black text-gray-900 mb-6 uppercase tracking-widest">What's Next?</h3>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <span className="w-6 h-6 rounded-full bg-[#700b10] text-white flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                                    You will receive an order confirmation email shortly with your full receipt and tracking details.
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <span className="w-6 h-6 rounded-full bg-[#700b10] text-white flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                                    Our team is meticulously packing your traditional sweets to ensure they arrive in perfect condition.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <Link href="/" className="flex-1 bg-[#700b10] text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-[#700b10]/20 hover:bg-[#5a090d] transition-all flex items-center justify-center gap-2">
                            CONTINUE SHOPPING
                            <ArrowRight size={20} />
                        </Link>
                        <Link href="/collections/all" className="flex-1 bg-white text-gray-900 border border-gray-200 py-5 rounded-2xl font-black text-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                            <ShoppingBag size={20} />
                            VIEW ALL PRODUCTS
                        </Link>
                    </div>

                </div>

                {/* Secure Footer */}
                <div className="mt-12 text-center">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">NILKANTH STORE - TRADITION IN EVERY BITE</p>
                </div>

            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#700b10]"></div>
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}
