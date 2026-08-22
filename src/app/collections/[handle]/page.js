import React from 'react';
import ProductCard from '@/components/ProductCard';
import { getCollectionByHandle } from '@/app/api/collections/[handle]/route';
import CollectionFilters from '@/components/CollectionFilters';
import Pagination from '@/components/Pagination';

const PAGE_SIZE = 12;

// Next.js dynamic metadata generation
export async function generateMetadata({ params }) {
    const { handle } = await params;

    try {
        const { body, status } = await getCollectionByHandle(handle);
        if (status === 200 && body?.data?.collection) {
            return {
                title: `${body.data.collection.title} | Nilkanth Store`,
                description: body.data.collection.description,
            };
        }
    } catch (e) { }

    return {
        title: 'Collection | Nilkanth Store',
    };
}

// Helper to extract weight/size options from product options and variants
function getProductWeightValues(node) {
    const values = new Set();
    const targetOptionNames = ['weight', 'size', 'volume', 'net wt', 'net weight', 'quantity'];

    // 1. Check options
    const matchedOpt = node.options?.find(opt =>
        targetOptionNames.includes(opt.name?.toLowerCase().trim())
    );
    if (matchedOpt && Array.isArray(matchedOpt.values)) {
        matchedOpt.values.forEach(v => {
            if (v && v.toLowerCase() !== 'default title' && v.toLowerCase() !== 'default') {
                values.add(v.trim());
            }
        });
    }

    // 2. Check variants
    const variants = Array.isArray(node.variants)
        ? node.variants
        : (node.variants?.edges?.map(e => e.node) || []);

    variants.forEach(v => {
        if (v?.title && v.title.toLowerCase() !== 'default title' && v.title.toLowerCase() !== 'default' && v.title.trim()) {
            values.add(v.title.trim());
        }
        if (Array.isArray(v?.selectedOptions)) {
            v.selectedOptions.forEach(opt => {
                if (opt?.value && opt.value.toLowerCase() !== 'default title' && opt.value.toLowerCase() !== 'default' && opt.value.trim()) {
                    if (targetOptionNames.includes(opt.name?.toLowerCase().trim()) || opt.name?.toLowerCase().trim() === 'title') {
                        values.add(opt.value.trim());
                    }
                }
            });
        }
    });

    // 3. Fallback: Check any non-default option
    if (values.size === 0 && Array.isArray(node.options)) {
        node.options.forEach(opt => {
            if (opt.name?.toLowerCase() !== 'title' || (opt.values && opt.values.length > 1)) {
                opt.values?.forEach(v => {
                    if (v && v.toLowerCase() !== 'default title' && v.toLowerCase() !== 'default' && v.trim()) {
                        values.add(v.trim());
                    }
                });
            }
        });
    }

    return Array.from(values);
}

export default async function CollectionPage({ params, searchParams }) {
    const { handle } = await params;
    const sParams = await searchParams;
    const currentPage = sParams.page ? parseInt(sParams.page) : 1;

    const { body, status } = await getCollectionByHandle(handle);

    if (status !== 200 || body.errors || !body?.data?.collection) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center pt-32 pb-16 px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-nunito font-bold text-[#700b10] mb-4">Collection Not Found</h1>
                <p className="text-gray-600 text-lg">We couldn't find the collection you are looking for.</p>
                <a href="/" className="mt-8 px-6 py-3 bg-[#700b10] text-white rounded-full font-bold hover:bg-[#5a090d] transition-colors">
                    Back to Home
                </a>
            </div>
        );
    }

    const collection = body.data.collection;
    const allProducts = collection.products?.edges || [];

    // --- MANUALLY CALCULATE FILTERS (Same as Products Page) ---
    const availableFilters = [];

    // 1. Availability Filter
    const inStockCount = allProducts.filter(({ node }) => node.variants?.edges?.some(v => v.node?.availableForSale)).length;
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
        const price = parseFloat(node.priceRange?.minVariantPrice?.amount || node.price || 0);
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

    // 3. Weight Filter (Calculated from options & variants)
    const weightOptions = new Map();
    allProducts.forEach(({ node }) => {
        const weights = getProductWeightValues(node);
        weights.forEach(val => {
            const currentCount = weightOptions.get(val) || 0;
            weightOptions.set(val, currentCount + 1);
        });
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
            const isAvailable = node.variants?.edges?.some(v => v.node?.availableForSale);
            return isAvailable === wantAvailable;
        });
    }

    // Price
    const minP = sParams.min_price ? parseFloat(sParams.min_price) : 0;
    const maxP = sParams.max_price ? parseFloat(sParams.max_price) : Infinity;
    if (minP > 0 || maxP < Infinity) {
        filteredProducts = filteredProducts.filter(({ node }) => {
            const price = parseFloat(node.priceRange?.minVariantPrice?.amount || node.price || 0);
            return price >= minP && price <= maxP;
        });
    }

    // Weight
    if (sParams.weight) {
        const selectedWeights = Array.isArray(sParams.weight) ? sParams.weight : [sParams.weight];
        filteredProducts = filteredProducts.filter(({ node }) => {
            const productWeights = getProductWeightValues(node);
            return productWeights.some(w => selectedWeights.includes(w));
        });
    }

    // --- APPLY PAGINATION ---
    const totalProducts = filteredProducts.length;
    const totalPages = Math.ceil(totalProducts / PAGE_SIZE);
    const paginatedProducts = filteredProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    // --- GENERATE JSON-LD SCHEMA FOR COLLECTION & RICH SNIPPETS ---
    const plainDescription = collection.description
        ? collection.description.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
        : `${collection.title} - Explore authentic devotional and pooja samagri collections at Nilkanth Store.`;

    const collectionUrl = `https://nilkanthstore.in/collections/${collection.handle}`;
    const collectionImage = collection.image?.url || collection.image_url || "";

    const collectionSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": collection.title,
        "description": plainDescription,
        "url": collectionUrl,
        ...(collectionImage ? { "image": collectionImage } : {}),
        "mainEntity": {
            "@type": "ItemList",
            "numberOfItems": allProducts.length,
            "itemListElement": allProducts.slice(0, 50).map(({ node: prod }, index) => {
                const prodImage = prod.images?.edges?.[0]?.node?.url || prod.image_url || (Array.isArray(prod.images) ? prod.images[0]?.url : "") || "";
                const price = parseFloat(prod.priceRange?.minVariantPrice?.amount || prod.price || 0);
                return {
                    "@type": "ListItem",
                    "position": index + 1,
                    "url": `https://nilkanthstore.in/products/${prod.handle}`,
                    "name": prod.title,
                    ...(prodImage ? { "image": prodImage } : {}),
                    ...(price > 0 ? {
                        "offers": {
                            "@type": "Offer",
                            "priceCurrency": "INR",
                            "price": price,
                            "availability": "https://schema.org/InStock"
                        }
                    } : {})
                };
            })
        }
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://nilkanthstore.in"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Collections",
                "item": "https://nilkanthstore.in/collections"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": collection.title,
                "item": collectionUrl
            }
        ]
    };

    return (
        <main className="min-h-screen pt-0 pb-20 md:pb-24 bg-[#FDFBF7]">
            {/* Schema.org CollectionPage & Breadcrumb Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />

            {/* Collection Hero Banner */}
            <div className="max-w-[100rem] mx-auto mb-6 md:mb-12">
                <div className="w-full overflow-hidden rounded-2xl bg-white shadow-md border border-yellow-100/50 flex items-center justify-center text-center max-w-7xl mx-auto">
                    <div className="inset-0 w-full h-full">
                        <img
                            src="https://cdn.shopify.com/s/files/1/0804/0867/4532/files/about_us_contact_us_bhagvat_poojan_4_1.webp?v=1774254662"
                            className="w-full h-full object-contain object-center"
                            alt={collection.title}
                        />
                    </div>
                </div>
            </div>

            {/* Collection Main Content */}
            <div className="max-w-[100rem] mx-auto px-3 sm:px-6 md:px-8 lg:px-12">
                <div className="flex flex-col lg:flex-row md:gap-12">
                    {/* Filters Sidebar */}
                    <CollectionFilters availableFilters={availableFilters} />

                    {/* Products Grid Area */}
                    <div className="flex-grow">
                        {paginatedProducts.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-3xl border border-yellow-100/50 shadow-sm">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">No matching products found</h2>
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