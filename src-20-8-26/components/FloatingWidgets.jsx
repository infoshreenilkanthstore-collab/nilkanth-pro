"use client";

import React, { useState, useEffect } from "react";
import { ShoppingBag, MoveUp, Heart } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { useWishlist } from "../context/WishlistContext";
import { useCartSidebar } from "../context/CartSidebarContext";

export default function FloatingWidgets() {
    const { openWishlist, wishlist } = useWishlist();
    const { openCart } = useCartSidebar();
    const pathname = usePathname();
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isProductPageScrolled, setIsProductPageScrolled] = useState(false);

    // Handle scroll for Back to Top visibility and progress
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            setScrollProgress(progress);
            setShowBackToTop(scrollTop > 400);

            // Check if we are on a product page and scrolled past 800px
            const isProductPage = pathname?.startsWith('/products/');
            if (isProductPage && scrollTop > 800) {
                setIsProductPageScrolled(true);
            } else {
                setIsProductPageScrolled(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [pathname]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };



    return (
        <div className={`fixed ${isProductPageScrolled ? 'bottom-36 md:bottom-20' : 'bottom-20 md:bottom-6'} right-3 md:right-6 z-[60] flex flex-col gap-2.5 sm:gap-3 transition-all duration-500 ease-in-out`}>

            {/* Back to Top with Scroll Progress Ring */}
            <div
                className={`relative md:w-12 md:h-12 w-10 h-10 flex items-center justify-center transition-all duration-300 ${showBackToTop ? "opacity-100 scale-100" : "opacity-0 scale-50 pointer-events-none"}`}
            >
                {/* SVG Progress Ring */}
                <svg
                    className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
                    viewBox="0 0 56 56"
                >
                    {/* Track circle */}
                    <circle
                        cx="28"
                        cy="28"
                        r="25"
                        fill="none"
                        stroke="#bdbdbdff"
                        strokeWidth="3"
                    />
                    {/* Progress circle */}
                    <circle
                        cx="28"
                        cy="28"
                        r="25"
                        fill="none"
                        stroke="#A07F3F"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 25}`}
                        strokeDashoffset={`${2 * Math.PI * 25 * (1 - scrollProgress / 100)}`}
                        style={{ transition: "stroke-dashoffset 0.2s linear" }}
                    />
                </svg>

                {/* Button */}
                <button
                    onClick={scrollToTop}
                    className="w-9 h-9 md:w-11 md:h-11 bg-white text-[#A07F3F] rounded-full shadow-lg flex items-center justify-center hover:bg-[#A07F3F] hover:text-white transition-all duration-300"
                    aria-label="Back to top"
                >
                    <MoveUp className="h-5 w-5 md:h-6 md:w-6" />
                </button>
            </div>

            {/* Wishlist Widget */}
            <button
                onClick={openWishlist}
                className="hidden md:flex w-10 h-10 md:w-12 md:h-12 bg-white text-[#700b10] rounded-full shadow-xl items-center justify-center hover:bg-red-50 hover:-translate-y-1 transition-all duration-300 relative group"
                aria-label="Open wishlist"
            >
                <Heart className={`h-5 w-5 md:h-6 md:w-6 ${wishlist.length > 0 ? 'fill-[#700b10]' : ''}`} />
                {wishlist.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#700b10] text-white text-[10px] font-bold w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center">
                        {wishlist.length}
                    </span>
                )}
            </button>

            {/* Cart Widget */}
            <button
                onClick={() => { openCart(); }}
                className="hidden md:flex w-10 h-10 md:w-12 md:h-12 bg-[#700b10] text-white rounded-full shadow-xl shadow-[#700b10]/20 items-center justify-center hover:bg-[#5a090d] hover:-translate-y-1 transition-all duration-300 relative group"
                aria-label="Open cart"
            >
                <ShoppingBag className="h-5 w-5 md:h-6 md:w-6" />
            </button>


            {/* WhatsApp Widget */}
            <a
                href="https://wa.me/918980978118" // Replace with actual number if needed
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 md:w-12 md:h-12 bg-[#25D366] text-white rounded-full shadow-xl shadow-[#25D366]/20 flex items-center justify-center hover:bg-[#128C7E] hover:-translate-y-1 transition-all duration-300"
                aria-label="Contact on WhatsApp"
            >
                <FaWhatsapp className="h-5 w-5 md:h-6 md:w-6" />
            </a>
        </div>
    );
}
