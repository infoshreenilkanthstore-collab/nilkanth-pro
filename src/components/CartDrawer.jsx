import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  Lock,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { trackInitiateCheckout } from "../services/analytics";
import { fetchProducts } from "../services/api";

const FREE_SHIPPING_THRESHOLD = 999;

export default function CartDrawer({ onNavigate, onSelectProduct }) {
  const {
    isCartOpen,
    closeCart,
    cartItems,
    cartCount,
    cartTotal,
    loading,
    updatingIds,
    updateQuantity,
    removeItem,
    clearCart,
    shippingRate,
    shippingLoading,
    calculateShippingRate,
    addToCart,
  } = useCart();

  const [recommendations, setRecommendations] = useState([]);
  const [recLoading, setRecLoading] = useState(false);
  const [mobileSlideIndex, setMobileSlideIndex] = useState(0);
  const [isRecPaused, setIsRecPaused] = useState(false);
  const [addingRecId, setAddingRecId] = useState(null);

  const touchStartXRef = useRef(0);
  const touchEndXRef = useRef(0);

  // Fetch recommendations on drawer open
  useEffect(() => {
    let isMounted = true;
    async function loadRecommendations() {
      setRecLoading(true);
      try {
        const res = await fetchProducts({ page: 1, limit: 50 });
        if (isMounted) {
          const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
          setRecommendations(list);
        }
      } catch (err) {
        console.error("Failed loading recommendations in cart:", err);
      } finally {
        if (isMounted) setRecLoading(false);
      }
    }
    if (isCartOpen) {
      loadRecommendations();
    }
    return () => {
      isMounted = false;
    };
  }, [isCartOpen]);

  // Calculate live shipping rate on drawer open or cart amount changes
  useEffect(() => {
    if (isCartOpen && cartItems.length > 0) {
      calculateShippingRate();
    }
  }, [isCartOpen, cartTotal, cartItems.length, calculateShippingRate]);

  // Prevent background scroll when sidebar drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen, closeCart]);

  const displayRecs = useMemo(() => {
    const inCartProductIds = new Set(
      cartItems.map((item) => String(item.product_id || item.id || item.productId))
    );
    const availableRecs = recommendations.filter(
      (prod) => !inCartProductIds.has(String(prod.id))
    );
    const pool = availableRecs.length > 0 ? availableRecs : recommendations;

    if (cartItems.length === 0) return pool;

    const cartCategories = new Set(
      cartItems
        .map((it) =>
          (
            it.category ||
            it.product_type ||
            it.product?.category ||
            it.product?.product_type ||
            ""
          )
            .trim()
            .toLowerCase()
        )
        .filter(Boolean)
    );

    return [...pool].sort((a, b) => {
      const aCat = (a.category || a.product_type || "").trim().toLowerCase();
      const bCat = (b.category || b.product_type || "").trim().toLowerCase();
      const aMatch = cartCategories.has(aCat) ? 1 : 0;
      const bMatch = cartCategories.has(bCat) ? 1 : 0;
      return bMatch - aMatch;
    });
  }, [recommendations, cartItems]);

  // Auto-scroll product timer in Mobile View (Unconditional Hook)
  useEffect(() => {
    if (!isCartOpen || isRecPaused || displayRecs.length <= 1) return;
    const interval = setInterval(() => {
      setMobileSlideIndex((prev) => (prev + 1) % displayRecs.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [isCartOpen, isRecPaused, displayRecs.length]);

  // Touch Swipe handlers for mobile
  const handleTouchStart = (e) => {
    setIsRecPaused(true);
    touchStartXRef.current = e.targetTouches[0].clientX;
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsRecPaused(false);
    if (!touchStartXRef.current || !touchEndXRef.current) return;
    const distance = touchStartXRef.current - touchEndXRef.current;
    if (distance > 35) {
      // Swiped Left -> Go Next
      setMobileSlideIndex((prev) => (prev + 1) % displayRecs.length);
    } else if (distance < -35) {
      // Swiped Right -> Go Prev
      setMobileSlideIndex((prev) => (prev - 1 + displayRecs.length) % displayRecs.length);
    }
    touchStartXRef.current = 0;
    touchEndXRef.current = 0;
  };

  if (!isCartOpen) return null;

  const handleProductClick = (item) => {
    closeCart();
    const handle = item.product_handle || item.product_id;
    if (handle) {
      if (onNavigate) {
        onNavigate("product", { productHandle: handle });
      } else if (onSelectProduct) {
        onSelectProduct({ id: item.product_id, handle });
      }
    }
  };

  const handleContinueShopping = () => {
    closeCart();
    onNavigate?.("shop");
  };

  // Shipping cost & progress calculations
  const shippingCost = shippingRate?.cost !== undefined
    ? Number(shippingRate.cost)
    : (cartTotal >= FREE_SHIPPING_THRESHOLD ? 0 : 50);

  const estimatedTotal = cartTotal + (shippingCost || 0);
  const progressPercent = Math.min(100, Math.round((cartTotal / FREE_SHIPPING_THRESHOLD) * 100));
  const remainingForFree = Math.max(0, FREE_SHIPPING_THRESHOLD - cartTotal);

  const handleAddRecommendation = async (product) => {
    setAddingRecId(product.id);
    try {
      await addToCart(product, 1, product.variants?.[0]?.id || null, false);
    } catch (err) {
      console.error(err);
    } finally {
      setAddingRecId(null);
    }
  };

  const renderRecCard = (product) => {
    const title = product.title || product.product_title || "Spiritual Product";
    const image =
      product.image_url ||
      product.image ||
      product.images?.[0]?.url ||
      "https://megaecomm.megascale.co.in/backend/media/16/general/66066c8ca3ab4a8cc35413b3a26e3314.jpeg";
    const price = Number(product.priceRange?.minVariantPrice?.amount || product.price || 0);
    const isAdding = addingRecId === product.id;
    const rating = Number(product.rating || product.average_rating || 4.6).toFixed(1);
    const reviewsCount = product.total_reviews || 5;

    return (
      <div
        key={product.id}
        className="bg-white rounded-2xl border border-stone-200/90 hover:border-amber-200 shadow-2xs hover:shadow-xs transition-all p-2.5 sm:p-3 flex items-center justify-between gap-3 text-left group"
      >
        {/* Left Thumbnail Image */}
        <div
          onClick={() => {
            closeCart();
            onNavigate?.("product", { productHandle: product.handle || product.id, product });
          }}
          className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl bg-stone-50 border border-stone-100 overflow-hidden flex-shrink-0 cursor-pointer flex items-center justify-center p-1"
        >
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>

        {/* Middle: Title, Rating, Price */}
        <div className="flex-1 min-w-0 pr-1">
          <h4
            onClick={() => {
              closeCart();
              onNavigate?.("product", { productHandle: product.handle || product.id, product });
            }}
            className="font-tenor text-xs sm:text-[13px] font-semibold text-stone-900 group-hover:text-[#700b10] transition-colors line-clamp-1 uppercase tracking-wider cursor-pointer leading-snug mb-1"
            title={title}
          >
            {title}
          </h4>

          {/* Rating Stars & Count */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="flex items-center text-amber-400">
              {[...Array(4)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-current text-amber-400" />
              ))}
              <Star className="w-3 h-3 fill-amber-200 text-amber-400" />
            </div>
            <span className="text-[11px] font-bold text-stone-500 font-sans">
              {rating} ({reviewsCount})
            </span>
          </div>

          {/* Price */}
          <div className="font-extrabold text-sm sm:text-base text-[#700b10] font-sans">
            ₹{price.toLocaleString("en-IN")}
          </div>
        </div>

        {/* Right: ADD Button */}
        <button
          type="button"
          disabled={isAdding}
          onClick={() => handleAddRecommendation(product)}
          className="bg-[#7a3726] hover:bg-[#5e2719] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-sans font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 shrink-0 flex items-center justify-center min-w-[64px] disabled:opacity-60"
        >
          {isAdding ? (
            <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            "ADD"
          )}
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[75] overflow-hidden animate-fadeIn font-nunito">
      {/* 1. Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeCart}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0">
        {/* 2. Slide-out Container (Side-by-side on Desktop: Left Panel + Right Cart) */}
        <div className="flex flex-row items-stretch h-full bg-white shadow-2xl transform transition-transform duration-300 ease-out">

          {/* ── LEFT PANEL: Desktop "YOU MAY ALSO LIKE" (Image 2) ── */}
          {displayRecs.length > 0 && (
            <div className="hidden md:flex flex-col w-[340px] lg:w-[380px] bg-[#fffdfa] border-r border-stone-200/90 h-full p-5 text-left shrink-0">
              <h3 className="font-tenor text-sm sm:text-base text-[#845339] font-normal uppercase tracking-[0.16em] mb-4">
                YOU MAY ALSO LIKE
              </h3>
              <div className="flex-1 overflow-y-auto space-y-3 pr-1.5 custom-scrollbar-maroon">
                {displayRecs.map((prod) => renderRecCard(prod))}
              </div>
            </div>
          )}

          {/* ── RIGHT PANEL: Main Cart Drawer ── */}
          <div className="w-screen max-w-full sm:max-w-md md:w-[440px] lg:w-[470px] bg-white flex flex-col h-full shrink-0">

            {/* Header Matching Reference Screenshot */}
            <div className="px-5 sm:px-6 py-4 border-b border-stone-200/80 bg-white flex items-center justify-between sticky top-0 z-10">
              <div>
                <h2 className="font-tenor text-lg sm:text-xl font-normal uppercase tracking-[0.14em] text-stone-900 leading-tight">
                  YOUR CART
                </h2>
                <p className="text-[11px] font-bold text-stone-400 uppercase tracking-widest mt-0.5">
                  {cartCount} {cartCount === 1 ? "ITEM SELECTED" : "ITEMS SELECTED"}
                </p>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={closeCart}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
                aria-label="Close cart"
              >
                <X className="w-4.5 h-4.5 stroke-[2]" />
              </button>
            </div>

            {/* Free Shipping Bar */}
            {cartItems.length > 0 && (
              <div className="bg-amber-50/80 border-b border-amber-200/60 px-5 py-2.5">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="flex items-center gap-1.5 text-stone-700 font-medium">
                    <Truck className="w-4 h-4 text-[#700b10] shrink-0" />
                    {remainingForFree <= 0 ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        🎉 Free Shipping Unlocked!
                      </span>
                    ) : (
                      <span>
                        Add <strong className="text-[#700b10]">₹{remainingForFree.toFixed(0)}</strong> more for <strong className="text-emerald-700">FREE Delivery</strong>
                      </span>
                    )}
                  </span>
                  <span className="text-[11px] font-bold text-stone-500">{progressPercent}%</span>
                </div>
                <div className="w-full bg-stone-200/70 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-600 to-[#700b10] h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 custom-scrollbar-maroon flex flex-col justify-between">
              <div>
                {loading && cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-9 h-9 border-2 border-[#700b10]/20 border-t-[#700b10] rounded-full animate-spin mb-3" />
                    <p className="text-xs font-semibold text-stone-500">Loading your cart...</p>
                  </div>
                ) : cartItems.length === 0 ? (
                  /* Empty Cart State */
                  <div className="h-full flex flex-col items-center justify-center text-center px-4 py-12">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-amber-50 border border-amber-200/60 flex items-center justify-center mb-5 shadow-inner">
                      <ShoppingBag className="w-10 h-10 sm:w-11 sm:h-11 text-amber-700/60 stroke-[1.2]" />
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl text-stone-900 mb-2 font-bold">
                      Your Cart is Empty
                    </h3>

                    <p className="text-xs sm:text-sm text-stone-500 max-w-xs leading-relaxed mb-7 font-sans">
                      Explore our authentic pooja samagri, premium dhoop, divine attars, and sacred idols.
                    </p>

                    <button
                      type="button"
                      onClick={handleContinueShopping}
                      className="w-full max-w-xs bg-[#700b10] hover:bg-[#54060b] text-white py-3.5 px-6 rounded-full font-sans font-bold text-xs sm:text-[13px] uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg active:scale-98 cursor-pointer"
                    >
                      Explore Collection
                    </button>
                  </div>
                ) : (
                  /* Cart Items List */
                  <div className="space-y-3.5">
                    {cartItems.map((item) => {
                      const itemId = item.cart_item_id || item.id;
                      const isUpdating = updatingIds.has(itemId);
                      const title = item.product_title || item.title || "Spiritual Product";
                      const variant = item.variant_title || item.variant || "";
                      const image =
                        item.image ||
                        item.product_image ||
                        item.variant_image ||
                        "https://megaecomm.megascale.co.in/backend/media/16/general/66066c8ca3ab4a8cc35413b3a26e3314.jpeg";
                      const price = Number(item.price) || 0;
                      const lineTotal = Number(item.total_price) || price * item.quantity;

                      return (
                        <div
                          key={itemId}
                          className="bg-white rounded-2xl p-3 sm:p-3.5 border border-stone-200/90 shadow-2xs flex gap-3 sm:gap-4 items-center relative group"
                        >
                          {/* Product Thumbnail */}
                          <div
                            onClick={() => handleProductClick(item)}
                            className="w-20 h-20 sm:w-22 sm:h-22 rounded-xl overflow-hidden bg-stone-50 flex-shrink-0 border border-stone-100 cursor-pointer flex items-center justify-center p-1 group-hover:opacity-95 transition-opacity"
                          >
                            <img
                              src={image}
                              alt={title}
                              className="w-full h-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
                              loading="lazy"
                            />
                          </div>

                          {/* Info & Stepper */}
                          <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-0.5">
                            <div>
                              {/* Top Row: Title on left, Variant + Delete Trash on right */}
                              <div className="flex items-start justify-between gap-2">
                                <h4
                                  onClick={() => handleProductClick(item)}
                                  className="font-tenor text-xs sm:text-[13.5px] font-normal uppercase tracking-wide text-stone-900 hover:text-[#700b10] transition-colors leading-snug cursor-pointer line-clamp-1"
                                  title={title}
                                >
                                  {title}
                                </h4>

                                {/* Variant + Trash Delete */}
                                <div className="flex items-center gap-1.5 shrink-0 -mt-0.5">
                                  {variant && (
                                    <span className="text-[11px] font-bold uppercase text-stone-500 font-sans">
                                      {variant}
                                    </span>
                                  )}
                                  <button
                                    type="button"
                                    disabled={isUpdating}
                                    onClick={() => removeItem(item)}
                                    className="w-6 h-6 rounded-md flex items-center justify-center text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                    title="Remove item"
                                    aria-label="Remove item"
                                  >
                                    {isUpdating ? (
                                      <span className="w-3.5 h-3.5 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin" />
                                    ) : (
                                      <Trash2 className="w-3.5 h-3.5 stroke-[1.8]" />
                                    )}
                                  </button>
                                </div>
                              </div>

                              {/* Subtitle */}
                              <p className="text-[11.5px] text-stone-400 italic font-sans mt-0.5">
                                Premium Quality
                              </p>
                            </div>

                            {/* Bottom Row: Pill Quantity Stepper (- 1 +) on left, Price on right */}
                            <div className="flex items-center justify-between mt-2 pt-1">
                              {/* Pill Quantity Stepper */}
                              <div className="inline-flex items-center border border-stone-300 rounded-full px-2 py-0.5 bg-white shadow-2xs">
                                <button
                                  type="button"
                                  disabled={isUpdating}
                                  onClick={() => updateQuantity(item, item.quantity - 1)}
                                  className="w-6 h-6 flex items-center justify-center text-stone-600 hover:text-[#700b10] transition-colors cursor-pointer disabled:opacity-40"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="w-7 text-center font-bold text-xs sm:text-sm text-stone-900 select-none">
                                  {isUpdating ? "..." : item.quantity}
                                </span>
                                <button
                                  type="button"
                                  disabled={isUpdating}
                                  onClick={() => updateQuantity(item, item.quantity + 1)}
                                  className="w-6 h-6 flex items-center justify-center text-stone-600 hover:text-[#700b10] transition-colors cursor-pointer disabled:opacity-40"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Price */}
                              <div className="text-sm sm:text-base font-extrabold text-[#700b10] font-sans tracking-tight">
                                ₹{price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ── MOBILE ONLY INLINE "YOU MAY ALSO LIKE" Section (With Swipe & Arrows) ── */}
              {displayRecs.length > 0 && (
                <div className="md:hidden mt-6 pt-4 border-t border-stone-200/80 text-left">
                  <div className="flex items-center justify-between mb-2.5">
                    <h3 className="font-tenor text-xs sm:text-sm text-[#845339] font-normal uppercase tracking-[0.16em]">
                      YOU MAY ALSO LIKE
                    </h3>

                    {/* Controls: Left/Right Arrow Buttons + Indicator Dots */}
                    <div className="flex items-center gap-1.5">
                      {/* Indicator Dots */}
                      <div className="flex items-center gap-1 mr-1">
                        {displayRecs.slice(0, Math.min(6, displayRecs.length)).map((_, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setMobileSlideIndex(idx)}
                            className={`h-1.5 rounded-full transition-all cursor-pointer ${mobileSlideIndex === idx ? "w-4 bg-[#7a3726]" : "w-1.5 bg-stone-300"
                              }`}
                            aria-label={`Go to slide ${idx + 1}`}
                          />
                        ))}
                      </div>

                      {/* Left arrow */}
                      <button
                        type="button"
                        onClick={() =>
                          setMobileSlideIndex((prev) => (prev - 1 + displayRecs.length) % displayRecs.length)
                        }
                        className="w-6 h-6 rounded-full border border-stone-200 bg-white flex items-center justify-center text-stone-600 hover:text-stone-900 shadow-2xs hover:bg-stone-50 cursor-pointer"
                        title="Previous Product"
                        aria-label="Previous Product"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>

                      {/* Right arrow */}
                      <button
                        type="button"
                        onClick={() =>
                          setMobileSlideIndex((prev) => (prev + 1) % displayRecs.length)
                        }
                        className="w-6 h-6 rounded-full border border-stone-200 bg-white flex items-center justify-center text-stone-600 hover:text-stone-900 shadow-2xs hover:bg-stone-50 cursor-pointer"
                        title="Next Product"
                        aria-label="Next Product"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Touch Swipeable & Auto-Scrolling 1-Card Slider */}
                  <div
                    className="relative overflow-hidden select-none"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onMouseEnter={() => setIsRecPaused(true)}
                    onMouseLeave={() => setIsRecPaused(false)}
                  >
                    <div
                      className="flex transition-transform duration-500 ease-out"
                      style={{ transform: `translateX(-${mobileSlideIndex * 100}%)` }}
                    >
                      {displayRecs.map((prod) => (
                        <div key={prod.id} className="w-full flex-shrink-0">
                          {renderRecCard(prod)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── Drawer Footer (Subtotal + PROCEED TO CHECKOUT) ── */}
            {cartItems.length > 0 && (
              <div className="border-t border-stone-200 bg-white px-5 sm:px-6 py-4 space-y-3">
                {/* Subtotal Row */}
                <div className="flex items-center justify-between">
                  <span className="font-sans font-extrabold text-lg sm:text-xl text-stone-900">
                    Subtotal
                  </span>
                  <span className="font-sans font-extrabold text-lg sm:text-xl text-stone-900">
                    ₹{cartTotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Shipping / Taxes Subtext */}
                <p className="text-[10px] sm:text-[10.5px] uppercase font-bold tracking-wider text-stone-400 font-sans">
                  SHIPPING & TAXES CALCULATED AT CHECKOUT
                </p>

                {/* PROCEED TO CHECKOUT Button */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      trackInitiateCheckout(cartItems, cartTotal);
                      closeCart();
                      onNavigate?.("checkout");
                    }}
                    className="w-full bg-[#5c0b10] hover:bg-[#430407] text-white py-3.5 sm:py-4 px-6 rounded-xl font-sans font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer text-center shadow-md active:scale-[0.99]"
                  >
                    PROCEED TO CHECKOUT
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

