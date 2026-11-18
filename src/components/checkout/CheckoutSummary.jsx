import React, { useState } from "react";
import { ShieldCheck, Tag, ChevronDown, ChevronUp, Sparkles, Truck, Loader2, X, Minus, Plus } from "lucide-react";

export default function CheckoutSummary({
  items = [],
  subtotal = 0,
  tax = 0,
  taxLines = [],
  taxInclusive = true,
  shipping = 0,
  discount = 0,
  discountCode = "",
  onApplyCoupon,
  onRemoveCoupon,
  isFirstOrderFreeEligible = false,
  firstOrderData = null,
  grandTotal = 0,
  loading = false,
  onUpdateQuantity,
  isPartialPayment = false,
  advanceAmount = 0,
  balanceDue = 0,
}) {
  const [couponInput, setCouponInput] = useState("");
  const [couponMsg, setCouponMsg] = useState(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [showTaxBreakdown, setShowTaxBreakdown] = useState(false);
  const [showItemsMobile, setShowItemsMobile] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    if (onApplyCoupon) {
      setApplyingCoupon(true);
      setCouponMsg(null);
      try {
        const res = await onApplyCoupon(couponInput.trim().toUpperCase());
        if (res && res.success) {
          setCouponMsg({ type: "success", text: res.message || "Coupon applied!" });
          setCouponInput("");
        } else {
          setCouponMsg({ type: "error", text: res?.message || "Invalid coupon code" });
        }
      } catch (err) {
        setCouponMsg({ type: "error", text: "Failed to validate coupon" });
      } finally {
        setApplyingCoupon(false);
      }
    }
  };

  const handleRemoveAppliedCoupon = () => {
    if (onRemoveCoupon) {
      onRemoveCoupon();
      setCouponMsg(null);
    }
  };

  const handleQtyChange = async (item, delta) => {
    if (!onUpdateQuantity) return;
    const newQty = (item.quantity || 1) + delta;
    if (newQty < 1) return;
    const itemId = item.cart_item_id || item.variant_id || item.id;
    setUpdatingId(itemId);
    try {
      await onUpdateQuantity(item, newQty);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="bg-[#fcfaf7] border border-stone-200/90 rounded-2xl p-5 sm:p-6 shadow-xs font-nunito sticky top-24">
      {/* Mobile Toggle */}
      <div className="lg:hidden pb-4 border-b border-stone-200">
        <button
          type="button"
          onClick={() => setShowItemsMobile(!showItemsMobile)}
          className="w-full flex items-center justify-between text-left cursor-pointer"
        >
          <span className="text-sm font-bold text-stone-800 flex items-center gap-2">
            <span>Order Summary ({items.length} {items.length === 1 ? "item" : "items"})</span>
            {showItemsMobile ? <ChevronUp className="w-4 h-4 text-stone-500" /> : <ChevronDown className="w-4 h-4 text-stone-500" />}
          </span>
          <span className="text-base font-extrabold text-[#700b10]">
            Rs.{grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </button>
      </div>

      <div className={`${showItemsMobile ? "block" : "hidden"} lg:block pt-3 lg:pt-0`}>
        <h3 className="hidden lg:block font-serif text-lg font-bold text-stone-900 mb-4 tracking-tight">
          Order Summary ({items.length})
        </h3>

        {/* Product Items */}
        <div className="max-h-80 overflow-y-auto pr-1 space-y-3 divide-y divide-stone-100 scrollbar-thin">
          {items.map((item, idx) => {
            const priceNum = Number(item.price) || 0;
            const qty = item.quantity || 1;
            const lineTotal = priceNum * qty;
            const itemId = item.cart_item_id || item.variant_id || item.id;
            const isUpdating = updatingId === itemId;

            return (
              <div key={item.id || item.variantId || idx} className="pt-3 first:pt-0 flex items-start gap-3.5">
                <div className="relative w-14 h-14 rounded-xl border border-stone-200 overflow-hidden bg-white flex-shrink-0">
                  {item.image || item.featured_image ? (
                    <img src={item.image || item.featured_image} alt={item.title || "Product"} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-amber-50 flex items-center justify-center text-[#700b10] text-xs font-bold">
                      {(item.title || "NS").substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <span className="absolute -top-1.5 -right-1.5 bg-[#700b10] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                    {qty}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-semibold text-stone-900 truncate leading-snug">
                    {item.title || item.product_title || "Sacred Item"}
                  </h4>
                  {item.variantTitle && (
                    <p className="text-[11px] text-stone-500 truncate">{item.variantTitle}</p>
                  )}

                  {onUpdateQuantity ? (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <button
                        type="button"
                        disabled={isUpdating || loading || qty <= 1}
                        onClick={() => handleQtyChange(item, -1)}
                        className="w-6 h-6 rounded-md border border-stone-300 bg-white flex items-center justify-center text-stone-600 hover:border-[#700b10] hover:text-[#700b10] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Minus className="w-3 h-3" />}
                      </button>
                      <span className="text-xs font-bold text-stone-800 min-w-[18px] text-center">{qty}</span>
                      <button
                        type="button"
                        disabled={isUpdating || loading}
                        onClick={() => handleQtyChange(item, +1)}
                        className="w-6 h-6 rounded-md border border-stone-300 bg-white flex items-center justify-center text-stone-600 hover:border-[#700b10] hover:text-[#700b10] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <p className="text-[11px] text-stone-400 mt-0.5">Qty: {qty}</p>
                  )}
                </div>

                <div className="text-right flex-shrink-0 pt-0.5">
                  <span className="text-xs sm:text-sm font-bold text-stone-900">
                    Rs.{lineTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Promo Code */}
        <form onSubmit={handleApplyCoupon} className="mt-5 pt-4 border-t border-stone-200/70">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="Discount code (e.g. SAVE20)"
                disabled={applyingCoupon || loading}
                className="w-full pl-9 pr-3 py-2 bg-white border border-stone-300 rounded-xl text-xs uppercase tracking-wider font-semibold text-stone-800 placeholder:text-stone-400 placeholder:normal-case focus:outline-hidden focus:border-[#700b10] focus:ring-1 focus:ring-[#700b10] disabled:opacity-60"
              />
            </div>
            <button
              type="submit"
              disabled={!couponInput.trim() || applyingCoupon || loading}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              {applyingCoupon && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{applyingCoupon ? "Checking..." : "Apply"}</span>
            </button>
          </div>
          {couponMsg && (
            <p className={`text-[11px] mt-1.5 font-medium ${couponMsg.type === "success" ? "text-emerald-700" : "text-rose-600"}`}>
              {couponMsg.text}
            </p>
          )}
          {discountCode && (
            <div className="mt-2.5 flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl text-xs text-emerald-800">
              <span className="font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Code applied: <strong>{discountCode}</strong> (-Rs.{discount.toFixed(2)})</span>
              </span>
              <button type="button" onClick={handleRemoveAppliedCoupon} className="text-emerald-700 hover:text-rose-600 p-1 rounded-md hover:bg-emerald-100 transition-colors cursor-pointer" title="Remove">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </form>

        {/* Pricing */}
        <div className="mt-4 pt-4 border-t border-stone-200/80 space-y-2.5 text-xs text-stone-600">
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <span className="font-semibold text-stone-900">Rs.{subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          {discount > 0 && (
            <div className="flex items-center justify-between text-emerald-700 font-semibold">
              <span>Discount</span>
              <span>-Rs.{discount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-stone-500" /> Shipping</span>
            <span className="font-semibold text-stone-900">
              {shipping === 0 ? (
                <span className="inline-flex items-center gap-1 text-emerald-700 font-bold uppercase text-[11px] tracking-wider">
                  <span>FREE</span>
                  {isFirstOrderFreeEligible && (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/90 px-1.5 py-0.5 rounded-sm normal-case">
                      (1st Order)
                    </span>
                  )}
                </span>
              ) : (
                `Rs.${shipping.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              )}
            </span>
          </div>
          {firstOrderData?.is_first_order && !isFirstOrderFreeEligible && (
            <div className="p-2.5 bg-amber-50/90 border border-amber-200/80 rounded-xl text-[11px] text-amber-900 flex items-center gap-2">
              <span className="text-sm">🎁</span>
              <span>1st Order Special: Add <strong>Rs.{Math.max(0, 599 - subtotal).toFixed(2)}</strong> more to get <strong>FREE Shipping</strong>!</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span>Estimated GST ({taxInclusive ? "Included" : "Added"})</span>
              {taxLines && taxLines.length > 0 && (
                <button type="button" onClick={() => setShowTaxBreakdown(!showTaxBreakdown)} className="text-[10px] text-[#700b10] hover:underline font-semibold cursor-pointer">
                  {showTaxBreakdown ? "(hide)" : "(details)"}
                </button>
              )}
            </div>
            <span className="font-semibold text-stone-900">
              {taxInclusive ? <span className="text-stone-500 font-normal text-xs">Incl. Rs.{Number(tax).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                : `+Rs.${Number(tax).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </span>
          </div>
          {showTaxBreakdown && taxLines && taxLines.length > 0 && (
            <div className="bg-stone-100/80 p-2.5 rounded-lg space-y-1.5 text-[11px] text-stone-600 border border-stone-200/60">
              <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider pb-1 border-b border-stone-200/60">
                {taxInclusive ? "Tax Included in Product Price:" : "Tax Added to Order:"}
              </div>
              {taxLines.map((line, lIdx) => (
                <div key={lIdx} className="flex justify-between items-center">
                  <span>{line.name} ({line.rate}%):</span>
                  <span className="font-medium text-stone-800">Rs.{Number(line.amount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              ))}
            </div>
          )}
          <div className="pt-3 border-t border-stone-200 flex items-baseline justify-between">
            <div>
              <span className="text-sm font-bold text-stone-900 block">Total</span>
              <span className="text-[10px] text-stone-400">Including all applicable taxes</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-stone-500 mr-1.5 font-sans font-medium">INR</span>
              <span className="text-xl font-extrabold text-[#700b10]">
                Rs.{grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Partial Payment Breakdown */}
          {isPartialPayment && (
            <div className="mt-3 p-3 bg-amber-50/90 border border-amber-200 rounded-xl space-y-1.5 text-xs animate-fadeIn">
              <div className="flex justify-between items-center text-stone-700 font-bold">
                <span className="flex items-center gap-1">
                  <span>Pay Online Now:</span>
                  <span className="text-[10px] font-extrabold uppercase bg-[#700b10] text-white px-1.5 py-0.2 rounded-md">
                    Advance
                  </span>
                </span>
                <span className="text-[#700b10] font-extrabold text-sm">
                  Rs.{advanceAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-stone-600">
                <span>Remaining on Delivery (COD):</span>
                <span className="font-bold text-stone-800">
                  Rs.{balanceDue.toFixed(2)}
                </span>
              </div>
              <p className="text-[10px] text-stone-500 pt-1 border-t border-amber-200/60 leading-tight">
                {grandTotal > 399
                  ? "Store Special: Flat ₹100 advance on orders above ₹399!"
                  : "Store Special: Flat ₹50 advance on orders up to ₹399!"}
              </p>
            </div>
          )}
        </div>

        {/* Guarantee Seal */}
        <div className="mt-5 p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#700b10] mt-0.5 flex-shrink-0" />
          <div className="text-[11px] leading-snug text-stone-700">
            <span className="font-bold text-stone-900 block">Sacred &amp; 100% Authentic Guarantee</span>
            Consecrated spiritual jewelry &amp; temple items packed with utmost sanctity.
          </div>
        </div>
      </div>
    </div>
  );
}
