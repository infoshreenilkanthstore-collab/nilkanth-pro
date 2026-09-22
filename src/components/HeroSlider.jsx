

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
        image: "https://megaecomm.megascale.co.in/backend/media/16/general/7c9009714fa69ec32c8f3d868d4839d9.jpg",
        mobileImage: "https://megaecomm.megascale.co.in/backend/media/16/general/6fc3ca2d0c8550725847027ecea9248c.jpg",
        color: "bg-orange-100",
    },
    {
        id: 2,
        title: "Pure & Traditional",
        subtitle: "Prepared with utmost devotion and purity",
        image: "https://megaecomm.megascale.co.in/backend/media/16/general/f813da82769e89652e96d7f30c57055f.jpg",
        mobileImage: "https://megaecomm.megascale.co.in/backend/media/16/general/eac3845d6b740c1612bf3bfe42b0ce6b.jpg",
        color: "bg-green-100",
    },
    {
        id: 3,
        title: "Delivered to Your Doorstep",
        subtitle: "Freshness guaranteed in every bite",
        image: "https://megaecomm.megascale.co.in/backend/media/16/general/31d6e538cf7843ec74e79c4d03b929c5.jpg",
        mobileImage: "https://megaecomm.megascale.co.in/backend/media/16/general/923611477721cbbf193099e0afd75a0e.jpg",
        color: "bg-yellow-100",
    },
    {
        id: 4,
        title: "Delivered to Your Doorstep",
        subtitle: "Freshness guaranteed in every bite",
        image: "https://megaecomm.megascale.co.in/backend/media/16/general/6dd627b927defb761c14ef4af67ac40c.jpg",
        mobileImage: "https://megaecomm.megascale.co.in/backend/media/16/general/13c4b56a3de857c76efb670d54371e22.jpg", // Replace with mobile link
        color: "bg-yellow-100",
    },
    {
        id: 5,
        title: "Delivered to Your Doorstep",
        subtitle: "Freshness guaranteed in every bite",
        image: "https://megaecomm.megascale.co.in/backend/media/16/general/f6f4dc305092d252e44611e70299c73c.jpg",
        mobileImage: "https://megaecomm.megascale.co.in/backend/media/16/general/ce8349a18499b55ffe57fee027fbeed1.jpg", // Replace with mobile link
        color: "bg-yellow-100",
    },
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
        <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[40vh] lg:h-[80vh] overflow-hidden bg-gray-900 group">
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
            <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                    onClick={prevSlide}
                    className="p-3 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-sm transition-all transform hover:scale-110"
                    aria-label="Previous slide"
                >
                    <ChevronLeft size={24} />
                </button>
                <button
                    onClick={nextSlide}
                    className="p-3 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-sm transition-all transform hover:scale-110"
                    aria-label="Next slide"
                >
                    <ChevronRight size={24} />
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
