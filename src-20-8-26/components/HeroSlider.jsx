// src\components\HeroSlider.jsx

"use client";

import { useState, useEffect, useCallback } from "react";

const ChevronLeft = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m15 18-6-6 6-6" /></svg>
);

const ChevronRight = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6" /></svg>
);

const slides = [
    {
        id: 1,
        title: "Welcome to Nilkanth Store",
        subtitle: "Experience the divine taste of authentic prasadam",
        image: "https://cdn.shopify.com/s/files/1/0804/0867/4532/files/spray_banner_resized_1.webp?v=1774084110",
        mobileImage: "https://megaecomm.megascale.co.in/backend/media/16/general/78a2fa4a3f5850499b6276c98f251316.png",
        color: "bg-orange-100",
    },
    {
        id: 2,
        title: "Pure & Traditional",
        subtitle: "Prepared with utmost devotion and purity",
        image: "https://cdn.shopify.com/s/files/1/0804/0867/4532/files/pooja_samagri.webp?v=1774084110",
        mobileImage: "https://megaecomm.megascale.co.in/backend/media/16/general/a75ef2b51a1a39f4812c8c6444e56585.png",
        color: "bg-green-100",
    },
    {
        id: 3,
        title: "Delivered to Your Doorstep",
        subtitle: "Freshness guaranteed in every bite",
        image: "https://cdn.shopify.com/s/files/1/0804/0867/4532/files/vastu-yantra.webp?v=1774084110",
        mobileImage: "https://megaecomm.megascale.co.in/backend/media/16/general/59ada74baac42ac21d6353c7e5356c50.png",
        color: "bg-yellow-100",
    },
    // {
    //     id: 4,
    //     title: "Delivered to Your Doorstep",
    //     subtitle: "Freshness guaranteed in every bite",
    //     image: "https://cdn.shopify.com/s/files/1/0804/0867/4532/files/skin_care_hai_care.webp?v=1774084110",
    //     mobileImage: "https://cdn.shopify.com/s/files/1/0804/0867/4532/files/3_26728af4-4378-444c-bf34-39c3f0a74cec.webp?v=1774084465", // Replace with mobile link
    //     color: "bg-yellow-100",
    // },
    // {
    //     id: 5,
    //     title: "Delivered to Your Doorstep",
    //     subtitle: "Freshness guaranteed in every bite",
    //     image: "https://cdn.shopify.com/s/files/1/0804/0867/4532/files/aushadhi_1.webp?v=1774084111",
    //     mobileImage: "https://cdn.shopify.com/s/files/1/0804/0867/4532/files/1_1b1d2d72-b7c2-4125-ba9f-ed4eab210dfe.webp?v=1774084465", // Replace with mobile link
    //     color: "bg-yellow-100",
    // },
];

export default function HeroSlider() {
    const [currentSlide, setCurrentSlide] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    // Initial check and resize listener for mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const extendedSlides = [slides[slides.length - 1], ...slides, slides[0]];

    const nextSlide = useCallback(() => {
        setIsTransitioning(true);
        setCurrentSlide((prev) => {
            if (prev >= slides.length + 1) return prev;
            return prev + 1;
        });
    }, []);

    const prevSlide = useCallback(() => {
        setIsTransitioning(true);
        setCurrentSlide((prev) => {
            if (prev <= 0) return prev;
            return prev - 1;
        });
    }, []);

    const handleTransitionEnd = () => {
        if (currentSlide === extendedSlides.length - 1) {
            setIsTransitioning(false);
            setCurrentSlide(1);
        } else if (currentSlide === 0) {
            setIsTransitioning(false);
            setCurrentSlide(extendedSlides.length - 2);
        }
    };

    // Auto-slide functionality
    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(timer);
    }, [nextSlide, currentSlide]);

    return (
        <div className="relative w-full h-[55vh] sm:h-[60vh] md:h-[65vh] lg:h-[75vh] xl:h-[80vh] min-h-[260px] max-h-[750px] overflow-hidden bg-gray-900 group">
            {/* Slides Container */}
            <div
                className={`flex h-full ${isTransitioning ? 'transition-transform duration-700 ease-out' : ''}`}
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                onTransitionEnd={handleTransitionEnd}
            >
                {extendedSlides.map((slide, index) => (
                    <div
                        key={`${slide.id}-${index}`}
                        className={`min-w-full h-full relative flex items-center ${slide.color}`}
                    >
                        {/* Background Image */}
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${isMobile ? slide.mobileImage : slide.image})` }}
                        >
                            {/* <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div> */}
                        </div>

                        {/* Content Container */}
                        {/* <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 opacity-0 animate-fade-in-up"
                            style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
                            <div className="max-w-2xl text-white">
                                <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight drop-shadow-lg">
                                    {slide.title}
                                </h1>
                                <p className="text-lg md:text-2xl mb-8 text-gray-100 drop-shadow-md">
                                    {slide.subtitle}
                                </p>
                                <button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-full text-lg font-semibold transition-all transform hover:scale-105 shadow-xl">
                                    Explore Now
                                </button>
                            </div>
                        </div> */}
                    </div>
                ))}
            </div>

            {/* Navigation Controls */}
            <div className="absolute inset-0 flex items-center justify-between px-2 sm:px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <button
                    onClick={prevSlide}
                    className="p-2 sm:p-3 bg-black/40 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-all transform hover:scale-110 pointer-events-auto"
                    aria-label="Previous slide"
                >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button
                    onClick={nextSlide}
                    className="p-2 sm:p-3 bg-black/40 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-all transform hover:scale-110 pointer-events-auto"
                    aria-label="Next slide"
                >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
            </div>

            {/* Pagination Dots */}
            {/* <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-20">
                {slides.map((_, index) => {
                    const isActive = currentSlide === index + 1 ||
                        (currentSlide === extendedSlides.length - 1 && index === 0) ||
                        (currentSlide === 0 && index === slides.length - 1);

                    return (
                        <button
                            key={index}
                            onClick={() => {
                                setIsTransitioning(true);
                                setCurrentSlide(index + 1);
                            }}
                            className={`h-3 rounded-full transition-all duration-300 ${isActive
                                ? "w-10 bg-orange-500"
                                : "w-3 bg-white/50 hover:bg-white/80"
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    );
                })}
            </div> */}

            {/* Custom Styles for animations */}
            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
      `}} />
        </div>
    );
}


// "use client";

// import { useState, useEffect, useCallback } from "react";

// const ChevronLeft = ({ size = 24, className = "" }) => (
//     <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m15 18-6-6 6-6" /></svg>
// );

// const ChevronRight = ({ size = 24, className = "" }) => (
//     <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6" /></svg>
// );

// const slides = [
//     {
//         id: 1,
//         title: "Welcome to Nilkanth Store",
//         subtitle: "Experience the divine taste of authentic prasadam",
//         image: "https://cdn.shopify.com/s/files/1/0804/0867/4532/files/spray_banner_resized_1.webp?v=1774084110",
//         mobileImage: "https://cdn.shopify.com/s/files/1/0804/0867/4532/files/attar_spre_mobile_banner_c791e9e2-f27f-4a82-97e6-50a60a0db698.webp?v=1774084464", // Replace with mobile link
//         color: "bg-orange-100",
//     },
//     {
//         id: 2,
//         title: "Pure & Traditional",
//         subtitle: "Prepared with utmost devotion and purity",
//         image: "https://cdn.shopify.com/s/files/1/0804/0867/4532/files/pooja_samagri.webp?v=1774084110",
//         mobileImage: "https://cdn.shopify.com/s/files/1/0804/0867/4532/files/4_3e157270-4769-4c1c-9abf-c5e926895661.webp?v=1774084464", // Replace with mobile link
//         color: "bg-green-100",
//     },
//     {
//         id: 3,
//         title: "Delivered to Your Doorstep",
//         subtitle: "Freshness guaranteed in every bite",
//         image: "https://cdn.shopify.com/s/files/1/0804/0867/4532/files/vastu-yantra.webp?v=1774084110",
//         mobileImage: "https://cdn.shopify.com/s/files/1/0804/0867/4532/files/2_1.webp?v=1774084465", // Replace with mobile link
//         color: "bg-yellow-100",
//     },
//     {
//         id: 4,
//         title: "Delivered to Your Doorstep",
//         subtitle: "Freshness guaranteed in every bite",
//         image: "https://cdn.shopify.com/s/files/1/0804/0867/4532/files/skin_care_hai_care.webp?v=1774084110",
//         mobileImage: "https://cdn.shopify.com/s/files/1/0804/0867/4532/files/3_26728af4-4378-444c-bf34-39c3f0a74cec.webp?v=1774084465", // Replace with mobile link
//         color: "bg-yellow-100",
//     },
//     {
//         id: 5,
//         title: "Delivered to Your Doorstep",
//         subtitle: "Freshness guaranteed in every bite",
//         image: "https://cdn.shopify.com/s/files/1/0804/0867/4532/files/aushadhi_1.webp?v=1774084111",
//         mobileImage: "https://cdn.shopify.com/s/files/1/0804/0867/4532/files/1_1b1d2d72-b7c2-4125-ba9f-ed4eab210dfe.webp?v=1774084465", // Replace with mobile link
//         color: "bg-yellow-100",
//     },
// ];

// export default function HeroSlider() {
//     const [currentSlide, setCurrentSlide] = useState(1);
//     const [isTransitioning, setIsTransitioning] = useState(true);
//     const [isMobile, setIsMobile] = useState(false);

//     // Initial check and resize listener for mobile
//     useEffect(() => {
//         const checkMobile = () => {
//             setIsMobile(window.innerWidth < 768);
//         };
//         checkMobile();
//         window.addEventListener("resize", checkMobile);
//         return () => window.removeEventListener("resize", checkMobile);
//     }, []);

//     const extendedSlides = [slides[slides.length - 1], ...slides, slides[0]];

//     const nextSlide = useCallback(() => {
//         setIsTransitioning(true);
//         setCurrentSlide((prev) => {
//             if (prev >= slides.length + 1) return prev;
//             return prev + 1;
//         });
//     }, []);

//     const prevSlide = useCallback(() => {
//         setIsTransitioning(true);
//         setCurrentSlide((prev) => {
//             if (prev <= 0) return prev;
//             return prev - 1;
//         });
//     }, []);

//     const handleTransitionEnd = () => {
//         if (currentSlide === extendedSlides.length - 1) {
//             setIsTransitioning(false);
//             setCurrentSlide(1);
//         } else if (currentSlide === 0) {
//             setIsTransitioning(false);
//             setCurrentSlide(extendedSlides.length - 2);
//         }
//     };

//     // Auto-slide functionality
//     useEffect(() => {
//         const timer = setInterval(() => {
//             nextSlide();
//         }, 5000); // Change slide every 5 seconds

//         return () => clearInterval(timer);
//     }, [nextSlide, currentSlide]);

//     return (
//         <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[40vh] lg:h-[80vh] overflow-hidden bg-gray-900 group">
//             {/* Slides Container */}
//             <div
//                 className={`flex h-full ${isTransitioning ? 'transition-transform duration-700 ease-out' : ''}`}
//                 style={{ transform: `translateX(-${currentSlide * 100}%)` }}
//                 onTransitionEnd={handleTransitionEnd}
//             >
//                 {extendedSlides.map((slide, index) => (
//                     <div
//                         key={`${slide.id}-${index}`}
//                         className={`min-w-full h-full relative flex items-center ${slide.color}`}
//                     >
//                         {/* Background Image */}
//                         <div
//                             className="absolute inset-0 bg-cover bg-center"
//                             style={{ backgroundImage: `url(${isMobile ? slide.mobileImage : slide.image})` }}
//                         >
//                             {/* <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div> */}
//                         </div>

//                         {/* Content Container */}
//                         {/* <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 opacity-0 animate-fade-in-up"
//                             style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
//                             <div className="max-w-2xl text-white">
//                                 <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight drop-shadow-lg">
//                                     {slide.title}
//                                 </h1>
//                                 <p className="text-lg md:text-2xl mb-8 text-gray-100 drop-shadow-md">
//                                     {slide.subtitle}
//                                 </p>
//                                 <button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-full text-lg font-semibold transition-all transform hover:scale-105 shadow-xl">
//                                     Explore Now
//                                 </button>
//                             </div>
//                         </div> */}
//                     </div>
//                 ))}
//             </div>

//             {/* Navigation Controls */}
//             <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                 <button
//                     onClick={prevSlide}
//                     className="p-3 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-sm transition-all transform hover:scale-110"
//                     aria-label="Previous slide"
//                 >
//                     <ChevronLeft size={24} />
//                 </button>
//                 <button
//                     onClick={nextSlide}
//                     className="p-3 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-sm transition-all transform hover:scale-110"
//                     aria-label="Next slide"
//                 >
//                     <ChevronRight size={24} />
//                 </button>
//             </div>

//             {/* Pagination Dots */}
//             {/* <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-20">
//                 {slides.map((_, index) => {
//                     const isActive = currentSlide === index + 1 ||
//                         (currentSlide === extendedSlides.length - 1 && index === 0) ||
//                         (currentSlide === 0 && index === slides.length - 1);

//                     return (
//                         <button
//                             key={index}
//                             onClick={() => {
//                                 setIsTransitioning(true);
//                                 setCurrentSlide(index + 1);
//                             }}
//                             className={`h-3 rounded-full transition-all duration-300 ${isActive
//                                 ? "w-10 bg-orange-500"
//                                 : "w-3 bg-white/50 hover:bg-white/80"
//                             }`}
//                             aria-label={`Go to slide ${index + 1}`}
//                         />
//                     );
//                 })}
//             </div> */}

//             {/* Custom Styles for animations */}
//             <style dangerouslySetInnerHTML={{
//                 __html: `
//         @keyframes fade-in-up {
//           0% {
//             opacity: 0;
//             transform: translateY(30px);
//           }
//           100% {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-fade-in-up {
//           animation: fade-in-up 0.8s ease-out;
//         }
//       `}} />
//         </div>
//     );
// }
