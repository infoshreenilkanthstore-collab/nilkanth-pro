"use client";

import React, { useState } from "react";
import { ExternalLink } from "lucide-react";

// ─── SECTION DATA ───────────────────────────────────────────────────────────

const SOCIAL_LINKS = [
    {
        id: "about",
        label: "About Us",
        href: "/",
        icon: "🌐",
        iconBg: "#E91E8C",
        image: "https://cdn.shopify.com/s/files/1/0821/4767/2314/files/Desktop_-_168.webp?v=1773229696",
    },
    {
        id: "youtube",
        label: "YouTube",
        href: "https://youtube.com/@nikanthdham",
        icon: "▶",
        iconBg: "#FF0000",
        image: "https://cdn.shopify.com/s/files/1/0821/4767/2314/files/Desktop_-_164_2.webp?v=1773229695",
    },
    {
        id: "facebook",
        label: "Facebook",
        href: "https://facebook.com/nilkanthstore",
        icon: "f",
        iconBg: "#1877F2",
        image: "https://cdn.shopify.com/s/files/1/0821/4767/2314/files/Desktop_-_160.webp?v=1773229696",
    },
    {
        id: "instagram",
        label: "Instagram",
        href: "https://instagram.com/nilkanthstore",
        icon: "📷",
        iconBg: "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",
        image: "https://cdn.shopify.com/s/files/1/0821/4767/2314/files/Desktop_-_159_1.webp?v=1773229696",
    },
    {
        id: "whatsapp",
        label: "WhatsApp",
        href: "https://wa.me/918866794111",
        icon: "💬",
        iconBg: "#25D366",
        image: "https://cdn.shopify.com/s/files/1/0821/4767/2314/files/Desktop_-_161_2.webp?v=1773229696",
    },
    {
        id: "playstore",
        label: "Play Store",
        href: "https://play.google.com/store/apps/details?id=com.nilkanthstore",
        icon: "▶",
        iconBg: "#01875F",
        image: "https://cdn.shopify.com/s/files/1/0821/4767/2314/files/Desktop_-_162.webp?v=1773229695",
    },
    {
        id: "appstore",
        label: "App Store",
        href: "https://apps.apple.com/app/nilkanth-store",
        icon: "",
        iconBg: "#000000",
        image: "https://cdn.shopify.com/s/files/1/0821/4767/2314/files/Desktop_-_163_2.webp?v=1773229695",
    },
];

const BROCHURE_IMAGES = [
    "/link-images/brochure-1.jpg",
    "/link-images/brochure-2.jpg",
];

const TABS = ["Links", "Brochure", "About Us", "Contact Us", "Map"];

// ─── LINK CARD ───────────────────────────────────────────────────────────────

function SocialCard({ item }) {
    return (
        <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border border-gray-100"
        >
            {/* Preview Image */}
            <div className=" bg-gray-100 overflow-hidden">
                <img
                    src={item.image}
                    alt={item.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={e => { e.target.style.display = "none"; }}
                />
            </div>

            {/* Label Button */}
            <div
                className="py-3 px-4 flex items-center justify-center gap-2 font-bold text-sm text-white"
                style={{ background: item.iconBg.startsWith("linear") ? item.iconBg : item.iconBg }}
            >
                {item.label}
                <ExternalLink size={13} />
            </div>
        </a>
    );
}

// ─── SECTIONS ────────────────────────────────────────────────────────────────

function LinksSection() {
    return (
        <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {SOCIAL_LINKS.map(item => (
                    <SocialCard key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
}

function BrochureSection() {
    const [active, setActive] = useState(0);
    return (
        <div className="max-w-3xl mx-auto">
            <img src="https://cdn.shopify.com/s/files/1/0821/4767/2314/files/b1.webp?v=1773230368" alt="" />
            <img src="https://cdn.shopify.com/s/files/1/0821/4767/2314/files/b2.webp?v=1773230373" alt="" />
        </div>
    );
}

function AboutSection() {
    return (
        <div className="max-w-[900px] mx-auto px-4 py-12">

            <h2 className="text-4xl font-nunito text-gray-800 text-center mb-10">
                About Us
            </h2>

            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 md:p-8 flex flex-col md:flex-row gap-8">

                {/* Image */}
                <div className="md:w-1/3 w-full">
                    <img
                        src="https://cdn.shopify.com/s/files/1/0821/4767/2314/files/FARALI_4_1.webp?v=1772858595"
                        alt="Nilkanth Store"
                        className="w-full h-full object-cover rounded-3xl"
                        onError={(e) => { e.target.src = "/placeholder.png"; }}
                    />
                </div>

                {/* Text */}
                <div className="md:w-2/3 w-full flex flex-col justify-center text-gray-700 leading-relaxed space-y-4 text-sm sm:text-base">
                    <p>
                        Experience the divine flavors of sanctified offerings from
                        Neelkanthdham Swaminarayan Temple, we bring the sacred essence
                        of temple prasad, sweets, namkeen, and farsan directly to your
                        doorstep, wherever you may be in the world.
                    </p>

                    <p>
                        Nilkanth Store is a heartfelt initiative born out of the divine
                        sanctity of Neelkanthdham Swaminarayan Temple. With a deep reverence
                        for the spiritual journey and a commitment to serving Haribhaktas
                        across the globe, we have embarked on this journey to spread the
                        blessings of Lord Swaminarayan's prasad far and wide.
                    </p>
                </div>

            </div>
        </div>
    );
}

function ContactSection() {
    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-nunito font-bold text-gray-900 text-center mb-8">Contact Details</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-6 space-y-4 text-sm sm:text-base text-center">
                <p>
                    <span className="font-bold text-gray-700">Address:</span>{" "}
                    <span className="text-gray-600">
                        Nilkanth Store Nilkanthdham Rd, Poicha, Rajpipla, Gujarat 393145
                    </span>
                </p>
                <p>
                    <span className="font-bold text-gray-700">Email:</span>{" "}
                    <a href="mailto:bprasadam@sgrs.org" className="text-[#700b10] hover:underline">
                        bprasadam@sgrs.org
                    </a>
                </p>
                <p>
                    <span className="font-bold text-gray-700">Phone:</span>{" "}
                    <a href="tel:+918866794111" className="text-[#700b10] hover:underline">
                        +91 88667 94111
                    </a>
                </p>
                <p>
                    <span className="font-bold text-gray-700">Time:</span>{" "}
                    <span className="text-gray-600">8:30 to 6:00</span>
                </p>
            </div>

            {/* Google Maps Embed */}
            <div className="rounded-2xl overflow-hidden shadow-md border border-gray-100">
                <iframe
                    title="Nilkanth Store Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3717.4!2d73.52!3d21.86!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04b7e4a8b7c0f%3A0x9a23b5c6d1e2f3a4!2sNilkanth%20Store!5e0!3m2!1sen!2sin!4v1234567890"
                    width="100%"
                    height="320"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </div>
        </div>
    );
}

function MapSection() {
    return (
        <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-nunito font-bold text-gray-900 text-center mb-8">Location Map</h2>
            <div className="rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
                <img
                    src="https://cdn.shopify.com/s/files/1/0821/4767/2314/files/map.webp?v=1773231062"
                    alt="Neelkanthdham Location Map"
                    className="w-full h-auto object-contain"
                    onError={e => { e.target.src = "/placeholder.png"; }}
                />
            </div>
            <div className="text-center mt-4">
                <a
                    href="https://maps.google.com/?q=Nilkanth+Store+Poicha"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#700b10] text-white rounded-full font-bold text-sm hover:bg-[#5a090d] transition-all shadow-md"
                >
                    Open in Google Maps
                    <ExternalLink size={14} />
                </a>
            </div>
        </div>
    );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function LinkPage() {
    const [activeTab, setActiveTab] = useState("Links");

    const renderSection = () => {
        switch (activeTab) {
            case "Links": return <LinksSection />;
            case "Brochure": return <BrochureSection />;
            case "About Us": return <AboutSection />;
            case "Contact Us": return <ContactSection />;
            case "Map": return <MapSection />;
            default: return <LinksSection />;
        }
    };

    return (
        <div className="min-h-screen bg-white font-nunito md:pt-20">
            {/* Tab Bar */}
            <div className="max-w-[900px] w-full justify-self-center top-0 z-50 bg-gray-50 backdrop-blur-sm border-b border-gray-100 shadow-sm">
                <div className="max-w-[900px] mx-auto">
                    <div className="flex justify-between overflow-x-auto scrollbar-hide">
                        {TABS.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 min-w-[80px] py-3.5 px-3 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition-all duration-200 ${activeTab === tab
                                    ? "border-[#700b10] text-[#700b10]"
                                    : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Section Content */}
            <div className="max-w-[900px] mx-auto px-4 py-8">
                {renderSection()}
            </div>
        </div>
    );
}
