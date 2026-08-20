"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import Image from "next/image";         

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const galleryImages = [
    {
        url: "https://cdn.shopify.com/s/files/1/0804/0867/4532/files/ocean_perfyum_2_50008dcb-8a09-44ab-9ad0-a5483bb42e32.webp?v=1774253909",
        title: "Perfume"
    },
    {
        url: "https://cdn.shopify.com/s/files/1/0804/0867/4532/files/karatal_16_e95b9ee9-97cd-4cec-80f9-5b848e104c64.webp?v=1774253909",
        title: "Kadtal"
    },
    {
        url: "https://cdn.shopify.com/s/files/1/0804/0867/4532/files/pital_lota_18_c6c71947-9ea9-495b-8140-20dd5c79f5bb.webp?v=1774253909",
        title: "Pital Kalash"
    },
    {
        url: "https://cdn.shopify.com/s/files/1/0804/0867/4532/files/happy_men_2_f00197a2-81db-4c2e-96d7-6711991232c4.webp?v=1774253909",
        title: "Laughing Budhha"
    },
    {
        url: "https://cdn.shopify.com/s/files/1/0804/0867/4532/files/stone_3_565d46b1-805a-4d63-b3f6-7c65fb75f10a.webp?v=1774253909",
        title: "Decorative Stone"
    },
    {
        url: "https://cdn.shopify.com/s/files/1/0804/0867/4532/files/aarati_dish_1_73a11d45-c152-41ab-898d-b18347e16841.webp?v=1774253908",
        title: "Aarati Dish"
    },
    {
        url: "https://cdn.shopify.com/s/files/1/0804/0867/4532/files/sceen_colour_nilkanth_varni_2_3b6a562a-ceda-473c-9d8e-181e31a476c0.webp?v=1774253908",
        title: "Murtis"
    },
    {
        url: "https://cdn.shopify.com/s/files/1/0804/0867/4532/files/prasad_vataki_1_2f820f8e-6fb3-47ca-89ce-ed9334a1006b.webp?v=1774253908",
        title: "Thal Bowls"
    },
    {
        url: "https://cdn.shopify.com/s/files/1/0804/0867/4532/files/singal_aarati_9_dc2a526e-3078-44f1-874e-7702c323731e.webp?v=1774253908",
        title: "Aarati"
    }
];

export default function ImageGallery() {
    return (
        <section className="w-full bg-white py-12 md:py-8 px-4 md:px-8 lg:px-12 overflow-hidden">
            <div className="max-w-[95rem] mx-auto">
                {/* Header */}
                <div className="text-center mb-10 md:mb-16">
                    <h2 className="tenor-sans-regular text-3xl md:text-6xl text-[#700b10] mb-4 md:mb-6 tracking-tight">
                        Image Gallery
                    </h2>
                    <p className="text-gray-500 max-w-2xl mx-auto text-[8px] md:text-sm font-jost uppercase tracking-widest">
                        A visual journey through our most loved and blessed devotional offerings, captured in their finest detail.
                    </p>
                </div>

                {/* Slider */}
                <div className="image-gallery-swiper relative group/slider">
                    <Swiper
                        modules={[Navigation, Autoplay]}
                        spaceBetween={20}
                        slidesPerView={1.2}
                        centeredSlides={true}
                        loop={true}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                        }}
                        navigation={{
                            nextEl: ".swiper-button-next-custom",
                            prevEl: ".swiper-button-prev-custom",
                        }}
                        breakpoints={{
                            480: {
                                slidesPerView: 2,
                                centeredSlides: false,
                                spaceBetween: 16
                            },
                            768: {
                                slidesPerView: 3,
                                centeredSlides: false,
                                spaceBetween: 20
                            },
                            1024: {
                                slidesPerView: 4,
                                centeredSlides: false,
                                spaceBetween: 24
                            },
                            1280: {
                                slidesPerView: 5,
                                centeredSlides: false,
                                spaceBetween: 24
                            }
                        }}
                        className="pb-12"
                    >
                        {galleryImages.map((image, index) => (
                            <SwiperSlide key={index}>
                                <div className="relative group overflow-hidden rounded-xl aspect-[4/5] shadow-sm hover:shadow-2xl transition-all duration-700 bg-gray-50 border border-gray-100">
                                    <Image
                                        src={image.url}
                                        alt={image.title}
                                        width={500}
                                        height={500}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    {/* Elegant Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 md:p-8">
                                        <p className="text-white font-jost text-lg md:text-xl font-light tracking-wide transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 text-center">
                                            {image.title}
                                        </p>
                                    </div>

                                    {/* Default Title Display (Subtle) */}
                                    <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md py-2 px-4 rounded-lg opacity-100 group-hover:opacity-0 transition-opacity duration-300 shadow-lg border border-white/20">
                                        <p className="text-[#700b10] font-jost text-xs md:text-sm font-medium text-center truncate uppercase tracking-widest">
                                            {image.title}
                                        </p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Custom Navigation Buttons */}
                    <button className="swiper-button-prev-custom absolute left-[-20px] md:left-[-40px] top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-14 md:h-14 bg-white rounded-full flex items-center justify-center shadow-xl border border-gray-100 text-[#700b10] hover:bg-[#700b10] hover:text-white transition-all duration-300 opacity-0 group-hover/slider:opacity-100 group-hover/slider:left-2 md:group-hover/slider:left-[-20px]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    </button>
                    <button className="swiper-button-next-custom absolute right-[-20px] md:right-[-40px] top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-14 md:h-14 bg-white rounded-full flex items-center justify-center shadow-xl border border-gray-100 text-[#700b10] hover:bg-[#700b10] hover:text-white transition-all duration-300 opacity-0 group-hover/slider:opacity-100 group-hover/slider:right-2 md:group-hover/slider:right-[-20px]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                    </button>
                </div>
            </div>

        </section>
    );
}

