"use client";

import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ProductCard from "./ProductCard";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function ProductList({ products }) {
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    if (!products || products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-center">
                <h2 className="text-2xl font-bold text-gray-800">No products found</h2>
                <p className="text-gray-500 mt-2">Please check your Shopify configuration or add some products to your store.</p>
            </div>
        );
    }

    return (
        <section className="w-full bg-white py-4 md:py-8 px-0 relative overflow-hidden">
            <div className="max-w-[95rem] mx-auto px-4 md:px-8 lg:px-12">
                {/* Header Section */}
                <div className="text-center mb-2 md:mb-8">
                    <h2 className="font-nunito text-2xl md:text-5xl font-bold text-[#700b10] mb-2 md:mb-4">
                        Top Month Sellers
                    </h2>
                    <p className="text-gray-500 max-w-2xl mx-auto text-[8px] md:text-sm font-jost uppercase tracking-widest ">
                        Each fragrance is carefully chosen to elevate the divine ambiance of your surroundings
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
                        loop={products.length > 4}
                        autoplay={{
                            delay: 4500,
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
                            }
                        }}
                        className="product-list-swiper md:!py-8 !px-1"
                    >
                        {products.map((item) => {
                            const product = item?.node || item;
                            return (
                                <SwiperSlide key={product.id}>
                                    <div className="h-full">
                                        <ProductCard product={product} />
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </div>
            </div>

            <style jsx global>{`
                .product-list-swiper .swiper-slide {
                    display: flex;
                    height: auto;
                }
                .font-jost {
                    font-family: "Jost", sans-serif;
                }
                .font-nunito {
                    font-family: "Nunito", sans-serif;
                }
            `}</style>
        </section>
    );
}
