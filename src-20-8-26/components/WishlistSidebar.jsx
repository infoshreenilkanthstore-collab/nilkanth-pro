"use client";
import React, { useEffect, useState } from "react";
import { X, Heart, Trash2, ShoppingBag, Loader2 } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCartSidebar } from "../context/CartSidebarContext";
import Link from "next/link";

export default function WishlistSidebar() {
    const { isOpen, closeWishlist, wishlist, isLoading, removeFromWishlist } = useWishlist();
    const { addToCart } = useCartSidebar();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-500 ${
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
                onClick={closeWishlist}
            />

            {/* Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-[450px] bg-white/95 backdrop-blur-md shadow-2xl z-[101] transform transition-transform duration-500 ease-out border-l border-white/20 ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-white/50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#700b10]/10 rounded-xl">
                                <Heart className="w-5 h-5 text-[#700b10] fill-[#700b10]" />
                            </div>
                            <div>
                                <h2 className="text-lg sm:text-xl font-nunito font-bold text-gray-900">Your Wishlist</h2>
                                <p className="text-xs text-gray-500 font-medium">{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved</p>
                            </div>
                        </div>
                        <button
                            onClick={closeWishlist}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-900"
                        >
                            <X className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 space-y-3.5 sm:space-y-6">
                        {isLoading ? (
                            <div className="h-full flex flex-col items-center justify-center gap-4">
                                <Loader2 className="w-8 h-8 text-[#700b10] animate-spin" />
                                <p className="text-gray-500 font-medium">Updating wishlist...</p>
                            </div>
                        ) : wishlist.length > 0 ? (
                            wishlist.map((item) => (
                                <div
                                    key={item.id}
                                    className="group relative flex items-center gap-3.5 sm:gap-5 bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-[2rem] border border-gray-100 hover:border-[#700b10]/20 hover:shadow-2xl hover:shadow-[#700b10]/10 transition-all duration-500"
                                >
                                    {/* Product Image */}
                                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl bg-[#FDFBF7] overflow-hidden flex-shrink-0 border border-gray-50">
                                        <img
                                            src={item.product_image || item.image || item.product_img || "/placeholder.png"}
                                            alt={item.product_name || item.title}
                                            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
                                        />
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-1 flex flex-col gap-2">
                                        <div>
                                            <Link 
                                                href={`/products/${item.product_handle || item.handle || item.product_id}`}
                                                onClick={closeWishlist}
                                                className="text-[15px] font-bold text-gray-900 line-clamp-2 hover:text-[#700b10] transition-colors leading-tight mb-1"
                                            >
                                                {item.product_name || item.product_title || item.title || "Product"}
                                            </Link>
                                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                                                {item.variant_name || item.variant_title || "Standard"}
                                            </p>
                                        </div>
                                        
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="text-lg font-black text-[#700b10]">
                                                ₹{parseFloat(item.price || item.product_price || item.base_price || 0).toLocaleString("en-IN", { minimumFractionDigits: 0 })}
                                            </span>
                                            
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => {
                                                        addToCart({
                                                            id: item.product_id || item.id,
                                                            title: item.product_title || item.product_name || item.title || "Product",
                                                            price: item.price || item.product_price || 0,
                                                            image: item.product_image || item.image || null,
                                                            selectedVariant: {
                                                                id: item.variant_id || item.variant_ids?.[0] || item.product_id || item.id,
                                                                title: item.variant_name || item.variant_title || "Default",
                                                                price: { amount: item.price || item.product_price || 0 },
                                                                image: { url: item.product_image || item.image || null }
                                                            }
                                                        }, 1);
                                                        closeWishlist();
                                                    }}
                                                    className="w-10 h-10 flex items-center justify-center bg-[#700b10] text-white rounded-full hover:bg-red-800 transition-all shadow-lg shadow-[#700b10]/20 active:scale-90"
                                                    title="Add to Cart"
                                                >
                                                    <ShoppingBag className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => removeFromWishlist(item.id || item.wishlist_id || item.wishlist_item_id || item.item_id || item.record_id)}
                                                    className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                                    title="Remove"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))

                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center px-6">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                    <Heart className="w-10 h-10 text-gray-200" />
                                </div>
                                <h3 className="text-xl font-nunito font-bold text-gray-900 mb-2">Wishlist is empty</h3>
                                <p className="text-gray-500 text-sm mb-8">Save items you love to your wishlist and they'll appear here.</p>
                                <button
                                    onClick={closeWishlist}
                                    className="w-full py-4 bg-[#700b10] text-white rounded-2xl font-bold hover:bg-red-800 transition-all shadow-lg shadow-[#700b10]/20 active:scale-[0.98]"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {wishlist.length > 0 && (
                        <div className="p-8 border-t border-gray-100 bg-gray-50/50">
                            <button
                                onClick={closeWishlist}
                                className="w-full py-5 bg-white border-2 border-gray-100 text-gray-900 rounded-[2rem] font-bold text-sm tracking-widest uppercase hover:bg-gray-100 hover:border-gray-200 transition-all active:scale-[0.98] shadow-sm"
                            >
                                Back to Shopping
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
