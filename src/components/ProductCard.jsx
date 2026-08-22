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

                        <h2 className="text-xs sm:text-xs md:text-sm font-bold text-gray-900 hover:text-[#700b10] line-clamp-2 transition-colors leading-tight">
                            {p.title}
                        </h2>

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
