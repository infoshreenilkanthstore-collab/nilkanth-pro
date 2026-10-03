import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Search,
  X,
  Package,
  FolderOpen,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Tag,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import { fetchAllSearchData } from "../services/api";

const POPULAR_SUGGESTIONS = [
  "Attar",
  "Agarbatti",
  "Dhoop",
  "Perfume",
  "Air Freshner",
  "Bramshir Hil Malam",
  "Honey",
  "Pooja",
  "Rose",
  "Chandan",
];

export default function SearchModal({
  isOpen,
  onClose,
  onNavigate,
  onSelectProduct,
}) {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'products' | 'collections' | 'blogs'
  const [data, setData] = useState({ products: [], collections: [], blogs: [] });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  // Load search data whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetchAllSearchData()
        .then((res) => {
          setData(res);
          setLoading(false);
        })
        .catch(() => setLoading(false));

      // Auto-focus input
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);

      // Prevent background scrolling
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setActiveTab("all");
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Clean string helper
  const cleanStr = (str) => (str || "").toLowerCase().trim();

  // Filtered matching items
  const searchResults = useMemo(() => {
    const q = cleanStr(query);
    if (!q) {
      return { products: [], collections: [], blogs: [] };
    }

    const matchedProducts = (data.products || []).filter((p) => {
      const titleMatch = cleanStr(p.title).includes(q);
      const descMatch = cleanStr(p.description).includes(q);
      const handleMatch = cleanStr(p.handle).includes(q);
      const tagMatch = Array.isArray(p.tags) && p.tags.some((t) => cleanStr(t).includes(q));
      return titleMatch || descMatch || handleMatch || tagMatch;
    });

    const matchedCollections = (data.collections || []).filter((c) => {
      const titleMatch = cleanStr(c.title).includes(q);
      const handleMatch = cleanStr(c.handle).includes(q);
      const descMatch = cleanStr(c.description).includes(q);
      return titleMatch || handleMatch || descMatch;
    });

    const matchedBlogs = (data.blogs || []).filter((b) => {
      const titleMatch = cleanStr(b.title).includes(q);
      const excerptMatch = cleanStr(b.excerpt).includes(q);
      const contentMatch = cleanStr(b.content).includes(q);
      return titleMatch || excerptMatch || contentMatch;
    });

    return {
      products: matchedProducts,
      collections: matchedCollections,
      blogs: matchedBlogs,
    };
  }, [query, data]);

  const totalResultsCount =
    searchResults.products.length +
    searchResults.collections.length +
    searchResults.blogs.length;

  const handleProductClick = (product) => {
    onClose();
    if (onSelectProduct) {
      onSelectProduct(product);
    } else if (onNavigate) {
      onNavigate("product", {
        productHandle: product.handle || product.id,
        product,
      });
    }
  };

  const handleCollectionClick = (collection) => {
    onClose();
    const handle = collection.handle || collection.slug;
    onNavigate?.("collections", { collectionHandle: handle });
  };

  const handleBlogClick = (blog) => {
    onClose();
    onNavigate?.("blog-post", { postHandle: blog.handle });
  };

  const handleSuggestionClick = (text) => {
    setQuery(text);
    inputRef.current?.focus();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center pt-2 sm:pt-10 px-2 sm:px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-amber-100/80 overflow-hidden flex flex-col max-h-[88dvh] sm:max-h-[92vh] z-10 animate-scaleUp">
        {/* Search Input Bar */}
        <div className="p-3 sm:p-5 border-b border-stone-200/80 bg-white sticky top-0 z-20">
          <div className="relative flex items-center">
            <div className="absolute left-3.5 sm:left-4 text-[#700b10] pointer-events-none">
              <Search className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, collections, blogs..."
              style={{ fontSize: "16px" }}
              className="w-full pl-11 sm:pl-14 pr-24 sm:pr-28 py-3 sm:py-3.5 bg-stone-50 hover:bg-stone-100/70 focus:bg-white border border-stone-200 focus:border-[#700b10] rounded-xl sm:rounded-2xl text-stone-800 placeholder-stone-400 font-nunito text-base outline-none transition-all shadow-inner focus:shadow-sm"
            />

            {/* Clear and Close Action buttons */}
            <div className="absolute right-2 sm:right-3 flex items-center gap-1 sm:gap-2">
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-full transition-colors cursor-pointer"
                  aria-label="Clear search query"
                  title="Clear text"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="h-8 sm:h-9 px-2.5 sm:px-3 bg-stone-100 hover:bg-[#700b10] text-stone-700 hover:text-white rounded-full sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer border border-stone-200 hover:border-[#700b10] shadow-2xs"
                aria-label="Close search"
                title="Close search"
              >
                <X className="w-4 h-4 stroke-[2.2]" />
                <span className="hidden sm:inline">Esc</span>
              </button>
            </div>
          </div>

          {/* Filter Tabs when search query is typed */}
          {query.trim() && (
            <div className="flex items-center gap-2 mt-3 pt-2 border-t border-stone-100 overflow-x-auto no-scrollbar text-xs sm:text-sm">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${activeTab === "all"
                    ? "bg-[#700b10] text-white shadow-xs"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
              >
                All Results ({totalResultsCount})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("products")}
                className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === "products"
                    ? "bg-[#700b10] text-white shadow-xs"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
              >
                <Package className="w-3.5 h-3.5" />
                Products ({searchResults.products.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("collections")}
                className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === "collections"
                    ? "bg-[#700b10] text-white shadow-xs"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
              >
                <FolderOpen className="w-3.5 h-3.5" />
                Collections ({searchResults.collections.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("blogs")}
                className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === "blogs"
                    ? "bg-[#700b10] text-white shadow-xs"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Blogs &amp; News ({searchResults.blogs.length})
              </button>
            </div>
          )}
        </div>

        {/* Scrollable Results Body */}
        <div className="overflow-y-auto flex-1 p-3 sm:p-6 space-y-6">
          {/* Loading Indicator */}
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center text-stone-500 gap-3">
              <div className="w-8 h-8 border-3 border-amber-200 border-t-[#700b10] rounded-full animate-spin" />
              <p className="text-sm font-medium">Scanning catalog and articles...</p>
            </div>
          )}

          {/* Empty Query: Trending Suggestions and Quick Collections */}
          {!loading && !query.trim() && (
            <div className="space-y-6">
              {/* Popular Searches */}
              <div>
                <div className="flex items-center gap-2 mb-3 text-stone-700 font-bold text-xs uppercase tracking-wider">
                  <TrendingUp className="w-4 h-4 text-[#700b10]" />
                  <span>Popular Searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SUGGESTIONS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleSuggestionClick(tag)}
                      className="px-3 py-1.5 bg-amber-50 hover:bg-[#700b10] text-stone-700 hover:text-white border border-amber-200/60 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-1.5"
                    >
                      <span>{tag}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Collection Shortcuts */}
              {data.collections.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3 text-stone-700 font-bold text-xs uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="w-4 h-4 text-[#700b10]" />
                      <span>Browse Collections</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onNavigate?.("collections");
                      }}
                      className="text-xs text-[#700b10] hover:underline font-bold flex items-center gap-1"
                    >
                      View All
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {data.collections.slice(0, 5).map((col) => (
                      <button
                        key={col.id || col.handle}
                        type="button"
                        onClick={() => handleCollectionClick(col)}
                        className="group relative rounded-xl overflow-hidden aspect-4/3 border border-stone-200/80 hover:border-[#700b10] transition-all text-left shadow-xs hover:shadow-md"
                      >
                        <img
                          src={col.image_url}
                          alt={col.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-2.5">
                          <p className="text-white text-xs sm:text-sm font-bold line-clamp-1">
                            {col.title}
                          </p>
                          <span className="text-white/80 text-[10px]">
                            {col.product_count} items
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Latest Blog Post Highlights */}
              {data.blogs.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3 text-stone-700 font-bold text-xs uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#700b10]" />
                      <span>Featured Blogs &amp; Wellness Articles</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onNavigate?.("blogs");
                      }}
                      className="text-xs text-[#700b10] hover:underline font-bold flex items-center gap-1"
                    >
                      Read All
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {data.blogs.slice(0, 2).map((post) => (
                      <div
                        key={post.handle}
                        onClick={() => handleBlogClick(post)}
                        className="flex gap-3 p-2.5 rounded-xl border border-stone-100 hover:border-amber-200 bg-stone-50/50 hover:bg-stone-50 cursor-pointer transition-all group"
                      >
                        {post.image_url && (
                          <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-stone-200">
                            <img
                              src={post.image_url}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                        )}
                        <div className="flex flex-col justify-center min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-stone-800 line-clamp-2 group-hover:text-[#700b10] transition-colors">
                            {post.title}
                          </h4>
                          <p className="text-[11px] text-stone-500 line-clamp-1 mt-1">
                            {post.excerpt}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Results: When Query is typed */}
          {!loading && query.trim() && (
            <>
              {totalResultsCount === 0 ? (
                /* No Results Found State */
                <div className="py-12 text-center space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-full bg-amber-50 flex items-center justify-center text-[#700b10]">
                    <Search className="w-7 h-7" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-stone-800">
                    No results found for &ldquo;{query}&rdquo;
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
                    Try checking your spelling or search with broader terms like &ldquo;attar&rdquo;, &ldquo;perfume&rdquo;, or &ldquo;incense&rdquo;.
                  </p>
                  <div className="pt-2 flex flex-wrap justify-center gap-2">
                    {POPULAR_SUGGESTIONS.slice(0, 5).map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => handleSuggestionClick(term)}
                        className="px-3 py-1 bg-stone-100 hover:bg-[#700b10] hover:text-white rounded-full text-xs font-medium transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* 1. COLLECTIONS MATCHES */}
                  {(activeTab === "all" || activeTab === "collections") &&
                    searchResults.collections.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-3 text-stone-700 font-bold text-xs uppercase tracking-wider border-b border-stone-100 pb-2">
                          <div className="flex items-center gap-2">
                            <FolderOpen className="w-4 h-4 text-[#700b10]" />
                            <span>Collections ({searchResults.collections.length})</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {searchResults.collections.map((col) => (
                            <button
                              key={col.id || col.handle}
                              type="button"
                              onClick={() => handleCollectionClick(col)}
                              className="group p-2.5 rounded-xl border border-stone-200 hover:border-[#700b10] bg-white hover:bg-amber-50/30 transition-all text-left flex items-center gap-3 shadow-2xs hover:shadow-xs"
                            >
                              <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-stone-100">
                                <img
                                  src={col.image_url}
                                  alt={col.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs sm:text-sm font-bold text-stone-900 group-hover:text-[#700b10] truncate transition-colors">
                                  {col.title}
                                </p>
                                <span className="text-[11px] text-stone-500">
                                  {col.product_count} products
                                </span>
                              </div>
                              <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#700b10] group-hover:translate-x-0.5 transition-all" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* 2. PRODUCTS MATCHES */}
                  {(activeTab === "all" || activeTab === "products") &&
                    searchResults.products.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-3 text-stone-700 font-bold text-xs uppercase tracking-wider border-b border-stone-100 pb-2">
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-[#700b10]" />
                            <span>Products ({searchResults.products.length})</span>
                          </div>
                          {searchResults.products.length > 6 && activeTab === "all" && (
                            <button
                              type="button"
                              onClick={() => setActiveTab("products")}
                              className="text-xs text-[#700b10] hover:underline font-bold"
                            >
                              See all {searchResults.products.length} products
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {(activeTab === "all"
                            ? searchResults.products.slice(0, 6)
                            : searchResults.products
                          ).map((product) => {
                            const price = Number(
                              product.priceRange?.minVariantPrice?.amount ??
                              product.price ??
                              product.variants?.[0]?.price?.amount ??
                              product.variants?.[0]?.price ??
                              0
                            );
                            const comparePrice = Number(
                              product.compareAtPrice?.amount ??
                              product.compare_at_price ??
                              product.compareAtPrice ??
                              product.variants?.[0]?.compareAtPrice?.amount ??
                              product.variants?.[0]?.compare_at_price ??
                              product.variants?.[0]?.compareAtPrice ??
                              0
                            );
                            const image =
                              product.image_url ||
                              product.images?.[0]?.url ||
                              "https://megaecomm.megascale.co.in/backend/media/16/general/66066c8ca3ab4a8cc35413b3a26e3314.jpeg";

                            return (
                              <div
                                key={product.id || product.handle}
                                onClick={() => handleProductClick(product)}
                                className="group flex gap-3 p-2.5 rounded-xl border border-stone-200/90 hover:border-[#700b10] bg-white hover:bg-stone-50/60 cursor-pointer transition-all shadow-2xs hover:shadow-sm"
                              >
                                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-lg overflow-hidden shrink-0 bg-stone-100 relative">
                                  <img
                                    src={image}
                                    alt={product.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                  />
                                  {comparePrice > price && (
                                    <span className="absolute top-1 left-1 bg-[#700b10] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-xs">
                                      SALE
                                    </span>
                                  )}
                                </div>
                                <div className="flex flex-col justify-center min-w-0 flex-1">
                                  <h4 className="text-xs sm:text-sm font-bold text-stone-900 group-hover:text-[#700b10] line-clamp-2 transition-colors">
                                    {product.title}
                                  </h4>
                                  <div className="flex items-baseline gap-2 mt-1">
                                    <span className="text-xs sm:text-sm font-extrabold text-[#700b10]">
                                      ₹{Number(price).toLocaleString("en-IN")}
                                    </span>
                                    {comparePrice > price && (
                                      <span className="text-[11px] text-stone-400 line-through">
                                        ₹{Number(comparePrice).toLocaleString("en-IN")}
                                      </span>
                                    )}
                                  </div>
                                  {product.total_reviews > 0 && (
                                    <span className="text-[10px] text-stone-500 mt-0.5">
                                      ★ {product.avg_rating || 5} ({product.total_reviews} reviews)
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  {/* 3. BLOGS MATCHES */}
                  {(activeTab === "all" || activeTab === "blogs") &&
                    searchResults.blogs.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-3 text-stone-700 font-bold text-xs uppercase tracking-wider border-b border-stone-100 pb-2">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-[#700b10]" />
                            <span>Blog Articles &amp; News ({searchResults.blogs.length})</span>
                          </div>
                          {searchResults.blogs.length > 4 && activeTab === "all" && (
                            <button
                              type="button"
                              onClick={() => setActiveTab("blogs")}
                              className="text-xs text-[#700b10] hover:underline font-bold"
                            >
                              See all {searchResults.blogs.length} articles
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {(activeTab === "all"
                            ? searchResults.blogs.slice(0, 4)
                            : searchResults.blogs
                          ).map((post) => (
                            <div
                              key={post.handle}
                              onClick={() => handleBlogClick(post)}
                              className="group flex gap-3 p-3 rounded-xl border border-stone-200/90 hover:border-[#700b10] bg-white hover:bg-stone-50/60 cursor-pointer transition-all shadow-2xs hover:shadow-sm"
                            >
                              {post.image_url && (
                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden shrink-0 bg-stone-100">
                                  <img
                                    src={post.image_url}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                  />
                                </div>
                              )}
                              <div className="flex flex-col justify-center min-w-0 flex-1">
                                <h4 className="text-xs sm:text-sm font-bold text-stone-900 group-hover:text-[#700b10] line-clamp-2 transition-colors">
                                  {post.title}
                                </h4>
                                <p className="text-[11px] text-stone-500 line-clamp-1 mt-1">
                                  {post.excerpt}
                                </p>
                                <span className="text-[10px] text-[#700b10] font-bold mt-1.5 flex items-center gap-1">
                                  Read Article <ArrowRight className="w-2.5 h-2.5" />
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer Bar */}
        <div className="p-3 bg-stone-50 border-t border-stone-200/80 px-4 sm:px-6 flex items-center justify-between text-xs text-stone-500">
          <span className="hidden sm:inline">
            Press <kbd className="px-1.5 py-0.5 bg-white border border-stone-300 rounded text-[11px] font-mono">ESC</kbd> to close
          </span>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <button
              type="button"
              onClick={() => {
                onClose();
                onNavigate?.("shop");
              }}
              className="text-[#700b10] font-bold hover:underline"
            >
              Explore Shop
            </button>
            <span className="text-stone-300">•</span>
            <button
              type="button"
              onClick={() => {
                onClose();
                onNavigate?.("collections");
              }}
              className="text-[#700b10] font-bold hover:underline"
            >
              All Collections
            </button>
            <span className="text-stone-300">•</span>
            <button
              type="button"
              onClick={() => {
                onClose();
                onNavigate?.("blogs");
              }}
              className="text-[#700b10] font-bold hover:underline"
            >
              Read Blogs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
