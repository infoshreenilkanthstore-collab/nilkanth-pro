import React from 'react';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, onSelectProduct, onAddToCart, onNavigate }) {
  const { isWishlisted, toggleWishlist, togglingIds } = useWishlist();
  const { addToCart } = useCart();

  if (!product) return null;

  const handle = product.handle || product.id;
  const title = product.title || "Spiritual Product";
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

  const reviewCount = product.total_reviews || 24;
  const wishlisted = isWishlisted(product.id);
  const isToggling = togglingIds?.has?.(product.id);

  // Hover image: second image if available
  const hoverImage =
    product.images?.[1]?.url ||
    product.images?.[1]?.src ||
    product.gallery?.[1]?.url ||
    null;

  const handleCardClick = (e) => {
    if (onSelectProduct) {
      onSelectProduct(product);
    } else if (onNavigate) {
      onNavigate('product', { productHandle: handle, product });
    }
  };

  const handleCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      product,
      variantId: product.variants?.[0]?.id || null,
      quantity: 1,
      openDrawer: true,
    });
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const variantId =
      product?.variant_id ||
      product?.selected_variant_id ||
      product?.variants?.[0]?.id ||
      null;
    toggleWishlist(product, variantId);
  };

  return (
    <a
      href={`/products/${handle}`}
      onClick={(e) => {
        e.preventDefault();
        handleCardClick(e);
      }}
      className="group bg-white rounded-none flex flex-col cursor-pointer select-none transition-all duration-300 w-full block"
    >
      {/* Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-stone-100/70 rounded-none">

        {/* Primary Image: fades out + scales up on hover when second image exists */}
        <img
          src={image}
          alt={title}
          loading="lazy"
          decoding="async"
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${hoverImage
            ? 'opacity-100 scale-100 group-hover:opacity-0 group-hover:scale-110'
            : 'opacity-100 scale-100 group-hover:scale-105'
            }`}
        />

        {/* Secondary Hover Image: crossfades in on hover */}
        {hoverImage && (
          <img
            src={hoverImage}
            alt={`${title} alternate view`}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover opacity-0 scale-105 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700 ease-out"
          />
        )}

        {/* Wishlist button */}
        <button
          type="button"
          onClick={handleWishlistClick}
          disabled={isToggling}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all hover:scale-110 z-10 cursor-pointer ${wishlisted
            ? 'bg-[#700b10] text-white shadow-[#700b10]/20'
            : 'bg-white/90 hover:bg-white text-stone-700 hover:text-[#700b10]'
            }`}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 stroke-[1.8] ${wishlisted ? 'fill-white text-white' : ''}`} />
        </button>

        {/* View Details strip slides up from bottom on hover */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/75 to-transparent pt-6 pb-2.5 text-center text-white text-[11px] font-bold font-nunito uppercase tracking-widest translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-10 pointer-events-none">
          View Details
        </div>
      </div>

      {/* Text Details */}
      <div className="pt-3 pb-1 flex flex-col text-left flex-1 justify-between">
        <div>
          <h3 className="font-nunito text-[13px] sm:text-[14px] font-medium text-stone-800 line-clamp-2 leading-snug group-hover:text-[#700b10] transition-colors mb-1.5 min-h-[2.4rem]">
            {title}
          </h3>

          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="flex items-center gap-0.5 text-[#700b10]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#700b10] text-[#700b10]" />
              ))}
            </div>
            <span className="text-[11px] text-stone-500 font-nunito">
              ({reviewCount} reviews)
            </span>
          </div>

          {/* Price, Compare Price & Discount Tag in One Line */}
          <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 mb-2.5">
            <span className="text-base sm:text-lg font-extrabold text-[#700b10] font-nunito whitespace-nowrap">
              ₹{Number(price).toLocaleString('en-IN')}
            </span>
            {compareAtPrice > price && (
              <span className="text-xs sm:text-[13px] text-stone-400 line-through font-nunito whitespace-nowrap">
                ₹{Number(compareAtPrice).toLocaleString('en-IN')}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="inline-flex items-center bg-[#f5b300] text-black font-extrabold text-[10px] sm:text-[11px] font-nunito px-1.5 py-0.5 rounded-[2px] uppercase tracking-wide whitespace-nowrap">
                {discountPercent}% OFF
              </span>
            )}
          </div>
        </div>

        <div className="pt-1 mt-auto">
          <button
            type="button"
            onClick={handleCartClick}
            className="w-full bg-[#700b10] hover:bg-[#54060b] active:scale-[0.98] text-white py-2.5 sm:py-3 px-4 rounded-full font-nunito font-extrabold text-xs sm:text-[13px] tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4 text-white" />
            ADD TO CART
          </button>
        </div>
      </div>
    </a>
  );
}
