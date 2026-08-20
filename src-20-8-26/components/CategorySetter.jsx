"use client";

import { useEffect } from 'react';
import { useBreadcrumbs } from '../context/BreadcrumbContext';

export default function CategorySetter({ label, href }) {
    const { updateLastCollection } = useBreadcrumbs();

    useEffect(() => {
        if (label && href) {
            updateLastCollection({ label, href });
        }
    }, [label, href, updateLastCollection]);

    return null;
}
