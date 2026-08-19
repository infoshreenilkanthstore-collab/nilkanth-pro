import React from 'react';
import Link from 'next/link';

export default function DoubleImageBanner({
    title = "Decorate Your Mandir with Shri Nilkanth Store",
    subtitle = "Pooja Saman",
    description = "At Shri Nilkanth Store, we bring divinity closer to your home. Our handpicked spiritual products are designed to elevate your pooja space with purity, tradition, and grace. Each item is crafted with care — blending age-old rituals with modern aesthetics for your sacred moments.",
    buttonText = "Shop Collection",
    buttonLink = "/collections/pooja-samagri",
    // Left side image (Pooja decoration/Samaagri)
    mainImageUrl = "https://cdn.shopify.com/s/files/1/0804/0867/4532/files/2e60e78829fb62d88e047443760b3bbc.webp?v=1774247435",
    // Background watermark/icon for the left side
    bgIconUrl = "https://cdn.shopify.com/s/files/1/0804/0867/4532/files/2e60e78829fb62d88e047443760b3bbc.webp?v=1774247435"
}) {
    return (
        <section className="w-full bg-white py-4 md:py-12 px-4 md:px-8 lg:px-12">
            <div className="max-w-[95rem] mx-auto overflow-hidden rounded-sm md:rounded-[2.5rem] md:shadow-2xl flex flex-col md:flex-row min-h-[400px] md:min-h-[500px]">

                {/* Left Side: Soft Yellow/Beige Background with Images */}
                <div className="w-full md:w-2/5 bg-[#e6d98e] relative flex items-center justify-center overflow-hidden">
                    {/* Background Watermark/Deity Image */}
                    {/* <div className="absolute inset-0 opacity-15 pointer-events-none flex items-center justify-center">
                        <img
                            src={bgIconUrl}
                            alt="Background Decoration"
                            className="w-full h-full object-contain scale-125 translate-x-[-10%] opacity-40 mix-blend-multiply"
                        />
                    </div> */}

                    {/* Main Foreground Image (incense, bell, etc.) */}
                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                        <img
                            src={mainImageUrl}
                            alt="Pooja Samagri"
                            className=" object-cover h-full w-full"
                        />
                    </div>
                </div>

                {/* Right Side: Deep Maroon Background with Text */}
                <div className="w-full md:w-3/5 bg-[#810000] flex flex-col justify-center p-6 sm:p-8 md:p-12 lg:p-14 text-white">
                    <span className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] mb-2 md:mb-4 text-[#EBD99C] font-jost">
                        {subtitle}
                    </span>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl tenor-sans-regular leading-[1.15] mb-3 md:mb-6 font-medium">
                        {title}
                    </h2>

                    <p className="text-sm md:text-base opacity-90 mb-6 md:mb-8 leading-relaxed font-jost max-w-2xl">
                        {description}
                    </p>

                    <div>
                        <Link
                            href={buttonLink}
                            className="inline-block bg-[#b5944d] hover:bg-[#c6a55e] text-white px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 rounded-full text-sm md:text-base font-bold transition-all duration-300 border-2 border-white/20 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            {buttonText}
                        </Link>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .font-jost {
                    font-family: 'Jost', sans-serif;
                }
                .font-serif {
                    font-family: 'Tenor Sans', serif;
                }
            `}</style>
        </section>
    );
}
