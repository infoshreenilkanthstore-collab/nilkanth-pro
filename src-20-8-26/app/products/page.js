
import React from 'react';
import ProductCard from '../../components/ProductCard';
import { getProducts } from '../../lib/shopify';
// import CategorySetter from '@/components/CategorySetter';

export const metadata = {
    title: 'All Products | Nilkanth Store',
    description: 'Explore our full range of premium products including Ghee, Sweets, and more.',
};

import CollectionFilters from '../../components/CollectionFilters';

import Pagination from '../../components/Pagination';

const PAGE_SIZE = 12;

export default async function AllProductsPage({ searchParams }) {
    const sParams = await searchParams;
    const currentPage = sParams.page ? parseInt(sParams.page) : 1;

    // Fetch ALL products (up to 250)
    const { body, status } = await getProducts(250);

    if (status !== 200 || body.errors || !body?.data?.products) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center pt-32 pb-16 px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-nunito font-bold text-[#700b10] mb-4">Products Not Found</h1>
                <p className="text-gray-600 text-lg">We're having trouble loading our products right now. Please try again later.</p>
                <a href="/" className="mt-8 px-6 py-3 bg-[#700b10] text-white rounded-full font-bold hover:bg-[#5a090d] transition-colors">
                    Back to Home
                </a>
            </div>
        );
    }

    const allProducts = body.data.products.edges || [];

    // --- MANUALLY CALCULATE FILTERS ---
    const availableFilters = [];

    // 1. Availability Filter
    const inStockCount = allProducts.filter(({ node }) => node.variants.edges.some(v => v.node.availableForSale)).length;
    const outOfStockCount = allProducts.length - inStockCount;

    availableFilters.push({
        id: 'filter.v.availability',
        label: 'Availability',
        type: 'LIST',
        values: [
            { id: 'avail-true', label: 'In Stock', count: inStockCount, input: JSON.stringify({ available: true }) },
            { id: 'avail-false', label: 'Out of Stock', count: outOfStockCount, input: JSON.stringify({ available: false }) }
        ]
    });

    // 2. Price Filter (Calculate Min/Max)
    let minPrice = Infinity;
    let maxPrice = 0;
    allProducts.forEach(({ node }) => {
        const price = parseFloat(node.priceRange.minVariantPrice.amount);
        if (price < minPrice) minPrice = price;
        if (price > maxPrice) maxPrice = price;
    });

    if (minPrice === Infinity) minPrice = 0;

    availableFilters.push({
        id: 'filter.v.price',
        label: 'Price',
        type: 'PRICE_RANGE',
        values: [
            {
                id: 'price-range',
                label: 'Price Range',
                count: allProducts.length,
                input: JSON.stringify({ price: { min: minPrice, max: maxPrice } })
            }
        ]
    });

    // 3. Weight Filter (Calculated from options)
    const weightOptions = new Map();
    allProducts.forEach(({ node }) => {
        const weightOpt = node.options?.find(opt => opt.name.toLowerCase() === 'weight');
        if (weightOpt) {
            weightOpt.values.forEach(val => {
                const currentCount = weightOptions.get(val) || 0;
                weightOptions.set(val, currentCount + 1);
            });
        }
    });

    if (weightOptions.size > 0) {
        availableFilters.push({
            id: 'filter.v.option.weight',
            label: 'Weight',
            type: 'LIST',
            values: Array.from(weightOptions.entries()).map(([label, count]) => ({
                id: `weight-${label}`,
                label: label,
                count: count,
                input: JSON.stringify({ variantOption: { name: 'Weight', value: label } })
            }))
        });
    }

    // --- APPLY FILTERS MANUALLY ---
    let filteredProducts = [...allProducts];

    // Availability
    if (sParams.availability) {
        const wantAvailable = sParams.availability === 'true';
        filteredProducts = filteredProducts.filter(({ node }) => {
            const isAvailable = node.variants.edges.some(v => v.node.availableForSale);
            return isAvailable === wantAvailable;
        });
    }

    // Price
    const minP = sParams.min_price ? parseFloat(sParams.min_price) : 0;
    const maxP = sParams.max_price ? parseFloat(sParams.max_price) : Infinity;
    if (minP > 0 || maxP < Infinity) {
        filteredProducts = filteredProducts.filter(({ node }) => {
            const price = parseFloat(node.priceRange.minVariantPrice.amount);
            return price >= minP && price <= maxP;
        });
    }

    // Weight
    if (sParams.weight) {
        const selectedWeights = Array.isArray(sParams.weight) ? sParams.weight : [sParams.weight];
        filteredProducts = filteredProducts.filter(({ node }) => {
            const weightOpt = node.options?.find(opt => opt.name.toLowerCase() === 'weight');
            return weightOpt && weightOpt.values.some(v => selectedWeights.includes(v));
        });
    }

    // --- APPLY PAGINATION ---
    const totalProducts = filteredProducts.length;
    const totalPages = Math.ceil(totalProducts / PAGE_SIZE);
    const paginatedProducts = filteredProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    return (
        <main className="min-h-screen pt-0 pb-20 md:pb-24 bg-[#FDFBF7]">
            {/* <CategorySetter label="All Products" href="/products" /> */}

            {/* Page Header */}
            <div className="max-w-[100rem] mx-auto mb-6 md:mb-12">
                <div className="w-full overflow-hidden rounded-2xl bg-white shadow-md border border-yellow-100/50 flex items-center justify-center text-center max-w-7xl mx-auto">
                    <div className="inset-0 w-full h-full">
                        <img
                            src="https://cdn.shopify.com/s/files/1/0804/0867/4532/files/about_us_contact_us_bhagvat_poojan_4_1.webp?v=1774254662"
                            className="w-full h-full object-contain object-center"
                            alt="All Products Banner"
                        />
                    </div>
                </div>
            </div>

            {/* Products Main Content */}
            <div className="max-w-[100rem] mx-auto px-3 sm:px-6 md:px-8 lg:px-12">
                <div className="flex flex-col lg:flex-row md:gap-12">
                    {/* Filters Sidebar */}
                    <CollectionFilters availableFilters={availableFilters} />

                    {/* Products Grid Area */}
                    <div className="flex-grow">
                        {paginatedProducts.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-3xl border border-yellow-100/50 shadow-sm">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">No products found</h2>
                                <p className="text-gray-500">Try adjusting your filters or search terms.</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
                                    {paginatedProducts.map((product) => (
                                        <div key={product.node.id}>
                                            <ProductCard product={product} />
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination Component */}
                                <Pagination
                                    totalPages={totalPages}
                                    currentPage={currentPage}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
