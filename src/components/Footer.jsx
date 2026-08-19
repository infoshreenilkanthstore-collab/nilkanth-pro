// src/components/Footer.jsx

"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaWhatsapp, FaFacebookF, FaInstagram, FaYoutube, FaPhoneAlt } from 'react-icons/fa';

export default function Footer() {
    const pathname = usePathname();
    const isProductPage = pathname?.startsWith('/products/');
    const currentYear = new Date().getFullYear();

    const supportContacts = [
        { title: "Sales Support", number: "9726778118" },
        { title: "After Sales Support", number: "9310501040" },
        { title: "Complain & Grievance", number: "9824878118" },
    ];

    const footerLinks = [
        { name: "Return & Refund", href: "/return-policy" },
        { name: "Privacy Policy", href: "/privacy-policy" },
        { name: "Terms & Conditions", href: "/terms-conditions" },
        { name: "Shipping Policy", href: "/shipping-policy" },
        { name: "About Us", href: "/about" },
        { name: "Blog", href: "/blogs" },
    ];

    const socialLinks = [
        { icon: <FaWhatsapp size={20} />, href: "https://chat.whatsapp.com/Ft1TM6WNHaALWyYQSbIF52", label: "WhatsApp" },
        { icon: <FaFacebookF size={18} />, href: "https://www.facebook.com/nilkanthstore", label: "Facebook" },
        { icon: <FaInstagram size={20} />, href: "https://www.instagram.com/nilkanthstore/", label: "Instagram" },
        { icon: <FaYoutube size={20} />, href: "https://www.youtube.com/@nilkanthstore", label: "YouTube" },
    ];

    return (
        <footer className={`w-full bg-[#700b10] text-white px-4 md:px-8 lg:px-12 pt-8 ${isProductPage ? 'pb-28 md:pb-10' : 'pb-24 md:pb-10'}`}>
            <div className="max-w-[1400px] mx-auto space-y-8">
                {/* Support Numbers Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 py-4 px-4 sm:px-6 bg-white/5 rounded-xl border border-white/10">
                    {supportContacts.map((contact, index) => (
                        <div
                            key={index}
                            className={`flex flex-col items-center text-center ${index !== supportContacts.length - 1 ? 'sm:border-r sm:border-white/10' : ''
                                }`}
                        >
                            <span className="text-[15px] md:text-[16px] font-tenor text-gray-200 tracking-wide mb-1">
                                {contact.title}
                            </span>
                            <a
                                href={`tel:${contact.number}`}
                                className="inline-flex items-center gap-2 text-[17px] md:text-[19px] font-semibold font-nunito text-[#EBD99C] hover:text-white transition-colors tracking-wider group"
                            >
                                <FaPhoneAlt size={13} className="opacity-75 group-hover:scale-110 transition-transform" />
                                <span>{contact.number}</span>
                            </a>
                        </div>
                    ))}
                </div>

                {/* Links and Social Row */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Navigation Links */}
                    <nav className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-3">
                        {footerLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-[14px] md:text-[15px] font-tenor hover:text-[#EBD99C] transition-colors whitespace-nowrap"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Social Icons */}
                    <div className="flex items-center gap-6">
                        {socialLinks.map((social) => (
                            <a
                                key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white hover:text-[#EBD99C] transition-all transform hover:scale-110"
                                aria-label={social.label}
                            >
                                {social.icon}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Divider Line */}
                <div className="w-full h-[1px] bg-white/10" />

                {/* Copyright Row */}
                <div className="text-center">
                    <p className="text-[13px] md:text-[14px] font-nunito opacity-80 tracking-wide">
                        Copyright © {currentYear} <span className="font-bold">Shri Nilkanth Store Trade Name: ILAVIZ</span>. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
