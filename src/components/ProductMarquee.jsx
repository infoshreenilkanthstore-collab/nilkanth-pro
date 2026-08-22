"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function ProductMarquee() {
    const [marqueeProducts, setMarqueeProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMarqueeProducts() {
            try {
                const response = await fetch("/api/products");
                const data = await response.json();
                if (data.success && data.products) {
                    // Shuffle products and pick 10 randomly
                    const shuffled = [...data.products].sort(() => 0.5 - Math.random());
                    setMarqueeProducts(shuffled.slice(0, 10));
                }
            } catch (error) {
                console.error("Failed to fetch products for marquee:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchMarqueeProducts();
    }, []);

    if (loading || marqueeProducts.length === 0) return null;

    // Duplicate products to create a seamless scrolling effect
    const displayProducts = [...marqueeProducts, ...marqueeProducts, ...marqueeProducts, ...marqueeProducts];

    return (
        <div className="w-full bg-[#fdfaf6] border-y border-yellow-100/50 md:py-4 py-1 overflow-hidden relative group">
            {/* 
              width max-content prevents flex children from squishing 
            */}
            <div className="flex w-max animate-marquee">
                {/* First set of products */}
                <div className="flex justify-around min-w-full ">
                    {displayProducts.map((product, index) => {
                        const image = product.images.edges[0]?.node;
                        return (
                            <Link
                                key={`first-${product.id}-${index}`}
                                href={`/products/${product.handle || product.id}`}
                                className="flex items-center gap-3 transition-transform duration-300 flex-shrink-0"
                            >
                                {image && (
                                    <div className="md:w-10 w-6 md:h-10 h-6 rounded-sm overflow-hidden shadow-sm flex-shrink-0 bg-white">
                                        <img
                                            src={image.url}
                                            alt={image.altText || product.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                <span className="text-[#700b10] font-bold font-nunito whitespace-nowrap md:text-lg text-sm">
                                    {product.title.split(' | ')[0]}
                                </span>
                            </Link>
                        );
                    })}
                </div>
                {/* Duplicate set for seamless scrolling */}
                <div className="flex justify-around min-w-full">
                    {displayProducts.map((product, index) => {
                        const image = product.images.edges[0]?.node;
                        return (
                            <Link
                                key={`second-${product.id}-${index}`}
                                href={`/products/${product.handle || product.id}`}
                                className="flex items-center gap-3 transition-transform duration-300 flex-shrink-0"
                            >
                                {image && (
                                    <div className="md:w-10 w-6 md:h-10 h-6 rounded-sm overflow-hidden shadow-sm flex-shrink-0 bg-white">
                                        <img
                                            src={image.url}
                                            alt={image.altText || product.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                <span className="text-[#700b10] font-bold font-nunito whitespace-nowrap md:text-lg text-sm">
                                    {product.title.split(' | ')[0]}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
            {/* 
              We need to add custom keyframes for the marquee animation in tailwind config or globals.css
              For now, we'll use a style block to ensure it works immediately 
            */}
            <style jsx>{`
                .animate-marquee {
                  animation: marquee 55s linear infinite;
                }
                .animate-marquee:hover {
                  animation-play-state: paused;
                }
                @keyframes marquee {
                  0% {
                    transform: translateX(0%);
                  }
                  100% {
                    transform: translateX(-50%);
                  }
                }
            `}</style>
        </div>
    );
}
