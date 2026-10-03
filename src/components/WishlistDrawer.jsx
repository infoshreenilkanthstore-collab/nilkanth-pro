import React, { useEffect, useState } from "react";
import { X, Heart, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";

export default function WishlistDrawer({ onNavigate, onSelectProduct, onOpenAuth, currentUser }) {
  const { isDrawerOpen, closeDrawer, wishlistItems, removeFromWishlist, loading } = useWishlist();
  const [removingId, setRemovingId] = useState(null);

  // Prevent background scroll when sidebar drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isDrawerOpen) {
        closeDrawer();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  if (!isDrawerOpen) return null;

  const handleProductClick = (item) => {
    closeDrawer();
    const prod = item.product || item;
    const handle = prod.handle || prod.slug || prod.id || item.product_id;
    if (handle) {
      if (onNavigate) {
        onNavigate("product", { productHandle: handle, product: prod });
      } else if (onSelectProduct) {
        onSelectProduct(prod);
      }
    }
  };

  const handleRemove = async (e, item) => {
    e.stopPropagation();
    const id = item.id || item.product_id || item.product?.id;
    setRemovingId(id);
    await removeFromWishlist(item.id || id);
    setRemovingId(null);
  };

  const handleContinueShopping = () => {
    closeDrawer();
    onNavigate?.("shop");
  };

  return (
    <div className="fixed inset-0 z-[70] overflow-hidden animate-fadeIn">
      {/* 1. Backdrop Overlay with smooth blur */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        {/* 2. Slide-out Panel (Full width on mobile, max-w-md on tablet/desktop) */}
        <div className="w-screen max-w-full sm:max-w-md bg-white shadow-2xl flex flex-col h-full transform transition-transform duration-300 ease-out">

          {/* Header */}
          <div className="px-5 sm:px-6 py-4 border-b border-stone-200/80 flex items-center justify-between bg-white sticky top-0 z-10 pt-safe">
            <div className="flex items-center gap-3">
              {/* Rounded soft badge with heart */}
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-[#700b10] flex-shrink-0">
                <Heart className="w-4.5 h-4.5 sm:w-5 sm:h-5 fill-[#700b10] text-[#700b10]" />
              </div>
              <div>
                <h2 className="font-serif text-lg sm:text-xl font-normal text-stone-900 tracking-tight leading-tight">
                  Your Wishlist
                </h2>
                <p className="text-[11px] sm:text-xs text-stone-500 font-sans mt-0.5">
                  {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={closeDrawer}
              className="w-9 h-9 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5 stroke-[1.8]" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 scrollbar-thin">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center py-20 text-center">
                <div className="w-8 h-8 border-2 border-[#700b10]/20 border-t-[#700b10] rounded-full animate-spin mb-3" />
                <p className="text-xs font-semibold text-stone-500">Loading saved items...</p>
              </div>
            ) : wishlistItems.length === 0 ? (
              /* EMPTY STATE - EXACT MATCH WITH SCREENSHOT */
              <div className="h-full flex flex-col items-center justify-center text-center px-4 py-16">
                {/* Large Subtle Heart Pill / Circle */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-stone-50/90 border border-stone-200/60 flex items-center justify-center mb-6 shadow-2xs">
                  <Heart className="w-10 h-10 sm:w-11 sm:h-11 text-stone-300 stroke-[1.2]" />
                </div>

                <h3 className="font-serif text-xl sm:text-2xl text-stone-900 mb-2 font-normal">
                  Wishlist is empty
                </h3>

                <p className="text-xs sm:text-sm text-stone-500 max-w-xs leading-relaxed mb-8 font-sans">
                  Save items you love to your wishlist and they&rsquo;ll appear here.
                </p>

                {/* Continue Shopping Button */}
                <button
                  type="button"
                  onClick={handleContinueShopping}
                  className="w-full max-w-xs bg-[#700b10] hover:bg-[#54060b] text-white py-3.5 px-6 rounded-full font-sans font-bold text-xs sm:text-[13px] uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg active:scale-98 cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              /* ITEMS LIST */
              <div className="space-y-3">
                {wishlistItems.map((item) => {
                  const product = item.product || item;
                  const title = product.title || "Spiritual Product";
                  const image =
                    product.image_url ||
                    product.images?.[0]?.url ||
                    "https://megaecomm.megascale.co.in/backend/media/16/general/66066c8ca3ab4a8cc35413b3a26e3314.jpeg";
                  const rawPrice =
                    product.priceRange?.minVariantPrice?.amount ??
                    product.price ??
                    product.variants?.[0]?.price?.amount ??
                    product.variants?.[0]?.price ??
                    item.price;
                  const price = rawPrice ? Number(rawPrice) : null;
                  const compareAtPrice = Number(
                    product.compareAtPrice?.amount ??
                    product.compare_at_price ??
                    product.compareAtPrice ??
                    product.variants?.[0]?.compareAtPrice?.amount ??
                    product.variants?.[0]?.compare_at_price ??
                    product.variants?.[0]?.compareAtPrice ??
                    0
                  );
                  const itemId = item.id || item.product_id || product.id;
                  const isRemoving = removingId === itemId;

                  const handle = product.handle || product.slug || product.id || item.product_id;
                  const productUrl = `/products/${handle}`;

                  return (
                    <a
                      key={itemId}
                      href={productUrl}
                      onClick={(e) => {
                        e.preventDefault();
                        handleProductClick(item);
                      }}
                      className="group bg-white rounded-2xl p-3 sm:p-3.5 border border-stone-200 hover:border-amber-200 shadow-2xs hover:shadow-xs transition-all duration-200 flex gap-3 sm:gap-3.5 items-center cursor-pointer relative block no-underline"
                    >
                      {/* Thumbnail Image */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0 border border-stone-100">
                        <img
                          src={image}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0 pr-7 text-left">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block truncate font-nunito">
                          Shri Nilkanth Store
                        </span>
                        <h4 className="font-nunito text-xs sm:text-[13px] font-semibold text-stone-900 group-hover:text-[#700b10] transition-colors truncate mb-1">
                          {title}
                        </h4>
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm font-extrabold text-[#700b10]">
                            {price !== null && price > 0 ? `₹${price.toLocaleString("en-IN")}` : "View Price"}
                          </span>
                          {compareAtPrice > (price || 0) && (
                            <span className="text-[11px] text-stone-400 line-through">
                              ₹{Number(compareAtPrice).toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemove(e, item);
                        }}
                        disabled={isRemoving}
                        className="absolute top-3 right-3 p-1.5 text-stone-400 hover:text-red-600 transition-colors rounded-full hover:bg-stone-50 cursor-pointer z-10"
                        title="Remove"
                        aria-label="Remove item"
                      >
                        {isRemoving ? (
                          <span className="w-3.5 h-3.5 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin inline-block" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Drawer Footer with View Full Wishlist Page option */}
          {wishlistItems.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-stone-200/80 bg-stone-50/70 sticky bottom-0 z-10 space-y-2 pb-safe">
              <button
                type="button"
                onClick={handleContinueShopping}
                className="w-full bg-[#700b10] hover:bg-[#54060b] text-white py-3 px-4 rounded-full font-sans font-bold text-xs uppercase tracking-wider transition-all shadow-sm hover:shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  closeDrawer();
                  onNavigate?.("wishlist");
                }}
                className="w-full text-stone-600 hover:text-[#700b10] text-[11px] sm:text-xs font-semibold py-1 transition-colors cursor-pointer text-center"
              >
                View Full Wishlist Page
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
