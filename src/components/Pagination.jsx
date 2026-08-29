'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function Pagination({ totalPages, currentPage }) {
    const searchParams = useSearchParams();

    if (totalPages <= 1) return null;

    const createPageURL = (pageNumber) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        return `?${params.toString()}`;
    };

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);
        
        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(
                <Link
                    key={i}
                    href={createPageURL(i)}
                    className={`w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm flex items-center justify-center rounded-full font-medium transition-all duration-300 ${
                        i === currentPage
                            ? 'bg-[#700b10] text-white shadow-lg shadow-red-900/20 scale-105'
                            : 'bg-white text-gray-600 hover:bg-yellow-50 hover:text-[#700b10] border border-yellow-100/50'
                    }`}
                >
                    {i}
                </Link>
            );
        }
        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-1.5 sm:gap-3 mt-10 sm:mt-12 mb-8">
            {/* Previous Button */}
            <Link
                href={currentPage > 1 ? createPageURL(currentPage - 1) : '#'}
                className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
                    currentPage > 1
                        ? 'bg-white text-[#700b10] border border-yellow-100/50 hover:bg-yellow-50 shadow-sm'
                        : 'bg-gray-50 text-gray-300 pointer-events-none'
                }`}
                aria-label="Previous Page"
            >
                <FiChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>

            {/* Page Numbers */}
            <div className="flex items-center gap-1 sm:gap-2">
                {renderPageNumbers()}
            </div>

            {/* Next Button */}
            <Link
                href={currentPage < totalPages ? createPageURL(currentPage + 1) : '#'}
                className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
                    currentPage < totalPages
                        ? 'bg-white text-[#700b10] border border-yellow-100/50 hover:bg-yellow-50 shadow-sm'
                        : 'bg-gray-50 text-gray-300 pointer-events-none'
                }`}
                aria-label="Next Page"
            >
                <FiChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
        </div>
    );
}
