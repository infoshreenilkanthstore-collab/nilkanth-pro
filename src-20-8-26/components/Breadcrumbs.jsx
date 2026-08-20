"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { useBreadcrumbs } from '../context/BreadcrumbContext';

const Breadcrumbs = ({ items: manualItems }) => {
    const pathname = usePathname();
    const { lastCollection } = useBreadcrumbs();

    // Don't show breadcrumbs on home page
    if (pathname === '/') return null;

    const generateItems = () => {
        if (manualItems) return manualItems;

        const paths = pathname.split('/').filter(p => p);

        // Special logic for product pages to inject last category
        if (paths[0] === 'product' && paths.length === 2 && lastCollection) {
            return [
                { label: lastCollection.label, href: lastCollection.href },
                {
                    label: paths[1].split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
                    href: pathname
                }
            ];
        }

        return paths.map((path, index) => {
            const href = `/${paths.slice(0, index + 1).join('/')}`;
            // Format handle-like strings to Title Case
            const label = path
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');

            return { label, href };
        });
    };

    const items = generateItems();

    return (
        <nav className="flex md:pb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 overflow-hidden whitespace-nowrap">
                <li>
                    <div>
                        <Link
                            href="/"
                            className="text-gray-400 hover:text-[#700b10] transition-colors flex items-center"
                        >
                            <Home className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                            <span className="sr-only">Home</span>
                        </Link>
                    </div>
                </li>

                {items.map((item, index) => (
                    <li key={item.href || index} className="flex items-center min-w-0">
                        <ChevronRight className="h-4 w-4 flex-shrink-0 text-gray-400 mx-1" />

                        <Link
                            href={item.href}
                            className={`md:text-sm text-xs font-bold font-nunito transition-colors truncate max-w-[110px] sm:max-w-[200px] md:max-w-none ${index === items.length - 1
                                ? "text-[#700b10]"
                                : "text-gray-500 hover:text-[#700b10]"
                                }`}
                        >
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
