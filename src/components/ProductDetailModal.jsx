import React, { useState, useEffect } from 'react';
import {
  X,
  Star,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Share2,
  Check,
  ChevronDown,
  ChevronUp,
  Minus,
  Plus
} from 'lucide-react';
import { fetchProductByIdOrHandle } from '../services/api';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

export default function ProductDetailModal({ product, onClose }) {
  const { isWishlisted, toggleWishlist, togglingIds } = useWishlist();
  const { addToCart } = useCart();
  const [detailedProduct, setDetailedProduct] = useState(product);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isShippingOpen, setIsShippingOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(
    product?.image_url || product?.images?.[0]?.url
  );
  const [selectedVariant, setSelectedVariant] = useState(
    product?.variants?.[0] || null
  );
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  useEffect(() => {
    if (!product?.handle && !product?.id) return;

    // Fetch full details if needed (like complete descriptions, reviews, all variants)
    let isMounted = true;
    setLoading(true);
    fetchProductByIdOrHandle(product.handle || product.id).then((fullData) => {
      if (isMounted && fullData) {
        setDetailedProduct(fullData);
        if (fullData.images?.length) {
          setSelectedImage(fullData.images[0].url);
        }
        if (fullData.variants?.length) {
          setSelectedVariant(fullData.variants[0]);
        }
      }
      if (isMounted) setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [product]);

  if (!product) return null;

  const currentPrice = Number(
    selectedVariant?.price?.amount ??
    selectedVariant?.price ??
    detailedProduct?.priceRange?.minVariantPrice?.amount ??
    detailedProduct?.price ??
    product?.priceRange?.minVariantPrice?.amount ??
    product?.price ??
    0
  );
  const currentComparePrice = Number(
    selectedVariant?.compareAtPrice?.amount ??
    selectedVariant?.compare_at_price ??
    selectedVariant?.compareAtPrice ??
    detailedProduct?.compareAtPrice?.amount ??
    detailedProduct?.compare_at_price ??
    detailedProduct?.compareAtPrice ??
    detailedProduct?.variants?.[0]?.compareAtPrice?.amount ??
    detailedProduct?.variants?.[0]?.compare_at_price ??
    detailedProduct?.variants?.[0]?.compareAtPrice ??
    product?.compareAtPrice?.amount ??
    product?.compare_at_price ??
    product?.compareAtPrice ??
    0
  );
  const images = detailedProduct?.images || [{ url: selectedImage }];
  const discountPercent = currentComparePrice > currentPrice
    ? Math.round(((currentComparePrice - currentPrice) / currentComparePrice) * 100)
    : 0;

  const handleAddToCart = async () => {
    const itemToAdd = detailedProduct || product;
    if (!itemToAdd) return;
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
    onClose?.();
    await addToCart({
      product: itemToAdd,
      variantId: selectedVariant?.id || null,
      quantity,
      openDrawer: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      {/* Modal Card */}
      <div
        className="relative bg-white w-full max-w-5xl rounded-3xl sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-amber-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 bg-stone-100/90 hover:bg-stone-200 text-stone-700 rounded-full transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">

            {/* Left: Gallery & Images */}
            <div className="flex flex-col gap-3">
              <div className="relative aspect-square w-full rounded-2xl sm:rounded-3xl bg-stone-50 border border-stone-200/80 overflow-hidden flex items-center justify-center p-4">
                <img
                  src={selectedImage}
                  alt={detailedProduct?.title}
                  className="w-full h-full object-contain mix-blend-multiply"
                />
                {discountPercent > 0 && (
                  <span className="absolute top-3 left-3 bg-[#700b10] text-[#ebd99c] font-nunito text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Thumbnails row */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(img.url)}
                      className={`relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 bg-stone-50 p-1 transition-all ${selectedImage === img.url ? 'border-[#700b10] shadow-sm' : 'border-stone-200 hover:border-stone-300'
                        }`}
                    >
                      <img
                        src={img.url}
                        alt={`thumb-${i}`}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Details & Purchase Actions */}
            <div className="flex flex-col">
              {/* Product Category / Tag */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#b5944d] font-jost bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/50">
                  {detailedProduct?.category || "Pooja Samagri"}
                </span>
                <span className="text-xs text-stone-400">•</span>
                <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> In Stock
                </span>
              </div>

              {/* Product Title */}
              <h1 className="font-tenor text-xl sm:text-2xl lg:text-3xl text-stone-900 leading-snug mb-3">
                {detailedProduct?.title}
              </h1>

              {/* Rating row */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <span className="text-sm font-bold text-stone-800">
                  {Number(detailedProduct?.avg_rating || 4.8).toFixed(1)}
                </span>
                <span className="text-xs text-stone-400">
                  ({detailedProduct?.total_reviews || 24} verified customer reviews)
                </span>
              </div>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 pb-4 mb-4 border-b border-stone-200">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#700b10] font-nunito">
                  ₹{Number(currentPrice).toLocaleString('en-IN')}
                </span>
                {currentComparePrice > currentPrice && (
                  <span className="text-base text-stone-400 line-through">
                    ₹{Number(currentComparePrice).toLocaleString('en-IN')}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Save ₹{(Number(currentComparePrice) - Number(currentPrice)).toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              {/* Variant Selector (if options available) */}
              {detailedProduct?.variants && detailedProduct.variants.length > 1 && (
                <div className="mb-5">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-2 font-nunito">
                    Select Size / Variant:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {detailedProduct.variants.map((v) => {
                      const isSelected = selectedVariant?.id === v.id;
                      const variantLabel = v.title || v.selectedOptions?.[0]?.value || (v.weight ? `${v.weight}${v.weightUnit || 'g'}` : "Standard");
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => {
                            setSelectedVariant(v);
                            if (v.image?.url) setSelectedImage(v.image.url);
                          }}
                          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${isSelected
                              ? 'bg-[#700b10] text-white border-[#700b10] shadow-sm'
                              : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
                            }`}
                        >
                          {variantLabel}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity & CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch gap-3 mb-6">
                {/* Quantity incrementor */}
                <div className="flex items-center justify-between border border-stone-200 rounded-2xl p-1 bg-stone-50 w-full sm:w-32">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 flex items-center justify-center text-stone-600 hover:bg-white rounded-xl transition-colors font-bold text-base"
                  >
                    -
                  </button>
                  <span className="font-bold text-sm text-stone-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 flex items-center justify-center text-stone-600 hover:bg-white rounded-xl transition-colors font-bold text-base"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#700b10] hover:bg-[#54060b] text-white font-nunito font-bold py-3.5 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 transform active:scale-98 cursor-pointer"
                >
                  <ShoppingBag className="w-5 h-5 text-[#ebd99c]" />
                  Add to Cart
                </button>

                {/* Wishlist toggle button */}
                {(() => {
                  const prodId = detailedProduct?.id || product?.id;
                  const isSaved = isWishlisted(prodId);
                  const isToggling = togglingIds?.has?.(prodId);
                  return (
                    <button
                      type="button"
                      disabled={isToggling}
                      onClick={() => toggleWishlist(detailedProduct || product, selectedVariant?.id)}
                      className={`w-12 sm:w-14 rounded-2xl border flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105 shrink-0 ${isSaved
                          ? "bg-[#700b10] text-white border-[#700b10]"
                          : "bg-white text-stone-600 hover:text-[#700b10] border-stone-200 hover:border-[#700b10]"
                        }`}
                      aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
                      title={isSaved ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <Heart className={`w-5 h-5 ${isSaved ? "fill-white text-white" : ""}`} />
                    </button>
                  );
                })()}
              </div>

              {addedNotice && (
                <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 animate-fadeIn">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Item successfully added to your cart!
                </div>
              )}

              {/* Trust Badges matching Nilkanth Dham store */}
              <div className="grid grid-cols-3 gap-2 py-4 border-t border-b border-stone-100 mb-5 text-center">
                <div className="flex flex-col items-center gap-1 text-stone-600">
                  <Truck className="w-4 h-4 text-[#700b10]" />
                  <span className="text-[10px] font-bold">Fast Pan-India Delivery</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-stone-600">
                  <ShieldCheck className="w-4 h-4 text-[#700b10]" />
                  <span className="text-[10px] font-bold">100% Pure &amp; Blessed</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-stone-600">
                  <Sparkles className="w-4 h-4 text-[#700b10]" />
                  <span className="text-[10px] font-bold">Divine Spiritual Value</span>
                </div>
              </div>

              {/* Product Description with 5-6 line clamp + Read More */}
              {detailedProduct?.description && (
                <div className="mt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-2 font-nunito">
                    Product Details &amp; Highlights:
                  </h4>
                  <div className="relative">
                    <div
                      className={`text-stone-600 text-xs sm:text-sm leading-relaxed prose prose-stone max-w-none transition-all duration-300 ${!isDescriptionExpanded ? "line-clamp-6 max-h-[140px] overflow-hidden" : ""
                        }`}
                      dangerouslySetInnerHTML={{
                        __html: (detailedProduct.description || "")
                          .replace(/https?:\/\/store\.nilkanthdham\.in/gi, "")
                          .replace(/https?:\/\/nilkanthdham\.in\/store/gi, "")
                          .replace(/https?:\/\/nilkanthstore\.in/gi, ""),
                      }}
                    />
                    {!isDescriptionExpanded && (
                      <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#700b10] hover:underline cursor-pointer"
                  >
                    <span>{isDescriptionExpanded ? "Read Less" : "Read More"}</span>
                    {isDescriptionExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              )}

              {/* Shipping & Returns Accordion */}
              <div className="pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsShippingOpen(!isShippingOpen)}
                  className="w-full flex items-center justify-between py-1.5 text-left group cursor-pointer"
                  aria-expanded={isShippingOpen}
                >
                  <div className="flex items-center gap-2.5">
                    <Truck className="w-4 h-4 text-stone-800 flex-shrink-0" strokeWidth={1.6} />
                    <span className="font-serif text-sm sm:text-base text-stone-900 tracking-wide font-normal group-hover:text-[#700b10] transition-colors">
                      Shipping &amp; Returns
                    </span>
                  </div>
                  <div className="w-5 h-5 flex items-center justify-center text-stone-700 group-hover:text-[#700b10] transition-colors">
                    {isShippingOpen ? (
                      <Minus className="w-3.5 h-3.5 stroke-[2]" />
                    ) : (
                      <Plus className="w-3.5 h-3.5 stroke-[2]" />
                    )}
                  </div>
                </button>

                {isShippingOpen && (
                  <div className="pt-2.5 pb-1 space-y-3 text-stone-700 text-xs sm:text-[13px] leading-relaxed font-sans animate-fadeIn">
                    <p>
                      Exchange and returns are available for products within 3–5
                      working days of delivery. Items must be in original condition
                      with all tags intact. Estimated delivery dates are approximate
                      and may change due to unforeseen circumstances that could
                      cause delays.
                    </p>
                    <p>
                      We do not offer refunds. In cases where a refund is approved,
                      the shipping charges for both the original delivery and the
                      return shipment will be deducted from the refund amount.
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
