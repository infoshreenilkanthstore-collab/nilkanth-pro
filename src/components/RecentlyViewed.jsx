"use client";

import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ProductCard from "./ProductCard";

export default function RecentlyViewed({ currentProductId }) {
    const [products, setProducts] = useState([]);

    const getValidProducts = (data) => {
        try {
            const stored = JSON.parse(data || '[]');
            // Filter out:
            // 1. Invalid/empty products
            // 2. The product currently being viewed
            return stored.filter(p => p && p.id && p.title && p.id !== currentProductId);
        } catch (e) {
            console.error("Error parsing recently viewed products:", e);
            return [];
        }
    };

    useEffect(() => {
        const stored = localStorage.getItem('ns_recentlyViewed');
        setProducts(getValidProducts(stored));
    }, [currentProductId]);

    // Also listen for localStorage changes (e.g. if viewing products in different tabs)
    useEffect(() => {
        const handleStorageChange = () => {
            const stored = localStorage.getItem('ns_recentlyViewed');
            setProducts(getValidProducts(stored));
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [currentProductId]);

    if (products.length === 0) return null;

    return (
        <section className="w-full md:py-16 py-4 px-4 md:px-8 lg:px-12 bg-white">
            <div className="max-w-[1400px] mx-auto">
                <h2 className="text-2xl md:text-4xl font-nunito font-bold text-gray-900 md:mb-10 mb-4 text-center">
                    Recently Viewed
                </h2>

                <div className="relative group">
                    <Swiper
                        modules={[Navigation, Autoplay]}
                        spaceBetween={20}
                        slidesPerView={2}
                        navigation={{
                            nextEl: ".swiper-button-next-recent",
                            prevEl: ".swiper-button-prev-recent",
                        }}
                        breakpoints={{
                            640: {
                                slidesPerView: 2.2,
                                spaceBetween: 20,
                            },
                            768: {
                                slidesPerView: 3,
                                spaceBetween: 25,
                            },
                            1024: {
                                slidesPerView: 4,
                                spaceBetween: 30,
                            },
                        }}
                        className="recently-viewed-swiper !pb-4 "
                    >
                        {products.map((product) => (
                            <SwiperSlide key={product.id}>
                                <ProductCard product={product} />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Custom Navigation buttons */}
                    <button className="swiper-button-prev-recent absolute left-0 top-1/2 -translate-y-1/2 -ml-2 md:-ml-6 z-10 w-8 h-8 md:w-12 md:h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-800 hover:text-[#700b10] transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="md:w-5 w-3 h-3 md:h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                    <button className="swiper-button-next-recent absolute right-0 top-1/2 -translate-y-1/2 -mr-2 md:-mr-6 z-10 w-8 h-8 md:w-12 md:h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-800 hover:text-[#700b10] transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="md:w-5 w-3 h-3 md:h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>
                </div>
            </div>

            <style jsx global>{`
                .recently-viewed-swiper .swiper-button-disabled {
                    display: none;
                }
            `}</style>
        </section>
    );
}
