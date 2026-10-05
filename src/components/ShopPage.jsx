import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Filter, X, Sparkles, ArrowLeft } from 'lucide-react';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';
import { fetchProducts, fetchCollectionByHandle, fetchCollections } from '../services/api';

const ITEMS_PER_PAGE = 12;

// Normalize weight/size string into standardized label: e.g. "8ml" -> "8 ml", "100g" -> "100 gm"
const normalizeWeight = (str) => {
  if (!str || typeof str !== 'string') return null;
  const match = str.match(/(\d+(?:\.\d+)?)\s*(ml|l|ltr|gm|g|kg|oz|lb)\b/i);
  if (!match) return null;
  const num = parseFloat(match[1]);
  if (isNaN(num) || num <= 0) return null;
  let unit = match[2].toLowerCase();
  if (unit === 'g') unit = 'gm';
  if (unit === 'ltr') unit = 'l';
  const numStr = num % 1 === 0 ? String(num) : String(parseFloat(num.toFixed(1)));
  return `${numStr} ${unit}`;
};

// Extract all distinct normalized weights from a single product object
const extractProductWeights = (prod) => {
  const found = new Set();
  const regex = /(\d+(?:\.\d+)?)\s*(ml|l|ltr|gm|g|kg|oz|lb)\b/gi;

  const scanText = (text) => {
    if (!text || typeof text !== 'string') return;
    const matches = text.matchAll(regex);
    for (const m of matches) {
      const norm = normalizeWeight(m[0]);
      if (norm) found.add(norm);
    }
  };

  // 1. From variants (title, name, sku, selectedOptions, weight)
  if (Array.isArray(prod?.variants)) {
    prod.variants.forEach((v) => {
      scanText(v?.title);
      scanText(v?.name);
      scanText(v?.sku);
      if (Array.isArray(v?.selectedOptions)) {
        v.selectedOptions.forEach((opt) => scanText(opt?.value));
      }
      if (v?.weight && v?.weight_unit) {
        scanText(`${v.weight} ${v.weight_unit}`);
      }
    });
  }

  // 2. From product options
  if (Array.isArray(prod?.options)) {
    prod.options.forEach((opt) => {
      if (Array.isArray(opt?.values)) {
        opt.values.forEach((val) => scanText(val));
      }
    });
  }

  // 3. From product title
  scanText(prod?.title || prod?.name || prod?.product_title);

  // 4. From product tags
  if (Array.isArray(prod?.tags)) {
    prod.tags.forEach((tag) => scanText(tag));
  } else if (typeof prod?.tags === 'string') {
    scanText(prod.tags);
  }

  return Array.from(found);
};

export default function ShopPage({ onSelectProduct, collectionHandle = null, onNavigate }) {
  const [products, setProducts] = useState([]);
  const [collectionInfo, setCollectionInfo] = useState(null);
  const [collectionsList, setCollectionsList] = useState([]);
  const [collectionProductMap, setCollectionProductMap] = useState(new Map());
  const [loading, setLoading] = useState(true);

  // Filter states
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2410);
  const [selectedWeights, setSelectedWeights] = useState([]);
  const [isCollectionOpen, setIsCollectionOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sorting & Pagination states
  const [sortBy, setSortBy] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch all primary product collections and their exact product sets from API
  useEffect(() => {
    let isMounted = true;
    fetchCollections()
      .then(async (res) => {
        if (!isMounted) return;
        const list = Array.isArray(res) ? res : res?.data || [];
        
        // Filter strictly to authentic distinct store product collections
        const activeOnly = list.filter((item) => {
          const handle = (item.handle || "").toLowerCase();
          const title = (item.title || "").toLowerCase();
          return (
            item.is_active !== false &&
            item.is_display !== false &&
            parseInt(item.product_count || 0, 10) > 0 &&
            !title.includes("%") &&
            !handle.includes("%") &&
            handle !== "agarbatti-&-dhoop" &&
            handle !== "perfume,-attar-&-air-freshner"
          );
        });

        // Order logically: Agarbatti, Attar, Perfume, Dhoop, Air Freshner
        activeOnly.sort((a, b) => {
          const countA = parseInt(a.product_count || 0, 10);
          const countB = parseInt(b.product_count || 0, 10);
          return countB - countA;
        });

        setCollectionsList(activeOnly);

        // Fetch each collection's exact products in parallel for 100% accurate filtering
        const colMap = new Map();
        await Promise.allSettled(
          activeOnly.map(async (col) => {
            try {
              const single = await fetchCollectionByHandle(col.handle);
              const colProducts = single?.data?.products || [];
              const idSet = new Set(colProducts.map((p) => Number(p.id)));
              colMap.set(col.handle, idSet);
            } catch (err) {
              console.error("Failed fetching collection products:", col.handle, err);
            }
          })
        );

        if (isMounted) {
          setCollectionProductMap(colMap);
        }
      })
      .catch((err) => {
        console.error("Failed loading collections for filter:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch products (either collection-specific or all products)
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setCurrentPage(1);

    if (collectionHandle) {
      // Fetch specific collection products by handle
      fetchCollectionByHandle(collectionHandle)
        .then((res) => {
          if (isMounted) {
            const colData = res?.data || null;
            setCollectionInfo(colData);
            const list = Array.isArray(colData?.products) ? colData.products : [];
            setProducts(list);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.error("Failed loading collection products:", err);
          if (isMounted) setLoading(false);
        });
    } else {
      setCollectionInfo(null);
      fetchProducts({ page: 1, limit: 100 })
        .then((res) => {
          if (isMounted) {
            const list = Array.isArray(res) ? res : (res?.data || []);
            setProducts(list);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.error("Failed loading shop products:", err);
          if (isMounted) setLoading(false);
        });
    }

    return () => {
      isMounted = false;
    };
  }, [collectionHandle]);

  // Precompute weights map for all loaded products for ultra-fast filtering & dynamic counts
  const productWeightMap = useMemo(() => {
    const map = new Map();
    products.forEach((p) => {
      const key = p.id || p.handle || p;
      map.set(key, extractProductWeights(p));
    });
    return map;
  }, [products]);

  // Dynamic maximum price from loaded products
  const maxAvailablePrice = useMemo(() => {
    if (!products.length) return 2410;
    let max = 0;
    products.forEach((p) => {
      const price = Number(
        p.priceRange?.minVariantPrice?.amount ??
        p.price ??
        p.variants?.[0]?.price ??
        0
      );
      if (price > max) max = price;
    });
    return Math.ceil(max) || 2410;
  }, [products]);

  // Sync maxPrice when products load
  useEffect(() => {
    if (products.length > 0) {
      setMaxPrice(maxAvailablePrice);
    }
  }, [products, maxAvailablePrice]);

  // Compute dynamic collections list with exact product counts
  const dynamicCollections = useMemo(() => {
    if (!collectionsList || collectionsList.length === 0) return [];

    return collectionsList.map((col) => {
      const idSet = collectionProductMap.get(col.handle);
      let count = 0;
      if (idSet && idSet.size > 0) {
        count = products.length > 0
          ? products.filter((p) => idSet.has(Number(p.id))).length
          : idSet.size;
      } else {
        count = parseInt(col.product_count || 0, 10);
      }

      return {
        ...col,
        count,
        label: col.title || col.name || col.handle,
        key: col.handle,
      };
    });
  }, [collectionsList, collectionProductMap, products]);

  // Compute 100% dynamic weights with actual live product counts
  const dynamicWeights = useMemo(() => {
    const countMap = new Map();

    products.forEach((prod) => {
      const key = prod.id || prod.handle || prod;
      const weights = productWeightMap.get(key) || [];
      weights.forEach((w) => {
        countMap.set(w, (countMap.get(w) || 0) + 1);
      });
    });

    const weightList = [];
    countMap.forEach((count, label) => {
      if (count > 0) {
        weightList.push({ label, count });
      }
    });

    // Smart sort: group by unit (ml -> l -> gm -> kg), then sort numerically
    const unitOrder = { ml: 1, l: 2, gm: 3, kg: 4, oz: 5, lb: 6 };

    weightList.sort((a, b) => {
      const parse = (str) => {
        const m = str.match(/(\d+(?:\.\d+)?)\s*([a-zA-Z]+)/);
        if (!m) return { num: 0, unit: str, order: 99 };
        const num = parseFloat(m[1]);
        const unit = m[2].toLowerCase();
        return { num, unit, order: unitOrder[unit] || 50 };
      };
      const pa = parse(a.label);
      const pb = parse(b.label);

      if (pa.order !== pb.order) return pa.order - pb.order;
      if (pa.unit !== pb.unit) return pa.unit.localeCompare(pb.unit);
      return pa.num - pb.num;
    });

    return weightList;
  }, [products, productWeightMap]);

  const handleClearAll = () => {
    setSelectedCollections([]);
    setInStockOnly(false);
    setMinPrice(0);
    setMaxPrice(maxAvailablePrice);
    setSelectedWeights([]);
    setCurrentPage(1);
  };

  const toggleCollection = (colKey) => {
    setSelectedCollections((prev) =>
      prev.includes(colKey)
        ? prev.filter((k) => k !== colKey)
        : [...prev, colKey]
    );
    setCurrentPage(1);
  };

  const toggleWeight = (weightLabel) => {
    setSelectedWeights((prev) =>
      prev.includes(weightLabel)
        ? prev.filter((w) => w !== weightLabel)
        : [...prev, weightLabel]
    );
    setCurrentPage(1);
  };

  // Fast memoized product filtering with exact collection membership
  const filteredProducts = useMemo(() => {
    const min = Number(minPrice) || 0;
    const max = Number(maxPrice) || Infinity;
    const hasCollectionFilter = selectedCollections.length > 0;
    const hasWeightFilter = selectedWeights.length > 0;
    const selectedWeightSet = hasWeightFilter ? new Set(selectedWeights) : null;

    return products.filter((prod) => {
      const prodId = Number(prod.id);

      // 1. Collection filter: check if product belongs to any of the selected collections
      if (hasCollectionFilter) {
        const matchesCollection = selectedCollections.some((colKey) => {
          const idSet = collectionProductMap.get(colKey);
          if (idSet) {
            return idSet.has(prodId);
          }
          // Fallback if map is loading: check collection handle / slug on product
          return (
            (prod.collection_handle && prod.collection_handle === colKey) ||
            (prod.category && prod.category.toLowerCase().includes(colKey.toLowerCase()))
          );
        });
        if (!matchesCollection) return false;
      }

      // 2. Price filter
      const price = Number(
        prod.priceRange?.minVariantPrice?.amount ??
        prod.price ??
        prod.variants?.[0]?.price ??
        0
      );
      if (price < min || price > max) {
        return false;
      }

      // 3. Availability filter
      if (inStockOnly && prod.in_stock === false) {
        return false;
      }

      // 4. Weight filter (instant O(1) Set lookup)
      if (hasWeightFilter) {
        const key = prod.id || prod.handle || prod;
        const weights = productWeightMap.get(key) || [];
        const matchesWeight = weights.some((w) => selectedWeightSet.has(w));
        if (!matchesWeight) return false;
      }

      return true;
    });
  }, [products, selectedCollections, collectionProductMap, minPrice, maxPrice, inStockOnly, selectedWeights, productWeightMap]);

  // Sort products with alphabetical & numeric accuracy
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      const getTitle = (p) => String(p?.title || p?.product_title || p?.name || "").trim();
      const getPrice = (p) => {
        const val = p?.priceRange?.minVariantPrice?.amount ?? p?.price ?? p?.variants?.[0]?.price ?? 0;
        return Number(val) || 0;
      };

      if (sortBy === "price-low-to-high") {
        return getPrice(a) - getPrice(b);
      }
      if (sortBy === "price-high-to-low") {
        return getPrice(b) - getPrice(a);
      }
      if (sortBy === "title-asc" || sortBy === "a-z") {
        return getTitle(a).localeCompare(getTitle(b), undefined, { numeric: true, sensitivity: "base" });
      }
      if (sortBy === "title-desc" || sortBy === "z-a") {
        return getTitle(b).localeCompare(getTitle(a), undefined, { numeric: true, sensitivity: "base" });
      }
      return 0; // Default / Featured
    });
  }, [filteredProducts, sortBy]);

  // Pagination (12 products per page)
  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / ITEMS_PER_PAGE));
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const hasActiveFilters =
    selectedCollections.length > 0 ||
    selectedWeights.length > 0 ||
    inStockOnly ||
    minPrice > 0 ||
    (maxPrice < maxAvailablePrice && maxPrice > 0);

  return (
    <div className="w-full bg-white min-h-screen">
      {/* Main Shop Content */}
      <div className="max-w-[95rem] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 md:py-12">

        {/* Title & Breadcrumbs matching reference website */}
        <div className="text-center mb-8 md:mb-10">
          <h1 className="font-tenor text-3xl sm:text-4xl md:text-5xl text-[#700b10] font-normal tracking-tight">
            {collectionInfo?.title || (collectionHandle ? collectionHandle.charAt(0).toUpperCase() + collectionHandle.slice(1).replace(/-/g, ' ') : "Shop All Products")}
          </h1>
          <nav className="text-stone-500 font-nunito text-xs sm:text-sm mt-2.5 flex items-center justify-center gap-1.5 uppercase tracking-widest">
            <button
              type="button"
              onClick={() => onNavigate?.("home")}
              className="hover:text-[#700b10] cursor-pointer hover:underline"
            >
              Home
            </button>
            <span>/</span>
            {collectionHandle && (
              <>
                <button
                  type="button"
                  onClick={() => onNavigate?.("collections")}
                  className="hover:text-[#700b10] cursor-pointer hover:underline"
                >
                  Collections
                </button>
                <span>/</span>
              </>
            )}
            <span className="text-[#700b10] font-bold">
              {collectionInfo?.title || (collectionHandle ? collectionHandle.replace(/-/g, ' ') : "Shop")}
            </span>
          </nav>

          {/* Quick back link when inside a specific collection */}
          {collectionHandle && (
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={() => onNavigate?.("collections")}
                className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-bold font-nunito text-[#700b10] hover:underline cursor-pointer bg-white px-4 py-1.5 rounded-full border border-stone-200/90 shadow-2xs hover:bg-stone-50 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to All Collections
              </button>
            </div>
          )}
        </div>

        {/* Top Control Bar: Total Count, Mobile Filter Button, Sort Selector */}
        <div className="flex items-center justify-between gap-4 pb-6 mb-8 border-b border-stone-200/80">
          <div className="flex items-center gap-3">
            {/* Mobile Filter Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 px-4 py-2 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm font-bold font-nunito text-[#700b10] shadow-xs cursor-pointer hover:bg-stone-50"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-[#700b10]" />
              )}
            </button>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 text-xs sm:text-sm font-nunito text-stone-600">
            <label htmlFor="sort-select" className="hidden sm:inline-block font-medium">Sort by:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white border border-stone-200 text-stone-800 text-xs sm:text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#700b10] cursor-pointer shadow-xs"
            >
              <option value="featured">Featured</option>
              <option value="price-low-to-high">Price: Low to High</option>
              <option value="price-high-to-low">Price: High to Low</option>
              <option value="title-asc">Alphabetically: A-Z</option>
              <option value="title-desc">Alphabetically: Z-A</option>
            </select>
          </div>
        </div>

        {/* Two-Column Layout: Sticky Left Sidebar Filters + Right Product Grid */}
        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-10">

          {/* LEFT SIDEBAR: Sticky Filters Card */}
          <aside className="hidden lg:block w-72 xl:w-80 flex-shrink-0 sticky top-28 self-start z-30">
            <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-sm max-h-[calc(100vh-8.5rem)] overflow-y-auto custom-scrollbar-maroon">

              {/* Header: Filters + Clear All */}
              <div className="flex items-center justify-between pb-3.5 border-b border-amber-100/60">
                <h3 className="font-nunito text-lg font-bold text-[#700b10]">
                  Filters
                </h3>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="text-xs font-semibold text-[#700b10] hover:underline cursor-pointer transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Filter 1: Collection Wise Filter */}
              {dynamicCollections.length > 0 && (
                <div className="py-4 border-b border-amber-100/60">
                  <button
                    type="button"
                    onClick={() => setIsCollectionOpen(!isCollectionOpen)}
                    className="w-full flex items-center justify-between text-left cursor-pointer group mb-3"
                  >
                    <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                      Collection
                    </span>
                    <span className="text-stone-400 group-hover:text-stone-600">
                      {isCollectionOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>

                  {isCollectionOpen && (
                    <div className="max-h-48 overflow-y-auto pr-2 space-y-2.5 custom-scrollbar-maroon">
                      {dynamicCollections.map((col) => {
                        const isChecked = selectedCollections.includes(col.key);
                        return (
                          <label
                            key={col.key}
                            className="flex items-center justify-between text-xs sm:text-[13px] text-stone-800 cursor-pointer select-none group py-0.5"
                          >
                            <div className="flex items-center gap-2.5">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleCollection(col.key)}
                                className="w-4 h-4 rounded border-stone-300 text-[#700b10] focus:ring-[#700b10] cursor-pointer accent-[#700b10]"
                              />
                              <span className="group-hover:text-[#700b10] transition-colors">{col.label}</span>
                            </div>
                            <span className="text-[11px] font-semibold text-stone-400">
                              ({col.count})
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Filter 2: Availability */}
              <div className="py-4 border-b border-amber-100/60">
                <span className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">
                  Availability
                </span>
                <label className="flex items-center gap-2.5 text-xs sm:text-[13px] font-medium text-stone-800 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => {
                      setInStockOnly(e.target.checked);
                      setCurrentPage(1);
                    }}
                    className="w-4 h-4 rounded border-stone-300 text-[#700b10] focus:ring-[#700b10] cursor-pointer accent-[#700b10]"
                  />
                  <span>In Stock Only</span>
                </label>
              </div>

              {/* Filter 3: Price with Dual Range Slider & Editable Input Pills */}
              <div className="py-4 border-b border-amber-100/60">
                <button
                  type="button"
                  onClick={() => setIsPriceOpen(!isPriceOpen)}
                  className="w-full flex items-center justify-between text-left cursor-pointer group"
                >
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    Price
                  </span>
                  <span className="text-stone-400 group-hover:text-stone-600">
                    {isPriceOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </button>

                {isPriceOpen && (
                  <div className="pt-3.5 space-y-4">
                    {/* Range Slider for Maximum Price */}
                    <input
                      type="range"
                      min="0"
                      max={maxAvailablePrice}
                      step="10"
                      value={maxPrice}
                      onChange={(e) => {
                        setMaxPrice(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="w-full accent-[#700b10] cursor-pointer"
                    />

                    {/* Editable Price Input Pills */}
                    <div className="flex items-center justify-between gap-3">
                      {/* Min Price Input Pill */}
                      <div className="flex-1 flex items-center justify-center gap-1 py-1.5 px-3 bg-white border border-stone-300 rounded-full shadow-2xs focus-within:border-[#700b10] transition-colors">
                        <span className="text-stone-400 text-xs font-bold">₹</span>
                        <input
                          type="number"
                          min="0"
                          max={maxPrice}
                          value={minPrice}
                          onChange={(e) => {
                            setMinPrice(e.target.value === '' ? '' : Number(e.target.value));
                            setCurrentPage(1);
                          }}
                          placeholder="0"
                          className="w-full bg-transparent text-xs font-bold text-stone-900 outline-none text-center"
                        />
                      </div>

                      <span className="text-stone-400 text-xs font-medium">to</span>

                      {/* Max Price Input Pill */}
                      <div className="flex-1 flex items-center justify-center gap-1 py-1.5 px-3 bg-white border border-stone-300 rounded-full shadow-2xs focus-within:border-[#700b10] transition-colors">
                        <span className="text-stone-400 text-xs font-bold">₹</span>
                        <input
                          type="number"
                          min={minPrice}
                          max={maxAvailablePrice}
                          value={maxPrice}
                          onChange={(e) => {
                            setMaxPrice(e.target.value === '' ? '' : Number(e.target.value));
                            setCurrentPage(1);
                          }}
                          placeholder={String(maxAvailablePrice)}
                          className="w-full bg-transparent text-xs font-bold text-stone-900 outline-none text-center"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Filter 4: Dynamic Weights with Live Counts & Thin Maroon Scrollbar */}
              {dynamicWeights.length > 0 && (
                <div className="pt-4">
                  <span className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">
                    WEIGHT
                  </span>

                  <div className="max-h-56 overflow-y-auto pr-2 space-y-2.5 custom-scrollbar-maroon">
                    {dynamicWeights.map((opt) => {
                      const isChecked = selectedWeights.includes(opt.label);
                      return (
                        <label
                          key={opt.label}
                          className="flex items-center justify-between text-xs sm:text-[13px] text-stone-800 cursor-pointer select-none group py-0.5"
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleWeight(opt.label)}
                              className="w-4 h-4 rounded border-stone-300 text-[#700b10] focus:ring-[#700b10] cursor-pointer accent-[#700b10]"
                            />
                            <span className="group-hover:text-[#700b10] transition-colors">{opt.label}</span>
                          </div>
                          <span className="text-[11px] font-semibold text-stone-400">
                            ({opt.count})
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          </aside>

          {/* RIGHT SIDE: Product Cards Grid */}
          <div className="flex-1 w-full min-w-0">

            {/* Active Filter Chips/Pills bar */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-white rounded-xl border border-stone-200/80 shadow-2xs">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider mr-1">Active:</span>

                {/* Collection Chips */}
                {selectedCollections.map((colKey) => {
                  const colObj = collectionsList.find((c) => (c.handle || c.slug || String(c.id)) === colKey);
                  const label = colObj?.title || colObj?.name || colKey;
                  return (
                    <span key={colKey} className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#700b10] text-[#ebd99c] rounded-full text-xs font-semibold shadow-2xs">
                      {label}
                      <button type="button" onClick={() => toggleCollection(colKey)} className="hover:text-white cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}

                {/* In Stock Chip */}
                {inStockOnly && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#700b10]/10 text-[#700b10] rounded-full text-xs font-semibold">
                    In Stock Only
                    <button type="button" onClick={() => setInStockOnly(false)} className="hover:opacity-75 cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {/* Weight Chips */}
                {selectedWeights.map((w) => (
                  <span key={w} className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#700b10] text-[#ebd99c] rounded-full text-xs font-semibold shadow-2xs">
                    {w}
                    <button type="button" onClick={() => toggleWeight(w)} className="hover:text-white cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {/* Price Chip */}
                {(minPrice > 0 || maxPrice < maxAvailablePrice) && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 text-stone-700 rounded-full text-xs font-semibold">
                    ₹{minPrice || 0} - ₹{maxPrice || maxAvailablePrice}
                    <button type="button" onClick={() => { setMinPrice(0); setMaxPrice(maxAvailablePrice); }} className="hover:opacity-75 cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-xs font-bold text-[#700b10] hover:underline ml-auto cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6 min-h-[500px]">
              {loading ? (
                [...Array(12)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))
              ) : paginatedProducts.length > 0 ? (
                paginatedProducts.map((prod) => (
                  <ProductCard
                    key={prod.id || prod.handle}
                    product={prod}
                    onSelectProduct={onSelectProduct}
                    onNavigate={onNavigate}
                  />
                ))
              ) : (
                <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-stone-200/80 p-8">
                  <p className="text-stone-600 font-nunito text-base font-semibold">
                    No products found matching these filters.
                  </p>
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="mt-4 px-6 py-2.5 bg-[#700b10] text-white text-xs sm:text-sm font-bold rounded-full font-nunito hover:bg-[#851016] transition-colors shadow-xs cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>

            {/* Pagination (12 Products Per Page) */}
            {!loading && totalPages > 1 && (
              <div className="mt-12 md:mt-16 flex items-center justify-center gap-1.5 sm:gap-2">
                {/* Prev Page Button */}
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border transition-all ${currentPage === 1
                    ? 'border-stone-200 text-stone-300 cursor-not-allowed'
                    : 'border-stone-300 text-stone-700 hover:border-[#700b10] hover:text-[#700b10] bg-white cursor-pointer shadow-xs'
                    }`}
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Page Number Buttons */}
                {[...Array(totalPages)].map((_, idx) => {
                  const pageNum = idx + 1;
                  const isActive = currentPage === pageNum;

                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full text-xs sm:text-sm font-bold font-nunito transition-all cursor-pointer ${isActive
                        ? 'bg-[#700b10] text-white shadow-md'
                        : 'bg-white text-stone-700 border border-stone-200 hover:border-stone-400 hover:bg-stone-50'
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {/* Next Page Button */}
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border transition-all ${currentPage === totalPages
                    ? 'border-stone-200 text-stone-300 cursor-not-allowed'
                    : 'border-stone-300 text-stone-700 hover:border-[#700b10] hover:text-[#700b10] bg-white cursor-pointer shadow-xs'
                    }`}
                  aria-label="Next Page"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* MOBILE / TABLET FILTER SLIDE-OVER DRAWER */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            onClick={() => setMobileFilterOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer */}
          <div className="relative ml-auto w-full max-w-xs sm:max-w-sm h-full bg-white shadow-2xl p-6 overflow-y-auto flex flex-col justify-between custom-scrollbar-maroon">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <h3 className="font-nunito text-lg font-bold text-[#700b10]">
                  Filters
                </h3>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-full hover:bg-stone-100 text-stone-500 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Collection Filter */}
              {dynamicCollections.length > 0 && (
                <div className="py-4 border-b border-stone-200">
                  <span className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">
                    Collection
                  </span>
                  <div className="max-h-48 overflow-y-auto space-y-2 pr-1 custom-scrollbar-maroon">
                    {dynamicCollections.map((col) => (
                      <label
                        key={col.key}
                        className="flex items-center justify-between text-xs text-stone-800 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedCollections.includes(col.key)}
                            onChange={() => toggleCollection(col.key)}
                            className="w-4 h-4 rounded border-stone-300 accent-[#700b10]"
                          />
                          <span>{col.label}</span>
                        </div>
                        <span className="text-[11px] text-stone-400">({col.count})</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Mobile Availability */}
              <div className="py-4 border-b border-stone-200">
                <span className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">
                  Availability
                </span>
                <label className="flex items-center gap-2.5 text-sm font-medium text-stone-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => {
                      setInStockOnly(e.target.checked);
                      setCurrentPage(1);
                    }}
                    className="w-4 h-4 rounded border-stone-300 text-[#700b10] focus:ring-[#700b10] accent-[#700b10]"
                  />
                  <span>In Stock Only</span>
                </label>
              </div>

              {/* Mobile Price */}
              <div className="py-4 border-b border-stone-200">
                <span className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">
                  Price
                </span>
                <input
                  type="range"
                  min="0"
                  max={maxAvailablePrice}
                  step="10"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="w-full accent-[#700b10]"
                />
                <div className="flex items-center justify-between gap-3 mt-3">
                  <div className="flex-1 flex items-center justify-center gap-1 py-1.5 px-3 bg-white border border-stone-300 rounded-full">
                    <span className="text-stone-400 text-xs font-bold">₹</span>
                    <input
                      type="number"
                      min="0"
                      max={maxPrice}
                      value={minPrice}
                      onChange={(e) => {
                        setMinPrice(e.target.value === '' ? '' : Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="w-full bg-transparent text-xs font-bold text-stone-900 outline-none text-center"
                    />
                  </div>
                  <span className="text-stone-400 text-xs">to</span>
                  <div className="flex-1 flex items-center justify-center gap-1 py-1.5 px-3 bg-white border border-stone-300 rounded-full">
                    <span className="text-stone-400 text-xs font-bold">₹</span>
                    <input
                      type="number"
                      min={minPrice}
                      max={maxAvailablePrice}
                      value={maxPrice}
                      onChange={(e) => {
                        setMaxPrice(e.target.value === '' ? '' : Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="w-full bg-transparent text-xs font-bold text-stone-900 outline-none text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Mobile Dynamic Weight */}
              {dynamicWeights.length > 0 && (
                <div className="py-4">
                  <span className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">
                    WEIGHT
                  </span>
                  <div className="max-h-48 overflow-y-auto space-y-2 pr-1 custom-scrollbar-maroon">
                    {dynamicWeights.map((opt) => (
                      <label
                        key={opt.label}
                        className="flex items-center justify-between text-xs text-stone-800 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedWeights.includes(opt.label)}
                            onChange={() => toggleWeight(opt.label)}
                            className="w-4 h-4 rounded border-stone-300 accent-[#700b10]"
                          />
                          <span>{opt.label}</span>
                        </div>
                        <span className="text-[11px] text-stone-400">({opt.count})</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="pt-4 border-t border-stone-200 flex gap-3">
              <button
                type="button"
                onClick={handleClearAll}
                className="flex-1 py-2.5 border border-stone-300 text-stone-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Clear All
              </button>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 bg-[#700b10] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

