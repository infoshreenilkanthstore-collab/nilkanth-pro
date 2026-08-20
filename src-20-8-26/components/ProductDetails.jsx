// src\components\ProductDetails.jsx

"use client";

import React, { useState, useEffect, useRef } from "react";
import { Star, CheckCircle2, User, Calendar, X, ChevronLeft, ChevronRight, ChevronDown, MessageSquarePlus, Ticket, Smartphone, Apple, MapPin, Truck, History, Sparkles, Info, Clock, ShieldCheck, ShoppingCart, Heart, Eye, Share2 } from "lucide-react";
import { FaWhatsapp, FaFacebookF, FaTwitter } from "react-icons/fa";
import ShippingBanner from "./ShippingBanner";
import BestSeller from "./BestSeller";
import RelatedProducts from "./RelatedProducts";
import RecentlyViewed from "./RecentlyViewed";
import FAQSection from "./FAQSection";
import ProductRating from "./ProductRating";
import ShareModal from "./ShareModal";
import { AddToCart } from "./ProductActions";
import { useCartSidebar } from "../context/CartSidebarContext";
import { useBreadcrumbs } from "../context/BreadcrumbContext";
import { useWishlist } from "../context/WishlistContext";




export default function ProductDetails({ handle }) {
    const { toggleWishlist, isInWishlist } = useWishlist();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const { cart, addToCart, openMegaCheckout } = useCartSidebar();
    const { lastCollection, updateLastCollection } = useBreadcrumbs();
    const [selectedImage, setSelectedImage] = useState(0);

    // Review States
    const [reviews, setReviews] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, comment: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [isEasebuzzModalOpen, setIsEasebuzzModalOpen] = useState(false);
    const [pincode, setPincode] = useState("");
    const [pincodeStatus, setPincodeStatus] = useState(null); // 'checking', 'success', 'error'
    const [stockCount, setStockCount] = useState(800);
    const [soldCount, setSoldCount] = useState(100);
    const [viewCount, setViewCount] = useState(15);

    useEffect(() => {
        setStockCount(Math.floor(Math.random() * (1200 - 800 + 1)) + 800);
        setSoldCount(Math.floor(Math.random() * (200 - 100 + 1)) + 100);
        setViewCount(Math.floor(Math.random() * (45 - 15 + 1)) + 15);
    }, []);

    // Animate the view count dynamically
    useEffect(() => {
        const interval = setInterval(() => {
            setViewCount(prev => {
                const change = Math.floor(Math.random() * 5) - 2; // Randomly add or subtract up to 2
                const newVal = prev + change;
                return newVal < 5 ? 5 : (newVal > 80 ? 80 : newVal); // Keep between 5 and 80
            });
        }, Math.floor(Math.random() * 3000) + 2000); // Updates randomly between 2 and 5 seconds

        return () => clearInterval(interval);
    }, []);
    const [showSticky, setShowSticky] = useState(false);

    // Review Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 6;

    const [selectedVariantId, setSelectedVariantId] = useState(null);

    // 1. Data Initialization & Normalization
    let allVariants = [];
    if (product) {
        if (Array.isArray(product.variants)) {
            allVariants = product.variants;
        } else if (product.variants?.edges) {
            allVariants = product.variants.edges.map(e => e.node);
        }
    }

    const selectedVariant = allVariants.find(v => v.id === selectedVariantId) || allVariants[0] || null;

    useEffect(() => {
        if (allVariants.length > 0 && !selectedVariantId) {
            const inStockVariant = allVariants.find(variant => {
                const qty = variant.inventory_quantity !== undefined ? variant.inventory_quantity : variant.inventoryQuantity;
                const isAvailable = variant.availableForSale !== false;
                return isAvailable && (qty === undefined || qty > 0);
            });
            const defaultVariant = inStockVariant || allVariants[0];
            setSelectedVariantId(defaultVariant.id);
        }
    }, [product, selectedVariantId]);


    const scrollContainerRef = useRef(null);
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(true);

    const checkScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight, scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            const isVertical = scrollHeight > clientHeight;
            const isHorizontal = scrollWidth > clientWidth;

            if (isVertical) {
                setCanScrollPrev(scrollTop > 0);
                setCanScrollNext(Math.ceil(scrollTop + clientHeight) < scrollHeight);
            } else if (isHorizontal) {
                setCanScrollPrev(scrollLeft > 0);
                setCanScrollNext(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
            } else {
                setCanScrollPrev(false);
                setCanScrollNext(false);
            }
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        const timeoutId = setTimeout(checkScroll, 150);
        return () => {
            window.removeEventListener('resize', checkScroll);
            clearTimeout(timeoutId);
        };
    }, [product]);

    async function fetchProduct() {
        try {
            const response = await fetch(`/api/product/${handle}`);
            const data = await response.json();

            if (data.success && data.product) {
                setProduct(data.product);
                if (Array.isArray(data.product.reviews)) {
                    setReviews(data.product.reviews);
                } else if (data.product.reviews?.value) {
                    try {
                        setReviews(JSON.parse(data.product.reviews.value));
                    } catch (e) {
                        console.error("Error parsing reviews:", e);
                        setReviews([]);
                    }
                }
            } else {
                setError(data.error || "Failed to load product details.");
            }
        } catch (err) {
            console.error(err);
            setError("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    }
    const isGlobalOutOfStock = product?.availableForSale === false;
    let isSelectedVariantOutOfStock = false;
    if (selectedVariant) {
        const qty = selectedVariant.inventory_quantity !== undefined ? selectedVariant.inventory_quantity : selectedVariant.inventoryQuantity;
        const isAvailable = selectedVariant.availableForSale !== false;
        isSelectedVariantOutOfStock = !isAvailable || (qty !== undefined && qty <= 0);
    }
    const isOutOfStock = isGlobalOutOfStock || isSelectedVariantOutOfStock;

    const priceAmountRaw = selectedVariant?.price?.amount || selectedVariant?.priceV2?.amount || product?.priceRange?.minVariantPrice?.amount || product?.price || 0;

    const handlebuynow = async () => {
        if (typeof window !== "undefined") {
            const checkoutValue = Number(priceAmountRaw) * quantity;
            if (window.fbq) {
                window.fbq('track', 'InitiateCheckout', {
                    content_name: product?.title,
                    content_ids: [product?.id],
                    content_type: 'product',
                    num_items: quantity,
                    currency: 'INR',
                    value: checkoutValue
                });
            }
            if (window.gtag) {
                window.gtag('event', 'begin_checkout', {
                    currency: 'INR',
                    value: checkoutValue,
                    items: [{
                        item_id: product?.id,
                        item_name: product?.title,
                        price: Number(priceAmountRaw),
                        quantity
                    }]
                });
            }
        }

        if (isOutOfStock) return;

        const variantId =
            selectedVariant?.id ||
            product?.variants?.edges?.[0]?.node?.id ||
            product?.variants?.[0]?.id;
        productHandle: product.handle || handle

        if (!variantId) return;

        const buyNowItem = {
            productId: product.id,
            variantId,
            qty: quantity,
            title: product.title,
            variantTitle: selectedVariant?.title || "",
            image:
                selectedVariant?.image?.url ||
                product.images?.edges?.[0]?.node?.url ||
                product.image ||
                "/placeholder.png",
            price: Number(priceAmountRaw) || 0,
            weight: selectedVariant?.weight || product?.variants?.edges?.[0]?.node?.weight || 0,
            weightUnit:
                selectedVariant?.weightUnit ||
                product?.variants?.edges?.[0]?.node?.weightUnit ||
                "GRAMS",
        };

        await addToCart({ ...product, selectedVariant }, quantity);

        openMegaCheckout({ cartItems: [buyNowItem] });
    }

    async function fetchDetailedReviews(productId) {
        try {
            const response = await fetch(`/api/reviews/${productId}`);
            const data = await response.json();

            if (data && data.success && data.data && data.data.reviews) {
                setReviews(data.data.reviews);
            }
        } catch (error) {
            console.error("Failed to fetch detailed reviews:", error);
        }
    }

    useEffect(() => {
        fetchProduct();
    }, [handle]);

    useEffect(() => {
        if (product && product.id) {
            // If the product ID is a Shopify GID (e.g. gid://shopify/Product/12345), extract just the numeric ID
            const numericId = String(product.id).split('/').pop();
            fetchDetailedReviews(numericId);
        }
    }, [product?.id]);

    useEffect(() => {
        if (product) {
            const recentlyViewed = JSON.parse(localStorage.getItem('ns_recentlyViewed') || '[]');
            const updated = [product, ...recentlyViewed.filter(p => p.id !== product.id)].slice(0, 10);
            localStorage.setItem('ns_recentlyViewed', JSON.stringify(updated));

            // Sync lastCollection with the current product
            const productCollections = product.collections?.edges?.map(e => e.node.handle) || [];
            const currentCollectionHandle = lastCollection?.href?.split('/').pop();
            const isProductInLastCollection = currentCollectionHandle && productCollections.includes(currentCollectionHandle);

            if (!lastCollection || !isProductInLastCollection) {
                const firstCollection = product.collections?.edges?.[0]?.node;
                if (firstCollection) {
                    updateLastCollection({
                        label: firstCollection.title,
                        href: `/collections/${firstCollection.handle}`
                    });
                }
            }
        }
    }, [product, lastCollection, updateLastCollection]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 800) {
                setShowSticky(true);
            } else {
                setShowSticky(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
       useEffect(() => {
        if (!product) return;

        if (typeof window !== "undefined" && window.fbq) {
            const price =
                selectedVariant?.price?.amount ||
                selectedVariant?.priceV2?.amount ||
                product?.priceRange?.minVariantPrice?.amount ||
                product?.price ||
                0;

            window.fbq('track', 'ViewContent', {
                content_ids: [product.id],
                content_name: product.title,
                content_type: 'product',
                value: Number(price),
                currency: 'INR'
            });
        }
    }, [product, selectedVariant]);


    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: product.id,
                    ...reviewForm
                }),
            });

            const data = await response.json();
            if (data.success) {
                setReviews(data.reviews);
                setReviewForm({ name: '', rating: 5, comment: '' });
                setSubmitStatus('success');
                setTimeout(() => {
                    setIsModalOpen(false);
                    setSubmitStatus(null);
                }, 2000);
            } else {
                setSubmitStatus('error');
            }
        } catch (err) {
            console.error("Submit Review Error:", err);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Review Summary Calculations
    const totalReviews = product?.total_reviews || reviews.length;

    const averageRating = product?.avg_rating
        ? parseFloat(product.avg_rating)
        : totalReviews > 0
            ? reviews.reduce((acc, rev) => acc + rev.rating, 0) / totalReviews
            : 0;

    // Full + Half star logic
    const fullStars = Math.floor(averageRating);
    const hasHalfStar = averageRating > fullStars && averageRating < 5;

    const starDistribution = [5, 4, 3, 2, 1].map(star => {
        const count = reviews.filter(rev => rev.rating === star).length;
        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
        return { star, count, percentage };
    });

    // Pagination Logic
    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
    const totalPages = Math.ceil(reviews.length / reviewsPerPage);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex justify-center items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#700b10]"></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-[60vh] flex flex-col justify-center items-center gap-4 text-[#700b10]">
                <h2 className="text-3xl font-nunito font-bold">Oops!</h2>
                <p className="text-lg font-nunito">{error || "Product not found."}</p>
            </div>
        );
    }

    const images = product?.images?.edges?.map(edge => edge.node) || [];
    const mainImage = images[selectedImage]?.url;

    const scrollThumbnails = (direction) => {
        if (scrollContainerRef.current) {
            const isMobile = window.innerWidth < 768;
            const scrollAmount = isMobile ? window.innerWidth * 0.5 : 200;
            if (isMobile) {
                scrollContainerRef.current.scrollBy({ left: direction === 'prev' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
            } else {
                scrollContainerRef.current.scrollBy({ top: direction === 'prev' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
            }
            setTimeout(checkScroll, 350);
        }
    };



    const priceAmount = selectedVariant?.price?.amount || selectedVariant?.priceV2?.amount || product?.priceRange?.minVariantPrice?.amount || product?.price || 0;
    const compareAtAmount = selectedVariant?.compareAtPrice?.amount || selectedVariant?.compareAtPriceV2?.amount || product?.compareAtPriceRange?.minVariantPrice?.amount || 0;
    const currency = selectedVariant?.price?.currencyCode || selectedVariant?.priceV2?.currencyCode || product?.priceRange?.minVariantPrice?.currencyCode || 'INR';

    const formattedPrice = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 0
    }).format(Number(priceAmount) || 0);

    const formattedCompareAtPrice = (compareAtAmount && Number(compareAtAmount) > Number(priceAmount)) ? new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 0
    }).format(Number(compareAtAmount)) : null;

    const handleVariantSelect = (v) => {
        setSelectedVariantId(v.id);
        if (v.image?.url || v.image?.src) {
            const url = v.image?.url || v.image?.src;
            const index = images.findIndex(img => img.url === url || img.src === url);
            if (index !== -1) {
                setSelectedImage(index);
            }
        }
    };

    // Strip HTML `class=` attributes to prevent React DOM warnings (Shopify returns raw HTML)
    const rawHTML = product.descriptionHtml || `<p>${product.description}</p>`;
    const cleanHTML = rawHTML.replace(/\sclass=/g, " data-class=");

    return (
        <div className="max-w-[1400px] mx-auto  font-nunito">
            <div className="grid grid-cols-1 px-2 md:px-12 lg:px-6 py-1 md:py-2 lg:grid-cols-[57%_37%] gap-0 lg:gap-12">
                {/* Left Side: Images */}
                <div className="flex flex-col-reverse md:flex-row gap-0 md:gap-4 lg:sticky lg:top-32 h-fit items-start md:items-stretch">
                    {images.length > 1 && (
                        <div className="relative flex-shrink-0 w-full md:w-20 lg:w-24 md:mt-4 mt-0 flex md:block items-center justify-center min-h-[5rem] md:min-h-0">
                            <button
                                onClick={() => scrollThumbnails('prev')}
                                className={`absolute left-0 top-1/2 -translate-y-1/2 -ml-2 md:-ml-0 md:left-1/2 md:top-0 md:-translate-x-1/2 md:-translate-y-4 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-md border border-gray-200 text-black hover:scale-110 transition-all ${!canScrollPrev ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 hidden md:block">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 md:hidden">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                </svg>
                            </button>

                            <div
                                ref={scrollContainerRef}
                                onScroll={checkScroll}
                                className="flex md:flex-col gap-1 md:gap-3 overflow-x-auto overflow-y-hidden md:overflow-x-hidden md:overflow-y-auto p-1 w-full h-full md:absolute md:inset-0 hide-scrollbar scroll-smooth"
                                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                            >
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`w-14 h-14 md:h-20 md:w-full aspect-square transition-all flex-shrink-0 bg-white p-1 border-[2px] ${selectedImage === idx ? 'border-black' : 'border-gray-100/50 hover:border-gray-300'}`}
                                    >
                                        <img
                                            src={img.url}
                                            alt={img.altText || `${product.title} ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => scrollThumbnails('next')}
                                className={`absolute right-0 top-1/2 -translate-y-1/2 -mr-2 md:-mr-0 md:right-auto md:left-1/2 md:bottom-0 md:-translate-x-1/2 md:translate-y-4 md:top-auto z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-md border border-gray-200 text-black hover:scale-110 transition-all ${!canScrollNext ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 hidden md:block">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 md:hidden">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </button>
                        </div>
                    )}

                    <div className="flex-grow w-full relative">
                        <div className="w-full pb-[100%] rounded-[1rem] overflow-hidden border border-gray-100 bg-white relative">
                            {mainImage ? (
                                <img
                                    src={mainImage}
                                    alt={product.title}
                                    className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-in-out cursor-zoom-in"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400">No image available</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Side: Product Details */}
                <div className="flex flex-col space-y-8">
                    <div className="space-y-4 mb-1">
                        {product.vendor && (
                            <div className="text-sm font-bold text-[#700b10] md:mb-2 mb-1">
                                {product.vendor}
                            </div>
                        )}
                        <div className="flex justify-between items-start gap-4 mb-1 md:mb-4">
                            <h1 className="font-nunito text-xl md:text-3xl font-bold text-gray-900 leading-tight flex-grow">
                                {product.title}
                            </h1>
                            <button
                                onClick={() => setIsShareModalOpen(true)}
                                className="p-2 md:p-2.5 rounded-full border border-gray-200 text-gray-600 hover:text-[#700b10] hover:bg-gray-50 transition-all flex items-center gap-1.5 shadow-sm flex-shrink-0 group"
                                title="Share Product"
                            >
                                <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-bold hidden sm:inline">Share</span>
                            </button>
                        </div>

                        {totalReviews > 0 && (
                            <div className="md:mt-2 mt-1 mb-1">
                                <ProductRating averageRating={averageRating} totalReviews={totalReviews} />
                            </div>
                        )}

                        <div className="flex items-baseline gap-3 mb-2 md:mb-4">
                            <div className="text-xl md:text-4xl font-bold text-[#700b10]">
                                {formattedPrice}
                            </div>
                            {formattedCompareAtPrice && (
                                <div className="text-md md:text-xl text-gray-400 line-through">
                                    {formattedCompareAtPrice}
                                </div>
                            )}
                            {compareAtAmount > priceAmount && (
                                <div className="bg-[#700b10] text-white text-[10px] font-bold px-2 py-1 rounded">
                                    {Math.round(((compareAtAmount - priceAmount) / compareAtAmount) * 100)}% OFF
                                </div>
                            )}
                        </div>

                        <div className="md:text-[11px] text-[8px] text-gray opacity-80 font-bold font-nunito uppercase tracking-wider md:mb-2 mb-0">
                            Tax Excluded. <a href="/pages/shippingpolicy" className="text-[#700b10] underline">Shipping</a> calculated at checkout.
                        </div>

                        {/* Stock & Urgency Section */}
                        <div className="space-y-3 pt-2">
                            <div className="flex items-center gap-2 font-bold text-sm animate-pulse text-black">
                                <span>🔥 <span className="text-[#700b10]">{soldCount}</span> sold in last 18 hours</span>
                            </div>
                            <div className="flex items-center gap-2 font-bold text-sm animate-pulse text-black">
                                <span>👀 <span className="text-[#700b10]">{viewCount}</span> people are viewing this right now</span>
                            </div>

                            {/* <div className="space-y-1.5">
                                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider mb-1">
                                    <span className="text-gray-500">Hurry up, only {stockCount} items left!</span>
                                    <span className="text-[#d43818]">{Math.round((stockCount / 1200) * 100)}%</span>
                                </div>
                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-orange-400 to-[#d43818] rounded-full transition-all duration-1000"
                                        style={{ width: `${(stockCount / 1200) * 100}%` }}
                                    ></div>
                                </div>
                            </div> */}
                        </div>

                        {/* Pincode Check Section */}
                        {/* <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3">
                            <div className="flex items-center gap-2 text-gray-700 font-bold text-sm">
                                <MapPin className="w-4 h-4 text-[#700b10]" />
                                <span>Check Delivery Estimate</span>
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter Pincode"
                                    value={pincode}
                                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    className="flex-grow bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#700b10] transition-colors"
                                />
                                <button
                                    onClick={() => {
                                        if (pincode.length === 6) {
                                            setPincodeStatus('checking');
                                            setTimeout(() => setPincodeStatus('success'), 1000);
                                        }
                                    }}
                                    className="bg-black text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
                                    disabled={pincode.length !== 6 || pincodeStatus === 'checking'}
                                >
                                    {pincodeStatus === 'checking' ? '...' : 'CHECK'}
                                </button>
                            </div>
                            {pincodeStatus === 'success' && (
                                <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold animate-in fade-in slide-in-from-top-1">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Delivery available to {pincode} (3-5 days)</span>
                                </div>
                            )}
                        </div> */}

                        {/* Shipping Timeline */}
                        {/* <div className="grid grid-cols-3 gap-2 py-4 border-y border-gray-100">
                            <div className="flex flex-col items-center text-center space-y-2">
                                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[#700b10]">
                                    <ShoppingCart size={18} />
                                </div>
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter leading-tight">Order<br />Placed</span>
                            </div>
                            <div className="flex flex-col items-center text-center space-y-2 relative">
                                <div className="absolute top-5 -left-1/2 w-full h-[1px] bg-gray-100 -z-10"></div>
                                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[#700b10]">
                                    <Clock size={18} />
                                </div>
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter leading-tight">Order<br />Dispatch</span>
                            </div>
                            <div className="flex flex-col items-center text-center space-y-2 relative">
                                <div className="absolute top-5 -left-1/2 w-full h-[1px] bg-gray-100 -z-10"></div>
                                <div className="w-10 h-10 rounded-full bg-[#700b10] flex items-center justify-center text-white">
                                    <Truck size={18} />
                                </div>
                                <span className="text-[10px] font-bold text-gray-900 uppercase tracking-tighter leading-tight">Estimated<br />Delivery</span>
                            </div>
                        </div> */}

                        {/* <div className="text-[12px] text-gray-600 font-nunito flex items-center gap-2">
                            <Info className="w-3.5 h-3.5 text-[#700b10]" />
                            <span>👉 Free Shipping In India (On Order Above ₹999)</span>
                        </div> */}

                    </div>

                    {/* ICICI Promise Banner */}
                    <div
                        onClick={() => setIsEasebuzzModalOpen(true)}
                        className="relative bg-gradient-to-r from-[#fff3ec] to-white rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 group border border-orange-200 my-4"
                    >
                        {/* A subtle orange glow on hover */}
                        <div className="absolute inset-0 bg-[#f37021] opacity-0 group-hover:opacity-[0.03] transition-opacity"></div>

                        <div className="p-3 md:p-5 flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-3 md:gap-4">
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100/80 rounded-full flex items-center justify-center shadow-inner border border-orange-200">
                                    <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-[#f37021]" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-1.5 mb-0.5">
                                        <span className="text-gray-800 font-extrabold text-[12px] md:text-sm tracking-tight uppercase">ICICI Bank</span>
                                        <div className="bg-[#f37021] text-white text-[8px] md:text-[10px] font-bold px-1.5 py-0.5 rounded-sm">SECURE</div>
                                    </div>
                                    <h4 className="text-[#c15a1a] font-bold text-[13px] md:text-[15px] leading-tight">
                                        100% Payment Protection
                                    </h4>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="hidden md:block bg-orange-50 px-3 py-1.5 rounded-full text-[#c15a1a] text-[10px] font-bold uppercase tracking-wider border border-orange-200/50">
                                    Prepaid Orders
                                </div>
                                <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center group-hover:bg-[#f37021] transition-colors">
                                    <ChevronRight className="w-4 h-4 text-[#f37021] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-orange-50/50 p-2.5 px-4 md:px-5 flex items-center gap-2 border-t border-orange-100 relative z-10">
                            <div className="w-4 h-4 rounded-full bg-white shadow-sm flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-[#f37021]"></div>
                            </div>
                            <span className="text-[11px] md:text-xs font-nunito text-gray-700">
                                Click here to learn more about our <span className="text-[#f37021] font-bold">safe payment</span> guarantee.
                            </span>
                        </div>
                    </div>

                    {/* App Promotion Banner */}
                    {/* <div className="my-2 border-[1.5px] border-dashed border-[#336390] rounded-md overflow-hidden bg-white shadow-sm">
                        <div className="bg-[#e7f3ff] p-1 md:px-5 px-2 flex items-center justify-between">
                            <div className="flex items-center gap-0">
                                <div className="rounded-full p-1.5 flex items-center justify-center transform rotate-[-15deg]">
                                    <svg class="flower-icon11" className="h-4 w-4 md:h-6 md:w-6" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5.34256 0C5.44614 0 5.55252 0 5.65611 0C5.86887 0.065624 6.06484 0.154074 6.22721 0.316707C6.43717 0.527845 6.64994 0.733277 6.8627 0.944415C6.96908 1.04998 7.08946 1.08708 7.24063 1.0614C7.56538 1.01004 7.89012 0.961534 8.21487 0.930148C8.68519 0.884497 9.12751 1.1955 9.23669 1.66628C9.31228 1.98584 9.36547 2.31396 9.41586 2.63923C9.44386 2.82468 9.52504 2.95023 9.69302 3.03582C9.94497 3.16136 10.1885 3.29832 10.4349 3.43242C10.9668 3.7263 11.1432 4.28268 10.8828 4.83906C10.7568 5.10726 10.6309 5.37261 10.4993 5.63796C10.4293 5.77776 10.4293 5.91186 10.4993 6.05167C10.6309 6.31702 10.7568 6.58237 10.8828 6.85057C11.1432 7.40695 10.9668 7.96333 10.4349 8.25721C10.1829 8.39702 9.93097 8.53682 9.67342 8.66807C9.53064 8.74226 9.44946 8.84782 9.42426 9.0076C9.37947 9.28437 9.32348 9.56113 9.28429 9.83789C9.2003 10.4485 8.70478 10.8308 8.15608 10.7566C7.89292 10.7224 7.62977 10.6967 7.36941 10.6425C7.12865 10.594 6.93829 10.6339 6.76752 10.8308C6.59675 11.0277 6.40078 11.1989 6.21601 11.3815C5.78768 11.7952 5.20818 11.7952 4.77986 11.3815C4.56429 11.1732 4.34873 10.9592 4.13597 10.7481C4.03798 10.6511 3.9316 10.6026 3.79163 10.6254C3.46688 10.6739 3.14214 10.7224 2.81739 10.7623C2.33867 10.8223 1.87115 10.5027 1.75917 10.0291C1.68359 9.70379 1.63319 9.37282 1.58 9.0447C1.55201 8.8678 1.47642 8.74511 1.31685 8.66522C1.06209 8.53682 0.812935 8.39987 0.566577 8.26291C0.0374677 7.96047 -0.141702 7.4041 0.118654 6.84772C0.244632 6.57952 0.370611 6.31417 0.502188 6.04882C0.572176 5.90901 0.572176 5.77491 0.502188 5.6351C0.370611 5.36975 0.244632 5.1044 0.118654 4.8362C-0.141702 4.27982 0.0346681 3.72345 0.566577 3.42957C0.821333 3.28691 1.07889 3.1471 1.33645 3.01585C1.47642 2.94452 1.55201 2.8361 1.5772 2.68202C1.622 2.40526 1.67799 2.1285 1.71718 1.85174C1.80117 1.24115 2.29948 0.858818 2.84539 0.930148C3.10854 0.964387 3.3717 0.990066 3.62925 1.04428C3.87001 1.09278 4.06598 1.05569 4.23115 0.855965C4.33473 0.72757 4.46911 0.624854 4.58109 0.505019C4.79665 0.279615 5.02621 0.0713304 5.34256 0ZM8.0133 3.65212C8.0049 3.47807 7.94052 3.3725 7.81454 3.31258C7.67456 3.24696 7.54578 3.28405 7.40581 3.42671C5.98085 4.88185 4.55589 6.33414 3.13094 7.78643C3.10854 7.80925 3.08895 7.82923 3.06935 7.85205C2.92097 8.03751 2.99096 8.30286 3.21492 8.38275C3.3661 8.43696 3.48088 8.37704 3.58726 8.27147C5.02062 6.81063 6.45117 5.34978 7.88452 3.88893C7.90692 3.86611 7.93212 3.84614 7.94332 3.82046C7.97411 3.75769 7.99651 3.69206 8.0133 3.65212ZM4.17796 5.2756C4.84424 5.2756 5.38735 4.72207 5.39015 4.04586C5.39015 3.3725 4.83865 2.81042 4.17796 2.81042C3.51727 2.81042 2.96857 3.36965 2.96857 4.04586C2.96857 4.72493 3.50887 5.2756 4.17796 5.2756ZM6.82071 6.41118C6.15442 6.41118 5.61131 6.96755 5.61411 7.64377C5.61411 8.31427 6.17122 8.87921 6.8291 8.87636C7.49259 8.8735 8.0357 8.31427 8.0357 7.63806C8.0301 6.959 7.48979 6.40832 6.82071 6.41118Z" fill="#0A3174"></path>
                                        <path d="M8.01318 3.65211C7.99639 3.6892 7.97119 3.75768 7.9404 3.82045C7.9264 3.84613 7.9012 3.8661 7.88161 3.88892C6.45105 5.34977 5.0177 6.80776 3.58434 8.26861C3.47796 8.37703 3.36318 8.4341 3.21201 8.37989C2.99084 8.3 2.91806 8.03465 3.06643 7.84919C3.08603 7.82636 3.10842 7.80354 3.12802 7.78356C4.55298 6.33128 5.97793 4.87899 7.40289 3.4267C7.54566 3.28119 7.67164 3.2441 7.81162 3.31257C7.9404 3.37249 8.00479 3.47806 8.01318 3.65211Z" fill="white"></path>
                                        <path d="M4.1779 5.2756C3.50881 5.2756 2.96851 4.72493 2.96851 4.04587C2.96851 3.36966 3.51721 2.81042 4.1779 2.81042C4.83859 2.81042 5.39009 3.37251 5.39009 4.04587C5.39009 4.72208 4.84418 5.2756 4.1779 5.2756ZM4.1947 3.48664C3.88955 3.47522 3.63479 3.72345 3.62639 4.03731C3.61799 4.3369 3.86715 4.60224 4.1639 4.6108C4.46625 4.61936 4.72381 4.37113 4.7322 4.05728C4.7434 3.75769 4.49704 3.49805 4.1947 3.48664Z" fill="white"></path>
                                        <path d="M6.82072 6.41125C7.48981 6.41125 8.03291 6.95907 8.03291 7.63814C8.03291 8.31435 7.48981 8.87358 6.82632 8.87643C6.16843 8.87929 5.61413 8.3172 5.61133 7.64384C5.61133 6.96763 6.15444 6.41125 6.82072 6.41125ZM6.82632 8.20022C7.12867 8.19737 7.37503 7.94914 7.37783 7.64099C7.38063 7.3357 7.12307 7.0732 6.82072 7.07605C6.52397 7.07891 6.27202 7.33284 6.26922 7.63814C6.26642 7.94629 6.52117 8.20307 6.82632 8.20022Z" fill="white"></path>
                                        <path d="M4.19464 3.48665C4.49699 3.49806 4.74334 3.7577 4.73215 4.05729C4.72095 4.36829 4.46619 4.61652 4.16384 4.61081C3.86709 4.60225 3.61514 4.3369 3.62634 4.03732C3.63473 3.72346 3.88949 3.47523 4.19464 3.48665Z" fill="#0A3174"></path>
                                        <path d="M6.82617 8.20012C6.52102 8.20297 6.26627 7.94618 6.26907 7.63804C6.27187 7.33559 6.52102 7.0788 6.82057 7.07595C7.12292 7.0731 7.38048 7.33274 7.37768 7.64089C7.37488 7.94903 7.12852 8.19727 6.82617 8.20012Z" fill="#0A3174"></path>
                                    </svg>
                                </div>
                                <span className="text-[#1e5d99] font-bold text-[14px] tracking-tight">
                                    Exclusive Discounts
                                </span>
                            </div>
                            <div className="flex items-center gap-0">
                                <div className="rounded-full p-1.5 flex items-center justify-center transform rotate-[-15deg]">
                                    <svg class="flower-icon11" className="h-4 w-4 md:h-6 md:w-6" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5.34256 0C5.44614 0 5.55252 0 5.65611 0C5.86887 0.065624 6.06484 0.154074 6.22721 0.316707C6.43717 0.527845 6.64994 0.733277 6.8627 0.944415C6.96908 1.04998 7.08946 1.08708 7.24063 1.0614C7.56538 1.01004 7.89012 0.961534 8.21487 0.930148C8.68519 0.884497 9.12751 1.1955 9.23669 1.66628C9.31228 1.98584 9.36547 2.31396 9.41586 2.63923C9.44386 2.82468 9.52504 2.95023 9.69302 3.03582C9.94497 3.16136 10.1885 3.29832 10.4349 3.43242C10.9668 3.7263 11.1432 4.28268 10.8828 4.83906C10.7568 5.10726 10.6309 5.37261 10.4993 5.63796C10.4293 5.77776 10.4293 5.91186 10.4993 6.05167C10.6309 6.31702 10.7568 6.58237 10.8828 6.85057C11.1432 7.40695 10.9668 7.96333 10.4349 8.25721C10.1829 8.39702 9.93097 8.53682 9.67342 8.66807C9.53064 8.74226 9.44946 8.84782 9.42426 9.0076C9.37947 9.28437 9.32348 9.56113 9.28429 9.83789C9.2003 10.4485 8.70478 10.8308 8.15608 10.7566C7.89292 10.7224 7.62977 10.6967 7.36941 10.6425C7.12865 10.594 6.93829 10.6339 6.76752 10.8308C6.59675 11.0277 6.40078 11.1989 6.21601 11.3815C5.78768 11.7952 5.20818 11.7952 4.77986 11.3815C4.56429 11.1732 4.34873 10.9592 4.13597 10.7481C4.03798 10.6511 3.9316 10.6026 3.79163 10.6254C3.46688 10.6739 3.14214 10.7224 2.81739 10.7623C2.33867 10.8223 1.87115 10.5027 1.75917 10.0291C1.68359 9.70379 1.63319 9.37282 1.58 9.0447C1.55201 8.8678 1.47642 8.74511 1.31685 8.66522C1.06209 8.53682 0.812935 8.39987 0.566577 8.26291C0.0374677 7.96047 -0.141702 7.4041 0.118654 6.84772C0.244632 6.57952 0.370611 6.31417 0.502188 6.04882C0.572176 5.90901 0.572176 5.77491 0.502188 5.6351C0.370611 5.36975 0.244632 5.1044 0.118654 4.8362C-0.141702 4.27982 0.0346681 3.72345 0.566577 3.42957C0.821333 3.28691 1.07889 3.1471 1.33645 3.01585C1.47642 2.94452 1.55201 2.8361 1.5772 2.68202C1.622 2.40526 1.67799 2.1285 1.71718 1.85174C1.80117 1.24115 2.29948 0.858818 2.84539 0.930148C3.10854 0.964387 3.3717 0.990066 3.62925 1.04428C3.87001 1.09278 4.06598 1.05569 4.23115 0.855965C4.33473 0.72757 4.46911 0.624854 4.58109 0.505019C4.79665 0.279615 5.02621 0.0713304 5.34256 0ZM8.0133 3.65212C8.0049 3.47807 7.94052 3.3725 7.81454 3.31258C7.67456 3.24696 7.54578 3.28405 7.40581 3.42671C5.98085 4.88185 4.55589 6.33414 3.13094 7.78643C3.10854 7.80925 3.08895 7.82923 3.06935 7.85205C2.92097 8.03751 2.99096 8.30286 3.21492 8.38275C3.3661 8.43696 3.48088 8.37704 3.58726 8.27147C5.02062 6.81063 6.45117 5.34978 7.88452 3.88893C7.90692 3.86611 7.93212 3.84614 7.94332 3.82046C7.97411 3.75769 7.99651 3.69206 8.0133 3.65212ZM4.17796 5.2756C4.84424 5.2756 5.38735 4.72207 5.39015 4.04586C5.39015 3.3725 4.83865 2.81042 4.17796 2.81042C3.51727 2.81042 2.96857 3.36965 2.96857 4.04586C2.96857 4.72493 3.50887 5.2756 4.17796 5.2756ZM6.82071 6.41118C6.15442 6.41118 5.61131 6.96755 5.61411 7.64377C5.61411 8.31427 6.17122 8.87921 6.8291 8.87636C7.49259 8.8735 8.0357 8.31427 8.0357 7.63806C8.0301 6.959 7.48979 6.40832 6.82071 6.41118Z" fill="#0A3174"></path>
                                        <path d="M8.01318 3.65211C7.99639 3.6892 7.97119 3.75768 7.9404 3.82045C7.9264 3.84613 7.9012 3.8661 7.88161 3.88892C6.45105 5.34977 5.0177 6.80776 3.58434 8.26861C3.47796 8.37703 3.36318 8.4341 3.21201 8.37989C2.99084 8.3 2.91806 8.03465 3.06643 7.84919C3.08603 7.82636 3.10842 7.80354 3.12802 7.78356C4.55298 6.33128 5.97793 4.87899 7.40289 3.4267C7.54566 3.28119 7.67164 3.2441 7.81162 3.31257C7.9404 3.37249 8.00479 3.47806 8.01318 3.65211Z" fill="white"></path>
                                        <path d="M4.1779 5.2756C3.50881 5.2756 2.96851 4.72493 2.96851 4.04587C2.96851 3.36966 3.51721 2.81042 4.1779 2.81042C4.83859 2.81042 5.39009 3.37251 5.39009 4.04587C5.39009 4.72208 4.84418 5.2756 4.1779 5.2756ZM4.1947 3.48664C3.88955 3.47522 3.63479 3.72345 3.62639 4.03731C3.61799 4.3369 3.86715 4.60224 4.1639 4.6108C4.46625 4.61936 4.72381 4.37113 4.7322 4.05728C4.7434 3.75769 4.49704 3.49805 4.1947 3.48664Z" fill="white"></path>
                                        <path d="M6.82072 6.41125C7.48981 6.41125 8.03291 6.95907 8.03291 7.63814C8.03291 8.31435 7.48981 8.87358 6.82632 8.87643C6.16843 8.87929 5.61413 8.3172 5.61133 7.64384C5.61133 6.96763 6.15444 6.41125 6.82072 6.41125ZM6.82632 8.20022C7.12867 8.19737 7.37503 7.94914 7.37783 7.64099C7.38063 7.3357 7.12307 7.0732 6.82072 7.07605C6.52397 7.07891 6.27202 7.33284 6.26922 7.63814C6.26642 7.94629 6.52117 8.20307 6.82632 8.20022Z" fill="white"></path>
                                        <path d="M4.19464 3.48665C4.49699 3.49806 4.74334 3.7577 4.73215 4.05729C4.72095 4.36829 4.46619 4.61652 4.16384 4.61081C3.86709 4.60225 3.61514 4.3369 3.62634 4.03732C3.63473 3.72346 3.88949 3.47523 4.19464 3.48665Z" fill="#0A3174"></path>
                                        <path d="M6.82617 8.20012C6.52102 8.20297 6.26627 7.94618 6.26907 7.63804C6.27187 7.33559 6.52102 7.0788 6.82057 7.07595C7.12292 7.0731 7.38048 7.33274 7.37768 7.64089C7.37488 7.94903 7.12852 8.19727 6.82617 8.20012Z" fill="#0A3174"></path>
                                    </svg>
                                </div>
                                <span className="text-gray-800 font-bold text-[13px] tracking-tight">
                                    Extra 2% OFF
                                </span>
                            </div>
                        </div>
                        <div className="py-2 px-2 flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-center">
                            <span className="text-gray-600 text-[12px] font-nunito">Only on App :</span>
                            <div className="flex items-center gap-4">
                                <a
                                    href="#"
                                    className="group flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity"
                                >
                                    <div className="w-4 h-4 bg-gray-50 rounded-full flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 24 24">
                                            <path d="M 7.5 1 C 7.372 1 7.2439844 1.0489844 7.1464844 1.1464844 C 6.9514844 1.3414844 6.9514844 1.6585156 7.1464844 1.8535156 L 8.4570312 3.1640625 C 6.9691108 4.2559188 6 6.0127547 6 8 L 18 8 C 18 6.0127547 17.030889 4.2559188 15.542969 3.1640625 L 16.853516 1.8535156 C 17.048516 1.6575156 17.048516 1.3424844 16.853516 1.1464844 C 16.658516 0.95148437 16.341484 0.95148438 16.146484 1.1464844 L 14.664062 2.6289062 C 13.860616 2.2295595 12.95819 2 12 2 C 11.04181 2 10.139384 2.2295595 9.3359375 2.6289062 L 7.8535156 1.1464844 C 7.7560156 1.0489844 7.628 1 7.5 1 z M 9 5 L 10 5 L 10 6 L 9 6 L 9 5 z M 14 5 L 15 5 L 15 6 L 14 6 L 14 5 z M 4 9 C 3.448 9 3 9.448 3 10 L 3 16 C 3 16.552 3.448 17 4 17 C 4.552 17 5 16.552 5 16 L 5 10 C 5 9.448 4.552 9 4 9 z M 6 9 L 6 17 C 6 17.552 6.448 18 7 18 L 8 18 L 8 21.5 C 8 22.328 8.672 23 9.5 23 C 10.328 23 11 22.328 11 21.5 L 11 18 L 13 18 L 13 21.5 C 13 22.328 13.672 23 14.5 23 C 15.328 23 16 22.328 16 21.5 L 16 18 L 17 18 C 17.552 18 18 17.552 18 17 L 18 9 L 6 9 z M 20 9 C 19.448 9 19 9.448 19 10 L 19 16 C 19 16.552 19.448 17 20 17 C 20.552 17 21 16.552 21 16 L 21 10 C 21 9.448 20.552 9 20 9 z">
                                            </path>
                                        </svg>
                                    </div>
                                    <span className="text-[#1e5d99] font-bold md:text-[13px] text-[10px] uppercase tracking-wider group-hover:underline">
                                        DOWNLOAD NOW
                                    </span>
                                </a>
                                <span className="text-gray-300">|</span>
                                <a
                                    href="#"
                                    className="group flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                                >
                                    <div className="w-4 h-4 bg-gray-100 rounded-full flex items-center justify-center opacity-80 hover:opacity-100">
                                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 50 50">
                                            <path d="M 16 3 C 9.38 3 4 8.38 4 15 L 4 35 C 4 41.62 9.38 47 16 47 L 36 47 C 42.62 47 48 41.62 48 35 L 48 15 C 48 8.38 42.62 3 36 3 L 16 3 z M 12.619141 18.070312 C 13.319141 18.070312 13.839844 18.570469 13.839844 19.230469 C 13.839844 19.880469 13.319141 20.380859 12.619141 20.380859 C 11.909141 20.380859 11.390625 19.880469 11.390625 19.230469 C 11.390625 18.570469 11.909141 18.070312 12.619141 18.070312 z M 23.039062 18.640625 C 26.689062 18.640625 28.939453 21.189297 28.939453 25.279297 C 28.939453 29.359297 26.709062 31.929688 23.039062 31.929688 C 19.349062 31.929688 17.109375 29.369297 17.109375 25.279297 C 17.109375 21.179297 19.399062 18.640625 23.039062 18.640625 z M 35.970703 18.640625 C 38.540703 18.640625 40.419062 20.139297 40.539062 22.279297 L 38.619141 22.279297 C 38.429141 21.109297 37.419453 20.380859 35.939453 20.380859 C 34.379453 20.380859 33.349609 21.119531 33.349609 22.269531 C 33.349609 23.169531 34.009922 23.690078 35.669922 24.080078 L 37.060547 24.419922 C 39.670547 25.029922 40.740234 26.080234 40.740234 27.990234 C 40.740234 30.420234 38.859609 31.939453 35.849609 31.939453 C 33.039609 31.939453 31.149766 30.490703 31.009766 28.220703 L 32.960938 28.220703 C 33.130938 29.420703 34.31 30.189453 36 30.189453 C 37.58 30.189453 38.740234 29.370234 38.740234 28.240234 C 38.740234 27.280234 38.010078 26.700781 36.330078 26.300781 L 34.689453 25.910156 C 32.399453 25.370156 31.349609 24.260391 31.349609 22.400391 C 31.349609 20.140391 33.200703 18.640625 35.970703 18.640625 z M 23.039062 20.470703 C 20.649062 20.470703 19.130859 22.339297 19.130859 25.279297 C 19.130859 28.209297 20.599062 30.099609 23.039062 30.099609 C 25.449062 30.099609 26.929688 28.209297 26.929688 25.279297 C 26.929688 22.339297 25.449063 20.470703 23.039062 20.470703 z M 11.679688 22.060547 L 13.560547 22.060547 L 13.560547 31.630859 L 11.679688 31.630859 L 11.679688 22.060547 z">
                                            </path>
                                        </svg>
                                    </div>
                                    <span className="text-[#1e5d99] font-bold text-[10px] uppercase tracking-wider group-hover:underline">
                                        DOWNLOAD NOW
                                    </span>
                                </a>
                            </div>
                        </div>
                    </div> */}

                    {/* WhatsApp Community Banner */}
                    {/* <div className="my-2 bg-emerald-50 border border-emerald-100 rounded-md overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group">
                        <a href="https://chat.whatsapp.com/Ft1TM6WNHaALWyYQSbIF52" target="_blank" rel="noopener noreferrer" className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-emerald-50">
                                    <svg viewBox="0 0 24 24" className="w-7 h-7 fill-emerald-500">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-emerald-800 font-bold text-[15px] leading-tight flex items-center gap-1">
                                        Join WhatsApp Community
                                    </h4>
                                    <p className="text-emerald-600 text-[11px] font-medium">Get exclusive updates & special offers</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-emerald-400 group-hover:text-emerald-600 transition-all" />
                        </a>
                    </div> */}

                    {/* <div className="w-full h-px bg-gray-200"></div> */}

                    {/* Variant Selector */}
                    {allVariants.length > 0 && !(allVariants.length === 1 && (allVariants[0]?.title?.toLowerCase() === 'default title' || allVariants[0]?.title?.toLowerCase() === 'default' || !allVariants[0]?.title?.trim())) && (
                        <div className="space-y-3 pt-2 mb-2 md:mb-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Select Option</label>
                            <div className="flex flex-wrap gap-2">
                                {allVariants.map((v) => (
                                    <button
                                        key={v.id}
                                        onClick={() => handleVariantSelect(v)}
                                        className={`px-6 py-2 rounded-full border text-sm font-bold transition-all ${selectedVariantId === v.id
                                            ? 'bg-[#700b10] border-[#700b10] text-white shadow-md'
                                            : 'bg-white border-gray-200 text-gray-600 hover:border-[#700b10] hover:text-[#700b10]'
                                            }`}
                                    >
                                        {v.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="space-y-5 mb-1">
                        {/* Hide qty selector when product is already in cart — cart sidebar controls handle it */}
                        {(() => {
                            const variantId = selectedVariant?.id || product?.variants?.edges?.[0]?.node?.id || product?.variants?.[0]?.id;
                            const inCart = cart.some(i => i.variantId === variantId);
                            return !inCart && (
                                <div className="flex items-center gap-6">

                                    <span className="font-semibold text-gray-700 text-sm sm:text-base">
                                        Quantity
                                    </span>

                                    <div className="flex items-center bg-white border border-gray-200 rounded-full overflow-hidden shadow-sm">

                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-12 h-12 flex items-center justify-center text-lg font-bold text-gray-500 hover:text-[#700b10] hover:bg-gray-50 transition"
                                        >
                                            −
                                        </button>

                                        <input
                                            type="number"
                                            min="1"
                                            value={quantity}
                                            onChange={(e) =>
                                                setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                                            }
                                            className="w-16 h-12 text-center font-semibold text-gray-800 bg-transparent focus:outline-none"
                                        />

                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="w-12 h-12 flex items-center justify-center text-lg font-bold text-gray-500 hover:text-[#700b10] hover:bg-gray-50 transition"
                                        >
                                            +
                                        </button>

                                    </div>

                                </div>
                            );
                        })()}


                        <div className="flex flex-col sm:flex-row gap-3 pt-2 mb-0">
                            <div className="flex-1">
                                <AddToCart product={product} variant={selectedVariant} qty={quantity} isOutOfStock={isOutOfStock} price={Number(priceAmount)} />
                            </div>
                            <div className="flex-1">
                                <button
                                    onClick={handlebuynow}
                                    disabled={isOutOfStock}
                                    className={`text-[10px] md:text-sm w-full flex items-center justify-center md:gap-2 gap-1 px-2 py-2.5 md:px-4 md:py-2.5 rounded-full font-bold tracking-widest transition uppercase ${isOutOfStock
                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none'
                                        : 'bg-[#700b10] hover:bg-[#5a090d] text-white active:scale-95 shadow-md'
                                        }`}
                                >
                                    <span>{isOutOfStock ? 'OUT OF STOCK' : 'BUY IT NOW'}</span>
                                </button>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => toggleWishlist(product, selectedVariant?.id)}
                                    className="p-3 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors transform active:scale-95 shadow-sm"
                                    title="Add to Wishlist"
                                >
                                    <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? "fill-[#700b10] text-[#700b10]" : "text-gray-400"}`} />
                                </button>
                                <button
                                    onClick={() => setIsShareModalOpen(true)}
                                    className="p-3 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors transform active:scale-95 shadow-sm text-gray-700 hover:text-[#700b10]"
                                    title="Share Product"
                                >
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Quick Social Share Strip */}
                        <div className="flex items-center gap-2.5 pt-1.5 pb-0 text-xs">
                            <span className="font-bold text-gray-600 font-nunito">Share:</span>
                            <button
                                onClick={() => {
                                    const url = typeof window !== "undefined" ? window.location.href : "";
                                    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out ${product.title}: ${url}`)}`, "_blank");
                                }}
                                className="w-7 h-7 rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-all shadow-sm active:scale-95"
                                title="Share on WhatsApp"
                            >
                                <FaWhatsapp className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => {
                                    const url = typeof window !== "undefined" ? window.location.href : "";
                                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
                                }}
                                className="w-7 h-7 rounded-full bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white flex items-center justify-center transition-all shadow-sm active:scale-95"
                                title="Share on Facebook"
                            >
                                <FaFacebookF className="w-3 h-3" />
                            </button>
                            <button
                                onClick={() => {
                                    const url = typeof window !== "undefined" ? window.location.href : "";
                                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(product.title)}&url=${encodeURIComponent(url)}`, "_blank");
                                }}
                                className="w-7 h-7 rounded-full bg-black/10 text-gray-800 hover:bg-black hover:text-white flex items-center justify-center transition-all shadow-sm active:scale-95"
                                title="Share on X (Twitter)"
                            >
                                <FaTwitter className="w-3 h-3" />
                            </button>
                            <button
                                onClick={() => setIsShareModalOpen(true)}
                                className="text-[11px] font-bold text-[#700b10] hover:underline ml-1 font-nunito flex items-center gap-1"
                            >
                                <Share2 className="w-3 h-3" /> More
                            </button>
                        </div>

                        {/* Trust Badges */}




                    </div>

                    {/* <div className="w-full h-px bg-gray-200"></div> */}

                    <div className="space-y-4">
                        {/* Description Accordion (Always Open) */}
                        <div className="border-b border-gray-100 pt-4">
                            <h3 className="text-xl font-nunito font-bold text-gray-900 mb-4 flex items-center justify-between">
                                Description
                            </h3>
                            <div
                                className="prose md:text-sm text-xs md:prose-base prose-amber max-w-none text-gray-700 leading-relaxed font-nunito"
                                dangerouslySetInnerHTML={{ __html: cleanHTML }}
                            />
                        </div>
                        <div className="pt-2">
                            <img
                                src="https://cdn.shopify.com/s/files/1/0804/0867/4532/files/Fast_3.webp?v=1774263310"
                                alt="Trust Badges"
                                className="w-full h-auto opacity-90 hover:opacity-100 transition-opacity"
                            />
                        </div>

                        {/* Dynamic Metafield Accordions */}
                        {[
                            { label: "Ingredients", key: "ingredients", icon: <Info size={18} /> },
                            { label: "Benefits", key: "benefits", icon: <Sparkles size={18} /> },
                            { label: "Storage & Shelf Life", key: "shelf_life", icon: <History size={18} /> },
                            { label: "About Product", key: "about", icon: <ShieldCheck size={18} /> }
                        ].map((item, idx) => (
                            product[item.key]?.value && (
                                <details key={idx} className="group border-b border-gray-100 pb-4 outline-none">
                                    <summary className="flex items-center justify-between cursor-pointer list-none outline-none">
                                        <div className="flex items-center gap-3">
                                            <div className="text-[#700b10]">
                                                {item.icon}
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-800 group-open:text-[#700b10] transition-colors">
                                                {item.label}
                                            </h3>
                                        </div>
                                        <div className="text-gray-400 group-open:rotate-180 transition-transform duration-300">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                        </div>
                                    </summary>
                                    <div className="mt-4 text-gray-600 leading-relaxed font-nunito animate-in fade-in slide-in-from-top-1">
                                        {product[item.key].value}
                                    </div>
                                </details>
                            )
                        ))}

                        {/* FAQ Section */}
                        {/* <div className=" md:pt-8 md:mt-4">
                            <h3 className="text-xl font-nunito font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
                            <div className="space-y-4">
                                {[
                                    { q: "Is this product suitable for vegetarians?", a: "Yes, all Nilkanth Store products are 100% vegetarian and made with pure ingredients." },
                                    { q: "How should I store this product?", a: "Store in a cool, dry place away from direct sunlight. Once opened, keep in an airtight container for lasting freshness." }
                                ].map((item, idx) => (
                                    <details key={idx} className="group bg-gray-50 rounded-2xl md:p-4 p-2 outline-none transition-all hover:bg-gray-100/50">
                                        <summary className="flex items-center justify-between cursor-pointer list-none outline-none">
                                            <span className="md:text-sm text-xs font-bold text-gray-800 pr-4">{item.q}</span>
                                            <div className="text-gray-400 group-open:rotate-180 transition-transform duration-300">
                                                <ChevronDown size={18} />
                                            </div>
                                        </summary>
                                        <div className="mt-3 text-sm text-gray-600 leading-relaxed font-nunito animate-in fade-in slide-in-from-top-1 px-1">
                                            {item.a}
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>

            {/* <ShippingBanner /> */}
            <BestSeller />
            <RelatedProducts />
            <RecentlyViewed currentProductId={product?.id} />




            {/* REDESIGNED CUSTOMER REVIEWS SECTION */}

            <div className=" border-t border-gray-200">
                <div className="md:py-8 py-4 max-w-7xl mx-auto">
                    <h2 className="text-center md:text-4xl text-2xl font-nunito font-bold text-gray-900 md:mb-16 mb-0">Customer Reviews</h2>

                    {/* Review Summary Bar */}
                    <div className="bg-white md:rounded-[2.5rem] rounded-xl p-4 md:p-14 shadow-sm border border-yellow-100/50 md:mb-20 mb-8">
                        <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-0 lg:gap-0">

                            {/* Left: Overall Score */}
                            <div className="flex flex-col items-center lg:items-start text-center lg:text-left min-w-[200px] border-b lg:border-b-0 lg:border-r border-gray-100 pb-8 lg:pb-0 lg:pr-12">
                                <div className="flex items-center gap-1 mb-3">
                                    <ProductRating averageRating={averageRating} sizeClass="md:w-6 w-4 md:h-6 h-4" hideCount={true} />
                                    <span className="ml-3 md:text-xl text-lg font-bold text-gray-900">{averageRating} out of 5</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-500 font-bold md:text-sm text-xs">
                                    Based on {totalReviews} reviews
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                </div>
                            </div>

                            {/* Middle: Star Distribution */}
                            <div className="flex-grow max-w-lg w-full px-0 lg:px-8 space-y-3">
                                {starDistribution.map((dist) => (
                                    <div key={dist.star} className="flex items-center gap-4 group mb-1">
                                        <div className="flex items-center gap-0.5 min-w-[75px]">
                                            {[1, 2, 3, 4, 5].map(s => (
                                                <Star key={s} className={`w-3 h-3 ${dist.star >= s ? 'fill-[#700b10] text-[#700b10]' : 'text-gray-100'}`} />
                                            ))}
                                        </div>
                                        <div className="flex-grow h-2 md:h-3 bg-gray-100 rounded-full overflow-hidden relative">
                                            <div
                                                className="absolute h-full bg-[#700b10] transition-all duration-1000 ease-out"
                                                style={{ width: `${dist.percentage}%` }}
                                            ></div>
                                        </div>
                                        <span className="min-w-[25px] text-xs font-bold text-gray-400 group-hover:text-gray-900 transition-colors">
                                            {dist.count}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Right: Write Button */}
                            <div className="lg:pl-12 border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:block flex justify-center w-full lg:w-auto">
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-[#700b10] hover:bg-[#5a090d] text-white md:px-10 px-4 md:py-5 py-2 rounded-full font-bold md:text-xs text-[10px] tracking-[0.2em] shadow-xl hover:shadow-[#700b10]/20 transition-all active:scale-[0.97]"
                                >
                                    WRITE A REVIEW
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sorting Header (Visual only for now) */}
                    <div className="flex items-center justify-between mb-8 px-4 font-nunito">
                        <div className="relative group">
                            <button className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-black transition-colors">
                                Most Recent
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Review Grid */}
                    {totalReviews === 0 ? (
                        <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-gray-200 shadow-sm mx-4">
                            <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6 text-[#700b10]">
                                <MessageSquarePlus className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-nunito font-bold text-gray-900 mb-2">No reviews yet</h3>
                            <p className="text-gray-500 font-nunito max-w-md mx-auto">Be the first to share your experience with this product!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 lg:px-0">
                            {currentReviews.map((review) => (
                                <div key={review.id} className="bg-white md:p-10 p-4 md:rounded-[2rem] rounded-[0.5rem] shadow-sm border border-yellow-100/30 flex flex-col h-full hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                                    <div className="flex justify-between items-start md:mb-6 mb-3">
                                        <div className="flex gap-0.5">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star key={s} className={`md:w-4 md:h-4 w-3 h-3 ${review.rating >= s ? 'fill-[#700b10] text-[#700b10]' : 'text-gray-200'}`} />
                                            ))}
                                        </div>
                                        <span className="text-[0.65rem] font-bold text-gray-400 font-mono tracking-tighter">
                                            {new Date(review.created_at || review.date || Date.now()).toLocaleDateString('en-GB')}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3 md:mb-6 mb-3">
                                        <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center text-[#700b10] border border-yellow-100/50">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <h4 className="font-bold text-gray-900 text-sm whitespace-nowrap">{review.customer_name || review.name || "Anonymous"}</h4>
                                                <span className="bg-[#700b10] text-white md:text-[10px] text-[8px] md:px-2 px-1 py-0.5 rounded-sm font-bold tracking-widest leading-normal mb-[-1px]">VERIFIED</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-grow">
                                        {review.title && (
                                            <h5 className="font-bold text-gray-900 text-sm mb-2">{review.title}</h5>
                                        )}
                                        <p className="text-gray-700 font-nunito leading-relaxed md:text-base text-sm italic line-clamp-6">
                                            "{review.description || review.comment}"
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-20 flex justify-center items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className={`w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center transition-all ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#700b10] hover:text-white hover:border-[#700b10]'}`}
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-12 h-12 rounded-full font-bold text-sm transition-all ${currentPage === i + 1 ? 'bg-gray-100 text-[#700b10]' : 'text-gray-400 hover:text-black'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className={`w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center transition-all ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#700b10] hover:text-white hover:border-[#700b10]'}`}
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <FAQSection />
            {/* REVIEW MODAL */}
            {
                isModalOpen && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-500"
                            onClick={() => !isSubmitting && setIsModalOpen(false)}
                        ></div>

                        <div className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-5 duration-500">
                            {/* Modal Header */}
                            <div className="p-8 md:p-10 border-b border-gray-50 flex justify-between items-center bg-yellow-50/30">
                                <div>
                                    <h2 className="text-3xl font-nunito font-bold text-gray-900 mb-1">WRITE A REVIEW</h2>
                                    <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Share your authentic experience</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-12 h-12 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center hover:scale-110 active:scale-90 transition-all text-gray-400 hover:text-red-500"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-8 md:p-12">
                                {submitStatus === 'success' ? (
                                    <div className="text-center py-12 flex flex-col items-center animate-in zoom-in duration-700">
                                        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-8 text-emerald-500">
                                            <CheckCircle2 className="w-16 h-16" />
                                        </div>
                                        <h3 className="text-3xl font-nunito font-bold text-gray-900 mb-4">Thank You!</h3>
                                        <p className="text-gray-600 max-w-md">Your review has been submitted successfully and will be visible shortly.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleReviewSubmit} className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Your Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={reviewForm.name}
                                                    onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                                                    className="w-full text-black px-6 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-[#700b10] focus:ring-1 focus:ring-[#700b10] transition-all bg-gray-50/50"
                                                    placeholder="e.g. john doe"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Rating</label>
                                                <div className="flex gap-3 px-2">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                            key={star}
                                                            type="button"
                                                            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                                            className="focus:outline-none transition-transform active:scale-90"
                                                        >
                                                            <Star
                                                                className={`w-10 h-10 ${reviewForm.rating >= star ? 'fill-[#700b10] text-[#700b10]' : 'text-gray-200 hover:text-gray-400'}`}
                                                            />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Your Message</label>
                                            <textarea
                                                required
                                                rows={5}
                                                value={reviewForm.comment}
                                                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                                className="w-full text-black px-6 py-4 rounded-3xl border border-gray-200 focus:outline-none focus:border-[#700b10] transition-all bg-gray-50/50 resize-none font-nunito"
                                                placeholder="What did you like or dislike?"
                                            />
                                        </div>

                                        {submitStatus === 'error' && (
                                            <div className="p-4 bg-red-50 text-red-600 rounded-2xl font-bold text-sm text-center">
                                                Something went wrong. Please check your connection and try again.
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className={`w-full py-5 rounded-full font-bold text-xs tracking-[0.3em] transition-all shadow-xl ${isSubmitting ? 'bg-gray-400 cursor-not-allowed opacity-70' : 'bg-[#700b10] hover:bg-[#5a090d] text-white hover:shadow-[#700b10]/30 active:scale-[0.98]'}`}
                                        >
                                            {isSubmitting ? 'PROCESSING...' : 'SUBMIT REVIEW'}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }

            <style jsx global>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes zoom-in {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                @keyframes slide-in-from-bottom {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-in {
                    animation-fill-mode: forwards;
                }
                .fade-in {
                    animation-name: fade-in;
                }
                .zoom-in-95 {
                    animation-name: zoom-in;
                }
                .slide-in-from-bottom-5 {
                    animation-name: slide-in-from-bottom;
                }
            `}</style>
            {
                isEasebuzzModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300"
                            onClick={() => setIsEasebuzzModalOpen(false)}
                        />

                        <div className="bg-white w-full max-w-md rounded-[1.5rem] overflow-hidden shadow-2xl relative z-10 animate-in fade-in zoom-in duration-300">
                            {/* Close Button */}
                            <button
                                onClick={() => setIsEasebuzzModalOpen(false)}
                                className="absolute top-6 right-6 p-1 rounded-full bg-gray-50 text-gray-400 hover:text-gray-900 transition-colors z-20"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            <div className="p-6 pt-10">
                                {/* Header Logos */}
                                <div className="flex justify-between items-start mb-2">
                                    <div className="w-14 h-14 bg-[#fff3ec] rounded-full flex items-center justify-center border border-white shadow-sm">
                                        <div className="w-10 h-10 rounded-full border-2 border-[#f37021]/20 flex items-center justify-center">
                                            <span className="text-[#f37021] font-bold text-xl">₹</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center rounded-full border border-gray-100 p-2">
                                        <ShieldCheck className="h-8 w-8 text-[#f37021]" />
                                    </div>
                                </div>

                                <h2 className="text-lg font-nunito font-bold text-gray-900 leading-tight mb-2 pr-10">
                                    Your Purchase From Nilkanth Store Is Protected By <span className="text-[#f37021] font-sans italic text-xl">ICICI Bank</span>
                                </h2>
                                <p className="text-[#c15a1a] font-bold text-lg mb-4">Secure Payment Promise</p>

                                {/* Eligibility Box */}
                                <div className="bg-[#fffdf9] border border-orange-100 rounded-2xl p-2 mb- relative">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-orange-50/30 rounded-bl-[4rem] -z-0"></div>
                                    <p className="text-xs text-gray-700 font-nunito leading-relaxed relative z-10">
                                        If your order is incorrect, damaged, or not delivered, you'll be eligible for full support from ICICI payment protection.
                                    </p>
                                    <p className="text-gray-400 text-xs mt-4 italic font-nunito">Valid only on Prepaid orders.</p>
                                </div>

                                {/* Checklist */}
                                <div className="space-y-6 mb-4">
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1 w-6 h-6 rounded-full bg-[#fff3ec] flex items-center justify-center flex-shrink-0">
                                            <CheckCircle2 className="w-4 h-4 text-[#f37021]" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#f37021] text-md">100% Secure</h4>
                                            <p className="text-gray-500 font-nunito text-xs">encrypted and safe transactions</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1 w-6 h-6 rounded-full bg-[#fff3ec] flex items-center justify-center flex-shrink-0">
                                            <CheckCircle2 className="w-4 h-4 text-[#f37021]" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#f37021] text-m">100% Free</h4>
                                            <p className="text-gray-500 font-nunito text-xs">with no hidden costs</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Disclaimer Box */}
                                <div className="bg-gray-50 rounded-xl p-5 mb-4">
                                    <p className="text-[11px] text-gray-500 leading-relaxed italic">
                                        ICICI offers Secure Payment Promise only on select businesses that pass detailed background checks.
                                    </p>
                                </div>

                                {/* Action Button */}
                                <button
                                    onClick={() => setIsEasebuzzModalOpen(false)}
                                    className="w-full bg-[#f37021] hover:bg-[#d95d1a] text-white font-bold py-5 rounded-2xl shadow-lg transition-all active:scale-[0.98] mb-3"
                                >
                                    Yes, got it
                                </button>

                                <p className="text-center text-[10px] text-gray-400 font-nunito">
                                    To read detailed terms and conditions, <a href="#" className="underline hover:text-gray-600 transition-colors">click here</a>.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

            {/* Sticky Add to Cart Bar */}
            <div className={`fixed bottom-16 md:bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-[50] transition-all duration-500 transform ${showSticky ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-[150%] opacity-0 pointer-events-none'}`}>
                <div className="max-w-[1400px] mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-2 sm:gap-4">
                    <div className="hidden sm:flex items-center gap-4">
                        <img
                            src={mainImage}
                            alt={product.title}
                            className="w-12 h-12 rounded-lg object-cover border border-gray-100"
                        />
                        <div className="flex flex-col">
                            <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{product.title}</h4>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-[#700b10]">{formattedPrice}</span>
                                {formattedCompareAtPrice && (
                                    <span className="text-[10px] text-gray-400 line-through font-medium">
                                        {formattedCompareAtPrice}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-1 sm:flex-none items-center justify-end gap-1.5 sm:gap-3 w-full sm:w-auto">
                        {/* Variant Selector */}
                        {allVariants.length > 0 && !(allVariants.length === 1 && (allVariants[0]?.title?.toLowerCase() === 'default title' || allVariants[0]?.title?.toLowerCase() === 'default' || !allVariants[0]?.title?.trim())) && (
                            <select
                                value={selectedVariantId || ""}
                                onChange={(e) => {
                                    const variant = allVariants.find(v => v.id === e.target.value);
                                    if (variant) handleVariantSelect(variant);
                                }}
                                className="h-10 sm:h-11 px-2 sm:px-3 bg-gray-50 border border-gray-100 rounded-xl text-[10px] sm:text-[11px] font-bold text-gray-700 focus:outline-none focus:border-[#700b10] transition-colors cursor-pointer max-w-[100px] sm:max-w-[140px] md:max-w-none truncate"
                            >
                                {allVariants.map((v) => (
                                    <option key={v.id} value={v.id}>
                                        {v.title}
                                    </option>
                                ))}
                            </select>
                        )}

                        <div className="flex items-center bg-gray-50 rounded-full border border-gray-100 overflow-hidden h-10 sm:h-11 flex-shrink-0">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-8 sm:w-10 flex items-center justify-center text-gray-400 hover:text-[#700b10] transition text-sm"
                            >
                                −
                            </button>
                            <span className="w-6 sm:w-8 text-center text-xs sm:text-sm font-bold text-gray-900">{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="w-8 sm:w-10 flex items-center justify-center text-gray-400 hover:text-[#700b10] transition text-sm"
                            >
                                +
                            </button>
                        </div>
                        <div className="flex-1 sm:flex-none sm:w-48">
                            <AddToCart product={product} variant={selectedVariant} qty={quantity} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Share Modal */}
            <ShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                product={product}
            />
        </div>
    );
}