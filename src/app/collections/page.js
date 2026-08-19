// src\app\collections\page.js

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, LayoutGrid, List } from "lucide-react";

export default function AllCollectionsPage() {
    const [collections, setCollections] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [view, setView] = useState("grid"); // "grid" | "list"

    useEffect(() => {
        async function fetchCollections() {
            try {
                const res = await fetch("/api/collections");
                const data = await res.json();
                if (data.success && data.collections) {
                    let processedCollections = data.collections;

                    // 1. Filter collections where is_display is true
                    processedCollections = processedCollections.filter(c => 
                        c.is_display === true || c.is_display === 1 || c.is_display === "true"
                    );

                    // 2. Filter collections that have 0 products
                    processedCollections = processedCollections.filter(c => {
                        const count = Number(c.product_count ?? c.products_count ?? c.productsCount ?? (c.products?.length || 0));
                        return count > 0;
                    });

                    setCollections(processedCollections);
                    setFiltered(processedCollections);
                }
            } catch (err) {
                console.error("Failed to fetch collections:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchCollections();
    }, []);

    // Search filtering
    useEffect(() => {
        if (!search.trim()) {
            setFiltered(collections);
        } else {
            const q = search.toLowerCase();
            setFiltered(
                collections.filter(
                    (c) =>
                        c.title.toLowerCase().includes(q) ||
                        (c.description && c.description.toLowerCase().includes(q))
                )
            );
        }
    }, [search, collections]);

    // ─── Skeleton ───────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <main className="min-h-screen pt-0 pb-20">
                {/* Hero skeleton */}
                <div className="w-full h-[180px] bg-gradient-to-r from-[#f5efe0] to-[#fdf7ee] animate-pulse mb-12" />
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-square rounded-2xl bg-[#f0e9d8] mb-3" />
                                <div className="h-4 bg-[#f0e9d8] rounded-full w-3/4 mx-auto" />
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen pb-20">



            {/* ── Controls ────────────────────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 mt-10 mb-6 flex items-center justify-between flex-wrap gap-4">
                <p className="text-gray-500 text-sm">
                    Showing{" "}
                    <span className="font-bold text-[#700b10]">{filtered.length}</span>{" "}
                    collection{filtered.length !== 1 ? "s" : ""}
                    {search && (
                        <span className="ml-1">
                            for <span className="italic">"{search}"</span>
                        </span>
                    )}
                </p>

                {/* View Toggle */}
                <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
                    <button
                        onClick={() => setView("grid")}
                        className={`p-2 rounded-lg transition-all duration-200 ${view === "grid"
                            ? "bg-[#700b10] text-white shadow-sm"
                            : "text-gray-400 hover:text-gray-600"
                            }`}
                        aria-label="Grid view"
                    >
                        <LayoutGrid size={16} />
                    </button>
                    <button
                        onClick={() => setView("list")}
                        className={`p-2 rounded-lg transition-all duration-200 ${view === "list"
                            ? "bg-[#700b10] text-white shadow-sm"
                            : "text-gray-400 hover:text-gray-600"
                            }`}
                        aria-label="List view"
                    >
                        <List size={16} />
                    </button>
                </div>
            </div>

            {/* ── Collections ─────────────────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8">

                {filtered.length === 0 ? (
                    <div className="text-center py-24">
                        <div className="text-6xl mb-4">🪔</div>
                        <h2 className="text-2xl font-bold text-gray-700 mb-2">No collections found</h2>
                        <p className="text-gray-400">Try a different search term.</p>
                    </div>
                ) : view === "grid" ? (

                    /* ── GRID VIEW ── */
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 md:gap-8 lg:gap-10 py-6 sm:py-10">
                        {filtered.map((collection) => (
                            <Link
                                key={collection.id}
                                href={`/collections/${collection.handle}`}
                                className="group relative flex flex-col transition-all duration-500 hover:-translate-y-2"
                            >
                                {/* The Arch Card */}
                                <div
                                    className="relative w-full aspect-[4/5] overflow-hidden shadow-2xl"
                                    style={{
                                        clipPath: "url(#collectionArch)",
                                        borderRadius: "20px 20px 12px 12px"
                                    }}
                                >
                                    {/* Using a more standard CSS approach for the arch shape since path() in clip-path can be tricky with percentages */}
                                    {/* <div className="absolute inset-0 bg-gradient-to-b from-[#fdf2d0] via-[#f7e096] to-[#c59d5f] z-0" /> */}
                                    {/* Collection Image */}
                                    {(() => {
                                        const imgUrl = collection.image?.url || (typeof collection.image === 'string' ? collection.image : null) || collection.image_url;
                                        return imgUrl ? (
                                            <img
                                                src={imgUrl}
                                                alt={collection.image?.altText || collection.title}
                                                className="w-full h-full object-contain object-bottom transition-transform duration-700 group-hover:scale-100 drop-shadow-xl"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-6xl opacity-20">🪷</div>
                                        );
                                    })()}

                                    {/* Bottom Overlay for better text readability */}
                                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent z-30" />

                                    {/* Bottom Text & Button */}
                                    <div className="absolute bottom-0 inset-x-0 p-4 md:p-6 flex items-end justify-between z-40">
                                        <div>
                                            <h2 className="font-bold text-white uppercase tracking-wider text-base md:text-lg drop-shadow-md">
                                                {collection.title}
                                            </h2>
                                            {collection.description && (
                                                <p className="text-gray-200 text-xs line-clamp-1 mt-0.5 opacity-90 drop-shadow">
                                                    {collection.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                ) : (

                    /* ── LIST VIEW ── */
                    <div className="flex flex-col gap-3">
                        {filtered.map((collection) => (
                            <Link
                                key={collection.id}
                                href={`/collections/${collection.handle}`}
                                className="group flex items-center gap-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#A07F3F]/30 p-4 transition-all duration-300"
                            >
                                {/* Thumbnail */}
                                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-[#f5ede0] border border-gray-100">
                                    {(() => {
                                        const imgUrl = collection.image?.url || (typeof collection.image === 'string' ? collection.image : null) || collection.image_url;
                                        return imgUrl ? (
                                            <img
                                                src={imgUrl}
                                                alt={collection.image?.altText || collection.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-2xl">🪷</div>
                                        );
                                    })()}
                                </div>

                                {/* Text */}
                                <div className="flex-grow min-w-0">
                                    <h2 className="font-bold text-[#1a1a1a] group-hover:text-[#700b10] transition-colors duration-300 uppercase tracking-wide text-sm truncate">
                                        {collection.title}
                                    </h2>
                                    {collection.description && (
                                        <p className="text-gray-400 text-xs mt-0.5 line-clamp-1 leading-relaxed">
                                            {collection.description}
                                        </p>
                                    )}
                                </div>

                                {/* Arrow */}
                                <span className="text-[#A07F3F] text-xl font-light flex-shrink-0 group-hover:translate-x-1 transition-transform duration-300">
                                    →
                                </span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* SVG ClipPath Definition */}
            <svg width="0" height="0" className="absolute">
                <defs>
                    <clipPath id="collectionArch" clipPathUnits="objectBoundingBox">
                        <path d="M 0.5 0 C 0.55 0.1 0.8 0.15 1 0.35 V 1 H 0 V 0.35 C 0.2 0.15 0.45 0.1 0.5 0 Z" />
                    </clipPath>
                </defs>
            </svg>
        </main>
    );
}



// "use client";

// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import { Search, LayoutGrid, List } from "lucide-react";

// // List of collection titles to display (Optional: Add titles to filter, e.g., ["Temple", "Decorative"])
// const SHOWN_COLLECTIONS = ["Aushadhi & Cosemetic items", "Agarbatti & Dhoop", "Perfume, Attar & Air Freshner", "Pooja Saman", "Pital & Copper", "Gift Item"];

// export default function AllCollectionsPage() {
//     const [collections, setCollections] = useState([]);
//     const [filtered, setFiltered] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [search, setSearch] = useState("");
//     const [view, setView] = useState("grid"); // "grid" | "list"

//     useEffect(() => {
//         async function fetchCollections() {
//             try {
//                 const res = await fetch("/api/collections");
//                 const data = await res.json();
//                 if (data.success && data.collections) {
//                     let processedCollections = data.collections;

//                     // 1. Filter by specific names if provided
//                     if (SHOWN_COLLECTIONS.length > 0) {
//                         processedCollections = processedCollections.filter(c =>
//                             SHOWN_COLLECTIONS.some(name =>
//                                 c.title.toLowerCase().trim() === name.toLowerCase().trim()
//                             )
//                         );
//                     }

//                     // 2. Limit to exactly 6 collections
//                     const limitedCollections = processedCollections.slice(0, 6);

//                     setCollections(limitedCollections);
//                     setFiltered(limitedCollections);
//                 }
//             } catch (err) {
//                 console.error("Failed to fetch collections:", err);
//             } finally {
//                 setLoading(false);
//             }
//         }
//         fetchCollections();
//     }, []);

//     // Search filtering
//     useEffect(() => {
//         if (!search.trim()) {
//             setFiltered(collections);
//         } else {
//             const q = search.toLowerCase();
//             setFiltered(
//                 collections.filter(
//                     (c) =>
//                         c.title.toLowerCase().includes(q) ||
//                         (c.description && c.description.toLowerCase().includes(q))
//                 )
//             );
//         }
//     }, [search, collections]);

//     // ─── Skeleton ───────────────────────────────────────────────────────────────
//     if (loading) {
//         return (
//             <main className="min-h-screen pt-0 pb-20">
//                 {/* Hero skeleton */}
//                 <div className="w-full h-[180px] bg-gradient-to-r from-[#f5efe0] to-[#fdf7ee] animate-pulse mb-12" />
//                 <div className="max-w-7xl mx-auto px-4 md:px-8">
//                     <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6">
//                         {Array.from({ length: 6 }).map((_, i) => (
//                             <div key={i} className="animate-pulse">
//                                 <div className="aspect-square rounded-2xl bg-[#f0e9d8] mb-3" />
//                                 <div className="h-4 bg-[#f0e9d8] rounded-full w-3/4 mx-auto" />
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </main>
//         );
//     }

//     return (
//         <main className="min-h-screen pb-20">



//             {/* ── Controls ────────────────────────────────────────────────────── */}
//             <div className="max-w-7xl mx-auto px-4 md:px-8 mt-10 mb-6 flex items-center justify-between flex-wrap gap-4">
//                 <p className="text-gray-500 text-sm">
//                     Showing{" "}
//                     <span className="font-bold text-[#700b10]">{filtered.length}</span>{" "}
//                     collection{filtered.length !== 1 ? "s" : ""}
//                     {search && (
//                         <span className="ml-1">
//                             for <span className="italic">"{search}"</span>
//                         </span>
//                     )}
//                 </p>

//                 {/* View Toggle */}
//                 <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
//                     <button
//                         onClick={() => setView("grid")}
//                         className={`p-2 rounded-lg transition-all duration-200 ${view === "grid"
//                             ? "bg-[#700b10] text-white shadow-sm"
//                             : "text-gray-400 hover:text-gray-600"
//                             }`}
//                         aria-label="Grid view"
//                     >
//                         <LayoutGrid size={16} />
//                     </button>
//                     <button
//                         onClick={() => setView("list")}
//                         className={`p-2 rounded-lg transition-all duration-200 ${view === "list"
//                             ? "bg-[#700b10] text-white shadow-sm"
//                             : "text-gray-400 hover:text-gray-600"
//                             }`}
//                         aria-label="List view"
//                     >
//                         <List size={16} />
//                     </button>
//                 </div>
//             </div>

//             {/* ── Collections ─────────────────────────────────────────────────── */}
//             <div className="max-w-7xl mx-auto px-4 md:px-8">

//                 {filtered.length === 0 ? (
//                     <div className="text-center py-24">
//                         <div className="text-6xl mb-4">🪔</div>
//                         <h2 className="text-2xl font-bold text-gray-700 mb-2">No collections found</h2>
//                         <p className="text-gray-400">Try a different search term.</p>
//                     </div>
//                 ) : view === "grid" ? (

//                     /* ── GRID VIEW ── */
//                     <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 py-10">
//                         {filtered.map((collection) => (
//                             <Link
//                                 key={collection.id}
//                                 href={`/collections/${collection.handle}`}
//                                 className="group relative flex flex-col transition-all duration-500 hover:-translate-y-2"
//                             >
//                                 {/* The Arch Card */}
//                                 <div
//                                     className="relative w-full aspect-[4/5] overflow-hidden shadow-2xl"
//                                     style={{
//                                         clipPath: "url(#collectionArch)",
//                                         borderRadius: "20px 20px 12px 12px"
//                                     }}
//                                 >
//                                     {/* Using a more standard CSS approach for the arch shape since path() in clip-path can be tricky with percentages */}
//                                     {/* <div className="absolute inset-0 bg-gradient-to-b from-[#fdf2d0] via-[#f7e096] to-[#c59d5f] z-0" /> */}

//                                     {/* Main Title Background (Semi-transparent stylized text) */}
//                                     {/* <div className="absolute top-[20%] inset-x-0 text-center px-4 z-10 opacity-80 pointer-events-none">
//                                         <h3 className="text-[#8b1d1d] font-serif text-xl md:text-2xl font-black uppercase tracking-widest leading-tight drop-shadow-sm">
//                                             {collection.title}
//                                         </h3>
//                                         <div className="flex justify-center gap-4 mt-1">
//                                             <span className="text-[#8b1d1d] text-sm hidden md:block">⟵</span>
//                                             <span className="text-[#8b1d1d] text-sm hidden md:block">⟶</span>
//                                         </div>
//                                     </div> */}

//                                     {/* Collection Image */}
//                                     {/* <div className="absolute bottom-0 inset-x-0 h-[65%] z-20 overflow-hidden px-4 pb-4"> */}
//                                     {collection.image ? (
//                                         <img
//                                             src={collection.image.url}
//                                             alt={collection.image.altText || collection.title}
//                                             className="w-full h-full object-contain object-bottom transition-transform duration-700 group-hover:scale-100 drop-shadow-xl"
//                                         />
//                                     ) : (
//                                         <div className="w-full h-full flex items-center justify-center text-6xl opacity-20">🪷</div>
//                                     )}
//                                     {/* </div> */}

//                                     {/* Bottom Overlay for better text readability */}
//                                     <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent z-30" />

//                                     {/* Bottom Text & Button */}
//                                     <div className="absolute bottom-0 inset-x-0 p-4 md:p-6 flex items-end justify-between z-40">
//                                         <div className="text-left text-white drop-shadow-lg">
//                                             <h4 className="font-bold text-sm md:text-base leading-tight line-clamp-1 mb-0.5">
//                                                 {collection.title}
//                                             </h4>
//                                             <p className="text-[10px] md:text-xs opacity-90 font-medium">
//                                                 {/* {collection.products?.totalCount || 0} Products */}
//                                             </p>
//                                         </div>

//                                         <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/60 flex items-center justify-center text-white backdrop-blur-sm group-hover:bg-[#8b1d1d] group-hover:border-[#8b1d1d] transition-all duration-300">
//                                             <span className="text-lg md:text-xl font-light transform rotate-[-45deg] group-hover:rotate-0 transition-transform duration-300">
//                                                 →
//                                             </span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </Link>
//                         ))}
//                     </div>

//                 ) : (

//                     /* ── LIST VIEW ── */
//                     <div className="flex flex-col gap-3">
//                         {filtered.map((collection) => (
//                             <Link
//                                 key={collection.id}
//                                 href={`/collections/${collection.handle}`}
//                                 className="group flex items-center gap-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#A07F3F]/30 p-4 transition-all duration-300"
//                             >
//                                 {/* Thumbnail */}
//                                 <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-[#f5ede0] border border-gray-100">
//                                     {collection.image ? (
//                                         <img
//                                             src={collection.image.url}
//                                             alt={collection.image.altText || collection.title}
//                                             className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                                         />
//                                     ) : (
//                                         <div className="w-full h-full flex items-center justify-center text-2xl">🪷</div>
//                                     )}
//                                 </div>

//                                 {/* Text */}
//                                 <div className="flex-grow min-w-0">
//                                     <h2 className="font-bold text-[#1a1a1a] group-hover:text-[#700b10] transition-colors duration-300 uppercase tracking-wide text-sm truncate">
//                                         {collection.title}
//                                     </h2>
//                                     {collection.description && (
//                                         <p className="text-gray-400 text-xs mt-0.5 line-clamp-1 leading-relaxed">
//                                             {collection.description}
//                                         </p>
//                                     )}
//                                 </div>

//                                 {/* Arrow */}
//                                 <span className="text-[#A07F3F] text-xl font-light flex-shrink-0 group-hover:translate-x-1 transition-transform duration-300">
//                                     →
//                                 </span>
//                             </Link>
//                         ))}
//                     </div>
//                 )}
//             </div>

//             {/* SVG ClipPath Definition */}
//             <svg width="0" height="0" className="absolute">
//                 <defs>
//                     <clipPath id="collectionArch" clipPathUnits="objectBoundingBox">
//                         <path d="M 0.5 0 C 0.55 0.1 0.8 0.15 1 0.35 V 1 H 0 V 0.35 C 0.2 0.15 0.45 0.1 0.5 0 Z" />
//                     </clipPath>
//                 </defs>
//             </svg>
//         </main>
//     );
// }
