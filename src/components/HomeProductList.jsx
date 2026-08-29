"use client";

import { useState, useEffect } from "react";
import ProductList from "@/components/ProductList";

export default function HomeProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch("/api/products");
                const data = await response.json();
                if (data.success && data.products) {
                    // Shuffle products and pick 10 randomly
                    const shuffled = [...data.products].sort(() => 0.5 - Math.random());
                    setProducts(shuffled.slice(0, 10));
                }
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#700b10]"></div>
            </div>
        );
    }

    return <ProductList products={products.map((p) => ({ node: p }))} />;
}
