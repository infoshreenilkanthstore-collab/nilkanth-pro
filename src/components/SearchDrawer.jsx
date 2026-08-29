"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Search, X, Package, LayoutGrid, BookOpen, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

function useDebounce(value, delay) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
}

export default function SearchDrawer({ isOpen, onClose }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState({ products: [], collections: [], articles: [] });
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const inputRef = useRef(null);
    const debouncedQuery = useDebounce(query, 350);

    useEffect(() => setMounted(true), []);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            setQuery("");
            setResults({ products: [], collections: [], articles: [] });
        }
    }, [isOpen]);

    // Fetch results
    useEffect(() => {
        if (!debouncedQuery || debouncedQuery.length < 2) {
            setResults({ products: [], collections: [], articles: [] });
            return;
        }
        setLoading(true);
        fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
            .then(r => r.json())
            .then(data => {
                if (data.success) setResults(data);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [debouncedQuery]);

    // ESC to close
    useEffect(() => {
        const handle = (e) => { if (e.key === "Escape") onClose(); };
        if (isOpen) document.addEventListener("keydown", handle);
        return () => document.removeEventListener("keydown", handle);
    }, [isOpen, onClose]);

    const hasResults = results.products.length > 0 || results.collections.length > 0 || results.articles?.length > 0;
    const showEmpty = debouncedQuery.length >= 2 && !loading && !hasResults;

    if (!mounted) return null;

    const drawer = (
        <div className={`fixed inset-0 z-[300] transition-all duration-300 ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
                onClick={onClose}
            />

            {/* Drawer Panel - slides from top */}
            <div className={`absolute top-0 left-0 right-0 bg-white shadow-2xl transition-transform duration-400 ease-out ${isOpen ? "translate-y-0" : "-translate-y-full"}`}>
                {/* Search Input Bar */}
                <div className="max-w-4xl mx-auto px-4 py-5">
                    <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 focus-within:border-[#700b10] focus-within:ring-2 focus-within:ring-[#700b10]/10 transition-all">
                        {loading
                            ? <Loader2 size={20} className="text-[#700b10] animate-spin flex-shrink-0" />
                            : <Search size={20} className="text-gray-400 flex-shrink-0" />
                        }
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Search products, collections, blogs..."
                            className="flex-1 bg-transparent text-gray-900 placeholder-gray-400 text-base outline-none"
                        />
                        {query && (
                            <button onClick={() => setQuery("")} className="text-gray-400 hover:text-gray-700 transition">
                                <X size={18} />
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="ml-2 p-1.5 rounded-full hover:bg-gray-200 transition text-gray-500"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Results */}
                {(hasResults || showEmpty || (debouncedQuery.length < 2 && !query)) && (
                    <div className="max-w-4xl mx-auto px-4 pb-6 max-h-[65vh] overflow-y-auto">

                        {/* Products */}
                        {results.products.length > 0 && (
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <Package size={14} className="text-[#700b10]" />
                                    <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Products</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {results.products.map(product => (
                                        <Link
                                            key={product.id}
                                            href={`/products/${product.handle || product.id}`}
                                            onClick={onClose}
                                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all group"
                                        >
                                            <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border">
                                                {product.images?.edges?.[0]?.node?.url ? (
                                                    <img
                                                        src={product.images.edges[0].node.url}
                                                        alt={product.title}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                        <Package size={20} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-[#700b10] transition-colors">{product.title}</p>
                                                <p className="text-sm font-bold text-[#700b10] mt-0.5">
                                                    ₹{parseFloat(product.priceRange?.minVariantPrice?.amount || 0).toLocaleString("en-IN")}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Collections */}
                        {results.collections.length > 0 && (
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <LayoutGrid size={14} className="text-[#700b10]" />
                                    <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Collections</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {results.collections.map(col => (
                                        <Link
                                            key={col.id}
                                            href={`/collections/${col.handle}`}
                                            onClick={onClose}
                                            className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-[#700b10] hover:text-white border border-gray-200 hover:border-[#700b10] rounded-full text-sm font-medium text-gray-700 transition-all group"
                                        >
                                            {col.image?.url && (
                                                <img src={col.image.url} alt={col.title} className="w-5 h-5 rounded-full object-cover" />
                                            )}
                                            {col.title}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}


                        {/* Articles / Blogs */}
                        {results.articles?.length > 0 && (
                            <div className="mb-2">
                                <div className="flex items-center gap-2 mb-3">
                                    <BookOpen size={14} className="text-[#700b10]" />
                                    <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Blog Posts</span>
                                </div>
                                <div className="space-y-2">
                                    {results.articles.map((article, i) => (
                                        <Link
                                            key={article.id || i}
                                            href={`/blogs/${article.handle}`}
                                            onClick={onClose}
                                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all group"
                                        >
                                            {article.image_url && (
                                                <img src={article.image_url} alt={article.title} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                                            )}
                                            <p className="text-sm font-semibold text-gray-800 group-hover:text-[#700b10] transition-colors line-clamp-1">{article.title}</p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                        {/* Empty state */}
                        {showEmpty && (
                            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                                <Search size={40} className="mb-3 opacity-30" />
                                <p className="font-semibold text-gray-600">No results for &ldquo;{debouncedQuery}&rdquo;</p>
                                <p className="text-sm mt-1">Try a different keyword</p>
                            </div>
                        )}

                        {/* Hint when nothing typed */}
                        {!query && (
                            <div className="flex flex-col items-center justify-center py-10 text-gray-300">
                                <Search size={40} className="mb-3" />
                                <p className="text-sm text-gray-400">Start typing to search...</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );

    return createPortal(drawer, document.body);
}
