"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { User, ShoppingCart, Heart, Search, Menu, X, Volume2, VolumeX, ArrowUpRight, Home } from "lucide-react";
import { useRef } from "react";
import LoginPopup from "./LoginPopup";
import SearchDrawer from "@/components/SearchDrawer";
import { useWishlist } from "@/context/WishlistContext";
import { useCartSidebar } from "@/context/CartSidebarContext";

export default function Header() {
    const { wishlist, openWishlist, openLogin } = useWishlist();
    const { openCart, cart } = useCartSidebar();
    const [headerCollections, setHeaderCollections] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        const customerId = localStorage.getItem("ns_customerId");
        setIsLoggedIn(!!customerId);
    }, []);

    useEffect(() => {
        audioRef.current = new Audio("https://cdn.shopify.com/s/files/1/0821/4767/2314/files/Bhagvat_prasadam_mastered_1_1.wav?v=1773212555");
        audioRef.current.loop = true;

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const toggleSound = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(err => console.error("Audio playback failed:", err));
        }
        setIsPlaying(!isPlaying);
    };

    const handleopencart = () => {
        openCart();
    }

    useEffect(() => {
        async function fetchHeaderCollections() {
            try {
                const res = await fetch("/api/collections");
                const data = await res.json();

                if (data.success) {
                    const headerColls = data.collections.filter(c => {
                        const val = c.whereToShow?.value;
                        if (!val) return false;
                        try {
                            const parsed = JSON.parse(val);
                            return Array.isArray(parsed) ? parsed.some(v => v.toLowerCase() === 'header') : false;
                        } catch (e) {
                            return val.toLowerCase() === 'header';
                        }
                    }).slice(0, 4);

                    const collsWithProducts = await Promise.all(headerColls.map(async (col) => {
                        const prodRes = await fetch(`/api/collections/${col.handle}`);
                        const prodData = await prodRes.json();
                        return {
                            ...col,
                            products: prodData.success ? prodData.products.slice(0, 4) : []
                        };
                    }));

                    // Only set collections that actually have products in them
                    setHeaderCollections(collsWithProducts.filter(c => c.products && c.products.length > 0));
                }
            } catch (error) {
                console.error("Error fetching header collections", error);
            }
        }
        fetchHeaderCollections();
    }, []);

    const megamenuData = [
        {
            title: "Pital & Copper",
            handle: "pital-copper",
            items: [
                { title: "Agarbatti Stand", handle: "agarbathi-stand" },
                { title: "Mor Deep", handle: "mor-deep" },
                { title: "Copper Lota", handle: "copper-lota" },
                { title: "Pital Lota", handle: "pital-lota" },
                { title: "Silver Kalash", handle: "silver-kalash" },
                { title: "Ghantdi", handle: "ghantadi" },
                { title: "Latkan", handle: "latkan" },
            ]
        },
        {
            title: "Pooja Samgri",
            handle: "pooja-samgri",
            items: [
                { title: "Kanthi Mala", handle: "kanthi" },
                { title: "Chandan Powder", handle: "chandan-powder" },
                { title: "Murti", handle: "murti" },
                { title: "Toran", handle: "toran" },
            ]
        },
        {
            title: "Perfume & Aroma Items",
            handle: "perfume-aroma-items",
            items: [
                { title: "Attar", handle: "attar" },
                { title: "Perfume", handle: "perfume" },
                { title: "Air Freshener", handle: "air-freshner" },
            ]
        },
        {
            title: "Agarbatti & Dhoop",
            handle: "agarbatti-dhoop",
            items: [
                { title: "Agarbatti", handle: "agarbatti" },
                { title: "Dhoop", handle: "dhoop" },
            ]
        },
        {
            title: "Aushadhi & Cosmetic Products",
            handle: "aushadhi-cosmetic-products",
            items: [
                { title: "Aushadhi", handle: "aushadhi" },
                { title: "Face Products", handle: "face-products" },
                { title: "Hair Products", handle: "hair-products" },
            ]
        },
        {
            title: "Gift Items",
            handle: "gift-items",
            items: [
                { title: "Car Stand", handle: "car-stand" },
                { title: "Gift Items", handle: "gift-item" },
                { title: "Hindola", handle: "hindola" },
            ]
        }
    ];

    const navLinks = {
        left: [
            { label: "Home", href: "/" },
            { label: "Shop", href: "/products" },
            { label: "Our Collections", href: "/collections" },
        ],
        right: [
            { label: "About Us", href: "/about" },
            { label: "Contact Us", href: "/contact" }
        ]
    };

    // State for mobile menu
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [isMegamenuExpanded, setIsMegamenuExpanded] = useState(false);

    useEffect(() => {
        if (!isMobileMenuOpen) {
            setExpandedCategory(null);
            setIsMegamenuExpanded(false);
        }
    }, [isMobileMenuOpen]);

    const toggleCategory = (handle) => {
        setExpandedCategory(expandedCategory === handle ? null : handle);
    };

    const NavItem = ({ item, align = "left" }) => (
        <div className="relative group py-4">
            <Link
                href={item.href}
                className="font-nunito relative text-sm lg:text-base font-bold transition-colors group-hover:text-red-700 py-2 inline-block whitespace-nowrap"
            >
                {item.label}
                {item.isMegamenu && (
                    <span className="ml-1 inline-block transition-transform duration-300 group-hover:rotate-180">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                    </span>
                )}
            </Link>

            {item.isMegamenu && (
                <div className="absolute top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="bg-white rounded-[2rem] shadow-[0_30px_60px_rgba(112,11,16,0.15)] border border-yellow-100/50 p-10 w-[95vw] max-w-7xl backdrop-blur-md bg-white/98">
                        <div className="grid grid-cols-6 gap-8">
                            {megamenuData.map((category, idx) => (
                                <div key={idx} className="flex flex-col space-y-4">
                                    <Link
                                        href={`/collections/${category.handle}`}
                                        className="text-lg font-bold text-[#700b10] hover:text-red-700 transition-colors tracking-tight leading-tight block mb-2"
                                    >
                                        {category.title}
                                    </Link>
                                    <ul className="space-y-2.5">
                                        {category.items.map((subItem, sIdx) => (
                                            <li key={sIdx}>
                                                <Link
                                                    href={`/collections/${subItem.handle}`}
                                                    className="text-[14px] text-gray-600 hover:text-[#700b10] hover:pl-1 transition-all duration-200 font-medium block"
                                                >
                                                    {subItem.title}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 pt-6 border-t border-gray-100 flex justify-center">
                            <Link
                                href="/collections"
                                className="text-xs font-bold text-[#700b10] uppercase tracking-[0.2em] hover:opacity-70 transition-opacity flex items-center gap-2"
                            >
                                View All Collections
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {item.collection && item.collection.products?.length > 0 && !item.isMegamenu && (
                <div className={`absolute top-full ${align === 'left' ? 'left-0' : 'right-0'} pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50`}>
                    <div className="bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-yellow-100/50 p-6 flex gap-6 w-[max-content]">
                        {item.collection.products.map(prod => (
                            <Link key={prod.id} href={`/products/${prod.handle}`} className="flex flex-col flex-1 w-[140px] group/item">
                                <div className="aspect-square bg-[#FDFBF7] rounded-xl overflow-hidden mb-3 flex items-center justify-center p-2 border border-yellow-50/50">
                                    {prod.images?.edges?.[0]?.node?.url ? (
                                        <img src={prod.images.edges[0].node.url} alt={prod.title} className="w-full h-full object-contain mix-blend-multiply group-hover/item:scale-110 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                                    )}
                                </div>
                                <h4 className="text-sm font-bold text-gray-800 line-clamp-2 text-center group-hover/item:text-[#700b10] transition-colors">{prod.title}</h4>
                            </Link>
                        ))}

                        {/* See All Button */}
                        <div className="flex items-center justify-center pl-4 border-l border-gray-100 ml-2">
                            <Link href={item.href} className="group/seeall flex flex-col items-center gap-2">
                                <span className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center group-hover/seeall:border-[#700b10] group-hover/seeall:bg-[#700b10] group-hover/seeall:text-white text-gray-400 transition-all duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                                </span>
                                <span className="text-xs font-bold text-gray-600 group-hover/seeall:text-[#700b10] transition-colors whitespace-nowrap">See All</span>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="fixed top-0 inset-x-0 z-50 pointer-events-none">
            {/* Announcement Marquee */}
            <div className="bg-[#700b10] text-white py-1.5 overflow-hidden flex items-center shadow-md">
                <style>{`
                    @keyframes marquee-scroll {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                    .animate-marquee-scroll {
                        display: flex;
                        width: max-content;
                        animation: marquee-scroll 55s linear infinite;
                    }
                    .animate-marquee-scroll:hover {
                        animation-play-state: paused;
                    }
                `}</style>
                <div className="animate-marquee-scroll pointer-events-auto">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <span key={i} className="font-nunito md:mx-26 mx-16 text-[11px] sm:text-xs md:text-sm font-bold tracking-widest whitespace-nowrap">
                            Free Shipping On Orders Above ₹999 🚚✨
                        </span>
                    ))}
                </div>
            </div>

            <div className="px-2 lg:px-4">
                <header className="mt-0 pointer-events-auto max-w-[90rem] mx-auto bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[4rem] transition-all duration-500 border border-yellow-100/50 relative z-50">
                    <div className="px-4 sm:px-6 lg:px-12 h-16 lg:h-14 flex items-center justify-between relative text-[#700b10] bg-white rounded-[4rem]">

                        {/* Mobile Menu Toggle Button */}
                        <div className="md:hidden flex items-center flex-1 justify-start z-50">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
                                aria-label="Toggle Menu"
                            >
                                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>

                        {/* Desktop Left Nav */}
                        <nav className="hidden md:flex flex-1 items-center gap-4 lg:gap-8 justify-start">
                            {navLinks.left.map((item) => (
                                <NavItem key={item.label} item={item} align="left" />
                            ))}
                        </nav>

                        {/* Center Logo Area */}
                        <Link href="/" className="absolute left-1/2 md:top-[20%] top-[10%] -translate-x-1/2 -translate-y-1/3 flex flex-col items-center justify-center z-50 group mt-4">
                            <div className="relative w-24 h-24 sm:w-24 sm:h-24 lg:w-30 lg:h-30 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
                                <img
                                    src="https://megaecomm.megascale.co.in/backend/media/16/general/c2bf167e8984676b71498ccb3c299e14.png"
                                    alt="Nilkanth Store Logo"
                                    className="w-full h-full object-contain filter drop-shadow-md rounded-full p-1"
                                />
                            </div>
                        </Link>

                        {/* Desktop Right Nav & Icons */}
                        <div className="flex flex-1 items-center gap-3 lg:gap-6 justify-end">
                            <nav className="hidden md:flex items-center gap-4 lg:gap-8">
                                {navLinks.right.map((item) => (
                                    <NavItem key={item.label} item={item} align="right" />
                                ))}
                            </nav>

                            <div className="flex items-center gap-2 sm:gap-3">
                                {/* <button
                                    onClick={toggleSound}
                                    className={`p-1.5 sm:p-2 bg-white shadow-sm border border-gray-100 rounded-full transition-all transform hover:scale-105 ${isPlaying ? 'text-red-600 animate-pulse' : 'text-gray-400'}`}
                                    aria-label={isPlaying ? "Mute Sound" : "Play Sound"}
                                >
                                    {isPlaying ? <Volume2 className="w-4 h-4 md:w-4 md:h-4 lg:w-5 lg:h-5 cursor-pointer" /> : <VolumeX className="w-4 h-4 md:w-4 md:h-4 lg:w-5 lg:h-5 cursor-pointer" />}
                                </button> */}

                                <button
                                    onClick={() => setIsSearchOpen(true)}
                                    className="p-1.5 sm:p-2 bg-white shadow-sm border border-gray-100 rounded-full hover:bg-gray-50 transition-colors transform hover:scale-105" aria-label="Search"
                                >
                                    <Search className="w-4 h-4 md:w-4 md:h-4 lg:w-5 lg:h-5 cursor-pointer text-[#700b10]" />
                                </button>

                                <button
                                    onClick={() => {
                                        const token = typeof window !== "undefined" ? localStorage.getItem("ns_accessToken") : null;
                                        if (!token) {
                                            openLogin();
                                        } else {
                                            openWishlist();
                                        }
                                    }}
                                    className="relative p-1.5 sm:p-2 bg-white shadow-sm border border-gray-100 rounded-full hover:bg-gray-50 transition-colors transform hover:scale-105"
                                    aria-label="Wishlist"
                                >
                                    <Heart className={`w-4 h-4 md:w-4 md:h-4 lg:w-5 lg:h-5 cursor-pointer text-[#700b10] ${wishlist.length > 0 ? 'fill-[#700b10]' : ''}`} />
                                    {wishlist.length > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-[#700b10] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                                            {wishlist.length}
                                        </span>
                                    )}
                                </button>

                                <button
                                    onClick={handleopencart}
                                    className="relative hidden sm:block p-1.5 sm:p-2 bg-white shadow-sm border border-gray-100 rounded-full hover:bg-gray-50 transition-colors transform hover:scale-105"
                                    aria-label="Cart"
                                >
                                    <ShoppingCart className="w-4 h-4 md:w-4 md:h-4 lg:w-5 lg:h-5 cursor-pointer text-[#700b10]" />
                                </button>


                                <button
                                    onClick={() => isLoggedIn ? window.location.href = "/profile" : openLogin()}
                                    className="hidden sm:flex p-1.5 sm:p-2 bg-white shadow-sm border border-gray-100 rounded-full hover:bg-gray-50 transition-colors transform hover:scale-105"
                                >
                                    <User className={`w-4 h-4 md:w-4 md:h-4 lg:w-5 lg:h-5 text-[#700b10]`} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <SearchDrawer isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

                    {/* Mobile Menu Dropdown */}
                    <div
                        className={`md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md rounded-b-[2rem] shadow-lg border border-yellow-100/50 transition-all duration-300 overflow-y-auto max-h-[calc(100vh-120px)] z-40 ${isMobileMenuOpen ? "opacity-100 py-4 pb-8" : "max-h-0 opacity-0 py-0 pointer-events-none"
                            }`}
                    >
                        <nav className="flex flex-col items-center md:gap-4 text-[#700b10]">
                            {[...navLinks.left, ...navLinks.right].map((item) => (
                                <React.Fragment key={item.label}>
                                    <div className="w-full">
                                        <div className="flex items-center w-full">
                                            <Link
                                                href={item.href}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="font-nunito text-lg font-bold flex-1 text-center py-3 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 pl-10"
                                            >
                                                {item.label}
                                            </Link>
                                            {item.isMegamenu && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setIsMegamenuExpanded(!isMegamenuExpanded);
                                                    }}
                                                    className="p-3 pr-8 text-[#700b10] transition-transform duration-300"
                                                    style={{ transform: isMegamenuExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                                </button>
                                            )}
                                        </div>

                                        {item.isMegamenu && (
                                            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isMegamenuExpanded ? "max-h-[2000px] opacity-100 mb-4" : "max-h-0 opacity-0"}`}>
                                                <div className="w-full bg-white flex flex-col py-0 px-4">
                                                    <div className="bg-gray-50/50 rounded-3xl overflow-hidden border border-gray-100 mb-4">
                                                        {megamenuData.map((cat, cIdx) => (
                                                            <div key={cIdx} className="w-full border-b border-gray-100 last:border-0">
                                                                <button
                                                                    onClick={() => toggleCategory(cat.handle)}
                                                                    className="w-full px-6 py-4 flex items-center justify-between group transition-all duration-200"
                                                                >
                                                                    <div className="flex items-center gap-3">
                                                                        <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${expandedCategory === cat.handle ? 'bg-[#700b10] scale-125' : 'bg-gray-300'}`} />
                                                                        <span className={`font-bold text-[15px] tracking-tight transition-colors ${expandedCategory === cat.handle ? 'text-[#700b10]' : 'text-gray-700'}`}>
                                                                            {cat.title}
                                                                        </span>
                                                                    </div>
                                                                    <span className={`transition-transform duration-300 ${expandedCategory === cat.handle ? 'rotate-180 text-[#700b10]' : 'text-gray-400'}`}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                                                    </span>
                                                                </button>

                                                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedCategory === cat.handle ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                                                                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 px-10 pb-6 pt-0">
                                                                        {cat.items.map((sub, sIdx) => (
                                                                            <Link
                                                                                key={sIdx}
                                                                                href={`/collections/${sub.handle}`}
                                                                                onClick={() => setIsMobileMenuOpen(false)}
                                                                                className="text-[13px] text-gray-500 hover:text-[#700b10] transition-colors py-1"
                                                                            >
                                                                                {sub.title}
                                                                            </Link>
                                                                        ))}
                                                                        <Link
                                                                            href={`/collections/${cat.handle}`}
                                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                                            className="col-span-2 mt-2 py-2 px-4 bg-white/50 border border-gray-100 rounded-lg text-[11px] font-bold text-[#700b10] uppercase tracking-wider flex items-center justify-between group w-fit"
                                                                        >
                                                                            Explore {cat.title}
                                                                            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform ml-2" />
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="flex justify-center pb-2">
                                                        <Link
                                                            href="/collections"
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                            className="w-full text-center py-4 bg-[#700b10] text-white rounded-2xl text-[13px] font-bold uppercase tracking-widest shadow-[0_10px_20px_rgba(112,11,16,0.15)] hover:bg-red-900 transition-all active:scale-[0.98]"
                                                        >
                                                            View All Collections
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </React.Fragment>
                            ))}


                        </nav>
                    </div>
                </header>
            </div>

            {/* Mobile Bottom Navigation Bar */}
            <div className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-[60] pb-safe pointer-events-auto">
                <div className="flex justify-around items-center h-16 px-1 sm:px-2 max-w-lg mx-auto">
                    <Link href="/" className="flex flex-col items-center justify-center flex-1 max-w-[68px] gap-0.5 py-1 text-gray-500 hover:text-[#700b10] transition-colors">
                        <Home className="w-5 h-5" />
                        <span className="text-[10px] font-bold">Home</span>
                    </Link>

                    <button
                        onClick={handleopencart}
                        className="flex flex-col items-center justify-center flex-1 max-w-[68px] gap-0.5 py-1 text-gray-500 hover:text-[#700b10] transition-colors relative"
                    >
                        <div className="relative">
                            <ShoppingCart className="w-5 h-5" />
                            {cart && cart.length > 0 && (
                                <span className="absolute -top-1.5 -right-2 bg-[#700b10] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                    {cart.length}
                                </span>
                            )}
                        </div>
                        <span className="text-[10px] font-bold">Cart</span>
                    </button>

                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="flex flex-col items-center justify-center flex-1 max-w-[68px] gap-0.5 py-1 text-gray-500 hover:text-[#700b10] transition-colors"
                    >
                        <Search className="w-5 h-5" />
                        <span className="text-[10px] font-bold">Search</span>
                    </button>

                    <button
                        onClick={() => {
                            const token = typeof window !== "undefined" ? localStorage.getItem("ns_accessToken") : null;
                            if (!token) {
                                openLogin();
                            } else {
                                openWishlist();
                            }
                        }}
                        className="flex flex-col items-center justify-center flex-1 max-w-[68px] gap-0.5 py-1 text-gray-500 hover:text-[#700b10] transition-colors relative"
                    >
                        <div className="relative">
                            <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'fill-[#700b10] text-[#700b10]' : ''}`} />
                            {wishlist.length > 0 && (
                                <span className="absolute -top-1.5 -right-2 bg-[#700b10] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                    {wishlist.length}
                                </span>
                            )}
                        </div>
                        <span className="text-[10px] font-bold">Wishlist</span>
                    </button>

                    <button
                        onClick={() => isLoggedIn ? window.location.href = "/profile" : openLogin()}
                        className="flex flex-col items-center justify-center flex-1 max-w-[68px] gap-0.5 py-1 text-gray-500 hover:text-[#700b10] transition-colors"
                    >
                        <User className={`w-5 h-5 ${isLoggedIn ? 'text-[#700b10]' : ''}`} />
                        <span className="text-[10px] font-bold">Profile</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
