"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight, ShoppingCart, Truck, Star, Heart, Share2 } from "lucide-react";
import Link from "next/link";
import { AddToCart } from "@/components/ProductActions";
import { useWishlist } from "@/context/WishlistContext";
import ShareModal from "./ShareModal";

export function ProductModal({ isOpen, onClose, product }) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [qty, setQty] = useState(1);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const p = product?.node || product;

  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
      setQty(1);
      // Pre-select first value for each option
      if (p?.options) {
        const defaults = {};
        p.options.forEach(opt => { defaults[opt.name] = opt.values[0]; });
        setSelectedOptions(defaults);
      }
    }
  }, [isOpen, p]);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen || !p) return null;

  const images = p.images?.edges?.map(e => e.node) || [];
  const totalImages = images.length;

  const price = parseFloat(p.priceRange?.minVariantPrice?.amount || 0);
  const compareAtPrice = parseFloat(p.compareAtPriceRange?.minVariantPrice?.amount || 0);
  const discount = compareAtPrice > price ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100) : 0;

  const variants = p.variants?.edges?.map(e => e.node) || [];
  // Determine selected variant's price based on selected options
  const matchedVariant = variants.find(v =>
    v.selectedOptions?.every(so => selectedOptions[so.name] === so.value)
  ) || variants[0];





  const variantPrice = matchedVariant?.price?.amount ? parseFloat(matchedVariant.price.amount) : price;
  const variantCompareAtPrice = matchedVariant?.compareAtPrice?.amount ? parseFloat(matchedVariant.compareAtPrice.amount) : compareAtPrice;


  if (!mounted || !isOpen || !p) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-100 transition-all hover:rotate-90 duration-300"
        >
          <X size={18} className="text-gray-700" />
        </button>

        {/* LEFT - Image Gallery */}
        <div className="relative w-full md:w-1/2 bg-[#F9F5EF] flex-shrink-0 aspect-square md:aspect-auto md:h-auto overflow-hidden">
          {images.length > 0 ? (
            <>
              <img
                src={images[currentImageIndex]?.url}
                alt={images[currentImageIndex]?.altText || p.title}
                className="w-full h-full object-cover transition-all duration-500"
              />
              {totalImages > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex(i => (i - 1 + totalImages) % totalImages)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white shadow rounded-full flex items-center justify-center transition"
                  >
                    <ChevronLeft size={18} className="text-black" />
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex(i => (i + 1) % totalImages)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white shadow rounded-full flex items-center justify-center transition"
                  >
                    <ChevronRight size={18} className="text-black" />
                  </button>
                  {/* Dots */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentImageIndex(i)}
                        className={`w-2 h-2 rounded-full transition-all ${i === currentImageIndex ? "bg-[#700b10] w-5" : "bg-white/70"}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
          )}

          {discount > 0 && (
            <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-md">
              -{discount}%
            </span>
          )}
        </div>

        {/* RIGHT - Details */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-4">

          {/* Title - Multi-segment Support */}
          <div className="space-y-1">
            <h2 className="text-2xl md:text-3xl font-nunito font-bold text-gray-900 leading-tight">
              {p.title}
            </h2>
          </div>

          {/* Rating */}
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
                <div className="flex items-center gap-3">
                  <div className="flex gap-0.5 text-[#700b10]">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star 
                        key={s} 
                        size={16} 
                        fill={avg >= s ? "currentColor" : "none"} 
                        className={avg >= s ? "" : avg >= s - 0.5 ? "opacity-50" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                    {avg.toFixed(1)} ({total} Reviews)
                  </span>
                </div>
              );
            }
            return null;
          })()}

          {/* Price */}
          <div className="flex items-center gap-4 py-1">
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black text-[#700b10]">
                  ₹{variantPrice.toLocaleString("en-IN", { minimumFractionDigits: 0 })}
                </span>
                {variantCompareAtPrice > variantPrice && (
                  <span className="text-lg text-gray-400 line-through decoration-gray-300">
                    ₹{variantCompareAtPrice.toLocaleString("en-IN", { minimumFractionDigits: 0 })}
                  </span>
                )}
              </div>
              {discount > 0 && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter">
                    Save {discount}%
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                    Special Offer
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {p.description && (
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{p.description}</p>
          )}

          {/* Variants / Options */}
          {p.options?.filter(o => o.name !== "Title" && o.values.length > 0 && !(o.values.length === 1 && o.values[0] === "Default Title")).map(option => (
            <div key={option.name}>
              <p className="text-sm font-semibold text-gray-800 mb-2">
                {option.name}: <span className="font-normal text-gray-600">{selectedOptions[option.name]}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {option.values.map(val => (
                  <button
                    key={val}
                    onClick={() => setSelectedOptions(prev => ({ ...prev, [option.name]: val }))}
                    className={`px-4 py-1.5 border rounded-lg text-sm font-medium transition-all ${selectedOptions[option.name] === val
                      ? "border-[#700b10] bg-[#700b10]/5 text-[#700b10] font-bold"
                      : "border-gray-200 text-gray-700 hover:border-gray-400"
                      }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Qty + Add to Cart */}
          <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
            <button
              onClick={() => setQty(q => Math.max(1, q - 1))}
              className="w-10 h-10 flex items-center justify-center text-lg text-gray-700 hover:bg-gray-100 transition"
            >
              −
            </button>
            <span className="w-10 text-center font-bold text-sm text-black">{qty}</span>
            <button
              onClick={() => setQty(q => q + 1)}
              className="w-10 h-10 flex items-center justify-center text-lg text-gray-700 hover:bg-gray-100 transition"
            >
              +
            </button>
          </div>

          {/* Add to Cart Button */}
          <div className="flex-1">
            <AddToCart product={p} variant={matchedVariant} qty={qty} />
          </div>


          {/* Free Shipping Banner */}
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm">
            <Truck size={18} className="text-[#700b10] flex-shrink-0" />
            <span className="text-gray-600">
              Spend <strong>₹999</strong> more for <span className="text-[#700b10] font-semibold">Free Shipping</span>
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-2">
            <Link
              href={`/products/${p.handle || p.id}`}
              onClick={onClose}
              className="flex-1 text-center border-2 border-[#700b10] text-[#700b10] font-bold py-3 rounded-full hover:bg-[#700b10] hover:text-white transition-all duration-300"
            >
              VIEW FULL DETAILS
            </Link>
            <button
              onClick={() => toggleWishlist(p, matchedVariant?.id)}
              className="px-5 border-2 border-gray-200 rounded-full hover:bg-gray-50 transition-colors transform active:scale-95 flex items-center justify-center"
              title="Add to Wishlist"
            >
              <Heart className={`w-5 h-5 ${isInWishlist(p.id) ? "fill-[#700b10] text-[#700b10]" : "text-gray-400"}`} />
            </button>
            <button
              onClick={() => setIsShareOpen(true)}
              className="px-5 border-2 border-gray-200 rounded-full hover:bg-gray-50 transition-colors transform active:scale-95 text-gray-700 hover:text-[#700b10] flex items-center justify-center"
              title="Share Product"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        product={p}
      />
    </div>,
    document.body
  );
}