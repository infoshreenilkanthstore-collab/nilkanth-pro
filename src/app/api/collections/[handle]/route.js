import { NextResponse } from "next/server";
import { shopfrontFetch } from "@/lib/shopify";

export async function getCollectionByHandle(handle, filters = []) {
    if (handle === 'all') {
        const { status, body } = await shopfrontFetch('/products');
        if (status === 200 && body?.success) {
            const edges = (body.data || []).map(product => ({
                node: {
                    ...product,
                    images: { edges: product.images?.map(img => ({ node: img })) || [] },
                    variants: { edges: product.variants?.map(v => ({ node: v })) || [] },
                    options: product.options || [],
                    priceRange: product.priceRange || {
                        minVariantPrice: { amount: product.price || 0, currencyCode: "INR" }
                    },
                    compareAtPriceRange: product.compareAtPriceRange || {
                        minVariantPrice: { 
                            amount: product.compare_at_price || product.compareAtPrice || product.price || 0, 
                            currencyCode: "INR" 
                        }
                    }

                }
            }));
            return {
                status: 200,
                body: {
                    data: {
                        collection: {
                            id: 'all',
                            title: 'All Products',
                            handle: 'all',
                            description: 'Explore our complete range of premium Ayurvedic and traditional products.',
                            products: { edges, filters: [] }
                        }
                    }
                }
            };
        }
        return { status, body };
    }

    // Build query params for filters if the API supports it
    let queryString = '';
    if (filters && filters.length > 0) {
        // You can serialize filters to query string here if the backend supports it
        // e.g. ?available=true&min_price=100
    }

    const { status, body } = await shopfrontFetch(`/collections/${handle}${queryString}`);
    
    if (status !== 200 || !body?.success) {
        return { status, body };
    }

    const col = body.data;
    const edges = (col.products || []).map(product => ({
        node: {
            ...product,
            images: { edges: product.images?.map(img => ({ node: img })) || [] },
            variants: { edges: product.variants?.map(v => ({ node: v })) || [] },
            options: product.options || [],
            priceRange: product.priceRange || {
                minVariantPrice: { amount: product.price || 0, currencyCode: "INR" }
            },
            compareAtPriceRange: product.compareAtPriceRange || {
                minVariantPrice: { 
                    amount: product.compare_at_price || product.compareAtPrice || product.price || 0, 
                    currencyCode: "INR" 
                }
            }

        }
    }));

    return {
        status: 200,
        body: {
            data: {
                collection: {
                    id: col.id,
                    title: col.title,
                    handle: col.handle,
                    description: col.description,
                    image: col.image_url ? { url: col.image_url, altText: col.title } : null,
                    products: { edges, filters: col.filters || [] }
                }
            }
        }
    };
}

export async function GET(request, { params }) {
    try {
        const { handle } = await params;
        if (!handle) {
            return NextResponse.json({ error: "Collection handle is required" }, { status: 400 });
        }

        const { body, status } = await getCollectionByHandle(handle);

        if (status !== 200 || body.errors) {
            return NextResponse.json(
                { error: "Shopfront API Error", details: body.errors || body },
                { status: status === 200 ? 500 : status }
            );
        }

        const collection = body?.data?.collection;
        if (!collection) {
            return NextResponse.json({ error: "Collection not found" }, { status: 404 });
        }
        
        const productsData = collection?.products;
        const products = productsData?.edges.map(edge => edge.node) || [];
        const filters = productsData?.filters || [];

        let bannerUrl = null;
        let bannerAltData = null;

        return NextResponse.json({
            success: true,
            collection: {
                id: collection.id,
                title: collection.title,
                handle: collection.handle,
                description: collection.description,
                image: collection.image,
                bannerImageUrl: bannerUrl,
                bannerImageAlt: bannerAltData
            },
            count: products.length,
            products,
            filters
        });
    } catch (error) {
        console.error("API Route Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error", message: error.message },
            { status: 500 }
        );
    }
}
