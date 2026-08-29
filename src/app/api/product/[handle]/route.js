import { getProduct } from '@/lib/shopify';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    const { handle } = await params;

    if (!handle || handle === 'null' || handle === 'undefined') {
        return NextResponse.json(
            { success: false, error: 'Invalid product handle or ID' },
            { status: 400 }
        );
    }

    try {
        const response = await getProduct(handle);

        // Handle unauthenticated state or shopify error
        if (response.status === 401) {
            return NextResponse.json(
                { success: false, error: 'Shopify Storefront API Unauthorized. Check your SHOPIFY_STOREFRONT_ACCESS_TOKEN and SHOPIFY_STORE_DOMAIN in .env.local' },
                { status: 401 }
            );
        }

        if (response.error || response.status !== 200) {
            return NextResponse.json(
                { success: false, error: response.error || 'Failed to fetch product' },
                { status: response.status || 500 }
            );
        }

        const product = response.body?.data?.product;

        if (!product) {
            return NextResponse.json(
                { success: false, error: 'Product not found' },
                { status: 404 }
            );
        }



        return NextResponse.json({
            success: true,
            product: product,
        });

    } catch (error) {
        console.error("API Route Error:", error);
        return NextResponse.json(
            { success: false, error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
