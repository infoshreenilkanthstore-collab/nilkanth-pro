"use client";

import React, { useState, useEffect } from "react";
import { X, Mail, Phone, ArrowRight } from "lucide-react";

export default function LoginPopup({ isOpen, onClose }) {
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState("phone"); // "phone" or "otp"
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Reset state when popup opens/closes
    useEffect(() => {
        if (isOpen) {
            setStep("phone");
            setPhone("");
            setOtp("");
            setError("");
        }
    }, [isOpen]);

    if (!isOpen) return null;

    async function sendOTP() {
        setError("");
        if (!phone || !/^[0-9]{10}$/.test(phone)) {
            setError("Please enter a valid 10-digit phone number");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "send", phone })
            });
            const data = await res.json();
            if (data.success) {
                setStep("otp");
            } else {
                setError(data.message || "Failed to send OTP");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    async function verifyOTP() {
        setError("");
        if (!otp || (otp.length < 4 || otp.length > 6)) {
            setError("Please enter a valid OTP");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "verify", phone, otp })
            });
            const data = await res.json();
            console.log("Auth Verify Data:", data);
            if (data.success) {

                localStorage.setItem("ns_userPhone", phone);
                localStorage.setItem("ns_customerId", data.customerId);
                const token = data.token || data.accessToken;
                if (token) {
                    localStorage.setItem("ns_accessToken", token);
                }
                window.location.reload(); // Refresh to update header state


                onClose();
            } else {
                setError(data.message || "Invalid OTP");
            }
        } catch (err) {
            setError("Verification failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
            {/* Modal Container */}
            <div className="relative w-full max-w-[900px] h-auto bg-white rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in fade-in zoom-in duration-300">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 p-2 bg-white/80 hover:bg-white rounded-full shadow-md text-gray-500 hover:text-black transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Left Side: Branding/Image */}
                <div className="hidden md:flex w-1/2 relative overflow-hidden bg-[#1a1a1ab0]">
                    <img
                        src="https://cdn.shopify.com/s/files/1/0804/0867/4532/files/Bhagvat-poojan_Collections_2_39ac439b-4dd3-40b6-aa90-fe81614d2527.webp?v=1774257288"
                        alt="Branding"
                        className="absolute inset-0 w-full h-full object-cover opacity-100 mix-blend-overlay"
                    />
                    {/* <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-white p-12 text-center">
                        <h2 className="text-5xl font-nunito tracking-[0.2em] mb-4 uppercase">Bhagvat</h2>
                        <div className="w-24 h-[1px] bg-white/50 mb-4"></div>
                        <p className="text-sm tracking-[0.3em] font-light uppercase opacity-80">Divine Prasadam House</p>
                    </div> */}
                </div>

                {/* Right Side: Form */}
                <div className="w-full md:w-1/2 flex flex-col justify-center p-6 sm:p-8 md:p-12 lg:p-14 bg-[#FCFAF7]">
                    <div className="max-w-[320px] mx-auto w-full">
                        <div className="mb-6 sm:mb-10 text-center md:text-left">
                            <h3 className="text-2xl sm:text-3xl font-nunito text-[#1a1a1a] mb-2 italic">Sign In</h3>
                            <p className="text-sm text-gray-500 font-light">
                                {step === "phone"
                                    ? "Enter your phone to receive a one-time code"
                                    : "Enter the verification code sent to your phone"}
                            </p>
                        </div>

                        {error && (
                            <div className="mb-4 text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 animate-shake">
                                {error}
                            </div>
                        )}

                        <div className="space-y-6">
                            {step === "phone" ? (
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Phone Number</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-gray-400">
                                            <Phone className="w-4 h-4" />
                                            <span className="text-sm font-medium border-r border-gray-200 pr-2 mr-1">+91</span>
                                        </div>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="99999-99999"
                                            className="w-full bg-white border border-gray-200 rounded-lg py-4 pl-24 pr-4 outline-none focus:border-[#700b10] transition-colors text-sm tracking-widest placeholder:text-gray-300 text-black"
                                        />
                                    </div>
                                    <button
                                        onClick={sendOTP}
                                        disabled={loading}
                                        className="w-full bg-[#1a1a1a] hover:bg-[#700b10] disabled:bg-gray-400 text-white rounded-lg py-4 font-medium transition-all duration-300 flex items-center justify-center gap-2 group mt-4 overflow-hidden relative"
                                    >
                                        <span className="relative z-10 uppercase tracking-widest text-xs">
                                            {loading ? "Sending..." : "Continue"}
                                        </span>
                                        {!loading && (
                                            <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                                        )}
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">One-Time Code</label>
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="------"
                                        maxLength={6}
                                        className="w-full bg-white border border-gray-200 rounded-lg py-4 px-4 outline-none focus:border-[#700b10] transition-colors text-center text-xl tracking-[0.5em] placeholder:text-gray-300"
                                    />
                                    <div className="flex justify-between items-center mt-2">
                                        <button
                                            onClick={() => setStep("phone")}
                                            className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-[#700b10] transition-colors"
                                        >
                                            Change Phone
                                        </button>
                                        <button
                                            onClick={sendOTP}
                                            className="text-[10px] uppercase tracking-widest text-[#700b10] font-bold"
                                        >
                                            Resend Code
                                        </button>
                                    </div>
                                    <button
                                        onClick={verifyOTP}
                                        disabled={loading}
                                        className="w-full bg-[#1a1a1a] hover:bg-[#700b10] disabled:bg-gray-400 text-white rounded-lg py-4 font-medium transition-all duration-300 flex items-center justify-center gap-2 group mt-4 overflow-hidden relative"
                                    >
                                        <span className="relative z-10 uppercase tracking-widest text-xs">
                                            {loading ? "Verifying..." : "Sign In"}
                                        </span>
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-100">
                            <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                                By continuing, you agree to our <span className="underline cursor-pointer hover:text-gray-600 transition-colors">Terms of Service</span> and <span className="underline cursor-pointer hover:text-gray-600 transition-colors">Privacy Policy</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
