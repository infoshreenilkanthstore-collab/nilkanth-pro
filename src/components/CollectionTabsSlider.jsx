"use client";

import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ProductCard from "./ProductCard";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function CollectionTabsSlider() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    useEffect(() => {
        async function fetchNewArrivals() {
            try {
                const response = await fetch("/api/products");
                const data = await response.json();

                if (data.success && data.products) {
                    // Shuffle products and pick 10 randomly
                    const shuffled = [...data.products].sort(() => 0.5 - Math.random());
                    setProducts(shuffled.slice(0, 10));
                }
            } catch (error) {
                console.error("Failed to fetch new arrivals:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchNewArrivals();
    }, []);

    if (loading) return (
        <div className="w-full py-20 text-center bg-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#700b10] mx-auto"></div>
        </div>
    );

    if (products.length === 0) return null;

    return (
        <section className="w-full bg-white py-2 md:py-8 px-0 relative overflow-hidden">
            <div className="max-w-[95rem] mx-auto px-4 md:px-8 lg:px-12">
                <div className="text-center mb-2 md:mb-8">
                    <h2 className="tenor-sans-regular text-3xl md:text-5xl text-[#700b10] mb-2 md:mb-4">
                        New Arrivals
                    </h2>
                    <p className="text-gray-500 max-w-2xl mx-auto text-[8px] md:text-sm font-jost uppercase tracking-widest ">
                        Here's some of our most new arrivals products that people are in love with.
                    </p>
                </div>

                <div className="relative group">
                    {/* CUSTOM NAVIGATION BUTTONS */}
                    <button
                        ref={prevRef}
                        className="absolute left-[-10px] md:left-[-50px] top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-xl border border-yellow-100/50 flex items-center justify-center text-[#700b10] hover:bg-[#700b10] hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 disabled:opacity-0"
                    >
                        <FiChevronLeft size={24} />
                    </button>
                    <button
                        ref={nextRef}
                        className="absolute right-[-10px] md:right-[-50px] top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-xl border border-yellow-100/50 flex items-center justify-center text-[#700b10] hover:bg-[#700b10] hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 disabled:opacity-0"
                    >
                        <FiChevronRight size={24} />
                    </button>

                    <Swiper
                        modules={[Navigation, Autoplay]}
                        onInit={(swiper) => {
                            swiper.params.navigation.prevEl = prevRef.current;
                            swiper.params.navigation.nextEl = nextRef.current;
                            swiper.navigation.init();
                            swiper.navigation.update();
                        }}
                        spaceBetween={10}
                        slidesPerView={2}
                        loop={products.length > 5}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                        }}
                        breakpoints={{
                            480: {
                                slidesPerView: 2.2,
                                spaceBetween: 12
                            },
                            640: {
                                slidesPerView: 2.8,
                                spaceBetween: 16
                            },
                            768: {
                                slidesPerView: 3,
                                spaceBetween: 20
                            },
                            1024: {
                                slidesPerView: 4,
                                spaceBetween: 24
                            },
                            1280: {
                                slidesPerView: 4.5,
                                spaceBetween: 24
                            },
                            1536: {
                                slidesPerView: 5,
                                spaceBetween: 28
                            }
                        }}
                        className="product-swiper md:!py-8 !px-1"
                    >
                        {products.map((product) => (
                            <SwiperSlide key={product.id} className="h-auto">
                                <div className="h-full">
                                    <ProductCard product={product} />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>

            <style jsx global>{`
                .product-swiper .swiper-slide {
                    display: flex;
                    height: auto;
                }
                .font-jost {
                    font-family: "Jost", sans-serif;
                }
            `}</style>
        </section>
    );
}
