import React from 'react';
import ProductCard from '@/components/ProductCard';
import { getCollectionByHandle } from '@/app/api/collections/[handle]/route';
import CollectionFilters from '@/components/CollectionFilters';
// import CategorySetter from '@/components/CategorySetter';

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

export default async function CollectionPage({ params, searchParams }) {
    const { handle } = await params;
    const sParams = await searchParams;

    // Build filters for Shopify
    const shopifyFilters = [];

    // Availability Filter
    if (sParams.availability) {
        shopifyFilters.push({ available: sParams.availability === 'true' });
    }

    // Price Filter
    const minP = sParams.min_price ? parseFloat(sParams.min_price) : 0;
    const maxP = sParams.max_price ? parseFloat(sParams.max_price) : null;

    // Only apply filter if it's not the default "unfiltered" range
    // If min is 0 and max is null/not-provided, we don't send a price filter at all
    if (minP > 0 || maxP !== null) {
        shopifyFilters.push({
            price: {
                ...(minP > 0 ? { min: minP } : { min: 0 }),
                ...(maxP !== null && { max: maxP })
            }
        });
    }

    // Weight Filter
    if (sParams.weight) {
        const weights = Array.isArray(sParams.weight) ? sParams.weight : [sParams.weight];
        weights.forEach(w => {
            shopifyFilters.push({ variantOption: { name: "Weight", value: w } });
        });
    }

    const { body, status } = await getCollectionByHandle(handle, shopifyFilters);

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
    let products = collection.products?.edges || [];
    let availableFilters = collection.products?.filters || [];

    // MANUALLY EXTRACT WEIGHT FILTER IF MISSING
    // This is because Weight isn't enabled as a filter in Shopify Admin
    const hasWeightFilter = availableFilters.some(f => f.label.toLowerCase().includes('weight'));

    if (!hasWeightFilter) {
        const weightOptions = new Map();

        // Go through all products and find options named "Weight"
        products.forEach(({ node }) => {
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
    }

    // MANUALLY FILTER PRODUCTS IF WEIGHT IS SELECTED (Fallback logic)
    if (sParams.weight) {
        const selectedWeights = Array.isArray(sParams.weight) ? sParams.weight : [sParams.weight];
        products = products.filter(({ node }) => {
            const weightOpt = node.options?.find(opt => opt.name.toLowerCase() === 'weight');
            return weightOpt && weightOpt.values.some(v => selectedWeights.includes(v));
        });
    }

    // Extract banner URL from the metafield directly since this is the raw GraphQL response
    const bannerImageUrl = collection.bannerImage && collection.bannerImage.value ? collection.bannerImage.value : null;

    return (
        <main className="min-h-screen pt-0 pb-16 md:pb-20 bg-[#FDFBF7]">
            {/* <CategorySetter label={collection.title} href={`/collections/${handle}`} /> */}
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
                        {products.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-3xl border border-yellow-100/50 shadow-sm">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">No matching products found</h2>
                                <p className="text-gray-500">Try adjusting your filters or search terms.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
                                {products.map((product) => (
                                    <div key={product.node.id}>
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}