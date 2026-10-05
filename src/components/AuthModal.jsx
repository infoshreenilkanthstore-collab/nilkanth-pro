import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Phone,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Lock,
  MessageSquare,
} from "lucide-react";
import { sendOtp, verifyOtp } from "../services/api";

export default function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
}) {
  const [step, setStep] = useState("PHONE"); // "PHONE" | "OTP" | "SUCCESS"
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  const phoneInputRef = useRef(null);
  const otpInputsRef = useRef([]);

  // Auto-focus and lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        phoneInputRef.current?.focus();
      }, 150);
    } else {
      document.body.style.overflow = "";
      // Reset state on close
      setStep("PHONE");
      setPhoneNumber("");
      setOtp(["", "", "", "", "", ""]);
      setErrorMessage("");
      setResendTimer(0);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Resend countdown timer
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Format and restrict phone number input
  const handlePhoneChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    if (rawValue.length <= 10) {
      setPhoneNumber(rawValue);
      setErrorMessage("");
    }
  };

  const [storeSenderNumber, setStoreSenderNumber] = useState("+91 93105 01040");

  // Submit Phone Number to Send OTP via WhatsApp
  const handleSendOtp = async (e) => {
    e?.preventDefault();
    if (phoneNumber.length < 10) {
      setErrorMessage("Please enter a valid 10-digit mobile number");
      phoneInputRef.current?.focus();
      return;
    }

    setLoading(true);
    setErrorMessage("");

    const res = await sendOtp(phoneNumber);
    setLoading(false);

    if (res.success) {
      if (res.data?.sender_number || res.data?.sender || res.sender) {
        setStoreSenderNumber(res.data.sender_number || res.data.sender || res.sender);
      }
      setStep("OTP");
      setResendTimer(30);
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 150);
    } else {
      setErrorMessage(res.message || "Unable to send verification code. Please try again.");
    }
  };

  // Handle single-digit OTP input boxes
  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, "");
    if (!digit) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    // Support pasting full 6-digit OTP
    if (digit.length > 1) {
      const pastedDigits = digit.slice(0, 6).split("");
      const newOtp = [...otp];
      pastedDigits.forEach((d, i) => {
        if (i < 6) newOtp[i] = d;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(pastedDigits.length, 5);
      otpInputsRef.current[nextIndex]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto advance to next box
    if (index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  // Handle Backspace on OTP inputs
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  // Submit OTP to Verify
  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      setErrorMessage("Please enter the complete 6-digit verification code");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    const res = await verifyOtp(phoneNumber, otpCode);
    setLoading(false);

    if (res.success) {
      setStep("SUCCESS");
      if (onLoginSuccess) {
        onLoginSuccess(res.customer || { phone: phoneNumber });
      }
      setTimeout(() => {
        onClose();
      }, 1600);
    } else {
      setErrorMessage(res.message || "Invalid or expired code. Please verify and try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center pt-8 sm:pt-14 md:pt-0 p-3 sm:p-4 overflow-y-auto">
      {/* Blurred Backdrop */}
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-md transition-opacity duration-300 animate-fadeIn"
        onClick={onClose}
      />

      {/* Main Dialog Card with Desktop Spiritual Poster + Clean Sign-In Form */}
      <div className="relative w-full max-w-md md:max-w-[860px] bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-amber-100 z-10 animate-scaleUp flex flex-col md:flex-row max-h-[90dvh] md:min-h-[480px]">

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-1.5 sm:p-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-full transition-all duration-200 hover:scale-105 z-30 cursor-pointer shadow-xs"
          aria-label="Close"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* LEFT COLUMN: Spiritual Brand Poster from /about3.png (Desktop Only) */}
        <div className="hidden md:block md:w-[45%] relative overflow-hidden select-none bg-[#752603] flex-shrink-0">
          <img
            src="/about3.png"
            alt="शुद्ध भक्ति, सच्चा उद्देश्य - Shri Nilkanth Store"
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle gradient vignette at the bottom edge for seamless boundary */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />
        </div>

        {/* RIGHT COLUMN: Interactive Form Content */}
        <div className="w-full md:w-[55%] bg-white p-5 sm:p-7 md:p-8 flex flex-col justify-between overflow-y-auto">

          {/* STEP 1: Enter Phone Number */}
          {step === "PHONE" && (
            <div className="flex-1 flex flex-col justify-center">
              <div className="mb-4 sm:mb-6">
                <h3 className="font-tenor text-xl sm:text-2xl md:text-3xl text-stone-900 tracking-tight font-medium">
                  Sign In
                </h3>
                <p className="text-stone-500 text-xs sm:text-sm mt-1 font-nunito flex items-center gap-1.5">
                  Enter your mobile number to receive a one-time WhatsApp / SMS code
                </p>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5 font-nunito">
                    Phone Number
                  </label>

                  {/* Phone input with +91 country prefix badge */}
                  <div className="flex items-center border border-stone-300 focus-within:border-[#700b10] focus-within:ring-2 focus-within:ring-[#700b10]/15 rounded-xl transition-all bg-white overflow-hidden shadow-2xs">
                    <div className="px-3 py-2.5 sm:px-3.5 sm:py-3 bg-stone-50/90 border-r border-stone-200 flex items-center gap-1.5 text-stone-700 font-bold text-xs sm:text-sm select-none">
                      <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-500" />
                      <span>+91</span>
                    </div>
                    <input
                      ref={phoneInputRef}
                      type="tel"
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      placeholder="99999-99999"
                      maxLength={10}
                      style={{ fontSize: "16px" }}
                      className="w-full px-3 py-2.5 sm:px-3.5 sm:py-3 outline-none text-stone-900 placeholder-stone-300 text-sm sm:text-base font-semibold tracking-wider font-nunito"
                    />
                  </div>

                  {/* Dynamic WhatsApp Destination Number Indicator */}
                  {phoneNumber.length > 0 && (
                    <div className="mt-2.5 p-2.5 rounded-xl bg-emerald-50/90 border border-emerald-200/80 flex items-center gap-2 text-xs text-emerald-900 font-nunito animate-fadeIn">
                      <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        OTP will be sent to WhatsApp:{" "}
                        <strong className="text-emerald-950 font-bold font-mono">
                          +91 {phoneNumber.length >= 5 ? `${phoneNumber.slice(0, 5)} ${phoneNumber.slice(5)}` : phoneNumber}
                        </strong>
                      </span>
                    </div>
                  )}

                  {/* Error Notification */}
                  {errorMessage && (
                    <p className="text-red-600 text-xs mt-2 font-semibold font-nunito animate-fadeIn">
                      {errorMessage}
                    </p>
                  )}
                </div>

                {/* Continue Button */}
                <button
                  type="submit"
                  disabled={loading || phoneNumber.length < 10}
                  className="w-full py-3 sm:py-3.5 bg-[#1f1d1d] hover:bg-[#700b10] text-white rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-[0.99]"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* WhatsApp Sender Store Number Alert Box */}
              <div className="mt-3.5 p-3 rounded-xl bg-emerald-50/90 border border-emerald-200/80 text-xs text-emerald-950 font-nunito space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Official WhatsApp Sender Info</span>
                </div>
                <p className="text-[11px] sm:text-[11.5px] text-emerald-800 leading-snug">
                  You will receive the OTP message from our official WhatsApp number:{" "}
                  <strong className="text-emerald-950 font-mono font-bold bg-white/90 px-1.5 py-0.5 rounded border border-emerald-300 inline-block">
                    {storeSenderNumber}
                  </strong>{" "}
                  (Shree Nilkanth Store).
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: Enter 6-Digit OTP */}
          {step === "OTP" && (
            <div className="flex-1 flex flex-col justify-center animate-fadeIn">
              <div className="mb-4 sm:mb-5">
                <h3 className="font-tenor text-xl sm:text-2xl md:text-3xl text-stone-900 tracking-tight font-medium">
                  Enter Verification Code
                </h3>

                {/* Number & Store Sender Details Banner */}
                <div className="mt-3 p-3 rounded-xl bg-emerald-50/90 border border-emerald-200/80 text-xs font-nunito space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-stone-600 font-semibold">
                      OTP Sent To:{" "}
                      <strong className="text-stone-900 font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-stone-200">
                        +91 {phoneNumber.slice(0, 5)} {phoneNumber.slice(5)}
                      </strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setStep("PHONE");
                        setErrorMessage("");
                      }}
                      className="text-[#700b10] hover:underline font-bold text-xs cursor-pointer"
                    >
                      (Change Number)
                    </button>
                  </div>

                  <div className="pt-1.5 border-t border-emerald-200/60 text-[11px] sm:text-[11.5px] text-emerald-900 leading-snug">
                    📲 <strong>Incoming Message Sender:</strong> Check your WhatsApp for message from{" "}
                    <strong className="font-mono text-emerald-950 font-bold bg-white px-1.5 py-0.5 rounded border border-emerald-300">
                      {storeSenderNumber}
                    </strong>{" "}
                    (Shree Nilkanth Store).
                  </div>
                </div>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                {/* 6 Individual Digit Boxes */}
                <div>
                  <div className="flex justify-between gap-1.5 sm:gap-2.5">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => (otpInputsRef.current[idx] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        style={{ fontSize: "18px" }}
                        className="w-10 h-11 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold rounded-lg sm:rounded-xl border border-stone-300 focus:border-[#700b10] focus:ring-2 focus:ring-[#700b10]/20 outline-none transition-all bg-stone-50/40 focus:bg-white text-stone-900"
                      />
                    ))}
                  </div>

                  {errorMessage && (
                    <p className="text-red-600 text-xs mt-2 font-semibold text-center font-nunito animate-fadeIn">
                      {errorMessage}
                    </p>
                  )}
                </div>

                {/* Verify Button */}
                <button
                  type="submit"
                  disabled={loading || otp.join("").length < 6}
                  className="w-full py-3 sm:py-3.5 bg-[#700b10] hover:bg-[#851016] text-white rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-[0.99]"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Verify &amp; Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Resend Code Action */}
                <div className="text-center pt-1 text-xs text-stone-500 font-nunito">
                  {resendTimer > 0 ? (
                    <span>
                      Resend code in <strong className="text-stone-800">{resendTimer}s</strong>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="text-[#700b10] font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Resend WhatsApp OTP
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* STEP 3: SUCCESS STATE */}
          {step === "SUCCESS" && (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-6 sm:py-8 animate-fadeIn">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-3 sm:mb-4 animate-scaleUp">
                <CheckCircle2 className="w-8 h-8 sm:w-9 sm:h-9" />
              </div>
              <h3 className="text-lg sm:text-2xl font-bold text-stone-900 font-nunito">
                Namaste &amp; Welcome!
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xs font-nunito">
                You have successfully signed in to Nilkanth Store.
              </p>
            </div>
          )}

          {/* Bottom Legal / Terms footer */}
          <div className="pt-3 sm:pt-4 text-center border-t border-stone-100">
            <p className="text-[9.5px] sm:text-[11px] text-stone-400 font-nunito">
              By continuing, you agree to our{" "}
              <a href="/terms" className="text-stone-600 underline hover:text-[#700b10]">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy-policy" className="text-stone-600 underline hover:text-[#700b10]">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
