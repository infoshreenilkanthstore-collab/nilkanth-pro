// src\components\ProductCard.jsx



"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AddToCart } from "@/components/ProductActions";
import ShareModal from "./ShareModal";
import { Heart, Share2 } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import Image from "next/image";
import ProductRating from "./ProductRating";

export default function ProductCard({ product }) {
    const { toggleWishlist, isInWishlist } = useWishlist();
    const [isShareOpen, setIsShareOpen] = useState(false);
    const p = product?.node || product;
    if (!p) return null;

    const firstImage = p.images?.edges?.[0]?.node || p.images?.[0];
    const secondImage = p.images?.edges?.[1]?.node || p.images?.[1];

    const imageUrl = firstImage?.url || firstImage?.src;
    const secondImageUrl = secondImage?.url || secondImage?.src;

    // 1. Data Normalization (Extract Variants)
    let allVariants = [];
    if (Array.isArray(p.variants)) {
        allVariants = p.variants;
    } else if (p.variants?.edges) {
        allVariants = p.variants.edges.map(e => e.node);
    }

    // 2. Identify the "Active" (First In-Stock) Variant
    const inStockVariant = allVariants.find(variant => {
        const qty = variant.inventory_quantity !== undefined ? variant.inventory_quantity : variant.inventoryQuantity;
        const isAvailable = variant.availableForSale !== false;
        return isAvailable && (qty === undefined || qty > 0);
    });

    const activeVariant = inStockVariant || allVariants[0] || null;

    // 3. Calculate Dynamic Pricing & Discounts
    let price = 0;
    let compareAtPrice = 0;

    if (activeVariant) {
        price = activeVariant.price?.amount || activeVariant.priceV2?.amount || activeVariant.price || p.priceRange?.minVariantPrice?.amount || p.price || 0;
        compareAtPrice = activeVariant.compareAtPrice?.amount || activeVariant.compareAtPriceV2?.amount || activeVariant.compareAtPrice || p.compareAtPriceRange?.minVariantPrice?.amount || p.compareAtPrice || p.compare_at_price || 0;
    } else {
        price = p.priceRange?.minVariantPrice?.amount || p.price || 0;
        compareAtPrice = p.compareAtPriceRange?.minVariantPrice?.amount || p.compareAtPrice || p.compare_at_price || 0;
    }

    price = Number(price);
    compareAtPrice = Number(compareAtPrice);

    const discount = compareAtPrice > price
        ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
        : 0;

    // 4. Determine Global Stock Status for the Card
    const hasInStockVariants = allVariants.length === 0 || allVariants.some(v => {
        const qty = v.inventory_quantity !== undefined ? v.inventory_quantity : v.inventoryQuantity;
        const isAvailable = v.availableForSale !== false;
        return isAvailable && (qty === undefined || qty > 0);
    });

    const isOutOfStock = p.availableForSale === false ||
        (allVariants.length > 0 ? !hasInStockVariants : (p.inventory_quantity <= 0));

    return (
        <>
            <div className="group/card flex flex-col relative w-full bg-white h-full overflow-hidden hover:shadow-lg transition">
                {/* IMAGE */}
                <div className="relative aspect-square w-full bg-gray-50 overflow-hidden">
                    <Link href={`/products/${p.handle}`}>
                        {imageUrl ? (
                            <>
                                <Image
                                    src={imageUrl}
                                    alt={p.title}
                                    width={500}
                                    height={500}
                                    priority
                                    className={`w-full h-full object-cover transition-all duration-700 ${secondImageUrl ? "group-hover/card:opacity-0 group-hover/card:scale-105" : "group-hover/card:scale-105"
                                        }`}
                                />
                                {secondImageUrl && (
                                    <Image
                                        src={secondImageUrl}
                                        alt={p.title}
                                        width={500}
                                        height={500}
                                        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover/card:opacity-100 transition-opacity duration-700"
                                    />
                                )}
                            </>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                        )}
                    </Link>

                    {/* SALE BADGE - Premium Style */}
                    {discount > 0 && (
                        <div className="absolute top-3 left-3 bg-[#700b10] text-white text-[10px] font-black px-2 py-1 rounded shadow-lg z-10 flex items-center gap-1 uppercase tracking-tighter">
                            <span>SAVE</span>
                            <span>{discount}%</span>
                        </div>
                    )}

                    {/* ACTION BUTTONS (Wishlist & Share) */}
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 flex flex-col gap-1 sm:gap-1.5">
                        {/* WISHLIST BUTTON */}
                        <button
                            onClick={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log("Card Wishlist Click - Product:", p);
                                const vId = activeVariant?.id || p.variantId || p.id;
                                await toggleWishlist(p, vId);
                            }}
                            title="Add to Wishlist"
                            className="p-1.5 sm:p-2 bg-white/85 hover:bg-white rounded-full shadow-md text-[#700b10] transition-all duration-300 transform hover:scale-110 active:scale-95"
                        >
                            <Heart
                                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 transition-colors ${isInWishlist(p.id) ? "fill-[#700b10]" : ""
                                    }`}
                            />
                        </button>

                        {/* SHARE BUTTON */}
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsShareOpen(true);
                            }}
                            title="Share Product"
                            className="p-1.5 sm:p-2 bg-white/85 hover:bg-white rounded-full shadow-md text-gray-700 hover:text-[#700b10] transition-all duration-300 transform hover:scale-110 active:scale-95"
                        >
                            <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                        </button>
                    </div>

                </div>

                {/* DETAILS */}
                <div className="flex flex-col flex-1 p-2.5 sm:p-3 md:p-4 md:gap-1">
                    <p className="text-[8px] sm:text-[9px] md:text-[10px] text-gray-400 font-bold uppercase tracking-[0.1em] mb-0.5 sm:mb-1">NILKANTH STORE</p>

                    {/* Title - Multi-segment Support */}
                    <div className="min-h-[2.2rem] sm:min-h-[2.5rem] flex flex-col justify-center">
                        <Link href={`/products/${p.handle}`}>
                            <h2 className="text-xs sm:text-xs md:text-sm font-bold text-gray-900 hover:text-[#700b10] line-clamp-2 transition-colors leading-tight">
                                {p.title}
                            </h2>
                        </Link>

                        {/* Review Stars */}
                        {(() => {
                            let avg = 0;
                            let total = 0;

                            if (p.avg_rating && p.total_reviews) {
                                avg = parseFloat(p.avg_rating);
                                total = parseInt(p.total_reviews);
                            } else if (p.reviews?.value) {
                                try {
                                    const reviews = JSON.parse(p.reviews.value);
                                    if (reviews && reviews.length > 0) {
                                        avg = reviews.reduce((acc, r) => acc + Number(r.rating || 0), 0) / reviews.length;
                                        total = reviews.length;
                                    }
                                } catch (e) {
                                    console.error("Error parsing reviews:", e);
                                }
                            }

                            if (total > 0) {
                                return (
                                    <div className="mt-1">
                                        <ProductRating averageRating={avg} totalReviews={total} />
                                    </div>
                                );
                            }
                            return null;
                        })()}
                    </div>

                    {/* Price */}
                    <div className="flex flex-col mt-1.5 sm:mt-2 mb-2 sm:mb-3">
                        <div className="flex flex-wrap items-baseline gap-x-1.5 sm:gap-x-2 gap-y-0.5">
                            <span className="text-[#700b10] text-base sm:text-lg font-black leading-none">
                                ₹{price.toLocaleString("en-IN", { minimumFractionDigits: 0 })}
                            </span>
                            {compareAtPrice > price && (
                                <span className="text-gray-400 line-through text-[11px] sm:text-xs decoration-gray-300">
                                    ₹{compareAtPrice.toLocaleString("en-IN", { minimumFractionDigits: 0 })}
                                </span>
                            )}
                        </div>
                        {compareAtPrice > price && (
                            <div className="mt-1">
                                <span className="bg-green-100 text-green-700 text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded-full inline-block">
                                    {discount}% OFF
                                </span>
                            </div>
                        )}
                        {allVariants.length > 0 && !(allVariants.length === 1 && (allVariants[0]?.title?.toLowerCase() === 'default title' || allVariants[0]?.title?.toLowerCase() === 'default' || !allVariants[0]?.title?.trim())) && (
                            <span className="text-[9px] sm:text-[10px] text-gray-500 font-medium italic mt-0.5 sm:mt-1 truncate">Weight :&nbsp;
                                {activeVariant?.title || allVariants[0]?.title}
                            </span>
                        )}
                    </div>

                    <div className="mt-auto">
                        <AddToCart product={p} variant={activeVariant} isOutOfStock={isOutOfStock} price={price} />
                    </div>
                </div>
            </div>

            {/* SHARE MODAL */}
            <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} product={p} />
        </>
    );
}



// "use client";

// import React, { useRef } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Autoplay } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import ProductCard from "./ProductCard";
// import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

// export default function ProductList({ products }) {
//     const prevRef = useRef(null);
//     const nextRef = useRef(null);

//     if (!products || products.length === 0) {
//         return (
//             <div className="flex flex-col items-center justify-center p-20 text-center">
//                 <h2 className="text-2xl font-bold text-gray-800">No products found</h2>
//                 <p className="text-gray-500 mt-2">Please check your Shopify configuration or add some products to your store.</p>
//             </div>
//         );
//     }

//     return (
//         <section className="w-full bg-white py-4 md:py-8 px-0 relative overflow-hidden">
//             <div className="max-w-[95rem] mx-auto px-4 md:px-8 lg:px-12">
//                 {/* Header Section */}
//                 <div className="text-center mb-2 md:mb-8">
//                     <h2 className="font-nunito text-2xl md:text-5xl font-bold text-[#700b10] mb-2 md:mb-4">
//                         Top Month Sellers
//                     </h2>
//                     <p className="text-gray-500 max-w-2xl mx-auto text-[8px] md:text-sm font-jost uppercase tracking-widest ">
//                         Each fragrance is carefully chosen to elevate the divine ambiance of your surroundings
//                     </p>
//                 </div>

//                 <div className="relative group">
//                     {/* CUSTOM NAVIGATION BUTTONS */}
//                     <button
//                         ref={prevRef}
//                         className="absolute left-[-10px] md:left-[-50px] top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-xl border border-yellow-100/50 flex items-center justify-center text-[#700b10] hover:bg-[#700b10] hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 disabled:opacity-0"
//                     >
//                         <FiChevronLeft size={24} />
//                     </button>
//                     <button
//                         ref={nextRef}
//                         className="absolute right-[-10px] md:right-[-50px] top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-xl border border-yellow-100/50 flex items-center justify-center text-[#700b10] hover:bg-[#700b10] hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 disabled:opacity-0"
//                     >
//                         <FiChevronRight size={24} />
//                     </button>

//                     <Swiper
//                         modules={[Navigation, Autoplay]}
//                         onInit={(swiper) => {
//                             swiper.params.navigation.prevEl = prevRef.current;
//                             swiper.params.navigation.nextEl = nextRef.current;
//                             swiper.navigation.init();
//                             swiper.navigation.update();
//                         }}
//                         spaceBetween={10}
//                         slidesPerView={2}
//                         loop={products.length > 4}
//                         autoplay={{
//                             delay: 4500,
//                             disableOnInteraction: false,
//                         }}
//                         breakpoints={{
//                             480: {
//                                 slidesPerView: 2.2,
//                                 spaceBetween: 12
//                             },
//                             640: {
//                                 slidesPerView: 2.8,
//                                 spaceBetween: 16
//                             },
//                             768: {
//                                 slidesPerView: 3,
//                                 spaceBetween: 20
//                             },
//                             1024: {
//                                 slidesPerView: 4,
//                                 spaceBetween: 24
//                             },
//                             1280: {
//                                 slidesPerView: 4.5,
//                                 spaceBetween: 24
//                             }
//                         }}
//                         className="product-list-swiper md:!py-8 !px-1"
//                     >
//                         {products.map((item) => {
//                             const product = item?.node || item;
//                             return (
//                                 <SwiperSlide key={product.id}>
//                                     <div className="h-full">
//                                         <ProductCard product={product} />
//                                     </div>
//                                 </SwiperSlide>
//                             );
//                         })}
//                     </Swiper>
//                 </div>
//             </div>

//             <style jsx global>{`
//                 .product-list-swiper .swiper-slide {
//                     display: flex;
//                     height: auto;
//                 }
//                 .font-jost {
//                     font-family: "Jost", sans-serif;
//                 }
//                 .font-nunito {
//                     font-family: "Nunito", sans-serif;
//                 }
//             `}</style>
//         </section>
//     );
// }
