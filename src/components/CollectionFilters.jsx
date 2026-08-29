"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export default function CollectionFilters({ availableFilters }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isPriceOpen, setIsPriceOpen] = useState(true);

    const [maxPossiblePrice, setMaxPossiblePrice] = useState(10000);
    const hasInitializedMax = useRef(false);
    const isInteracting = useRef(false);

    useEffect(() => {
        const priceFilter = availableFilters.find(f =>
            f.type === 'PRICE_RANGE' ||
            f.label.toLowerCase().includes('price') ||
            f.id.toLowerCase().includes('price')
        );

        if (priceFilter && priceFilter.values && priceFilter.values[0]?.input) {
            try {
                const inputData = JSON.parse(priceFilter.values[0].input);
                if (inputData.price?.max) {
                    const foundMax = Math.ceil(inputData.price.max);
                    if (foundMax > 0 && (foundMax > maxPossiblePrice || !hasInitializedMax.current)) {
                        setMaxPossiblePrice(foundMax);
                        hasInitializedMax.current = true;
                    }
                }
            } catch (e) {
                try {
                    const decoded = atob(priceFilter.values[0].input);
                    const inputData = JSON.parse(decoded);
                    if (inputData.price?.max) {
                        const foundMax = Math.ceil(inputData.price.max);
                        if (foundMax > 0 && (foundMax > maxPossiblePrice || !hasInitializedMax.current)) {
                            setMaxPossiblePrice(foundMax);
                            hasInitializedMax.current = true;
                        }
                    }
                } catch (e2) { }
            }
        }
    }, [availableFilters, maxPossiblePrice]);

    const [minPrice, setMinPrice] = useState(searchParams.get('min_price') || '0');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || maxPossiblePrice.toString());
    const [activeThumb, setActiveThumb] = useState('min');

    useEffect(() => {
        if (isInteracting.current) return;
        const urlMin = searchParams.get('min_price') || '0';
        const urlMax = searchParams.get('max_price') || maxPossiblePrice.toString();
        if (urlMin !== minPrice) setMinPrice(urlMin);
        if (urlMax !== maxPrice) setMaxPrice(urlMax);
    }, [searchParams, maxPossiblePrice]);

    const updateFilters = (key, value) => {
        const params = new URLSearchParams(searchParams.toString());
        if (key === 'price') {
            const minNum = parseFloat(value.min);
            const maxNum = parseFloat(value.max);
            if (!isNaN(minNum) && minNum > 0) params.set('min_price', minNum.toString());
            else params.delete('min_price');
            if (!isNaN(maxNum) && maxNum < maxPossiblePrice) params.set('max_price', maxNum.toString());
            else params.delete('max_price');
        } else if (key === 'availability') {
            if (value.isChecked) params.set('availability', 'true');
            else params.delete('availability');
        } else if (key === 'weight') {
            const currentWeights = params.getAll('weight');
            if (value.isChecked) {
                if (!currentWeights.includes(value.label)) params.append('weight', value.label);
            } else {
                params.delete('weight');
                currentWeights.filter(w => w !== value.label).forEach(w => params.append('weight', w));
            }
        }
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    useEffect(() => {
        const urlMin = searchParams.get('min_price') || '0';
        const urlMax = searchParams.get('max_price') || maxPossiblePrice.toString();
        if (minPrice === urlMin && maxPrice === urlMax) return;
        const timer = setTimeout(() => {
            const finalMin = Math.max(0, parseInt(minPrice) || 0);
            const finalMax = Math.min(maxPossiblePrice, parseInt(maxPrice) || maxPossiblePrice);
            if (finalMin <= finalMax) {
                updateFilters('price', { min: finalMin, max: finalMax });
            }
        }, 800);
        return () => clearTimeout(timer);
    }, [minPrice, maxPrice, maxPossiblePrice]);

    const handleSliderChange = (e, type) => {
        const val = parseInt(e.target.value);
        setActiveThumb(type);
        if (type === 'min') {
            const newMin = Math.min(val, parseInt(maxPrice) || maxPossiblePrice);
            setMinPrice(newMin.toString());
        } else {
            const newMax = Math.max(val, parseInt(minPrice) || 0);
            setMaxPrice(newMax.toString());
        }
    };

    const handleInputChange = (val, type) => {
        if (type === 'min') setMinPrice(val);
        else setMaxPrice(val);
    };

    const clearFilters = () => {
        router.push(pathname, { scroll: false });
        setMinPrice('0');
        setMaxPrice(maxPossiblePrice.toString());
        setIsMobileOpen(false);
    };

    const weightFilter = availableFilters.find(f =>
        f.label.toLowerCase() === 'weight' ||
        f.label.toLowerCase().includes('weight') ||
        f.id.toLowerCase().includes('weight')
    );

    const FilterContentUI = (
        <div className="space-y-8 select-none">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-nunito font-bold text-[#700b10]">Filters</h3>
                <button
                    onClick={clearFilters}
                    className="text-sm text-gray-400 hover:text-[#700b10] underline font-nunito"
                >
                    Clear All
                </button>
            </div>

            {/* Availability */}
            <div className="border-b border-yellow-100 pb-6">
                <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2 font-nunito text-black">
                    Availability
                </h4>
                <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={searchParams.get('availability') === 'true'}
                        onChange={(e) => updateFilters('availability', { isChecked: e.target.checked })}
                        className="w-5 h-5 border-2 border-gray-300 rounded text-[#700b10] focus:ring-[#700b10] cursor-pointer"
                    />
                    <span className="group-hover:text-black transition-colors font-nunito text-black">In Stock Only</span>
                </label>
            </div>

            {/* Price Range */}
            <div className="border-b border-yellow-100 pb-6">
                <button
                    onClick={() => setIsPriceOpen(!isPriceOpen)}
                    className="flex items-center justify-between w-full mb-4 group text-left"
                >
                    <h4 className="font-bold text-gray-800 font-nunito text-black">Price</h4>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"
                        className={`w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-transform duration-300 ${isPriceOpen ? 'rotate-180' : ''}`}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                </button>

                {isPriceOpen && (
                    <div className="space-y-6 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex justify-between items-center text-[0.7rem] font-bold font-nunito text-gray-400 mb-[-1.5rem] px-1">

                        </div>

                        <div className="relative w-full h-8 flex items-center">
                            <div className="absolute left-0 right-0 h-[2px] bg-gray-200"></div>
                            <div
                                className="absolute h-[2px] bg-black"
                                style={{
                                    left: `${(Math.max(0, parseInt(minPrice) || 0) / maxPossiblePrice) * 100}%`,
                                    right: `${100 - (Math.min(maxPossiblePrice, parseInt(maxPrice) || maxPossiblePrice) / maxPossiblePrice) * 100}%`
                                }}
                            ></div>

                            <input
                                type="range"
                                min="0"
                                max={maxPossiblePrice}
                                value={parseInt(minPrice) || 0}
                                onChange={(e) => handleSliderChange(e, 'min')}
                                onMouseDown={() => { isInteracting.current = true; setActiveThumb('min'); }}
                                onMouseUp={() => { isInteracting.current = false; }}
                                className={`text-black range-slider-input absolute left-0 right-0 w-full appearance-none bg-transparent cursor-pointer ${activeThumb === 'min' ? 'z-30' : 'z-20'}`}
                            />
                            <input
                                type="range"
                                min="0"
                                max={maxPossiblePrice}
                                value={parseInt(maxPrice) || maxPossiblePrice}
                                onChange={(e) => handleSliderChange(e, 'max')}
                                onMouseDown={() => { isInteracting.current = true; setActiveThumb('max'); }}
                                onMouseUp={() => { isInteracting.current = false; }}
                                className={`text-black range-slider-input absolute left-0 right-0 w-full appearance-none bg-transparent cursor-pointer ${activeThumb === 'max' ? 'z-30' : 'z-20'}`}
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="relative flex-1 group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black font-bold text-xs">₹</span>
                                <input
                                    type="number"
                                    value={minPrice}
                                    onChange={(e) => handleInputChange(e.target.value, 'min')}
                                    onFocus={() => { isInteracting.current = true; }}
                                    onBlur={() => { isInteracting.current = false; }}
                                    placeholder="0"
                                    className="text-black w-full pl-8 pr-2 py-3 bg-white border border-gray-200 rounded-full text-center text-sm font-bold focus:outline-none focus:border-black transition-colors"
                                />
                            </div>
                            <div className="relative flex-1 group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black font-bold text-xs">₹</span>
                                <input
                                    type="number"
                                    value={maxPrice}
                                    onChange={(e) => handleInputChange(e.target.value, 'max')}
                                    onFocus={() => { isInteracting.current = true; }}
                                    onBlur={() => { isInteracting.current = false; }}
                                    placeholder={maxPossiblePrice.toString()}
                                    className="text-black w-full pl-8 pr-2 py-3 bg-white border border-gray-200 rounded-full text-center text-sm font-bold focus:outline-none focus:border-black transition-colors"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Weight Filter Section */}
            {weightFilter && weightFilter.values && weightFilter.values.length > 0 && (
                <div className="border-b border-yellow-100 pb-6">
                    <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2 font-nunito text-black">
                        {weightFilter.label}
                    </h4>
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        {weightFilter.values.map((val) => {
                            const isChecked = searchParams.getAll('weight').some(
                                (w) => w.trim().toLowerCase() === val.label.trim().toLowerCase()
                            );
                            return (
                                <label key={val.id} className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={(e) => updateFilters('weight', { label: val.label, isChecked: e.target.checked })}
                                        className="w-5 h-5 border-2 border-gray-300 rounded text-[#700b10] focus:ring-[#700b10] cursor-pointer"
                                    />
                                    <div className="flex justify-between w-full">
                                        <span className="group-hover:text-black transition-colors font-nunito text-black">{val.label}</span>
                                        <span className="text-gray-400 text-sm">({val.count})</span>
                                    </div>
                                </label>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <>
            <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-32 h-fit bg-white p-6 rounded-2xl shadow-sm border border-yellow-100/50">
                {FilterContentUI}
            </aside>

            <div className="lg:hidden mb-6 flex justify-start">
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-2.5 bg-[#700b10] text-white rounded-full font-bold shadow-md hover:bg-[#5a090d] transition-all transform active:scale-95 text-xs sm:text-sm"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 18H7.5m9-6h2.25m-2.25 0a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 12H13.5" />
                    </svg>
                    Filters
                </button>
            </div>

            {isMobileOpen && (
                <div className="fixed inset-0 z-[100] lg:hidden">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)}></div>
                    <div className="absolute bottom-0 left-0 right-0 bg-[#FDFBF7] rounded-t-[2rem] p-5 sm:p-8 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
                        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6"></div>
                        {FilterContentUI}
                        <button
                            onClick={() => setIsMobileOpen(false)}
                            className="w-full mt-8 py-3.5 sm:py-4 bg-[#700b10] text-white rounded-2xl font-bold shadow-md hover:bg-[#5a090d] transition-colors"
                        >
                            Show Results
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
