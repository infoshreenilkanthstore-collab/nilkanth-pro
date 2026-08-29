// src\app\about\page.js

"use client";

import React from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { FiChevronRight } from 'react-icons/fi';

export default function AboutPage() {

    const testimonials = [
        {
            name: "Ritik Sharma",
            location: "Varanasi",
            image: "https://cdn.shopify.com/s/files/1/0804/0867/4532/files/Gemini_Generated_Image_c00uhoc00uhoc00u_1.webp?v=1774257665",
            text: "Nilkanth Store Trade Name : ILAVIZ truly understands devotion. The quality of their brass lota and pooja items is unmatched — it feels like every piece is made with pure intention."
        },
        {
            name: "Divyesh Mehta",
            location: "Jaipur",
            image: "https://cdn.shopify.com/s/files/1/0804/0867/4532/files/Gemini_Generated_Image_k8frnqk8frnqk8fr.webp?v=1774257666",
            text: "I appreciate the attention to detail and authenticity in every product. You can tell Nilkanth Store Trade Name : ILAVIZ is built on values, not just sales."
        },

        {
            name: "Amit Desai",
            location: "Ahmedabad",
            image: "https://cdn.shopify.com/s/files/1/0804/0867/4532/files/Gemini_Generated_Image_2niogn2niogn2nio.webp?v=1774257665",
            text: "I ordered a silver kalash for a family ritual, and it was delivered with such care. Beautifully packed, authentic, and full of spiritual energy."
        },
        {
            name: "Sanjay Patel",
            location: "Surat",
            image: "https://cdn.shopify.com/s/files/1/0804/0867/4532/files/Gemini_Generated_Image_rix1srix1srix1sr.webp?v=1774257666",
            text: "The collection at Nilkanth Store Trade Name : ILAVIZ is simply divine. I found everything I needed for my home temple in one place. Highly recommended!"
        },
        {
            name: "Meera Shah",
            location: "Mumbai",
            image: "https://cdn.shopify.com/s/files/1/0804/0867/4532/files/Gemini_Generated_Image_qw2zorqw2zorqw2z.webp?v=1774257666",
            text: "Exquisite craftsmanship and very prompt delivery. The brass idols have a beautiful finish that reflects the artisans' dedication."
        }
    ];

    return (
        <main className="min-h-screen bg-white">
            {/* 1. TOP BANNER SECTION */}
            <div className="max-w-[100rem] mx-auto pt-0 md:pt-4 px-0 md:px-8 lg:px-12 mb-8">
                <div className="w-full overflow-hidden rounded-none md:rounded-2xl bg-white shadow-md border-0 md:border border-yellow-100/50 flex items-center justify-center text-center max-w-7xl mx-auto">
                    <img
                        src="https://cdn.shopify.com/s/files/1/0804/0867/4532/files/about_us_contact_us_bhagvat_poojan_2_1.webp?v=1774257001"
                        className="w-full h-full object-contain object-center"
                        alt="About Us Banner"
                    />
                </div>
            </div>

            {/* 2. SACRED RESPONSIBILITY SECTION */}
            <section className="bg-[#FDFBF7] py-12 md:py-20 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
                    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
                        <div className="w-full md:w-1/2 rounded-3xl overflow-hidden shadow-xl">
                            <img
                                src="https://cdn.shopify.com/s/files/1/0804/0867/4532/files/SHOPPING_INFORMATION_1_2.webp?v=1774257059"
                                alt="Sacred Items"
                                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                                onError={(e) => { e.target.src = "https://cdn.shopify.com/s/files/1/0804/0867/4532/files/about_us_contact_us_bhagvat_poojan_4_1.webp?v=1774254662"; }}
                            />
                        </div>
                        <div className="w-full md:w-1/2 space-y-4 md:space-y-6">
                            <h3 className="text-[#C5A358] font-nunito font-semibold text-base sm:text-lg md:text-xl tracking-wide">Nilkanth Store Trade Name : ILAVIZ</h3>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-tenor text-[#700b10] leading-tight">Sacred Responsibility</h2>
                            <p className="text-gray-600 text-base md:text-lg leading-relaxed font-nunito">
                                At Nilkanth Store Trade Name : ILAVIZ, we honor tradition with responsibility. Our products are thoughtfully sourced and crafted using ethical practices that respect both nature and spirituality. By supporting sustainable craftsmanship, we not only preserve cultural heritage but also uplift the artisans and communities behind each sacred creation.
                            </p>
                            <a
                                href="/products"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-[#EBD99C] text-[#700b10] rounded-xl font-bold font-nunito hover:bg-[#DBC686] transition-all duration-300 shadow-lg shadow-yellow-900/10 group"
                            >
                                Explore our products
                                <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. MAROON QUOTE SECTION */}
            <section className="bg-[#700b10] py-16 md:py-24 text-center px-4">
                <div className="max-w-4xl mx-auto space-y-6">
                    <p className="text-white text-xl md:text-2xl lg:text-2xl font-tenor italic leading-relaxed">
                        " Nilkanth Store Trade Name : ILAVIZ is guided by devotion, integrity, and purpose. We aim to bring lasting value to every soul we connect with — from our customers and artisans to the communities and traditions we proudly uphold."
                    </p>
                    <p className="text-white font-nunito font-bold text-lg md:text-xl tracking-widest uppercase opacity-90">
                        - Nilkanth Store Trade Name : ILAVIZ
                    </p>
                </div>
            </section>

            {/* 4. WHO WE ARE SECTION */}
            <section className="py-12 md:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
                    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
                        <div className="w-full md:w-5/12 rounded-[2.5rem] overflow-hidden bg-[#FDFBF7]">
                            <img
                                src="https://cdn.shopify.com/s/files/1/0804/0867/4532/files/Copy_of_Bhagvat-poojan_Collections_3.webp?v=1774257182"
                                alt="Who we are illustration"
                                className="w-full h-auto object-contain"
                                onError={(e) => { e.target.src = "https://cdn.shopify.com/s/files/1/0804/0867/4532/files/about_us_contact_us_bhagvat_poojan_4_1.webp?v=1774254662"; }}
                            />
                        </div>
                        <div className="w-full md:w-7/12 space-y-4 md:space-y-6">
                            <h3 className="text-[#C5A358] font-nunito font-semibold text-base sm:text-lg tracking-wide uppercase">Tradition with Purpose</h3>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-tenor text-[#700b10]">Who we are</h2>
                            <p className="text-gray-600 text-base md:text-lg leading-relaxed font-nunito">
                                At Nilkanth Store Trade Name : ILAVIZ, we are devoted to bringing purity, tradition, and spiritual grace into every home. Rooted in the essence of Indian rituals, our mission is to preserve sacred customs while making them accessible for the modern devotee. Every product we offer is a reflection of our commitment to authenticity, devotion, and trust.
                            </p>
                            <a
                                href="/products"
                                className="inline-block text-[#700b10] font-bold border-b-2 border-[#700b10] pb-1 hover:text-[#5a090d] hover:border-[#5a090d] transition-all font-nunito"
                            >
                                Discover Now
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. OUR PURPOSE SECTION */}
            <section className="py-12 md:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
                    <div className="flex flex-col-reverse md:flex-row items-center gap-8 md:gap-16">
                        <div className="w-full md:w-7/12 space-y-4 md:space-y-6">
                            <h3 className="text-[#C5A358] font-nunito font-semibold text-base sm:text-lg tracking-wide uppercase">Our Commitment</h3>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-tenor text-[#700b10]">Our Purpose</h2>
                            <div className="space-y-6 text-gray-600 text-base md:text-lg font-nunito">
                                <p>
                                    At Nilkanth Store Trade Name : ILAVIZ, our purpose is to make every spiritual moment more meaningful — by offering products that help you connect deeply with your faith, traditions, and inner peace. Rooted in a profound understanding of pooja practices and cultural significance, we are honored to be part of countless sacred rituals across homes and temples.
                                </p>
                                <p>
                                    We also believe that spirituality and sustainability go hand in hand. That's why we are committed to using eco-friendly materials and reducing waste — honoring not just the divine, but also the Earth that sustains us. With devotion at our core, we strive to serve with purity, purpose, and responsibility.
                                </p>
                            </div>
                            <a
                                href="/bulk-order"
                                className="inline-block text-[#700b10] font-bold border-b-2 border-[#700b10] pb-1 hover:text-[#5a090d] hover:border-[#5a090d] transition-all font-nunito"
                            >
                                Learn more
                            </a>
                        </div>
                        <div className="w-full md:w-5/12 rounded-[2.5rem] overflow-hidden shadow-2xl">
                            <img
                                src="https://cdn.shopify.com/s/files/1/0804/0867/4532/files/Bhagvat-poojan_Collections_2_39ac439b-4dd3-40b6-aa90-fe81614d2527.webp?v=1774257288"
                                alt="Our Purpose - Product"
                                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                                onError={(e) => { e.target.src = "https://cdn.shopify.com/s/files/1/0804/0867/4532/files/about_us_contact_us_bhagvat_poojan_4_1.webp?v=1774254662"; }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. TESTIMONIALS SECTION */}
            <section className="py-16 md:py-28 bg-[#FDFBF7] testimonial-slider-container overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 text-center">
                    <h2 className="text-4xl md:text-5xl font-tenor text-[#700b10] mb-16 md:mb-24">Testimonial</h2>

                    <div className="relative px-4">
                        <Swiper
                            modules={[Autoplay, Pagination]}
                            spaceBetween={30}
                            slidesPerView={1}
                            autoplay={{ delay: 4000, disableOnInteraction: false }}
                            pagination={{ clickable: true }}
                            breakpoints={{
                                640: {
                                    slidesPerView: 1,
                                },
                                1024: {
                                    slidesPerView: 2,
                                },
                                1280: {
                                    slidesPerView: 3,
                                }
                            }}
                            className="testimonial-swiper !pb-12"
                        >
                            {testimonials.map((t, i) => (
                                <SwiperSlide key={i}>
                                    <div className="px-4">
                                        <div className="flex flex-col items-center gap-6 group">
                                            <div className="w-40 h-40 md:w-48 md:h-48 rounded-[2rem] overflow-hidden shadow-xl border-4 border-white transition-transform duration-500 group-hover:-translate-y-2">
                                                <img
                                                    src={t.image}
                                                    alt={t.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="space-y-4 max-w-sm mx-auto">
                                                <p className="text-gray-700 font-nunito text-lg italic leading-relaxed">
                                                    "{t.text}"
                                                </p>
                                                <div className="space-y-1">
                                                    <h4 className="font-bold text-[#700b10] text-xl font-nunito">{t.name}</h4>
                                                    <p className="text-gray-500 font-nunito font-semibold">{t.location}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </section>

            <style jsx global>{`
                .testimonial-swiper .swiper-pagination-bullet {
                    background-color: #D1D5DB;
                    opacity: 1;
                    width: 10px;
                    height: 10px;
                    transition: all 0.3s ease;
                }
                .testimonial-swiper .swiper-pagination-bullet-active {
                    background-color: #700b10;
                    width: 32px;
                    border-radius: 9999px;
                }
                .testimonial-swiper .swiper-pagination {
                    bottom: 0px !important;
                }
            `}</style>
        </main>
    );
}


// // src\app\about\page.js



// "use client";

// import React from 'react';
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination";
// import { FiChevronRight } from 'react-icons/fi';

// export default function AboutPage() {

//     const testimonials = [
//         {
//             name: "Ritik Sharma",
//             location: "Varanasi",
//             image: "https://cdn.shopify.com/s/files/1/0804/0867/4532/files/Gemini_Generated_Image_c00uhoc00uhoc00u_1.webp?v=1774257665",
//             text: "Nilkanth Store by ILAVIZ truly understands devotion. The quality of their brass lota and pooja items is unmatched — it feels like every piece is made with pure intention."
//         },
//         {
//             name: "Divyesh Mehta",
//             location: "Jaipur",
//             image: "https://cdn.shopify.com/s/files/1/0804/0867/4532/files/Gemini_Generated_Image_k8frnqk8frnqk8fr.webp?v=1774257666",
//             text: "I appreciate the attention to detail and authenticity in every product. You can tell Nilkanth Store by ILAVIZ is built on values, not just sales."
//         },

//         {
//             name: "Amit Desai",
//             location: "Ahmedabad",
//             image: "https://cdn.shopify.com/s/files/1/0804/0867/4532/files/Gemini_Generated_Image_2niogn2niogn2nio.webp?v=1774257665",
//             text: "I ordered a silver kalash for a family ritual, and it was delivered with such care. Beautifully packed, authentic, and full of spiritual energy."
//         },
//         {
//             name: "Sanjay Patel",
//             location: "Surat",
//             image: "https://cdn.shopify.com/s/files/1/0804/0867/4532/files/Gemini_Generated_Image_rix1srix1srix1sr.webp?v=1774257666",
//             text: "The collection at Nilkanth Store by ILAVIZ is simply divine. I found everything I needed for my home temple in one place. Highly recommended!"
//         },
//         {
//             name: "Meera Shah",
//             location: "Mumbai",
//             image: "https://cdn.shopify.com/s/files/1/0804/0867/4532/files/Gemini_Generated_Image_qw2zorqw2zorqw2z.webp?v=1774257666",
//             text: "Exquisite craftsmanship and very prompt delivery. The brass idols have a beautiful finish that reflects the artisans' dedication."
//         }
//     ];

//     return (
//         <main className="min-h-screen bg-white">
//             {/* 1. TOP BANNER SECTION */}
//             <div className="max-w-[100rem] mx-auto pt-0 md:pt-4 px-0 md:px-8 lg:px-12 mb-8">
//                 <div className="w-full overflow-hidden rounded-none md:rounded-2xl bg-white shadow-md border-0 md:border border-yellow-100/50 flex items-center justify-center text-center max-w-7xl mx-auto">
//                     <img
//                         src="https://cdn.shopify.com/s/files/1/0804/0867/4532/files/about_us_contact_us_bhagvat_poojan_2_1.webp?v=1774257001"
//                         className="w-full h-full object-contain object-center"
//                         alt="About Us Banner"
//                     />
//                 </div>
//             </div>

//             {/* 2. SACRED RESPONSIBILITY SECTION */}
//             <section className="bg-[#FDFBF7] py-12 md:py-20 overflow-hidden">
//                 <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
//                     <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
//                         <div className="w-full md:w-1/2 rounded-3xl overflow-hidden shadow-xl">
//                             <img
//                                 src="https://cdn.shopify.com/s/files/1/0804/0867/4532/files/SHOPPING_INFORMATION_1_2.webp?v=1774257059"
//                                 alt="Sacred Items"
//                                 className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
//                                 onError={(e) => { e.target.src = "https://cdn.shopify.com/s/files/1/0804/0867/4532/files/about_us_contact_us_bhagvat_poojan_4_1.webp?v=1774254662"; }}
//                             />
//                         </div>
//                         <div className="w-full md:w-1/2 space-y-4 md:space-y-6">
//                             <h3 className="text-[#C5A358] font-nunito font-semibold text-lg md:text-xl tracking-wide">Nilkanth Store by ILAVIZ</h3>
//                             <h2 className="text-4xl md:text-5xl lg:text-5xl font-tenor text-[#700b10] leading-tight">Sacred Responsibility</h2>
//                             <p className="text-gray-600 text-base md:text-lg leading-relaxed font-nunito">
//                                 At Nilkanth Store by ILAVIZ, we honor tradition with responsibility. Our products are thoughtfully sourced and crafted using ethical practices that respect both nature and spirituality. By supporting sustainable craftsmanship, we not only preserve cultural heritage but also uplift the artisans and communities behind each sacred creation.
//                             </p>
//                             <a
//                                 href="/products"
//                                 className="inline-flex items-center gap-2 px-8 py-4 bg-[#EBD99C] text-[#700b10] rounded-xl font-bold font-nunito hover:bg-[#DBC686] transition-all duration-300 shadow-lg shadow-yellow-900/10 group"
//                             >
//                                 Explore our products
//                                 <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
//                             </a>
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             {/* 3. MAROON QUOTE SECTION */}
//             <section className="bg-[#700b10] py-16 md:py-24 text-center px-4">
//                 <div className="max-w-4xl mx-auto space-y-6">
//                     <p className="text-white text-xl md:text-2xl lg:text-2xl font-tenor italic leading-relaxed">
//                         " Nilkanth Store by ILAVIZ is guided by devotion, integrity, and purpose. We aim to bring lasting value to every soul we connect with — from our customers and artisans to the communities and traditions we proudly uphold."
//                     </p>
//                     <p className="text-white font-nunito font-bold text-lg md:text-xl tracking-widest uppercase opacity-90">
//                         - Nilkanth Store by ILAVIZ
//                     </p>
//                 </div>
//             </section>

//             {/* 4. WHO WE ARE SECTION */}
//             <section className="py-12 md:py-24 bg-white">
//                 <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
//                     <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
//                         <div className="w-full md:w-5/12 rounded-[2.5rem] overflow-hidden bg-[#FDFBF7]">
//                             <img
//                                 src="https://cdn.shopify.com/s/files/1/0804/0867/4532/files/Copy_of_Bhagvat-poojan_Collections_3.webp?v=1774257182"
//                                 alt="Who we are illustration"
//                                 className="w-full h-auto object-contain"
//                                 onError={(e) => { e.target.src = "https://cdn.shopify.com/s/files/1/0804/0867/4532/files/about_us_contact_us_bhagvat_poojan_4_1.webp?v=1774254662"; }}
//                             />
//                         </div>
//                         <div className="w-full md:w-7/12 space-y-4 md:space-y-6">
//                             <h3 className="text-[#C5A358] font-nunito font-semibold text-lg tracking-wide uppercase">Tradition with Purpose</h3>
//                             <h2 className="text-4xl md:text-5xl lg:text-5xl font-tenor text-[#700b10]">Who we are</h2>
//                             <p className="text-gray-600 text-base md:text-lg leading-relaxed font-nunito">
//                                 At Nilkanth Store by ILAVIZ, we are devoted to bringing purity, tradition, and spiritual grace into every home. Rooted in the essence of Indian rituals, our mission is to preserve sacred customs while making them accessible for the modern devotee. Every product we offer is a reflection of our commitment to authenticity, devotion, and trust.
//                             </p>
//                             <a
//                                 href="/products"
//                                 className="inline-block text-[#700b10] font-bold border-b-2 border-[#700b10] pb-1 hover:text-[#5a090d] hover:border-[#5a090d] transition-all font-nunito"
//                             >
//                                 Discover Now
//                             </a>
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             {/* 5. OUR PURPOSE SECTION */}
//             <section className="py-12 md:py-24 bg-white">
//                 <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
//                     <div className="flex flex-col-reverse md:flex-row items-center gap-8 md:gap-16">
//                         <div className="w-full md:w-7/12 space-y-4 md:space-y-6">
//                             <h3 className="text-[#C5A358] font-nunito font-semibold text-lg tracking-wide uppercase">Our Commitment</h3>
//                             <h2 className="text-4xl md:text-5xl lg:text-5xl font-tenor text-[#700b10]">Our Purpose</h2>
//                             <div className="space-y-6 text-gray-600 text-base md:text-lg font-nunito">
//                                 <p>
//                                     At Nilkanth Store by ILAVIZ, our purpose is to make every spiritual moment more meaningful — by offering products that help you connect deeply with your faith, traditions, and inner peace. Rooted in a profound understanding of pooja practices and cultural significance, we are honored to be part of countless sacred rituals across homes and temples.
//                                 </p>
//                                 <p>
//                                     We also believe that spirituality and sustainability go hand in hand. That's why we are committed to using eco-friendly materials and reducing waste — honoring not just the divine, but also the Earth that sustains us. With devotion at our core, we strive to serve with purity, purpose, and responsibility.
//                                 </p>
//                             </div>
//                             <a
//                                 href="/bulk-order"
//                                 className="inline-block text-[#700b10] font-bold border-b-2 border-[#700b10] pb-1 hover:text-[#5a090d] hover:border-[#5a090d] transition-all font-nunito"
//                             >
//                                 Learn more
//                             </a>
//                         </div>
//                         <div className="w-full md:w-5/12 rounded-[2.5rem] overflow-hidden shadow-2xl">
//                             <img
//                                 src="https://cdn.shopify.com/s/files/1/0804/0867/4532/files/Bhagvat-poojan_Collections_2_39ac439b-4dd3-40b6-aa90-fe81614d2527.webp?v=1774257288"
//                                 alt="Our Purpose - Product"
//                                 className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
//                                 onError={(e) => { e.target.src = "https://cdn.shopify.com/s/files/1/0804/0867/4532/files/about_us_contact_us_bhagvat_poojan_4_1.webp?v=1774254662"; }}
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             {/* 6. TESTIMONIALS SECTION */}
//             <section className="py-16 md:py-28 bg-[#FDFBF7] testimonial-slider-container overflow-hidden">
//                 <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 text-center">
//                     <h2 className="text-4xl md:text-5xl font-tenor text-[#700b10] mb-16 md:mb-24">Testimonial</h2>

//                     <div className="relative px-4">
//                         <Swiper
//                             modules={[Autoplay, Pagination]}
//                             spaceBetween={30}
//                             slidesPerView={1}
//                             autoplay={{ delay: 4000, disableOnInteraction: false }}
//                             pagination={{ clickable: true }}
//                             breakpoints={{
//                                 640: {
//                                     slidesPerView: 1,
//                                 },
//                                 1024: {
//                                     slidesPerView: 2,
//                                 },
//                                 1280: {
//                                     slidesPerView: 3,
//                                 }
//                             }}
//                             className="testimonial-swiper !pb-12"
//                         >
//                             {testimonials.map((t, i) => (
//                                 <SwiperSlide key={i}>
//                                     <div className="px-4">
//                                         <div className="flex flex-col items-center gap-6 group">
//                                             <div className="w-40 h-40 md:w-48 md:h-48 rounded-[2rem] overflow-hidden shadow-xl border-4 border-white transition-transform duration-500 group-hover:-translate-y-2">
//                                                 <img
//                                                     src={t.image}
//                                                     alt={t.name}
//                                                     className="w-full h-full object-cover"
//                                                 />
//                                             </div>
//                                             <div className="space-y-4 max-w-sm mx-auto">
//                                                 <p className="text-gray-700 font-nunito text-lg italic leading-relaxed">
//                                                     "{t.text}"
//                                                 </p>
//                                                 <div className="space-y-1">
//                                                     <h4 className="font-bold text-[#700b10] text-xl font-nunito">{t.name}</h4>
//                                                     <p className="text-gray-500 font-nunito font-semibold">{t.location}</p>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </SwiperSlide>
//                             ))}
//                         </Swiper>
//                     </div>
//                 </div>
//             </section>

//             <style jsx global>{`
//                 .testimonial-swiper .swiper-pagination-bullet {
//                     background-color: #D1D5DB;
//                     opacity: 1;
//                     width: 10px;
//                     height: 10px;
//                     transition: all 0.3s ease;
//                 }
//                 .testimonial-swiper .swiper-pagination-bullet-active {
//                     background-color: #700b10;
//                     width: 32px;
//                     border-radius: 9999px;
//                 }
//                 .testimonial-swiper .swiper-pagination {
//                     bottom: 0px !important;
//                 }
//             `}</style>
//         </main>
//     );
// }


// // "use client";

// // import React from 'react';
// // import { Swiper, SwiperSlide } from "swiper/react";
// // import { Autoplay, Pagination } from "swiper/modules";
// // import "swiper/css";
// // import "swiper/css/pagination";
// // import { FiChevronRight } from 'react-icons/fi';

// // export default function AboutPage() {

// //     const testimonials = [
// //         {
// //             name: "Ritik Sharma",
// //             location: "Varanasi",
// //             image: "https://cdn.shopify.com/s/files/1/0804/0867/4532/files/Gemini_Generated_Image_c00uhoc00uhoc00u_1.webp?v=1774257665",
// //             text: "Shri Nilkanth Store truly understands devotion. The quality of their brass lota and pooja items is unmatched — it feels like every piece is made with pure intention."
// //         },
// //         {
// //             name: "Divyesh Mehta",
// //             location: "Jaipur",
// //             image: "https://cdn.shopify.com/s/files/1/0804/0867/4532/files/Gemini_Generated_Image_k8frnqk8frnqk8fr.webp?v=1774257666",
// //             text: "I appreciate the attention to detail and authenticity in every product. You can tell Shri Nilkanth Store is built on values, not just sales."
// //         },

// //         {
// //             name: "Amit Desai",
// //             location: "Ahmedabad",
// //             image: "https://cdn.shopify.com/s/files/1/0804/0867/4532/files/Gemini_Generated_Image_2niogn2niogn2nio.webp?v=1774257665",
// //             text: "I ordered a silver kalash for a family ritual, and it was delivered with such care. Beautifully packed, authentic, and full of spiritual energy."
// //         },
// //         {
// //             name: "Sanjay Patel",
// //             location: "Surat",
// //             image: "https://cdn.shopify.com/s/files/1/0804/0867/4532/files/Gemini_Generated_Image_rix1srix1srix1sr.webp?v=1774257666",
// //             text: "The collection at Nilkanth Store is simply divine. I found everything I needed for my home temple in one place. Highly recommended!"
// //         },
// //         {
// //             name: "Meera Shah",
// //             location: "Mumbai",
// //             image: "https://cdn.shopify.com/s/files/1/0804/0867/4532/files/Gemini_Generated_Image_qw2zorqw2zorqw2z.webp?v=1774257666",
// //             text: "Exquisite craftsmanship and very prompt delivery. The brass idols have a beautiful finish that reflects the artisans' dedication."
// //         }
// //     ];

// //     return (
// //         <main className="min-h-screen bg-white">
// //             {/* 1. TOP BANNER SECTION */}
// //             <div className="max-w-[100rem] mx-auto pt-0 md:pt-4 px-0 md:px-8 lg:px-12 mb-8">
// //                 <div className="w-full overflow-hidden rounded-none md:rounded-2xl bg-white shadow-md border-0 md:border border-yellow-100/50 flex items-center justify-center text-center max-w-7xl mx-auto">
// //                     <img
// //                         src="https://cdn.shopify.com/s/files/1/0804/0867/4532/files/about_us_contact_us_bhagvat_poojan_2_1.webp?v=1774257001"
// //                         className="w-full h-full object-contain object-center"
// //                         alt="About Us Banner"
// //                     />
// //                 </div>
// //             </div>

// //             {/* 2. SACRED RESPONSIBILITY SECTION */}
// //             <section className="bg-[#FDFBF7] py-12 md:py-20 overflow-hidden">
// //                 <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
// //                     <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
// //                         <div className="w-full md:w-1/2 rounded-3xl overflow-hidden shadow-xl">
// //                             <img
// //                                 src="https://cdn.shopify.com/s/files/1/0804/0867/4532/files/SHOPPING_INFORMATION_1_2.webp?v=1774257059"
// //                                 alt="Sacred Items"
// //                                 className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
// //                                 onError={(e) => { e.target.src = "https://cdn.shopify.com/s/files/1/0804/0867/4532/files/about_us_contact_us_bhagvat_poojan_4_1.webp?v=1774254662"; }}
// //                             />
// //                         </div>
// //                         <div className="w-full md:w-1/2 space-y-4 md:space-y-6">
// //                             <h3 className="text-[#C5A358] font-nunito font-semibold text-lg md:text-xl tracking-wide">Shri Nilkanth Store</h3>
// //                             <h2 className="text-4xl md:text-5xl lg:text-5xl font-tenor text-[#700b10] leading-tight">Sacred Responsibility</h2>
// //                             <p className="text-gray-600 text-base md:text-lg leading-relaxed font-nunito">
// //                                 At Shri Nilkanth Store, we honor tradition with responsibility. Our products are thoughtfully sourced and crafted using ethical practices that respect both nature and spirituality. By supporting sustainable craftsmanship, we not only preserve cultural heritage but also uplift the artisans and communities behind each sacred creation.
// //                             </p>
// //                             <a
// //                                 href="/products"
// //                                 className="inline-flex items-center gap-2 px-8 py-4 bg-[#EBD99C] text-[#700b10] rounded-xl font-bold font-nunito hover:bg-[#DBC686] transition-all duration-300 shadow-lg shadow-yellow-900/10 group"
// //                             >
// //                                 Explore our products
// //                                 <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
// //                             </a>
// //                         </div>
// //                     </div>
// //                 </div>
// //             </section>

// //             {/* 3. MAROON QUOTE SECTION */}
// //             <section className="bg-[#700b10] py-16 md:py-24 text-center px-4">
// //                 <div className="max-w-4xl mx-auto space-y-6">
// //                     <p className="text-white text-xl md:text-2xl lg:text-2xl font-tenor italic leading-relaxed">
// //                         " Shri Nilkanth Store is guided by devotion, integrity, and purpose. We aim to bring lasting value to every soul we connect with — from our customers and artisans to the communities and traditions we proudly uphold."
// //                     </p>
// //                     <p className="text-white font-nunito font-bold text-lg md:text-xl tracking-widest uppercase opacity-90">
// //                         - Shri Nilkanth Store
// //                     </p>
// //                 </div>
// //             </section>

// //             {/* 4. WHO WE ARE SECTION */}
// //             <section className="py-12 md:py-24 bg-white">
// //                 <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
// //                     <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
// //                         <div className="w-full md:w-5/12 rounded-[2.5rem] overflow-hidden bg-[#FDFBF7]">
// //                             <img
// //                                 src="https://cdn.shopify.com/s/files/1/0804/0867/4532/files/Copy_of_Bhagvat-poojan_Collections_3.webp?v=1774257182"
// //                                 alt="Who we are illustration"
// //                                 className="w-full h-auto object-contain"
// //                                 onError={(e) => { e.target.src = "https://cdn.shopify.com/s/files/1/0804/0867/4532/files/about_us_contact_us_bhagvat_poojan_4_1.webp?v=1774254662"; }}
// //                             />
// //                         </div>
// //                         <div className="w-full md:w-7/12 space-y-4 md:space-y-6">
// //                             <h3 className="text-[#C5A358] font-nunito font-semibold text-lg tracking-wide uppercase">Tradition with Purpose</h3>
// //                             <h2 className="text-4xl md:text-5xl lg:text-5xl font-tenor text-[#700b10]">Who we are</h2>
// //                             <p className="text-gray-600 text-base md:text-lg leading-relaxed font-nunito">
// //                                 At Shri Nilkanth Store, we are devoted to bringing purity, tradition, and spiritual grace into every home. Rooted in the essence of Indian rituals, our mission is to preserve sacred customs while making them accessible for the modern devotee. Every product we offer is a reflection of our commitment to authenticity, devotion, and trust.
// //                             </p>
// //                             <a
// //                                 href="/products"
// //                                 className="inline-block text-[#700b10] font-bold border-b-2 border-[#700b10] pb-1 hover:text-[#5a090d] hover:border-[#5a090d] transition-all font-nunito"
// //                             >
// //                                 Discover Now
// //                             </a>
// //                         </div>
// //                     </div>
// //                 </div>
// //             </section>

// //             {/* 5. OUR PURPOSE SECTION */}
// //             <section className="py-12 md:py-24 bg-white">
// //                 <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
// //                     <div className="flex flex-col-reverse md:flex-row items-center gap-8 md:gap-16">
// //                         <div className="w-full md:w-7/12 space-y-4 md:space-y-6">
// //                             <h3 className="text-[#C5A358] font-nunito font-semibold text-lg tracking-wide uppercase">Our Commitment</h3>
// //                             <h2 className="text-4xl md:text-5xl lg:text-5xl font-tenor text-[#700b10]">Our Purpose</h2>
// //                             <div className="space-y-6 text-gray-600 text-base md:text-lg font-nunito">
// //                                 <p>
// //                                     At Shri Nilkanth Store, our purpose is to make every spiritual moment more meaningful — by offering products that help you connect deeply with your faith, traditions, and inner peace. Rooted in a profound understanding of pooja practices and cultural significance, we are honored to be part of countless sacred rituals across homes and temples.
// //                                 </p>
// //                                 <p>
// //                                     We also believe that spirituality and sustainability go hand in hand. That's why we are committed to using eco-friendly materials and reducing waste — honoring not just the divine, but also the Earth that sustains us. With devotion at our core, we strive to serve with purity, purpose, and responsibility.
// //                                 </p>
// //                             </div>
// //                             <a
// //                                 href="/bulk-order"
// //                                 className="inline-block text-[#700b10] font-bold border-b-2 border-[#700b10] pb-1 hover:text-[#5a090d] hover:border-[#5a090d] transition-all font-nunito"
// //                             >
// //                                 Learn more
// //                             </a>
// //                         </div>
// //                         <div className="w-full md:w-5/12 rounded-[2.5rem] overflow-hidden shadow-2xl">
// //                             <img
// //                                 src="https://cdn.shopify.com/s/files/1/0804/0867/4532/files/Bhagvat-poojan_Collections_2_39ac439b-4dd3-40b6-aa90-fe81614d2527.webp?v=1774257288"
// //                                 alt="Our Purpose - Product"
// //                                 className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
// //                                 onError={(e) => { e.target.src = "https://cdn.shopify.com/s/files/1/0804/0867/4532/files/about_us_contact_us_bhagvat_poojan_4_1.webp?v=1774254662"; }}
// //                             />
// //                         </div>
// //                     </div>
// //                 </div>
// //             </section>

// //             {/* 6. TESTIMONIALS SECTION */}
// //             <section className="py-16 md:py-28 bg-[#FDFBF7] testimonial-slider-container overflow-hidden">
// //                 <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 text-center">
// //                     <h2 className="text-4xl md:text-5xl font-tenor text-[#700b10] mb-16 md:mb-24">Testimonial</h2>

// //                     <div className="relative px-4">
// //                         <Swiper
// //                             modules={[Autoplay, Pagination]}
// //                             spaceBetween={30}
// //                             slidesPerView={1}
// //                             autoplay={{ delay: 4000, disableOnInteraction: false }}
// //                             pagination={{ clickable: true }}
// //                             breakpoints={{
// //                                 640: {
// //                                     slidesPerView: 1,
// //                                 },
// //                                 1024: {
// //                                     slidesPerView: 2,
// //                                 },
// //                                 1280: {
// //                                     slidesPerView: 3,
// //                                 }
// //                             }}
// //                             className="testimonial-swiper !pb-12"
// //                         >
// //                             {testimonials.map((t, i) => (
// //                                 <SwiperSlide key={i}>
// //                                     <div className="px-4">
// //                                         <div className="flex flex-col items-center gap-6 group">
// //                                             <div className="w-40 h-40 md:w-48 md:h-48 rounded-[2rem] overflow-hidden shadow-xl border-4 border-white transition-transform duration-500 group-hover:-translate-y-2">
// //                                                 <img
// //                                                     src={t.image}
// //                                                     alt={t.name}
// //                                                     className="w-full h-full object-cover"
// //                                                 />
// //                                             </div>
// //                                             <div className="space-y-4 max-w-sm mx-auto">
// //                                                 <p className="text-gray-700 font-nunito text-lg italic leading-relaxed">
// //                                                     "{t.text}"
// //                                                 </p>
// //                                                 <div className="space-y-1">
// //                                                     <h4 className="font-bold text-[#700b10] text-xl font-nunito">{t.name}</h4>
// //                                                     <p className="text-gray-500 font-nunito font-semibold">{t.location}</p>
// //                                                 </div>
// //                                             </div>
// //                                         </div>
// //                                     </div>
// //                                 </SwiperSlide>
// //                             ))}
// //                         </Swiper>
// //                     </div>
// //                 </div>
// //             </section>

// //             <style jsx global>{`
// //                 .testimonial-swiper .swiper-pagination-bullet {
// //                     background-color: #D1D5DB;
// //                     opacity: 1;
// //                     width: 10px;
// //                     height: 10px;
// //                     transition: all 0.3s ease;
// //                 }
// //                 .testimonial-swiper .swiper-pagination-bullet-active {
// //                     background-color: #700b10;
// //                     width: 32px;
// //                     border-radius: 9999px;
// //                 }
// //                 .testimonial-swiper .swiper-pagination {
// //                     bottom: 0px !important;
// //                 }
// //             `}</style>
// //         </main>
// //     );
// // }
