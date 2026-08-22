"use client";

import React, { useState, useEffect } from "react";
import { ShoppingBag, X } from "lucide-react";

const CITIES = ["Mumbai", "Delhi", "Bangalore", "Surat", "Ahmedabad", "Pune", "Chennai", "Jaipur", "Lucknow", "Hyderabad"];
const TIMES = ["just now", "1 minute ago", "2 minutes ago", "5 minutes ago", "10 minutes ago", "15 minutes ago"];

export default function SalesNotification() {
    const [isVisible, setIsVisible] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [currentCity, setCurrentCity] = useState("");
    const [currentTime, setCurrentTime] = useState("");
    const [products, setProducts] = useState([]);

    // Fetch some real products to use in notifications
    useEffect(() => {
        async function fetchProducts() {
            try {
                const res = await fetch("/api/products");
                const data = await res.json();
                if (data.products) {
                    setProducts(data.products);
                }
            } catch (err) {
                console.error("Failed to fetch products for notifications:", err);
            }
        }
        fetchProducts();
    }, []);

    useEffect(() => {
        if (products.length === 0) return;

        const showNotification = () => {
            const randomProduct = products[Math.floor(Math.random() * products.length)];
            const randomCity = CITIES[Math.floor(Math.random() * CITIES.length)];
            const randomTime = TIMES[Math.floor(Math.random() * TIMES.length)];

            setCurrentProduct(randomProduct);
            setCurrentCity(randomCity);
            setCurrentTime(randomTime);
            setIsVisible(true);

            // Hide after 6 seconds
            setTimeout(() => {
                setIsVisible(false);
            }, 6000);
        };

        // Initial delay
        const initialTimer = setTimeout(showNotification, 5000);

        // Repeat every 20-30 seconds
        const interval = setInterval(() => {
            showNotification();
        }, 25000);

        return () => {
            clearTimeout(initialTimer);
            clearInterval(interval);
        };
    }, [products]);

    if (!isVisible || !currentProduct) return null;

    return (
        <div className="fixed bottom-6 left-6 z-[60] animate-in slide-in-from-left-full duration-700">
            <div className="bg-white/80 backdrop-blur-md p-3 shadow-xl shadow-black/5 border border-white flex items-center gap-4 max-w-[320px] group relative overflow-hidden">
                
                {/* Close Button */}
                <button 
                    onClick={() => setIsVisible(false)}
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-900 transition-colors opacity-0 group-hover:opacity-100"
                >
                    <X size={14} />
                </button>

                {/* Product Image */}
                <div className="w-18 h-18 overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                    <img 
                        src={currentProduct.images?.edges?.[0]?.node?.url || "/placeholder.png"} 
                        alt={currentProduct.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-4">
                    <p className="text-[10px] font-black text-[#700b10] uppercase tracking-widest mb-0.5 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#700b10] animate-pulse"></span>
                        Verified Purchase
                    </p>
                    <p className="text-[11px] text-gray-500 font-medium">
                        Someone from <span className="text-gray-900 font-bold">{currentCity}</span> bought
                    </p>
                    <p className="text-xs font-bold text-gray-900 truncate uppercase mt-0.5 tracking-tight line-clamp-2">
                        {currentProduct.title}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1 italic font-medium">
                        {currentTime}
                    </p>
                </div>

                {/* Detail Link Overlay */}
                <a 
                    href={`/products/${currentProduct.handle || currentProduct.id}`}
                    className="absolute inset-0 z-10"
                    aria-label={`View ${currentProduct.title}`}
                ></a>
            </div>
        </div>
    );
}
