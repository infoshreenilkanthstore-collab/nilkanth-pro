import React, { useState } from "react";
import { Heart, ShoppingBag, Trash2, ArrowRight, ExternalLink, Sparkles } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

export default function WishlistPage({ onNavigate, onSelectProduct }) {
  const { wishlistItems, removeFromWishlist, loading } = useWishlist();
  const { addToCart } = useCart();
  const [removingId, setRemovingId] = useState(null);
  const [addingId, setAddingId] = useState(null);

  const handleRemove = async (e, item) => {
    e.stopPropagation();
    const id = item.id || item.product_id || item.product?.id;
    setRemovingId(id);
    await removeFromWishlist(item.id || id);
    setRemovingId(null);
  };

  const handleProductClick = (item) => {
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

  return (
    <div className="min-h-screen bg-[#faf8f5] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb & Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
            <button
              onClick={() => onNavigate?.("home")}
              className="hover:text-[#700b10] transition-colors cursor-pointer"
            >
              Home
            </button>
            <span>/</span>
            <span className="text-[#700b10]">Wishlist</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200/80 pb-5">
            <div>
              <h1 className="font-tenor text-2xl sm:text-3xl lg:text-4xl text-[#700b10] font-normal tracking-wide flex items-center gap-2.5">
                <span>My Wishlist</span>
                <Heart className="w-6 h-6 fill-[#700b10] text-[#700b10]" />
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 mt-1 font-nunito">
                Saved items synced to your Nilkanth account
              </p>
            </div>

            <div className="text-xs sm:text-sm font-bold text-stone-700 bg-white px-3.5 py-1.5 rounded-full border border-stone-200/80 shadow-2xs self-start sm:self-auto">
              {wishlistItems.length} {wishlistItems.length === 1 ? "Item" : "Items"}
            </div>
          </div>
        </div>

        {/* Wishlist Items List / Empty State */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-3 border-[#700b10]/20 border-t-[#700b10] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-bold text-stone-600">Loading your wishlist items...</p>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 sm:p-16 text-center border border-stone-200/80 shadow-xs max-w-xl mx-auto">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-rose-50 rounded-full flex items-center justify-center text-[#700b10] mx-auto mb-5 shadow-inner">
              <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-[#700b10]" />
            </div>
            <h2 className="font-tenor text-2xl sm:text-3xl text-stone-900 mb-2 font-normal">
              Your Wishlist is Empty
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto mb-6 leading-relaxed">
              Explore our divine spiritual collection of pooja essentials, murtis, and sacred accessories. Click the heart icon on any product to save it here!
            </p>
            <button
              onClick={() => onNavigate?.("shop")}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#700b10] hover:bg-[#851016] text-white rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              <span>Explore Spiritual Shop</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {wishlistItems.map((item) => {
              const product = item.product || item;
              const title = product.product_title || "Spiritual Product";
              const image =
                product.image_url ||
                product.images?.[0]?.url ||
                "https://megaecomm.megascale.co.in/backend/media/16/general/66066c8ca3ab4a8cc35413b3a26e3314.jpeg";
              const price = Number(
                product.priceRange?.minVariantPrice?.amount ??
                product.price ??
                product.variants?.[0]?.price?.amount ??
                product.variants?.[0]?.price ??
                0
              );
              const compareAtPrice = Number(
                product.compareAtPrice?.amount ??
                product.compare_at_price ??
                product.compareAtPrice ??
                product.variants?.[0]?.compareAtPrice?.amount ??
                product.variants?.[0]?.compare_at_price ??
                product.variants?.[0]?.compareAtPrice ??
                0
              );
              const discountPercent =
                compareAtPrice > price
                  ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
                  : 0;
              const itemId = item.id || item.product_id || product.id;
              const isRemoving = removingId === itemId;

              return (
                <div
                  key={itemId}
                  onClick={() => handleProductClick(item)}
                  className="group bg-white rounded-2xl border border-stone-200/80 hover:border-amber-200 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer relative"
                >
                  {/* Image container */}
                  <div className="relative aspect-square w-full overflow-hidden bg-stone-100/70">
                    <img
                      src={image}
                      alt={title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                    {/* Delete button from wishlist */}
                    <button
                      type="button"
                      onClick={(e) => handleRemove(e, item)}
                      disabled={isRemoving}
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 hover:bg-red-50 text-stone-600 hover:text-red-600 flex items-center justify-center shadow-md transition-all hover:scale-110 z-10 cursor-pointer"
                      title="Remove from wishlist"
                      aria-label="Remove from wishlist"
                    >
                      {isRemoving ? (
                        <span className="w-3.5 h-3.5 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Product Details */}
                  <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between text-left">
                    <div>
                      <h3 className="font-nunito text-xs sm:text-sm font-semibold text-stone-800 line-clamp-2 leading-snug group-hover:text-[#700b10] transition-colors mb-2 min-h-[2.2rem]">
                        {title}
                      </h3>
                    </div>

                    <div>
                      <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 mb-3">
                        <span className="text-sm sm:text-base font-extrabold text-[#700b10] whitespace-nowrap">
                          ₹{Number(price).toLocaleString("en-IN")}
                        </span>
                        {compareAtPrice > price && (
                          <span className="text-xs text-stone-400 line-through whitespace-nowrap">
                            ₹{Number(compareAtPrice).toLocaleString("en-IN")}
                          </span>
                        )}
                        {discountPercent > 0 && (
                          <span className="inline-flex items-center bg-[#f5b300] text-black font-extrabold text-[10px] px-1.5 py-0.5 rounded-[2px] uppercase tracking-wide whitespace-nowrap">
                            {discountPercent}% OFF
                          </span>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProductClick(item);
                          }}
                          className="bg-stone-100 hover:bg-stone-200 text-stone-700 py-2 sm:py-2.5 px-2 rounded-xl font-nunito font-bold text-[11px] sm:text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>View</span>
                        </button>

                        <button
                          type="button"
                          disabled={addingId === itemId}
                          onClick={async (e) => {
                            e.stopPropagation();
                            setAddingId(itemId);
                            try {
                              const variantId = product.variants?.[0]?.id || product.default_variant_id || item.variant_id;
                              await addToCart(product, 1, variantId);
                            } catch (err) {
                              console.error("Failed to add from wishlist", err);
                            } finally {
                              setAddingId(null);
                            }
                          }}
                          className="bg-[#700b10] hover:bg-[#54060b] text-white py-2 sm:py-2.5 px-2 rounded-xl font-nunito font-bold text-[11px] sm:text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1 shadow-2xs hover:shadow-xs cursor-pointer disabled:opacity-70"
                        >
                          {addingId === itemId ? (
                            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>
                              <ShoppingBag className="w-3 h-3 text-[#ebd99c]" />
                              <span>Add</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
