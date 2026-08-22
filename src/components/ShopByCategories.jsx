// src\components\ShopByCategories.jsx

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function ShopByCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loaded, setLoaded] = useState(false);

    const [sliderRef, instanceRef] = useKeenSlider({
        initial: 0,
        mode: "snap",
        slides: {
            perView: 2.3,
            spacing: 10,
        },
        breakpoints: {
            "(min-width: 480px)": {
                slides: { perView: 3.2, spacing: 12 },
            },
            "(min-width: 640px)": {
                slides: { perView: 3.8, spacing: 14 },
            },
            "(min-width: 768px)": {
                slides: { perView: 4.5, spacing: 16 },
            },
            "(min-width: 1024px)": {
                slides: { perView: 5.5, spacing: 18 },
            },
            "(min-width: 1280px)": {
                slides: { perView: 6.5, spacing: 20 },
            },
        },
        slideChanged(slider) {
            setCurrentSlide(slider.track.details.rel);
        },
        created() {
            setLoaded(true);
        },
    });

    useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await fetch("/api/collections");
                const data = await response.json();

                if (data.success && data.collections) {
                    const filteredCategories = data.collections.filter(category => {
                        const count = Number(category.product_count ?? category.products_count ?? category.productsCount ?? (category.products?.length || 0));
                        if (count === 0) return false;

                        const metafields = category.metafields || [];
                        
                        const isVisible = metafields.some(m => m.key === "is_visible" && m.value === "true");
                        
                        const whereToShowMeta = metafields.find(m => m.key === "where_to_show" || m.key === "whereToShow");
                        let isShopByCategories = false;
                        
                        if (whereToShowMeta && whereToShowMeta.value) {
                            try {
                                const parsed = JSON.parse(whereToShowMeta.value);
                                if (Array.isArray(parsed)) {
                                    isShopByCategories = parsed.some(v => v.toLowerCase() === "shop by categories");
                                } else {
                                    isShopByCategories = String(parsed).toLowerCase() === "shop by categories";
                                }
                            } catch (e) {
                                isShopByCategories = whereToShowMeta.value.toLowerCase().includes("shop by categories");
                            }
                        }
                        
                        return isVisible && isShopByCategories;
                    });
                    
                    setCategories(filteredCategories);
                }
            } catch (error) {
                console.error("Failed to fetch collections:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchCategories();
    }, []);

    if (loading) {
        return (
            <section className="w-full py-16 text-center">
                <p className="text-[#700b10] font-bold animate-pulse">
                    Loading Categories...
                </p>
            </section>
        );
    }

    if (!categories.length) return null;

    const showArrows =
        loaded &&
        instanceRef.current &&
        instanceRef.current.track.details.slides.length >
        instanceRef.current.options.slides.perView;

    return (
        <section className="w-full bg-white py-4 md:py-12 relative">
            <div className="max-w-[90rem] mx-auto md:px-6 px-4">

                {/* TITLE */}
                <h2 className="text-center  text-2xl md:text-5xl font-nunito text-[#700b10] font-bold mb-4 md:mb-16 tracking-tight">
                    Shop by Categories
                </h2>

                <div className="relative">

                    {/* LEFT BUTTON */}
                    {showArrows && (
                        <button
                            onClick={() => instanceRef.current?.prev()}
                            className="absolute left-[-10px] top-[40%] -translate-y-1/2 z-10
                                bg-white/90 backdrop-blur-sm text-[#700b10] md:w-12 w-8 md:h-12 h-8 rounded-full
                                flex items-center justify-center shadow-xl border border-yellow-100/50
                                hover:bg-[#700b10] hover:text-white transition-all duration-300 group" >
                            <FiChevronLeft className="md:h-6 h-4 md:w-6 w-4" />
                        </button>
                    )}

                    {/* SLIDER */}
                    <div ref={sliderRef} className="keen-slider px-2">

                        {categories.map((category) => (
                            <div
                                key={category.id}
                                className="keen-slider__slide flex flex-col items-center"
                            >
                                <Link
                                    href={`/collections/${category.handle}`}
                                    className="flex flex-col items-center group w-full"
                                >
                                    <div className="w-full md:mb-6 mb-2 relative group">
                                        <div className="relative aspect-square w-full rounded-md overflow-hidden transition-all duration-500 shadow-sm">
                                            {category.image ? (
                                                <img
                                                    src={category.image.url}
                                                    alt={category.image.altText || category.title}
                                                    className="w-full h-full object-cover transition-transform duration-700"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-50 flex items-center justify-center text-xs text-gray-400 font-bold uppercase tracking-widest">
                                                    {category.title.substring(0, 2)}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <h3 className="font-[600] font-nunito text-[#1a1a1a] text-xs sm:text-sm text-center uppercase tracking-[0.05em] group-hover:text-[#700b10] transition-colors duration-300">
                                        {category.title.length > 20
                                            ? category.title.slice(0, 20) + "..."
                                            : category.title}
                                    </h3>
                                </Link>
                            </div>
                        ))}

                    </div>

                    {/* RIGHT BUTTON */}
                    {showArrows && (
                        <button
                            onClick={() => instanceRef.current?.next()}
                            className="absolute right-[-10px] top-[40%] -translate-y-1/2 z-10
                                bg-white/90 backdrop-blur-sm text-[#700b10] md:w-12 w-8 md:h-12 h-8 rounded-full
                                flex items-center justify-center shadow-xl border border-yellow-100/50
                                hover:bg-[#700b10] hover:text-white transition-all duration-300 group">
                            <FiChevronRight className="md:h-6 h-4 md:w-6 w-4" />
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}

// "use client";

// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import { useKeenSlider } from "keen-slider/react";
// import "keen-slider/keen-slider.min.css";
// import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

// export default function ShopByCategories() {
//     const [categories, setCategories] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [currentSlide, setCurrentSlide] = useState(0);
//     const [loaded, setLoaded] = useState(false);

//     const [sliderRef, instanceRef] = useKeenSlider({
//         initial: 0,
//         mode: "snap",
//         slides: {
//             perView: 2.2,
//             spacing: 16,
//         },
//         breakpoints: {
//             "(min-width: 640px)": {
//                 slides: { perView: 3.2, spacing: 16 },
//             },
//             "(min-width: 1024px)": {
//                 slides: { perView: 4.3, spacing: 20 },
//             },
//         },
//         slideChanged(slider) {
//             setCurrentSlide(slider.track.details.rel);
//         },
//         created() {
//             setLoaded(true);
//         },
//     });

//     useEffect(() => {
//         async function fetchCategories() {
//             try {
//                 const response = await fetch("/api/collections");
//                 const data = await response.json();

//                 if (data.success && data.collections) {
//                     const filteredCategories = data.collections.filter(category => {
//                         const metafields = category.metafields || [];
                        
//                         const isVisible = metafields.some(m => m.key === "is_visible" && m.value === "true");
                        
//                         const whereToShowMeta = metafields.find(m => m.key === "where_to_show" || m.key === "whereToShow");
//                         let isShopByCategories = false;
                        
//                         if (whereToShowMeta && whereToShowMeta.value) {
//                             try {
//                                 const parsed = JSON.parse(whereToShowMeta.value);
//                                 if (Array.isArray(parsed)) {
//                                     isShopByCategories = parsed.some(v => v.toLowerCase() === "shop by categories");
//                                 } else {
//                                     isShopByCategories = String(parsed).toLowerCase() === "shop by categories";
//                                 }
//                             } catch (e) {
//                                 isShopByCategories = whereToShowMeta.value.toLowerCase().includes("shop by categories");
//                             }
//                         }
                        
//                         return isVisible && isShopByCategories;
//                     });
                    
//                     setCategories(filteredCategories);
//                 }
//             } catch (error) {
//                 console.error("Failed to fetch collections:", error);
//             } finally {
//                 setLoading(false);
//             }
//         }

//         fetchCategories();
//     }, []);

//     if (loading) {
//         return (
//             <section className="w-full py-16 text-center">
//                 <p className="text-[#700b10] font-bold animate-pulse">
//                     Loading Categories...
//                 </p>
//             </section>
//         );
//     }

//     if (!categories.length) return null;

//     const showArrows =
//         loaded &&
//         instanceRef.current &&
//         instanceRef.current.track.details.slides.length >
//         instanceRef.current.options.slides.perView;

//     return (
//         <section className="w-full bg-white py-4 md:py-12 relative">
//             <div className="max-w-[90rem] mx-auto md:px-6 px-4">

//                 {/* TITLE */}
//                 <h2 className="text-center  text-2xl md:text-5xl font-nunito text-[#700b10] font-bold mb-4 md:mb-16 tracking-tight">
//                     Shop by Categories
//                 </h2>

//                 <div className="relative">

//                     {/* LEFT BUTTON */}
//                     {showArrows && (
//                         <button
//                             onClick={() => instanceRef.current?.prev()}
//                             className="absolute left-[-10px] top-[40%] -translate-y-1/2 z-10
//                                 bg-white/90 backdrop-blur-sm text-[#700b10] md:w-12 w-8 md:h-12 h-8 rounded-full
//                                 flex items-center justify-center shadow-xl border border-yellow-100/50
//                                 hover:bg-[#700b10] hover:text-white transition-all duration-300 group" >
//                             <FiChevronLeft className="md:h-6 h-4 md:w-6 w-4" />
//                         </button>
//                     )}

//                     {/* SLIDER */}
//                     <div ref={sliderRef} className="keen-slider px-2">

//                         {categories.map((category) => (
//                             <div
//                                 key={category.id}
//                                 className="keen-slider__slide flex flex-col items-center"
//                             >
//                                 <Link
//                                     href={`/collections/${category.handle}`}
//                                     className="flex flex-col items-center group w-full"
//                                 >
//                                     <div className="w-full md:mb-6 mb-2 relative group">
//                                         {/* <div className="absolute inset-0 bg-[#700b10] rounded-md scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-10 transition-all duration-500"></div> */}
//                                         <div className="relative aspect-square w-full rounded-md overflow-hidden transition-all duration-500 shadow-sm">
//                                             {category.image ? (
//                                                 <img
//                                                     src={category.image.url}
//                                                     alt={category.image.altText || category.title}
//                                                     className="w-full h-full object-cover transition-transform duration-700"
//                                                 />
//                                             ) : (
//                                                 <div className="w-full h-full bg-gray-50 flex items-center justify-center text-xs text-gray-400 font-bold uppercase tracking-widest">
//                                                     {category.title.substring(0, 2)}
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </div>

//                                     <h3 className="font-[600] font-nunito text-[#1a1a1a] text-[8px] sm:text-sm text-center uppercase tracking-[0.1em] group-hover:text-[#700b10] transition-colors duration-300">
//                                         {category.title.length > 20
//                                             ? category.title.slice(0, 20) + "..."
//                                             : category.title}
//                                     </h3>
//                                 </Link>
//                             </div>
//                         ))}

//                     </div>

//                     {/* RIGHT BUTTON */}
//                     {showArrows && (
//                         <button
//                             onClick={() => instanceRef.current?.next()}
//                             className="absolute right-[-10px] top-[40%] -translate-y-1/2 z-10
//                                 bg-white/90 backdrop-blur-sm text-[#700b10] md:w-12 w-8 md:h-12 h-8 rounded-full
//                                 flex items-center justify-center shadow-xl border border-yellow-100/50
//                                 hover:bg-[#700b10] hover:text-white transition-all duration-300 group">
//                             <FiChevronRight className="md:h-6 h-4 md:w-6 w-4" />
//                         </button>
//                     )}
//                 </div>
//             </div>
//         </section>
//     );
// }