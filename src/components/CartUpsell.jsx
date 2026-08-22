import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { Star } from "lucide-react";
import { useCartSidebar } from "../context/CartSidebarContext";

export default function CartUpsell({ isMobile = false }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCartSidebar();

    useEffect(() => {
        async function fetchUpsellProducts() {
            try {
                const response = await fetch("/api/products");
                const data = await response.json();
                if (data.success && data.products) {
                    setProducts(data.products.slice(0, 5));
                }
            } catch (error) {
                console.error("Failed to fetch upsell products:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchUpsellProducts();
    }, []);

    if (loading) return (
        <div className="space-y-4 p-4">
            {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse flex gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-3 bg-gray-100 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                    </div>
                </div>
            ))}
        </div>
    );

    if (products.length === 0) return null;

    return (
        <div className={`flex flex-col ${isMobile ? 'sticky bottom-0 bg-white z-10 p-4 border-t border-gray-100 mt-auto' : 'h-full p-6'}`}>
            <h3 className="text-[13px] font-black text-[#7c442c] uppercase tracking-[0.1em] md:mb-4">You May Also Like</h3>
            
            {isMobile ? (
                <div className="-mx-4 px-4 overflow-hidden slider-container">
                    <Swiper
                        modules={[Autoplay]}
                        spaceBetween={0}
                        slidesPerView={1}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        loop={true}
                    >
                        {products.map((product) => {
                            const minPriceAmt = product.priceRange?.minVariantPrice?.amount;
                            const price = parseFloat(minPriceAmt || product.price || 0);
                            const compareAtPrice = parseFloat(product.compareAtPriceRange?.minVariantPrice?.amount || 0);
                            const image = product.images?.edges?.[0]?.node?.url || product.image || "/placeholder.png";

                            // Identify the variant that matches the minimum price shown
                            const matchingVariant = product.variants?.edges?.find(edge =>
                                edge.node.price?.amount === minPriceAmt ||
                                parseFloat(edge.node.price?.amount) === parseFloat(minPriceAmt)
                            ) || product.variants?.edges?.[0];

                            return (
                                <SwiperSlide key={product.id}>
                                    <div className="px-2">
                                        <div className="flex flex-row gap-3 bg-white border border-gray-100 rounded-xl p-2.5 hover:shadow-md transition-all group scale-[0.98] hover:scale-[1]">
                                            <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                                                <img src={image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            </div>
                                            <div className="flex-1 min-w-0 flex flex-col">
                                                <h4 className="text-[11px] font-bold text-gray-900 line-clamp-2 uppercase leading-tight mb-1">
                                                    {product.title}
                                                </h4>
                                                <div className="flex items-center gap-1 mb-1">
                                                    <div className="flex text-yellow-400">
                                                        {[...Array(5)].map((_, i) => <Star key={i} size={8} fill={i < 4 ? "currentColor" : "none"} />)}
                                                    </div>
                                                    <span className="text-[8px] font-medium text-gray-400">4.6 (5)</span>
                                                </div>
                                                <div className="flex items-center justify-between mt-auto">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[11px] font-black text-[#700b10]">₹{price.toFixed(0)}</span>
                                                        {compareAtPrice > price && (
                                                            <span className="text-[9px] text-gray-400 line-through">₹{compareAtPrice.toFixed(0)}</span>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => addToCart({ ...product, selectedVariant: matchingVariant?.node })}
                                                        className="bg-[#7c442c] text-white px-3 py-1 rounded-md text-[9px] font-black hover:bg-[#5e3421] transition-colors uppercase tracking-wider"
                                                    >
                                                        Add
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </div>
            ) : (
                <div className="flex-col space-y-3 overflow-y-auto pr-2 custom-scrollbar flex">
                    {products.map((product) => {
                        const minPriceAmt = product.priceRange?.minVariantPrice?.amount;
                        const price = parseFloat(minPriceAmt || product.price || 0);
                        const compareAtPrice = parseFloat(product.compareAtPriceRange?.minVariantPrice?.amount || 0);
                        const image = product.images?.edges?.[0]?.node?.url || product.image || "/placeholder.png";

                        // Identify the variant that matches the minimum price shown
                        const matchingVariant = product.variants?.edges?.find(edge =>
                            edge.node.price?.amount === minPriceAmt ||
                            parseFloat(edge.node.price?.amount) === parseFloat(minPriceAmt)
                        ) || product.variants?.edges?.[0];

                        return (
                            <div key={product.id} className="flex flex-row gap-3 bg-white border border-gray-100 rounded-xl p-2.5 hover:shadow-md transition-all group scale-[0.98] hover:scale-[1]">
                                <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                                    <img src={image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col">
                                    <h4 className="text-[11px] font-bold text-gray-900 line-clamp-2 uppercase leading-tight mb-1">
                                        {product.title}
                                    </h4>
                                    <div className="flex items-center gap-1 mb-1">
                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => <Star key={i} size={8} fill={i < 4 ? "currentColor" : "none"} />)}
                                        </div>
                                        <span className="text-[8px] font-medium text-gray-400">4.6 (5)</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[11px] font-black text-[#700b10]">₹{price.toFixed(0)}</span>
                                            {compareAtPrice > price && (
                                                <span className="text-[9px] text-gray-400 line-through">₹{compareAtPrice.toFixed(0)}</span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => addToCart({ ...product, selectedVariant: matchingVariant?.node })}
                                            className="bg-[#7c442c] text-white px-3 py-1 rounded-md text-[9px] font-black hover:bg-[#5e3421] transition-colors uppercase tracking-wider"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
