// src/components/TrustAndStorySection.jsx

"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function TrustAndStorySection() {
    const [isStoryOpen, setIsStoryOpen] = useState(false);
    const [isPromiseOpen, setIsPromiseOpen] = useState(false);
    const [isRitualsOpen, setIsRitualsOpen] = useState(false);
    const [isFestivalOpen, setIsFestivalOpen] = useState(false);
    const [isBudgetOpen, setIsBudgetOpen] = useState(false);

    const usps = [
        { icon: "🛕", label: "Temple-Inspired Products" },
        { icon: "🙏", label: "Devotional & Pooja Essentials" },
        { icon: "✨", label: "Purity & Quality Checked" },
        { icon: "📦", label: "Carefully Packed & Delivered" },
        { icon: "🚚", label: "Pan-India Delivery" },
        { icon: "🔒", label: "Secure Prepaid Orders" },
        { icon: "🪔", label: "Made for Your Daily Divine Rituals" },
    ];

    return (
        <section className="w-full bg-[#fdfbf7] border-t border-stone-200/80">
            {/* 1. Trust Header */}
            <div className="py-8 md:py-12 px-4 text-center">
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-tight text-gray-900 font-normal">
                    8,00,000+ Devotees Trust Us
                </h2>
            </div>

            {/* 2. USP Ribbon Bar with Right-to-Left Marquee Animation */}
            <div className="w-full bg-[#700b10] text-white py-3.5 sm:py-4 overflow-hidden shadow-inner flex items-center relative">
                <style>{`
                    @keyframes usp-marquee {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                    .animate-usp-marquee {
                        display: flex;
                        width: max-content;
                        animation: usp-marquee 32s linear infinite;
                    }
                    .animate-usp-marquee:hover {
                        animation-play-state: paused;
                    }
                `}</style>
                <div className="animate-usp-marquee flex items-center">
                    {[...usps, ...usps, ...usps, ...usps].map((usp, idx) => (
                        <div
                            key={idx}
                            className="flex items-center gap-2.5 sm:gap-3 px-5 sm:px-8 py-1 flex-shrink-0 group cursor-default"
                        >
                            <span className="text-xl sm:text-2xl transform group-hover:scale-115 transition-transform duration-200">
                                {usp.icon}
                            </span>
                            <span className="text-[13px] sm:text-[14px] font-nunito font-semibold text-white/95 leading-tight tracking-wide whitespace-nowrap">
                                {usp.label}
                            </span>
                            <span className="text-white/30 text-xs ml-4 sm:ml-6">•</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. Devotional Collection Story / SEO Text Accordion */}
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-14 py-8 md:py-10">
                <div className="border-b border-stone-200/60 pb-2">
                    <button
                        type="button"
                        onClick={() => setIsStoryOpen(!isStoryOpen)}
                        className="w-full flex items-center justify-between text-left py-2 group cursor-pointer"
                        aria-expanded={isStoryOpen}
                    >
                        <h3 className="font-serif text-base sm:text-lg md:text-xl font-bold tracking-wide text-gray-900 group-hover:text-[#700b10] transition-colors uppercase">
                            EXPLORE NILKANTH STORE'S DEVOTIONAL COLLECTION
                        </h3>
                        <span className="text-2xl font-light text-gray-700 group-hover:text-[#700b10] transition-colors ml-4 select-none">
                            {isStoryOpen ? '−' : '+'}
                        </span>
                    </button>

                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isStoryOpen ? 'max-h-[2000px] opacity-100 pt-4 pb-2' : 'max-h-0 opacity-0'}`}>
                        <div className="space-y-6 text-gray-700 font-nunito text-[13px] sm:text-[14px] leading-relaxed">
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm sm:text-base mb-1.5 font-nunito">
                                    Pooja Samagri & Essentials
                                </h4>
                                <p className="text-gray-600 leading-relaxed">
                                    Our collection of <Link href="/collections/pooja-samgri" className="underline hover:text-[#700b10] font-medium text-gray-800">pooja samagri</Link> is thoughtfully curated for your daily pooja, seva, and sacred rituals. From chandan and kanthi mala to cotton wicks and essential pooja accessories, every item is selected to bring purity, tradition, and devotion closer to your home.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-bold text-gray-900 text-sm sm:text-base mb-1.5 font-nunito">
                                    Murtis & Divine Idols
                                </h4>
                                <p className="text-gray-600 leading-relaxed">
                                    Our collection of <Link href="/collections/pital-copper" className="underline hover:text-[#700b10] font-medium text-gray-800">divine murtis</Link> brings the presence of devotion into your home mandir. From Nilkanth Varni and Harikrushna Maharaj to beautifully crafted devotional idols, each murti is chosen to complement your sacred space and make every moment of darshan and seva more meaningful.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-bold text-gray-900 text-sm sm:text-base mb-1.5 font-nunito">
                                    Pital & Copper Pooja Collection
                                </h4>
                                <p className="text-gray-600 leading-relaxed">
                                    Our <Link href="/collections/pital-copper" className="underline hover:text-[#700b10] font-medium text-gray-800">pital and copper collection</Link> combines traditional craftsmanship with everyday pooja essentials. From kalash and lota to aarti dishes, thal, and bowls, these timeless pieces are designed to become a meaningful part of your mandir and daily seva.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-bold text-gray-900 text-sm sm:text-base mb-1.5 font-nunito">
                                    Agarbatti, Dhoop & Sacred Fragrance
                                </h4>
                                <p className="text-gray-600 leading-relaxed">
                                    Create a peaceful and devotional atmosphere with our collection of <Link href="/collections/agarbatti-dhoop" className="underline hover:text-[#700b10] font-medium text-gray-800">agarbatti, dhoop</Link>, attar, <Link href="/collections/perfume-aroma-items" className="underline hover:text-[#700b10] font-medium text-gray-800">perfumes, and fragrances</Link>. Carefully selected for your home and pooja space, these products add a sense of freshness, serenity, and spiritual warmth to every moment of devotion.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-bold text-gray-900 text-sm sm:text-base mb-1.5 font-nunito">
                                    Devotional Gifts & Mandir Décor
                                </h4>
                                <p className="text-gray-600 leading-relaxed">
                                    Make every occasion more meaningful with our collection of <Link href="/collections/gift-items" className="underline hover:text-[#700b10] font-medium text-gray-800">devotional gifts and mandir décor</Link>. From torans and decorative pieces to spiritual gifts, murtis, julo, and hindola, discover thoughtful products that bring tradition, beauty, and devotion into every home.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-bold text-gray-900 text-sm sm:text-base mb-1.5 font-nunito">
                                    Bringing Tradition Closer to Your Home
                                </h4>
                                <p className="text-gray-600 leading-relaxed">
                                    Nilkanth Store brings together products inspired by devotion, tradition, and the timeless practices of seva. Every collection is thoughtfully selected to help you create a beautiful pooja space, celebrate your traditions, and bring a little more divinity into everyday life.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Shree Nilkanth Store Promise Accordion */}
                <div className="border-b border-stone-200/60 pb-2 pt-2">
                    <button
                        type="button"
                        onClick={() => setIsPromiseOpen(!isPromiseOpen)}
                        className="w-full flex items-center justify-between text-left py-2 group cursor-pointer"
                        aria-expanded={isPromiseOpen}
                    >
                        <h3 className="font-serif text-base sm:text-lg md:text-xl font-bold tracking-wide text-gray-900 group-hover:text-[#700b10] transition-colors uppercase">
                            SHREE NILKANTH STORE PROMISE
                        </h3>
                        <span className="text-2xl font-light text-gray-700 group-hover:text-[#700b10] transition-colors ml-4 select-none">
                            {isPromiseOpen ? '−' : '+'}
                        </span>
                    </button>

                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isPromiseOpen ? 'max-h-[800px] opacity-100 pt-4 pb-2' : 'max-h-0 opacity-0'}`}>
                        <div className="space-y-4 text-gray-700 font-nunito text-[13px] sm:text-[14px] leading-relaxed">
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm sm:text-base mb-1 font-nunito">
                                    Purity in Every Product. Devotion in Every Delivery.
                                </h4>
                                <p className="text-gray-600 leading-relaxed">
                                    At Nilkanth Store, every product is thoughtfully selected to bring quality, tradition, and devotion closer to your home.
                                </p>
                            </div>

                            <ul className="space-y-2.5 pt-1">
                                <li className="flex items-start gap-2.5">
                                    <span className="text-[#700b10] font-bold text-base leading-none mt-0.5">•</span>
                                    <span><strong className="text-gray-900 font-semibold">Authenticity</strong> — Carefully selected products</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="text-[#700b10] font-bold text-base leading-none mt-0.5">•</span>
                                    <span><strong className="text-gray-900 font-semibold">Quality</strong> — Checked before dispatch</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="text-[#700b10] font-bold text-base leading-none mt-0.5">•</span>
                                    <span><strong className="text-gray-900 font-semibold">Careful Packing</strong> — Safely packed with care</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="text-[#700b10] font-bold text-base leading-none mt-0.5">•</span>
                                    <span><strong className="text-gray-900 font-semibold">Devotional Value</strong> — Made for pooja & seva</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="text-[#700b10] font-bold text-base leading-none mt-0.5">•</span>
                                    <span><strong className="text-gray-900 font-semibold">Trusted Service</strong> — Reliable shopping experience</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* 5. Explore Daily Divine Rituals Accordion */}
                <div className="border-b border-stone-200/60 pb-2 pt-2">
                    <button
                        type="button"
                        onClick={() => setIsRitualsOpen(!isRitualsOpen)}
                        className="w-full flex items-center justify-between text-left py-2 group cursor-pointer"
                        aria-expanded={isRitualsOpen}
                    >
                        <h3 className="font-serif text-base sm:text-lg md:text-xl font-bold tracking-wide text-gray-900 group-hover:text-[#700b10] transition-colors uppercase">
                            EXPLORE DAILY DIVINE RITUALS
                        </h3>
                        <span className="text-2xl font-light text-gray-700 group-hover:text-[#700b10] transition-colors ml-4 select-none">
                            {isRitualsOpen ? '−' : '+'}
                        </span>
                    </button>

                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isRitualsOpen ? 'max-h-[600px] opacity-100 pt-4 pb-2' : 'max-h-0 opacity-0'}`}>
                        <ul className="space-y-3 text-gray-700 font-nunito text-[13px] sm:text-[14px]">
                            <li>
                                <Link href="/collections/pooja-samgri" className="text-gray-800 hover:text-[#700b10] hover:translate-x-1 transition-all inline-flex items-center gap-2 font-medium">
                                    <span className="text-[#700b10]">→</span>
                                    <span>Daily Hindu God Pooja Essentials</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/collections/pital-copper" className="text-gray-800 hover:text-[#700b10] hover:translate-x-1 transition-all inline-flex items-center gap-2 font-medium">
                                    <span className="text-[#700b10]">→</span>
                                    <span>Murtis & Divine Idols</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/collections/pital-copper" className="text-gray-800 hover:text-[#700b10] hover:translate-x-1 transition-all inline-flex items-center gap-2 font-medium">
                                    <span className="text-[#700b10]">→</span>
                                    <span>Pital & Copper Pooja Collection</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/collections/agarbatti-dhoop" className="text-gray-800 hover:text-[#700b10] hover:translate-x-1 transition-all inline-flex items-center gap-2 font-medium">
                                    <span className="text-[#700b10]">→</span>
                                    <span>Agarbatti, Dhoop & Fragrance</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/collections/gift-items" className="text-gray-800 hover:text-[#700b10] hover:translate-x-1 transition-all inline-flex items-center gap-2 font-medium">
                                    <span className="text-[#700b10]">→</span>
                                    <span>Mandir Décor & Seva</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/collections/gift-items" className="text-gray-800 hover:text-[#700b10] hover:translate-x-1 transition-all inline-flex items-center gap-2 font-medium">
                                    <span className="text-[#700b10]">→</span>
                                    <span>Devotional Gifts</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/collections/pooja-samgri" className="text-gray-800 hover:text-[#700b10] hover:translate-x-1 transition-all inline-flex items-center gap-2 font-medium">
                                    <span className="text-[#700b10]">→</span>
                                    <span>Daily Pooja Essentials</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* 6. Festival & Special Occasions Accordion */}
                <div className="border-b border-stone-200/60 pb-2 pt-2">
                    <button
                        type="button"
                        onClick={() => setIsFestivalOpen(!isFestivalOpen)}
                        className="w-full flex items-center justify-between text-left py-2 group cursor-pointer"
                        aria-expanded={isFestivalOpen}
                    >
                        <h3 className="font-serif text-base sm:text-lg md:text-xl font-bold tracking-wide text-gray-900 group-hover:text-[#700b10] transition-colors uppercase">
                            FESTIVAL & SPECIAL OCCASIONS
                        </h3>
                        <span className="text-2xl font-light text-gray-700 group-hover:text-[#700b10] transition-colors ml-4 select-none">
                            {isFestivalOpen ? '−' : '+'}
                        </span>
                    </button>

                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isFestivalOpen ? 'max-h-[800px] opacity-100 pt-4 pb-2' : 'max-h-0 opacity-0'}`}>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-gray-700 font-nunito text-[13px] sm:text-[14px]">
                            <li>
                                <Link href="/collections/janmashtami-collection" className="text-gray-800 hover:text-[#700b10] hover:translate-x-1 transition-all inline-flex items-center gap-2 font-medium group">
                                    <span className="text-[#700b10] font-bold">•</span>
                                    <span className="group-hover:underline">Janmashtami Collection</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/collections/diwali-pooja-essentials" className="text-gray-800 hover:text-[#700b10] hover:translate-x-1 transition-all inline-flex items-center gap-2 font-medium group">
                                    <span className="text-[#700b10] font-bold">•</span>
                                    <span className="group-hover:underline">Diwali Pooja Essentials</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/collections/swaminarayan-jayanti-collection" className="text-gray-800 hover:text-[#700b10] hover:translate-x-1 transition-all inline-flex items-center gap-2 font-medium group">
                                    <span className="text-[#700b10] font-bold">•</span>
                                    <span className="group-hover:underline">Swaminarayan Jayanti Collection</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/collections/hari-jayanti" className="text-gray-800 hover:text-[#700b10] hover:translate-x-1 transition-all inline-flex items-center gap-2 font-medium group">
                                    <span className="text-[#700b10] font-bold">•</span>
                                    <span className="group-hover:underline">Hari Jayanti</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/collections/ram-navami-collection" className="text-gray-800 hover:text-[#700b10] hover:translate-x-1 transition-all inline-flex items-center gap-2 font-medium group">
                                    <span className="text-[#700b10] font-bold">•</span>
                                    <span className="group-hover:underline">Ram Navami Collection</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/collections/holi-collection" className="text-gray-800 hover:text-[#700b10] hover:translate-x-1 transition-all inline-flex items-center gap-2 font-medium group">
                                    <span className="text-[#700b10] font-bold">•</span>
                                    <span className="group-hover:underline">Holi Collection</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/collections/akshaya-tritiya-collection" className="text-gray-800 hover:text-[#700b10] hover:translate-x-1 transition-all inline-flex items-center gap-2 font-medium group">
                                    <span className="text-[#700b10] font-bold">•</span>
                                    <span className="group-hover:underline">Akshaya Tritiya Collection</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/collections/laxmi-poojan" className="text-gray-800 hover:text-[#700b10] hover:translate-x-1 transition-all inline-flex items-center gap-2 font-medium group">
                                    <span className="text-[#700b10] font-bold">•</span>
                                    <span className="group-hover:underline">Laxmi Poojan</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/collections/guru-purnima" className="text-gray-800 hover:text-[#700b10] hover:translate-x-1 transition-all inline-flex items-center gap-2 font-medium group">
                                    <span className="text-[#700b10] font-bold">•</span>
                                    <span className="group-hover:underline">Guru Purnima</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/collections/navratri-collection" className="text-gray-800 hover:text-[#700b10] hover:translate-x-1 transition-all inline-flex items-center gap-2 font-medium group">
                                    <span className="text-[#700b10] font-bold">•</span>
                                    <span className="group-hover:underline">Navratri Collection</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/collections/shivratri-collection" className="text-gray-800 hover:text-[#700b10] hover:translate-x-1 transition-all inline-flex items-center gap-2 font-medium group">
                                    <span className="text-[#700b10] font-bold">•</span>
                                    <span className="group-hover:underline">Shivratri Collection</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/collections/mandir-patotsav" className="text-gray-800 hover:text-[#700b10] hover:translate-x-1 transition-all inline-flex items-center gap-2 font-medium group">
                                    <span className="text-[#700b10] font-bold">•</span>
                                    <span className="group-hover:underline">Mandir Patotsav</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                {/* 6. Shop By Budget Accordion */}
                <div className="border-b border-stone-200/60 pb-2 pt-2">
                    <button
                        type="button"
                        onClick={() => setIsBudgetOpen(!isBudgetOpen)}
                        className="w-full flex items-center justify-between text-left py-2 group cursor-pointer"
                        aria-expanded={isBudgetOpen}
                    >
                        <h3 className="font-serif text-base sm:text-lg md:text-xl font-bold tracking-wide text-gray-900 group-hover:text-[#700b10] transition-colors uppercase">
                            SHOP BY BUDGET
                        </h3>
                        <span className="text-2xl font-light text-gray-700 group-hover:text-[#700b10] transition-colors ml-4 select-none">
                            {isBudgetOpen ? '−' : '+'}
                        </span>
                    </button>

                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isBudgetOpen ? 'max-h-[800px] opacity-100 pt-4 pb-2' : 'max-h-0 opacity-0'}`}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
                            <Link
                                href="/collections/under-100"
                                className="p-3.5 bg-stone-50 hover:bg-white rounded-xl border border-stone-200/80 hover:border-[#700b10]/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group block"
                            >
                                <div className="font-bold text-[#700b10] text-sm sm:text-base font-nunito group-hover:underline flex items-center justify-between">
                                    <span>Under ₹100</span>
                                    <span className="text-xs text-[#700b10] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                </div>
                                <div className="text-gray-600 text-xs sm:text-[13px] font-nunito mt-1 leading-snug">
                                    Small devotional essentials
                                </div>
                            </Link>

                            <Link
                                href="/collections/100-300"
                                className="p-3.5 bg-stone-50 hover:bg-white rounded-xl border border-stone-200/80 hover:border-[#700b10]/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group block"
                            >
                                <div className="font-bold text-[#700b10] text-sm sm:text-base font-nunito group-hover:underline flex items-center justify-between">
                                    <span>₹100 – ₹300</span>
                                    <span className="text-xs text-[#700b10] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                </div>
                                <div className="text-gray-600 text-xs sm:text-[13px] font-nunito mt-1 leading-snug">
                                    Pooja & fragrance products
                                </div>
                            </Link>

                            <Link
                                href="/collections/300-500"
                                className="p-3.5 bg-stone-50 hover:bg-white rounded-xl border border-stone-200/80 hover:border-[#700b10]/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group block"
                            >
                                <div className="font-bold text-[#700b10] text-sm sm:text-base font-nunito group-hover:underline flex items-center justify-between">
                                    <span>₹300 – ₹500</span>
                                    <span className="text-xs text-[#700b10] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                </div>
                                <div className="text-gray-600 text-xs sm:text-[13px] font-nunito mt-1 leading-snug">
                                    Gifting & decorative products
                                </div>
                            </Link>

                            <Link
                                href="/collections/500-1000"
                                className="p-3.5 bg-stone-50 hover:bg-white rounded-xl border border-stone-200/80 hover:border-[#700b10]/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group block"
                            >
                                <div className="font-bold text-[#700b10] text-sm sm:text-base font-nunito group-hover:underline flex items-center justify-between">
                                    <span>₹500 – ₹1,000</span>
                                    <span className="text-xs text-[#700b10] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                </div>
                                <div className="text-gray-600 text-xs sm:text-[13px] font-nunito mt-1 leading-snug">
                                    Premium pooja products
                                </div>
                            </Link>

                            <Link
                                href="/collections/1000-plus"
                                className="p-3.5 bg-stone-50 hover:bg-white rounded-xl border border-stone-200/80 hover:border-[#700b10]/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group block"
                            >
                                <div className="font-bold text-[#700b10] text-sm sm:text-base font-nunito group-hover:underline flex items-center justify-between">
                                    <span>₹1,000+</span>
                                    <span className="text-xs text-[#700b10] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                </div>
                                <div className="text-gray-600 text-xs sm:text-[13px] font-nunito mt-1 leading-snug">
                                    Murtis & premium devotional collections
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
