"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const BreadcrumbContext = createContext();

export const BreadcrumbProvider = ({ children }) => {
    const [lastCollection, setLastCollection] = useState(null);
    const pathname = usePathname();

    // Persist to sessionStorage
    useEffect(() => {
        const stored = sessionStorage.getItem('lastCollection');
        if (stored) {
            try {
                setLastCollection(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse stored collection", e);
            }
        }
    }, []);

    const updateLastCollection = (collection) => {
        setLastCollection(collection);
        if (collection) {
            sessionStorage.setItem('lastCollection', JSON.stringify(collection));
        } else {
            sessionStorage.removeItem('lastCollection');
        }
    };

    // Clear lastCollection when navigating to Home
    useEffect(() => {
        if (pathname === '/') {
            updateLastCollection(null);
        }
    }, [pathname]);
    
    return (
        <BreadcrumbContext.Provider value={{ lastCollection, updateLastCollection }}>
            {children}
        </BreadcrumbContext.Provider>
    );
};

export const useBreadcrumbs = () => useContext(BreadcrumbContext);
