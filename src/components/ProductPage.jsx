import React, { useState, useEffect, useRef } from "react";
import {
  Star,
  ShoppingCart,
  Heart,
  Flame,
  Eye,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
  ArrowLeft,
  Share2,
  Check,
  Package,
  Truck,
} from "lucide-react";
import { fetchProductByIdOrHandle, fetchProducts } from "../services/api";
import { trackPageView, trackProductView, trackAddToCart, trackInitiateCheckout, removeProductSchema } from "../services/analytics";
import ProductCard from "./ProductCard";
import BestSellerSection from "./BestSellerSection";
import ProductReviewSection from "./ProductReviewSection";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

export default function ProductPage({
  productHandle,
  initialProduct = null,
  onNavigate,
  onSelectProduct,
  onAddToCart,
}) {
  const { isWishlisted: checkIsWishlisted, toggleWishlist, togglingIds } = useWishlist();
  const { addToCart, openCart } = useCart();
  const [product, setProduct] = useState(initialProduct);
  const [loading, setLoading] = useState(!initialProduct);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isShippingOpen, setIsShippingOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(
    initialProduct?.image_url || null,
  );
  const [selectedVariant, setSelectedVariant] = useState(
    initialProduct?.variants?.[0] || null,
  );
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [addedNotice, setAddedNotice] = useState(false);
  const [isSliderPaused, setIsSliderPaused] = useState(false);
  const relatedSliderRef = useRef(null);

  // Recently Viewed state & ref
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [isRecentSliderPaused, setIsRecentSliderPaused] = useState(false);
  const recentSliderRef = useRef(null);

  // Sticky Add to Cart bottom bar state & ref
  const [showStickyBar, setShowStickyBar] = useState(false);
  const mainCtaRef = useRef(null);

  // 1. Fetch complete product details by handle or ID
  useEffect(() => {
    if (!productHandle) return;

    let isMounted = true;
    setLoading(true);
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Track page view for the product URL
    trackPageView(window.location.href);

    fetchProductByIdOrHandle(productHandle)
      .then((res) => {
        if (isMounted && res) {
          const data = res?.data || res;
          setProduct(data);

          // Track this product in localStorage for "Recently Viewed"
          try {
            const raw = localStorage.getItem("nilkanth_recently_viewed");
            let items = raw ? JSON.parse(raw) : [];
            // Remove if already exists, then prepend
            items = items.filter(
              (it) => it.id !== data.id && it.handle !== data.handle
            );
            items.unshift(data);
            // Keep top 15 products
            items = items.slice(0, 15);
            localStorage.setItem("nilkanth_recently_viewed", JSON.stringify(items));
          } catch (e) {
            console.error("Failed saving recently viewed item:", e);
          }

          // Set primary image
          const primaryImg = data.image_url || data.images?.[0]?.url;
          setSelectedImage(primaryImg);

          // Set primary variant
          if (Array.isArray(data.variants) && data.variants.length > 0) {
            setSelectedVariant(data.variants[0]);
          }

          // ── Fire GA4 ViewContent + Meta Pixel ViewContent + inject JSON-LD schema ──
          trackProductView(data);

          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed fetching product details:", err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
      // Remove product schema when leaving the product page / switching products
      removeProductSchema();
    };
  }, [productHandle]);

  // Load recently viewed products from localStorage (excluding currently open product)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("nilkanth_recently_viewed");
      if (raw) {
        const items = JSON.parse(raw);
        if (Array.isArray(items)) {
          const filtered = items.filter(
            (p) => p.handle !== productHandle && p.id !== product?.id
          );
          setRecentlyViewed(filtered);
        }
      }
    } catch (e) {
      console.error("Failed parsing recently viewed items:", e);
    }
  }, [productHandle, product?.id]);

  // 2. Fetch related products from same collection or top picks
  useEffect(() => {
    let isMounted = true;
    fetchProducts({ page: 1, limit: 16 })
      .then((res) => {
        if (isMounted) {
          const list = Array.isArray(res) ? res : res?.data || [];
          const filtered = list.filter(
            (p) => p.handle !== productHandle && p.id !== product?.id,
          );
          setRelatedProducts(filtered);
        }
      })
      .catch((err) => console.error("Failed loading related items:", err));

    return () => {
      isMounted = false;
    };
  }, [productHandle, product?.id]);

  // 3. Smooth Auto-Slide Effect for You May Also Like Slider
  useEffect(() => {
    if (loading || isSliderPaused || relatedProducts.length === 0) return;

    const timer = setInterval(() => {
      if (relatedSliderRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } =
          relatedSliderRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 15) {
          relatedSliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          relatedSliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
      }
    }, 3800);

    return () => clearInterval(timer);
  }, [loading, isSliderPaused, relatedProducts]);

  // 4. Smooth Auto-Slide Effect for Recently Viewed Slider
  useEffect(() => {
    if (loading || isRecentSliderPaused || recentlyViewed.length === 0) return;

    const timer = setInterval(() => {
      if (recentSliderRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } =
          recentSliderRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 15) {
          recentSliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          recentSliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
      }
    }, 4200);

    return () => clearInterval(timer);
  }, [loading, isRecentSliderPaused, recentlyViewed]);

  // Slider scrollability states to conditionally show/hide arrows
  const [canScrollRelatedLeft, setCanScrollRelatedLeft] = useState(false);
  const [canScrollRelatedRight, setCanScrollRelatedRight] = useState(false);
  const [canScrollRecentLeft, setCanScrollRecentLeft] = useState(false);
  const [canScrollRecentRight, setCanScrollRecentRight] = useState(false);

  // Check if Related Products slider has overflow
  const updateRelatedScrollState = () => {
    if (relatedSliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = relatedSliderRef.current;
      setCanScrollRelatedLeft(scrollLeft > 5);
      setCanScrollRelatedRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  // Check if Recently Viewed slider has overflow
  const updateRecentScrollState = () => {
    if (recentSliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = recentSliderRef.current;
      setCanScrollRecentLeft(scrollLeft > 5);
      setCanScrollRecentRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  // Check overflow on mount, resize, and data changes
  useEffect(() => {
    const handleCheck = () => {
      updateRelatedScrollState();
      updateRecentScrollState();
    };

    handleCheck();
    window.addEventListener("resize", handleCheck);
    return () => window.removeEventListener("resize", handleCheck);
  }, [relatedProducts, recentlyViewed]);

  const slideRelatedLeft = () => {
    if (relatedSliderRef.current) {
      relatedSliderRef.current.scrollBy({ left: -320, behavior: "smooth" });
      setTimeout(updateRelatedScrollState, 350);
    }
  };

  const slideRelatedRight = () => {
    if (relatedSliderRef.current) {
      relatedSliderRef.current.scrollBy({ left: 320, behavior: "smooth" });
      setTimeout(updateRelatedScrollState, 350);
    }
  };

  const slideRecentLeft = () => {
    if (recentSliderRef.current) {
      recentSliderRef.current.scrollBy({ left: -320, behavior: "smooth" });
      setTimeout(updateRecentScrollState, 350);
    }
  };

  const slideRecentRight = () => {
    if (recentSliderRef.current) {
      recentSliderRef.current.scrollBy({ left: 320, behavior: "smooth" });
      setTimeout(updateRecentScrollState, 350);
    }
  };

  // 5. Scroll listener to show sticky Add to Cart bar when main CTA is scrolled past
  useEffect(() => {
    const handleScroll = () => {
      if (mainCtaRef.current) {
        const rect = mainCtaRef.current.getBoundingClientRect();
        // Show sticky bar once the main CTA button scrolls past the top of the viewport
        setShowStickyBar(rect.bottom < 0);
      } else {
        setShowStickyBar(window.scrollY > 450);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [product, selectedVariant]);

  // Calculations
  const currentPrice = Number(
    selectedVariant?.price?.amount ??
    selectedVariant?.price ??
    product?.priceRange?.minVariantPrice?.amount ??
    product?.price ??
    0
  );
  const currentComparePrice = Number(
    selectedVariant?.compareAtPrice?.amount ??
    selectedVariant?.compare_at_price ??
    selectedVariant?.compareAtPrice ??
    product?.compareAtPrice?.amount ??
    product?.compare_at_price ??
    product?.compareAtPrice ??
    product?.variants?.[0]?.compareAtPrice?.amount ??
    product?.variants?.[0]?.compare_at_price ??
    product?.variants?.[0]?.compareAtPrice ??
    0
  );
  const discountPercent =
    currentComparePrice > currentPrice
      ? Math.round(
        ((currentComparePrice - currentPrice) / currentComparePrice) * 100,
      )
      : 0;

  const images =
    Array.isArray(product?.images) && product.images.length > 0
      ? product.images
      : selectedImage
        ? [{ url: selectedImage }]
        : [];

  const handleAddToCart = async () => {
    if (!product) return;
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);

    // ── Fire GA4 add_to_cart + Meta Pixel AddToCart ──
    trackAddToCart(product, selectedVariant, quantity);

    await addToCart({
      product,
      variantId: selectedVariant?.id || null,
      quantity,
      openDrawer: true,
    });
  };

  const handleBuyNow = async () => {
    if (!product) return;
    const variant = selectedVariant || product?.variants?.[0] || null;
    const price = Number(
      variant?.price?.amount ||
      variant?.price ||
      product.price ||
      product.priceRange?.minVariantPrice?.amount ||
      0
    );

    // ── 1. Fire GA4 add_to_cart + Meta Pixel AddToCart ──
    trackAddToCart(product, variant, quantity);

    // ── 2. Fire GA4 begin_checkout + Meta Pixel InitiateCheckout ──
    const itemData = [
      {
        product_id: product.id || product.product_id,
        id: product.id || product.product_id,
        title: product.title || product.product_title || product.name,
        price: price,
        quantity: quantity,
      },
    ];
    trackInitiateCheckout(itemData, price * quantity);

    // ── 3. Add to cart in state without opening drawer ──
    await addToCart({
      product,
      variantId: variant?.id || null,
      quantity,
      openDrawer: false,
    });

    // ── 4. Redirect immediately to checkout page ──
    if (onNavigate) {
      onNavigate("checkout");
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-white min-h-screen py-8 md:py-14">
        <div className="max-w-[95rem] mx-auto px-4 sm:px-6 lg:px-12 animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
            <div className="lg:col-span-7 flex gap-4">
              <div className="w-20 space-y-3 hidden sm:block">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-20 h-20 bg-stone-200 rounded-lg" />
                ))}
              </div>
              <div className="flex-1 aspect-square bg-stone-200 rounded-2xl" />
            </div>
            <div className="lg:col-span-5 space-y-4">
              <div className="h-8 w-3/4 bg-stone-200 rounded" />
              <div className="h-6 w-32 bg-stone-200 rounded" />
              <div className="h-10 w-44 bg-stone-200 rounded" />
              <div className="h-24 w-full bg-stone-100 rounded-xl" />
              <div className="h-12 w-full bg-stone-200 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full bg-[#ffffff] min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <Package className="w-16 h-16 text-[#700b10]/40 mb-4" />
        <h2 className="font-tenor text-2xl text-stone-900 mb-2">
          Product Not Found
        </h2>
        <p className="text-stone-500 font-nunito text-sm mb-6 max-w-md">
          The devotional offering you are looking for may have moved or is
          temporarily unavailable.
        </p>
        <button
          type="button"
          onClick={() => onNavigate?.("shop")}
          className="px-6 py-2.5 bg-[#700b10] text-white font-nunito font-bold text-sm rounded-full shadow-md hover:bg-[#851016] transition-colors cursor-pointer"
        >
          Explore All Products
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-white min-h-screen text-[#1c1917] font-sans pb-16">
      {/* Breadcrumb Navigation matching site styling */}
      <div className="w-full border-b border-stone-100 bg-stone-50/50">
        <div className="max-w-[95rem] mx-auto px-4 sm:px-6 lg:px-12 py-3 flex items-center gap-2 text-xs sm:text-sm text-stone-500 overflow-x-auto whitespace-nowrap">
          <button
            type="button"
            onClick={() => onNavigate?.("home")}
            className="hover:text-[#700b10] transition-colors font-medium cursor-pointer"
          >
            Home
          </button>
          <span>/</span>
          <button
            type="button"
            onClick={() => onNavigate?.("shop")}
            className="hover:text-[#700b10] transition-colors font-medium cursor-pointer"
          >
            Shop
          </button>
          <span>/</span>
          <span className="text-stone-800 font-semibold truncate max-w-[260px] sm:max-w-md">
            {product.title}
          </span>
        </div>
      </div>

      {/* Main Container - Full Width Matching Header & Sections */}
      <div className="max-w-[95rem] mx-auto px-2 sm:px-2 lg:px-12 pt-6 md:pt-10">
        {/* Two-Column Layout Exactly like Reference Screenshot */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-start">
          {/* ========================================================
              LEFT COLUMN: Vertical Thumbnails Strip + Big Showcase
              (Sticky ONLY on Desktop/Laptop - NOT sticky on mobile & tablet)
              ======================================================== */}
          <div className="lg:col-span-7 flex flex-col-reverse lg:flex-row gap-3 sm:gap-4 relative lg:sticky lg:top-28 lg:self-start">
            {/* 1. Thumbnails Strip (Horizontal on Mobile & Tablet, Vertical on Desktop) */}
            {images.length > 1 && (
              <div className="flex lg:flex-col gap-2.5 overflow-x-auto lg:overflow-y-auto max-h-[580px] lg:w-[84px] flex-shrink-0 scrollbar-none py-1">
                {images.map((img, i) => {
                  const isSelected =
                    selectedImage === img.url || (!selectedImage && i === 0);
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedImage(img.url)}
                      className={`relative w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 overflow-hidden border transition-all cursor-pointer bg-stone-50 p-1 flex items-center justify-center flex-shrink-0 ${isSelected
                        ? "border-stone-900 ring-1 ring-stone-900"
                        : "border-stone-200 hover:border-stone-400 opacity-80 hover:opacity-100"
                        }`}
                    >
                      <img
                        src={img.url}
                        alt={`thumb-${i}`}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </button>
                  );
                })}
              </div>
            )}

            {/* 2. Main Large Showcase Image with Wishlist Heart in top-right corner */}
            <div className="flex-1 relative aspect-square w-full rounded-2xl bg-[#f7f5f0] overflow-hidden flex items-center justify-center border border-stone-200/60 shadow-xs group">
              <img
                src={selectedImage || product.image_url}
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-102"
              />

              {/* Circular Wishlist Button in Top-Right Corner of Image */}
              {(() => {
                const isSaved = checkIsWishlisted(product?.id);
                const isToggling = togglingIds?.has?.(product?.id);
                return (
                  <button
                    type="button"
                    disabled={isToggling}
                    onClick={() => toggleWishlist(product, selectedVariant?.id)}
                    className={`absolute top-3.5 right-3.5 sm:top-4 sm:right-4 w-10 h-10 sm:w-11 sm:h-11 rounded-full border flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-110 active:scale-95 z-20 ${isSaved
                      ? "bg-[#700b10] text-white border-[#700b10] shadow-rose-900/30"
                      : "bg-white/90 hover:bg-white backdrop-blur-xs text-stone-700 hover:text-[#700b10] border-stone-200/80 hover:border-[#700b10]"
                      }`}
                    aria-label={isSaved ? "Remove from Wishlist" : "Save to Wishlist"}
                    title={isSaved ? "Remove from Wishlist" : "Save to Wishlist"}
                  >
                    <Heart
                      className={`w-4.5 h-4.5 ${isSaved ? "fill-white text-white" : ""}`}
                    />
                  </button>
                );
              })()}
            </div>
          </div>

          {/* ========================================================
              RIGHT COLUMN: Product Meta, Pricing, ICICI Box & CTAs
              ======================================================== */}
          <div className="lg:col-span-5 flex flex-col text-left">
            {/* 1. Title matching Reference Site */}
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-[32px] text-stone-900 leading-tight font-normal tracking-tight mb-2.5">
              {product.title}
            </h1>

            {/* 2. Star Ratings & Review Count */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center text-[#c23333]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-current text-[#700b10]"
                  />
                ))}
              </div>
              <span className="text-xs sm:text-[13px] text-stone-500 font-sans">
                ({product.total_reviews || 24} reviews)
              </span>
            </div>

            {/* 3. Pricing Row: ₹130  ₹169  [22% OFF] */}
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl sm:text-4xl font-bold text-[#700b10] font-sans tracking-tight">
                ₹{Number(currentPrice).toLocaleString("en-IN")}
              </span>
              {currentComparePrice > currentPrice && (
                <span className="text-base sm:text-lg text-stone-400 line-through font-sans">
                  ₹{Number(currentComparePrice).toLocaleString("en-IN")}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="bg-[#f5b300] text-[#000000] text-[11px] font-bold font-sans px-2.5 py-0.5 rounded-[3px] uppercase tracking-wider">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {/* 4. Tax & Shipping Subtext */}
            <p className="text-[11px] font-sans text-stone-500 uppercase tracking-wider mb-4">
              TAX EXCLUDED.{" "}
              <button
                type="button"
                onClick={() => onNavigate?.("shipping")}
                className="underline hover:text-[#700b10] cursor-pointer"
              >
                SHIPPING
              </button>{" "}
              CALCULATED AT CHECKOUT.
            </p>

            {/* 5. Urgency Indicators (Matching Reference Site Screenshot) */}
            <div className="space-y-1.5 mb-5 text-xs text-stone-700 font-sans">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-600 fill-orange-500 flex-shrink-0" />
                <span>
                  <strong className="font-bold text-stone-900">172</strong> sold
                  in last 18 hours
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-stone-600 flex-shrink-0" />
                <span>
                  <strong className="font-bold text-stone-900">33</strong>{" "}
                  people are viewing this right now
                </span>
              </div>
            </div>

            {/* 6.5. Variant Options / Size Selector (Responsive for all screen sizes) */}
            {product?.variants && product.variants.length > 0 && (
              <div className="mb-6 pt-1">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-stone-700 font-sans">
                    {product?.options?.[0]?.name ? `${product.options[0].name}:` : "Select Variant / Size:"}
                    <span className="ml-2 font-normal normal-case text-stone-900 font-serif">
                      {selectedVariant?.title || "Standard"}
                    </span>
                  </span>
                  {selectedVariant && (
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${selectedVariant.availableForSale === false || selectedVariant.inventoryQuantity === 0
                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                    >
                      {selectedVariant.availableForSale === false || selectedVariant.inventoryQuantity === 0
                        ? "Out of Stock"
                        : "In Stock"}
                    </span>
                  )}
                </div>

                {/* Variant Chips (Shows only variant size/weight, without price) */}
                <div className="flex flex-wrap gap-2 sm:gap-2.5">
                  {product.variants.map((v) => {
                    const isSelected = selectedVariant?.id === v.id;
                    const isOutOfStock = v.availableForSale === false || v.inventoryQuantity === 0;
                    // Get variant weight or title cleanly
                    const variantLabel = v.title || v.selectedOptions?.[0]?.value || (v.weight ? `${v.weight}${v.weightUnit || 'g'}` : "Standard");

                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => {
                          setSelectedVariant(v);
                          if (v.image?.url) {
                            setSelectedImage(v.image.url);
                          }
                        }}
                        className={`group relative flex items-center justify-center min-w-[3.5rem] sm:min-w-[4rem] px-4 py-2 sm:py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${isSelected
                          ? "bg-[#700b10] text-white border-[#700b10] shadow-sm ring-1 ring-[#700b10]"
                          : isOutOfStock
                            ? "bg-stone-50 text-stone-400 border-stone-200 hover:border-stone-300 opacity-60"
                            : "bg-white text-stone-800 border-stone-200 hover:border-[#700b10]/60 hover:bg-[#700b10]/5"
                          }`}
                      >
                        <span className="font-sans tracking-wide">{variantLabel}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 7 & 8. Action Section: Quantity + ADD TO CART in One Line & BUY IT NOW Full Width */}
            <div ref={mainCtaRef} className="mb-6 space-y-2.5 sm:space-y-3">
              {/* Row 1: Quantity Counter + ADD TO CART Pill */}
              <div className="flex items-center gap-2.5 sm:gap-3">
                {/* Quantity Pill Counter */}
                <div className="inline-flex items-center border border-stone-300 rounded-full px-2 py-1 bg-white shadow-2xs shrink-0">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 sm:w-10 text-center font-bold text-xs sm:text-sm text-stone-900 select-none">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* ADD TO CART Button */}
                <button
                  type="button"
                  disabled={selectedVariant?.availableForSale === false || selectedVariant?.inventoryQuantity === 0}
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#700b10] hover:bg-[#54060b] text-white font-sans font-extrabold text-xs sm:text-[13px] py-3.5 px-4 rounded-full uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-4 h-4 text-white" />
                  {selectedVariant?.availableForSale === false || selectedVariant?.inventoryQuantity === 0
                    ? "OUT OF STOCK"
                    : "ADD TO CART"}
                </button>
              </div>

              {/* Row 2: BUY IT NOW Pill (Full Width) */}
              <button
                type="button"
                disabled={selectedVariant?.availableForSale === false || selectedVariant?.inventoryQuantity === 0}
                onClick={handleBuyNow}
                className="w-full bg-[#5b080c] hover:bg-[#430407] text-white font-sans font-extrabold text-xs sm:text-[13px] py-3.5 px-4 rounded-full uppercase tracking-wider flex items-center justify-center shadow-sm hover:shadow-md transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {selectedVariant?.availableForSale === false || selectedVariant?.inventoryQuantity === 0
                  ? "OUT OF STOCK"
                  : "BUY IT NOW"}
              </button>
            </div>

            {/* Notification alert on cart addition */}
            {addedNotice && (
              <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 animate-fadeIn">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>
                  {quantity}x &ldquo;{product.title}&rdquo; added to your cart!
                </span>
              </div>
            )}

            {/* 9. Description Header & Content with 5-6 line clamp + Read More */}
            <div className="pt-3 border-t border-stone-200">
              <h2 className="font-serif text-lg sm:text-xl text-stone-900 mb-3 font-normal">
                Description
              </h2>

              {product.description ? (
                <div>
                  <div className="relative">
                    <div
                      onClick={(e) => {
                        const link = e.target.closest("a");
                        if (!link) return;
                        const href = link.getAttribute("href") || "";
                        if (!href || href === "#") return;

                        const isExternal =
                          (href.startsWith("http://") || href.startsWith("https://")) &&
                          !href.includes(window.location.host) &&
                          !href.includes("store.nilkanthdham.in") &&
                          !href.includes("nilkanthdham.in");

                        if (isExternal) {
                          link.setAttribute("target", "_blank");
                          link.setAttribute("rel", "noopener noreferrer");
                          return;
                        }

                        e.preventDefault();
                        const productMatch = href.match(/\/products\/([^/?#]+)/i);
                        if (productMatch && productMatch[1]) {
                          const pHandle = decodeURIComponent(productMatch[1]);
                          if (onSelectProduct) onSelectProduct(pHandle);
                          else onNavigate?.("product", { productHandle: pHandle });
                          return;
                        }

                        const collectionMatch = href.match(/\/collections\/([^/?#]+)/i);
                        if (collectionMatch && collectionMatch[1]) {
                          onNavigate?.("collections", { collectionHandle: decodeURIComponent(collectionMatch[1]) });
                          return;
                        } else if (href.includes("/collections")) {
                          onNavigate?.("collections");
                          return;
                        }

                        if (href.includes("/shop")) onNavigate?.("shop");
                        else if (href.includes("/blogs")) onNavigate?.("blogs");
                        else if (href.includes("/contact")) onNavigate?.("contact");
                        else if (href.includes("/about")) onNavigate?.("about");
                        else onNavigate?.("home");
                      }}
                      className={`text-stone-700 text-xs sm:text-[13px] leading-relaxed font-sans prose prose-stone max-w-none transition-all duration-300 ${!isDescriptionExpanded ? "line-clamp-6 max-h-[145px] overflow-hidden" : ""
                        }`}
                      dangerouslySetInnerHTML={{
                        __html: (product.description || "")
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
                    className="mt-2.5 inline-flex items-center gap-1 text-xs sm:text-[13px] font-bold text-[#700b10] hover:text-[#54060b] hover:underline cursor-pointer transition-colors"
                  >
                    <span>{isDescriptionExpanded ? "Read Less" : "Read More"}</span>
                    {isDescriptionExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ) : (
                <p className="text-stone-600 text-xs sm:text-[13px] leading-relaxed font-sans">
                  Experience timeless elegance with our pure sacred offerings
                  crafted to bring purity, peace, and spiritual aroma to your
                  home and daily prayers.
                </p>
              )}
            </div>

            {/* 9.5. Shipping & Returns Accordion Section */}
            <div className="pt-4 mt-4 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setIsShippingOpen(!isShippingOpen)}
                className="w-full flex items-center justify-between py-2 text-left group cursor-pointer"
                aria-expanded={isShippingOpen}
              >
                <div className="flex items-center gap-2.5">
                  <Truck className="w-5 h-5 text-stone-800 flex-shrink-0" strokeWidth={1.6} />
                  <span className="font-serif text-base sm:text-lg text-stone-900 tracking-wide font-normal group-hover:text-[#700b10] transition-colors">
                    Shipping &amp; Returns
                  </span>
                </div>
                <div className="w-6 h-6 flex items-center justify-center text-stone-700 group-hover:text-[#700b10] transition-colors">
                  {isShippingOpen ? (
                    <Minus className="w-4 h-4 stroke-[2]" />
                  ) : (
                    <Plus className="w-4 h-4 stroke-[2]" />
                  )}
                </div>
              </button>

              {isShippingOpen && (
                <div className="pt-3 pb-1 space-y-3.5 text-stone-700 text-xs sm:text-[13px] leading-relaxed font-sans animate-fadeIn">
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

            {/* 10. Four Circular Trust Badges Image matching reference */}
            <div className="pt-5 mt-5 border-t border-stone-200 flex justify-center">
              <img
                src="/image copy.png"
                alt="100% Secure Payment, All India Shipping, 100% Quality, Official Authorized"
                className="w-full max-w-[660px] h-auto object-contain mx-auto"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Best Seller Section with medium & consistent spacing */}
        <div className="mt-3 md:mt-7 pt-3 md:pt-6 ">
          <BestSellerSection
            onSelectProduct={(p) => {
              const handle = p.handle || p.id;
              onNavigate?.("product", { productHandle: handle });
            }}
          />
        </div>

        {/* Recommended Products Auto-Slide Section with medium & consistent spacing */}
        {relatedProducts.length > 0 && (
          <div
            className="mt-3 md:mt-7 pt-3 md:pt-6"
            onMouseEnter={() => setIsSliderPaused(true)}
            onMouseLeave={() => setIsSliderPaused(false)}
          >
            {/* Centered Heading exactly as screenshot: "Some Similar Styles" */}
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="font-tenor text-2xl sm:text-3xl md:text-[34px] text-[#700b10] font-normal tracking-wide">
                Some Similar Styles
              </h2>
            </div>

            {/* Slider with Floating Left & Right Circular Arrow Buttons */}
            <div className="relative group/slider w-full px-2 sm:px-4">
              {/* Floating Left Arrow: shown only when scrolled right */}
              {canScrollRelatedLeft && (
                <button
                  type="button"
                  onClick={slideRelatedLeft}
                  className="absolute -left-3 sm:-left-4 md:-left-5 top-[32%] sm:top-[30%] -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white text-stone-800 hover:text-[#700b10] shadow-[0_4px_18px_rgba(0,0,0,0.18)] border border-stone-200 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer"
                  aria-label="Previous Products"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
                </button>
              )}

              {/* Floating Right Arrow: shown only when more products overflow on the right */}
              {canScrollRelatedRight && (
                <button
                  type="button"
                  onClick={slideRelatedRight}
                  className="absolute -right-3 sm:-right-4 md:-right-5 top-[32%] sm:top-[30%] -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white text-stone-800 hover:text-[#700b10] shadow-[0_4px_18px_rgba(0,0,0,0.18)] border border-stone-200 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer"
                  aria-label="Next Products"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
                </button>
              )}

              {/* Horizontal Sliding Track showing 4 columns on desktop/laptop, 2 columns on mobile and tablet */}
              <div
                ref={relatedSliderRef}
                onScroll={updateRelatedScrollState}
                className="flex items-stretch gap-3 sm:gap-4 md:gap-4 lg:gap-6 overflow-x-auto scroll-smooth py-2 px-1 scrollbar-none"
                style={{ scrollSnapType: "x mandatory" }}
              >
                {relatedProducts.map((rel) => (
                  <div
                    key={rel.id}
                    className="flex-shrink-0 w-[calc(50%-6px)] sm:w-[calc(50%-8px)] md:w-[calc(50%-8px)] lg:w-[calc(25%-18px)]"
                    style={{ scrollSnapAlign: "start" }}
                  >
                    <ProductCard
                      product={rel}
                      onSelectProduct={(p) => {
                        const handle = p.handle || p.id;
                        onNavigate?.("product", {
                          productHandle: handle,
                          product: p,
                        });
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recently Viewed Products Auto-Slide Section */}
        {recentlyViewed.length > 0 && (
          <div
            className="mt-3 md:mt-7 pt-3 md:pt-6"
            onMouseEnter={() => setIsRecentSliderPaused(true)}
            onMouseLeave={() => setIsRecentSliderPaused(false)}
          >
            {/* Centered Heading: "Recently Viewed" */}
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="font-tenor text-2xl sm:text-3xl md:text-[34px] text-[#700b10] font-normal tracking-wide">
                Recently Viewed
              </h2>
            </div>

            {/* Slider with Floating Left & Right Circular Arrow Buttons */}
            <div className="relative group/recent-slider w-full px-2 sm:px-4">
              {/* Floating Left Arrow: shown only when scrolled right */}
              {canScrollRecentLeft && (
                <button
                  type="button"
                  onClick={slideRecentLeft}
                  className="absolute -left-3 sm:-left-4 md:-left-5 top-[32%] sm:top-[30%] -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white text-stone-800 hover:text-[#700b10] shadow-[0_4px_18px_rgba(0,0,0,0.18)] border border-stone-200 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer"
                  aria-label="Previous Recently Viewed Products"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
                </button>
              )}

              {/* Floating Right Arrow: shown only when more products overflow on the right */}
              {canScrollRecentRight && (
                <button
                  type="button"
                  onClick={slideRecentRight}
                  className="absolute -right-3 sm:-right-4 md:-right-5 top-[32%] sm:top-[30%] -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white text-stone-800 hover:text-[#700b10] shadow-[0_4px_18px_rgba(0,0,0,0.18)] border border-stone-200 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer"
                  aria-label="Next Recently Viewed Products"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
                </button>
              )}

              {/* Horizontal Sliding Track showing 4 columns on desktop, 2 columns on mobile and tablet */}
              <div
                ref={recentSliderRef}
                onScroll={updateRecentScrollState}
                className="flex items-stretch gap-3 sm:gap-4 md:gap-4 lg:gap-6 overflow-x-auto scroll-smooth py-2 px-1 scrollbar-none"
                style={{ scrollSnapType: "x mandatory" }}
              >
                {recentlyViewed.map((item) => (
                  <div
                    key={item.id}
                    className="flex-shrink-0 w-[calc(50%-6px)] sm:w-[calc(50%-8px)] md:w-[calc(50%-8px)] lg:w-[calc(25%-18px)]"
                    style={{ scrollSnapAlign: "start" }}
                  >
                    <ProductCard
                      product={item}
                      onSelectProduct={(p) => {
                        const handle = p.handle || p.id;
                        onNavigate?.("product", {
                          productHandle: handle,
                          product: p,
                        });
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Customer Reviews Section with Write Review Popup & Dynamic megaecomm Reviews */}
        <ProductReviewSection product={product} />
      </div>

      {/* Sticky Bottom Add To Cart & Quantity Bar (Visible on scroll down - Mobile & Desktop) */}
      <div
        className={`fixed z-40 inset-x-0 transition-all duration-300 ease-in-out bg-white border-t border-stone-200/90 shadow-[0_-6px_25px_rgba(0,0,0,0.10)] ${showStickyBar
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-full opacity-0 pointer-events-none"
          } bottom-16 md:bottom-0`}
      >
        <div className="max-w-[95rem] mx-auto px-3 sm:px-6 lg:px-12 py-2 sm:py-2.5 md:py-3 flex items-center justify-between gap-3 sm:gap-6">
          {/* Left Side: Product Info (Visible on Desktop / Tablet) */}
          <div className="hidden md:flex items-center gap-3.5 min-w-0 flex-1">
            <div className="w-12 h-12 rounded-xl bg-stone-50 border border-stone-200/70 p-1 flex-shrink-0 flex items-center justify-center overflow-hidden">
              <img
                src={selectedImage || product.image_url}
                alt={product.title}
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-serif text-sm lg:text-base text-stone-900 font-medium truncate">
                {product.title}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-sans font-bold text-sm lg:text-base text-[#700b10]">
                  ₹{Number(currentPrice).toLocaleString("en-IN")}
                </span>
                {currentComparePrice > currentPrice && (
                  <span className="font-sans text-xs text-stone-400 line-through">
                    ₹{Number(currentComparePrice).toLocaleString("en-IN")}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="bg-[#700b10] text-[#ebd99c] text-[10px] font-bold font-sans px-1.5 py-0.5 rounded-[2px] uppercase">
                    {discountPercent}% OFF
                  </span>
                )}
                {selectedVariant && (
                  <span className="text-xs text-stone-500 font-sans hidden lg:inline">
                    • {selectedVariant.title || selectedVariant.selectedOptions?.[0]?.value || "Standard"}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Side / Mobile Full Bar: Quantity Selector + ADD TO CART Button (Identical to reference screenshot) */}
          <div className="flex items-center gap-2.5 sm:gap-3 w-full md:w-auto justify-between md:justify-end">
            {/* Pill Quantity Counter */}
            <div className="inline-flex items-center bg-[#f4f4f4] border border-stone-200/60 rounded-full px-2 sm:px-3 py-1 sm:py-1.5 shadow-2xs">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-stone-600 hover:text-stone-900 active:scale-95 transition-colors cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
              </button>
              <span className="w-7 sm:w-9 text-center font-bold text-xs sm:text-sm text-stone-900 select-none font-sans">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-stone-600 hover:text-stone-900 active:scale-95 transition-colors cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
              </button>
            </div>

            {/* Pill ADD TO CART Button */}
            <button
              type="button"
              disabled={
                selectedVariant?.availableForSale === false ||
                selectedVariant?.inventoryQuantity === 0
              }
              onClick={handleAddToCart}
              className="flex-1 md:flex-initial bg-[#700b10] hover:bg-[#54060b] active:scale-[0.98] text-white font-sans font-extrabold text-xs sm:text-[13px] py-2.5 sm:py-3 px-5 sm:px-8 rounded-full uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed min-w-[140px] sm:min-w-[180px]"
            >
              <ShoppingCart className="w-4 h-4 text-white flex-shrink-0" />
              <span>
                {selectedVariant?.availableForSale === false ||
                  selectedVariant?.inventoryQuantity === 0
                  ? "OUT OF STOCK"
                  : "ADD TO CART"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
