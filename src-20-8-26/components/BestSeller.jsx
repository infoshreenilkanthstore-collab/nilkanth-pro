"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function BestSeller({ sectionName = "Best Seller" }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch("/api/products");
                const data = await response.json();

                if (data.success && data.products) {
                    const targetHandles = [
                        'berakha',
                        'aadi-yogi',
                        'chandan-attar',
                        'chandan-goti',
                        'diffodil',
                        'chandan-powder-pouch'
                    ];

                    const filtered = data.products.filter(p => targetHandles.includes(p.handle) || targetHandles.includes(p.id));

                    // Sort to maintain the order of handles defined above or fallback to top products
                    const sorted = filtered.length > 0 ? filtered.sort((a, b) =>
                        targetHandles.indexOf(a.handle || a.id) - targetHandles.indexOf(b.handle || b.id)
                    ) : data.products.slice(0, 6);

                    setProducts(sorted);
                }

            } catch (error) {
                console.error(`Failed to fetch best seller products:`, error);
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);

    if (loading) return null;
    if (products.length === 0) return null;

    const leftProducts = products.slice(0, 3);
    const rightProducts = products.slice(3, 6);

    return (
        <section className="w-full bg-white md:py-12 py-4 px-4 overflow-hidden">
            <div className="max-w-[1400px] mx-auto">

                {/* Title */}
                <h2 className="text-2xl md:text-5xl font-nunito text-center font-bold text-[#700b10] md:mb-16 mb-4">
                    {sectionName}
                </h2>

                {/* Main Layout */}
                <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-5">

                    {/* Left Products */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-6 lg:flex lg:items-center lg:gap-5 order-2 lg:order-1 w-full lg:w-auto px-2 lg:px-0 justify-items-center">
                        {leftProducts.map((product) => (
                            <ProductCircle key={product.id} product={product} />
                        ))}
                    </div>

                    {/* Center Video */}
                    <div className="flex-shrink-0 flex justify-center order-1 lg:order-2 mb-2 lg:mb-0">
                        <video
                            src="https://cdn.shopify.com/videos/c/o/v/50c5cdff3e284c6194d0cc939cb8e8db.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="auto"
                            className="w-[170px]  lg:w-[240px] object-contain"
                        />
                    </div>

                    {/* Right Products */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-6 lg:flex lg:items-center lg:gap-5 order-3 w-full lg:w-auto px-2 lg:px-0 justify-items-center">
                        {rightProducts.map((product) => (
                            <ProductCircle key={product.id} product={product} />
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}

function ProductCircle({ product }) {
    const image = product.images?.edges?.[0]?.node || product.images?.[0];

    const shortTitle = product.title ? product.title.split(" | ")[0].split(" - ")[0] : "";

    return (
        <Link
            href={`/products/${product.handle || product.id}`}
            className="flex flex-col items-center group w-[80px] min-[375px]:w-[95px] sm:w-[110px] xl:w-[140px]"
        >

            {/* Circle Image */}
            <div className="w-full aspect-square rounded-full overflow-hidden shadow-sm group-hover:shadow-xl transition duration-300 border-2 border-white bg-gradient-to-br from-amber-50 to-orange-100 mb-2 sm:mb-3">

                {image ? (
                    <Image
                        src={image.url}
                        alt={image.altText || shortTitle}
                        width={500}
                        height={500}
                        className="w-full h-full object-contain group-hover:scale-110 transition duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        No Image
                    </div>
                )}

            </div>

            {/* Product Name */}
            <h3 className="text-[10px] min-[375px]:text-[11px] sm:text-xs xl:text-base font-bold text-gray-800 text-center leading-snug group-hover:text-[#700b10] transition px-0.5 line-clamp-2">
                {shortTitle}
            </h3>

        </Link>
    );
}