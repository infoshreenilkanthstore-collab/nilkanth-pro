import React from "react";
import { CreditCard, ShieldCheck, ChevronLeft, Lock, Loader2, Banknote, Building2, Zap } from "lucide-react";

export default function CheckoutPaymentStep({
  gateways = [],
  selectedProvider = "",
  onSelectProvider,
  grandTotal = 0,
  isPlacingOrder = false,
  onPlaceOrder,
  onBackStep,
  errorMessage = "",
  isOneStep = true,
}) {
  const renderGatewayIcon = (provider) => {
    switch (provider) {
      case "razorpay":
        return <Zap className="w-5 h-5 text-blue-600" />;
      case "icici":
        return <Building2 className="w-5 h-5 text-amber-700" />;
      case "easebuzz":
        return <CreditCard className="w-5 h-5 text-emerald-600" />;
      case "cod":
        return <Banknote className="w-5 h-5 text-green-700" />;
      default:
        return <CreditCard className="w-5 h-5 text-stone-600" />;
    }
  };

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-7 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
        <div className="flex items-start sm:items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-amber-50 text-[#700b10] border border-amber-200 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 sm:mt-0">
            3
          </div>
          <div>
            <h2 className="font-serif text-base sm:text-lg font-bold text-stone-900 leading-tight">
              Payment Method &amp; Confirmation
            </h2>
            <p className="text-[11px] sm:text-xs text-stone-500 font-sans mt-0.5">
              Choose your preferred encrypted gateway or Cash on Delivery.
            </p>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-start gap-2">
          <span className="font-bold">Error:</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Gateway Options */}
      <div className="space-y-3">
        {gateways.length === 0 ? (
          <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl text-center text-xs text-stone-500">
            No payment methods are currently available.
          </div>
        ) : (
          gateways.map((gw) => {
          const isSelected = selectedProvider === gw.provider;
          const isCod = gw.provider === "cod";
          const isTestMode = gw.is_test_mode;

          return (
            <label
              key={gw.provider}
              onClick={() => onSelectProvider(gw.provider)}
              className={`block p-4 rounded-xl border cursor-pointer transition-all ${isSelected
                  ? "border-[#700b10] bg-amber-50/40 ring-1 ring-[#700b10]"
                  : "border-stone-200 hover:border-stone-300 bg-white"
                }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-2 rounded-lg bg-stone-50 border border-stone-200 shrink-0">
                    {renderGatewayIcon(gw.provider)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs sm:text-sm font-bold text-stone-900">
                        {gw.display_title || gw.name}
                      </span>
                      {isTestMode && (
                        <span className="text-[10px] uppercase font-bold bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded-md">
                          Test Mode
                        </span>
                      )}
                      {isCod && (
                        <span className="text-[10px] uppercase font-bold bg-green-100 text-green-900 px-1.5 py-0.2 rounded-md">
                          Cash / Pay at Door
                        </span>
                      )}
                    </div>
                    <p className="text-stone-500 text-xs mt-1 leading-snug">
                      {gw.metadata?.description || gw.metadata?.instructions || "Secure online transaction via 256-bit SSL encryption."}
                    </p>

                    {/* Extended Gateway Info */}
                    {isSelected && !isCod && (
                      <div className="mt-3 pt-2.5 border-t border-amber-200/60 text-[11px] text-stone-600 flex items-center gap-2">
                        <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Instant UPI (GPay, PhonePe, Paytm), All Bank Cards &amp; NetBanking.</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center mt-1">
                  <div
                    className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center ${isSelected ? "border-[#700b10] bg-[#700b10]" : "border-stone-300"
                      }`}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>
              </div>
            </label>
          );
        })
        )}
      </div>

      {/* Security & Guarantee Note */}
      <div className="mt-6 p-4 rounded-xl bg-stone-50 border border-stone-200/70 text-xs text-stone-600 space-y-2">
        <div className="flex items-center gap-2 font-bold text-stone-900">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Nilkanth Store Trust &amp; Safety Protocol</span>
        </div>
        <p className="text-[11px] text-stone-500 leading-relaxed">
          By clicking Complete Payment, your encrypted transaction is protected under RBI-compliant gateway standards. Order tracking and receipt will be dispatched via Whatsapp &amp; Email immediately.
        </p>
      </div>

      {/* Navigation & Submit CTA */}
      <div className={`mt-6 pt-4 border-t border-stone-100 flex items-center ${isOneStep ? "justify-end" : "justify-between"}`}>
        {!isOneStep && (
          <button
            type="button"
            onClick={onBackStep}
            disabled={isPlacingOrder}
            className="text-stone-600 hover:text-stone-900 font-semibold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Shipping</span>
          </button>
        )}

        <button
          type="button"
          onClick={onPlaceOrder}
          disabled={isPlacingOrder || !selectedProvider || gateways.length === 0}
          className="w-full sm:w-auto bg-[#700b10] hover:bg-[#54060b] disabled:opacity-50 text-white py-3.5 px-8 rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
        >
          {isPlacingOrder ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing Order...</span>
            </>
          ) : (
            <>
              <Lock className="w-3.5 h-3.5" />
              <span>
                {selectedProvider === "cod" ? "Place COD Order" : `Pay ₹${grandTotal.toFixed(2)}`}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
