// src/components/Footer.jsx

"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    FaWhatsapp,
    FaFacebookF,
    FaInstagram,
    FaYoutube,
    FaPhoneAlt,
    FaEnvelope,
    FaClock,
    FaShieldAlt
} from 'react-icons/fa';

export default function Footer() {
    const pathname = usePathname();
    const isProductPage = pathname?.startsWith('/products/');
    const currentYear = new Date().getFullYear();

    const [collections, setCollections] = useState([]);
    const [loadingCollections, setLoadingCollections] = useState(true);

    // Accordion state for mobile view
    const [openSections, setOpenSections] = useState({
        explore: false,
        information: false,
        discover: false,
    });

    const toggleSection = (key) => {
        setOpenSections(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    useEffect(() => {
        async function fetchFooterCollections() {
            try {
                const res = await fetch("/api/collections");
                const data = await res.json();
                if (data.success && Array.isArray(data.collections)) {
                    // Only filter collections where is_display is true and has products
                    const validCollections = data.collections.filter(c =>
                        (c.is_display === true || c.is_display === 1 || c.is_display === "true") &&
                        Number(c.product_count ?? c.products_count ?? c.productsCount ?? (c.products?.length || 0)) > 0
                    );
                    setCollections(validCollections);
                }
            } catch (err) {
                console.error("Failed to fetch footer collections:", err);
            } finally {
                setLoadingCollections(false);
            }
        }
        fetchFooterCollections();
    }, []);

    const informationLinks = [
        { name: "Order & Return Policy", href: "/return-policy" },
        { name: "Return & Exchange Policy", href: "/return-policy" },
        { name: "Privacy Policy", href: "/privacy-policy" },
        { name: "Terms & Conditions", href: "/terms-conditions" },
        { name: "Shipping Policy", href: "/shipping-policy" },
        { name: "FAQ's", href: "/faq" },
        { name: "Place Return Request", href: "/return-policy" },
    ];

    const discoverLinks = [
        { name: "Blog", href: "/blogs" },
        { name: "About Us", href: "/about" },
        { name: "All Products", href: "/products" },
        { name: "My Profile", href: "/profile" },
    ];

    const socialLinks = [
        { icon: <FaFacebookF size={15} />, href: "https://www.facebook.com/nilkanthstore", label: "Facebook" },
        { icon: <FaInstagram size={16} />, href: "https://www.instagram.com/nilkanthstore/", label: "Instagram" },
        { icon: <FaWhatsapp size={16} />, href: "https://chat.whatsapp.com/Ft1TM6WNHaALWyYQSbIF52", label: "WhatsApp" },
        { icon: <FaYoutube size={16} />, href: "https://www.youtube.com/@nilkanthstore", label: "YouTube" },
    ];

    const supportContacts = [
        {
            title: "Sales Support",
            number: "9726778118",
            href: "tel:+919726778118",
            icon: <FaWhatsapp size={15} className="text-[#25D366]" />
        },
        {
            title: "After Sales Support",
            number: "9310501040",
            href: "tel:+919310501040",
            icon: <FaPhoneAlt size={13} className="text-[#EBD99C]" />
        },
        {
            title: "Complain & Grievance",
            number: "9824878118",
            href: "tel:+919824878118",
            icon: <FaPhoneAlt size={13} className="text-[#EBD99C]" />
        },
    ];

    return (
        <footer className={`w-full bg-[#700b10] text-white px-4 sm:px-6 md:px-10 lg:px-14 pt-12 md:pt-16 border-t border-[#8c161d] ${isProductPage ? 'pb-28 md:pb-10' : 'pb-24 md:pb-10'}`}>
            <div className="max-w-[1440px] mx-auto">
                {/* 5-Column Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-10 pb-8 lg:pb-12">

                    {/* Column 1: Brand & Bio (3 cols) */}
                    <div className="lg:col-span-3 space-y-4 pb-4 lg:pb-0 border-b border-white/10 lg:border-none">
                        <Link href="/" className="inline-flex items-center gap-3 group">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-white/10 p-1 border border-white/20 shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform">
                                <img
                                    src="https://megaecomm.megascale.co.in/backend/media/16/general/c2bf167e8984676b71498ccb3c299e14.png"
                                    alt="Nilkanth Store Logo"
                                    className="w-full h-full object-contain filter drop-shadow-sm"
                                />
                            </div>
                            <div>
                                <h3 className="font-serif text-2xl font-bold tracking-tight text-white leading-none">
                                    nilkanth
                                </h3>
                                <span className="text-[10px] tracking-[0.25em] uppercase text-[#EBD99C] font-semibold block mt-0.5">
                                    Store & Pooja Samagri
                                </span>
                            </div>
                        </Link>

                        <p className="text-[13px] md:text-[14px] leading-relaxed text-gray-200/90 font-nunito pt-1 pr-2">
                            Nilkanth Store brings you authentic pooja samagri, brass & copper idols, pure attars, premium dhoop and sacred essentials crafted with pure devotion, high quality, and tradition.
                        </p>
                    </div>

                    {/* Column 2: EXPLORE MORE / COLLECTIONS (2 cols) */}
                    <div className="lg:col-span-2 border-b border-white/10 lg:border-none">
                        <button
                            type="button"
                            onClick={() => toggleSection('explore')}
                            className="w-full flex items-center justify-between py-3 lg:py-0 text-left cursor-pointer lg:cursor-default"
                        >
                            <h4 className="text-[14px] md:text-[15px] font-bold uppercase tracking-wider text-white font-nunito">
                                Explore More
                            </h4>
                            <span className="lg:hidden text-lg font-bold text-white leading-none">
                                {openSections.explore ? '−' : '+'}
                            </span>
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openSections.explore ? 'max-h-[600px] opacity-100 pb-3 pt-2' : 'max-h-0 opacity-0'} lg:max-h-none lg:opacity-100 lg:overflow-visible lg:pt-4`}>
                            <ul className="space-y-2.5">
                                {collections.length > 0 ? (
                                    collections.map((col) => (
                                        <li key={col.id || col.handle}>
                                            <Link
                                                href={`/collections/${col.handle}`}
                                                className="text-[13px] md:text-[14px] text-gray-200 hover:text-[#EBD99C] transition-colors font-nunito block hover:translate-x-0.5 transform duration-150"
                                            >
                                                {col.title}
                                            </Link>
                                        </li>
                                    ))
                                ) : loadingCollections ? (
                                    Array.from({ length: 5 }).map((_, idx) => (
                                        <li key={idx} className="h-4 w-28 bg-white/10 animate-pulse rounded"></li>
                                    ))
                                ) : null}
                                <li>
                                    <Link
                                        href="/collections"
                                        className="text-[13px] md:text-[14px] text-[#EBD99C] font-semibold hover:underline transition-colors font-nunito block hover:translate-x-0.5 transform duration-150 pt-1"
                                    >
                                        All Collections →
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Column 3: INFORMATION (2 cols) */}
                    <div className="lg:col-span-2 border-b border-white/10 lg:border-none">
                        <button
                            type="button"
                            onClick={() => toggleSection('information')}
                            className="w-full flex items-center justify-between py-3 lg:py-0 text-left cursor-pointer lg:cursor-default"
                        >
                            <h4 className="text-[14px] md:text-[15px] font-bold uppercase tracking-wider text-white font-nunito">
                                Information
                            </h4>
                            <span className="lg:hidden text-lg font-bold text-white leading-none">
                                {openSections.information ? '−' : '+'}
                            </span>
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openSections.information ? 'max-h-[500px] opacity-100 pb-3 pt-2' : 'max-h-0 opacity-0'} lg:max-h-none lg:opacity-100 lg:overflow-visible lg:pt-4`}>
                            <ul className="space-y-2.5">
                                {informationLinks.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-[13px] md:text-[14px] text-gray-200 hover:text-[#EBD99C] transition-colors font-nunito block hover:translate-x-0.5 transform duration-150"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Column 4: DISCOVER (2 cols) */}
                    <div className="lg:col-span-2 border-b border-white/10 lg:border-none">
                        <button
                            type="button"
                            onClick={() => toggleSection('discover')}
                            className="w-full flex items-center justify-between py-3 lg:py-0 text-left cursor-pointer lg:cursor-default"
                        >
                            <h4 className="text-[14px] md:text-[15px] font-bold uppercase tracking-wider text-white font-nunito">
                                Discover
                            </h4>
                            <span className="lg:hidden text-lg font-bold text-white leading-none">
                                {openSections.discover ? '−' : '+'}
                            </span>
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openSections.discover ? 'max-h-[500px] opacity-100 pb-3 pt-2' : 'max-h-0 opacity-0'} lg:max-h-none lg:opacity-100 lg:overflow-visible lg:pt-4`}>
                            <ul className="space-y-2.5">
                                {discoverLinks.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-[13px] md:text-[14px] text-gray-200 hover:text-[#EBD99C] transition-colors font-nunito block hover:translate-x-0.5 transform duration-150"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Column 5: FOLLOW US & SUPPORT (3 cols) */}
                    <div className="lg:col-span-3 space-y-5 pt-3 lg:pt-0">
                        {/* Follow Us */}
                        <div className="space-y-2.5">
                            <h4 className="text-[14px] md:text-[15px] font-bold uppercase tracking-wider text-white font-nunito">
                                Follow Us
                            </h4>
                            <div className="flex items-center gap-2.5">
                                {socialLinks.map((social) => (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-9 h-9 rounded-full bg-white/15 hover:bg-[#EBD99C] text-white hover:text-[#700b10] flex items-center justify-center transition-all duration-200 shadow-sm transform hover:scale-105"
                                        aria-label={social.label}
                                    >
                                        {social.icon}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Support */}
                        <div className="space-y-3 pt-1">
                            <h4 className="text-[14px] md:text-[15px] font-bold uppercase tracking-wider text-[#EBD99C] font-nunito">
                                Support
                            </h4>
                            <div className="space-y-3">
                                {supportContacts.map((contact, idx) => (
                                    <div key={idx} className="flex flex-col">
                                        <span className="text-[12px] md:text-[13px] text-gray-300 font-medium font-nunito leading-tight">
                                            {contact.title}
                                        </span>
                                        <a
                                            href={contact.href}
                                            className="inline-flex items-center gap-2 text-[17px] sm:text-[18px] md:text-[19px] font-bold font-nunito text-[#EBD99C] hover:text-white transition-colors tracking-wide mt-0.5 group w-fit"
                                        >
                                            <span className="opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-transform">
                                                {contact.icon}
                                            </span>
                                            <span>{contact.number}</span>
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Working Hours */}
                        <div className="space-y-0.5 pt-1">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-300 block font-nunito">
                                Working Hours:
                            </span>
                            <p className="text-[12px] text-gray-200 font-nunito">
                                10:00 AM - 7:00 PM (Monday - Saturday)
                            </p>
                        </div>

                        {/* Secure Payment */}
                        <div className="space-y-1.5 pt-1">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-300 block font-nunito">
                                Secure Payment
                            </span>
                            <div className="flex flex-wrap items-center gap-1.5">
                                <span className="bg-white text-[#1a1f71] text-[10px] font-black px-2 py-0.5 rounded shadow-sm">
                                    VISA
                                </span>
                                <span className="bg-white text-[#eb001b] text-[10px] font-black px-2 py-0.5 rounded shadow-sm">
                                    Mastercard
                                </span>
                                <span className="bg-white text-[#0f7c90] text-[10px] font-black px-2 py-0.5 rounded shadow-sm">
                                    UPI
                                </span>
                                <span className="bg-white text-[#005a9c] text-[10px] font-black px-2 py-0.5 rounded shadow-sm">
                                    RuPay
                                </span>
                                <span className="bg-white text-[#2557a7] text-[10px] font-black px-2 py-0.5 rounded shadow-sm">
                                    AMEX
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider Line */}
                <div className="w-full h-[1px] bg-white/10" />

                {/* Bottom Copyright Row */}
                <div className="pt-6 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-[12px] md:text-[13px] font-nunito text-gray-300/90 tracking-wide">
                        © {currentYear} , <span className="font-bold text-white">Shri Nilkanth Store (Trade Name: ILAVIZ)</span>. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4 text-[12px] text-gray-300/80 font-nunito">
                        <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
                        <span>•</span>
                        <Link href="/terms-conditions" className="hover:text-white transition-colors">Terms</Link>
                        <span>•</span>
                        <Link href="/shipping-policy" className="hover:text-white transition-colors">Shipping</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
