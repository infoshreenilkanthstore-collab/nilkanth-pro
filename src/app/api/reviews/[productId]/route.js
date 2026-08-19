import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    const { productId } = await params;

    if (!productId) {
        return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    try {
        const apiUrl = process.env.SHOPFRONT_API_URL || 'https://megaecomm.megascale.co.in/backend';
        const apiToken = process.env.SHOPFRONT_TOKEN || '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d3690e704f526300';

        const numericId = String(productId).split('/').pop();

        const response = await fetch(`${apiUrl}/api/shop/reviews/product/${numericId}?limit=10000`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopfront-Token': apiToken,
                'x-store-id': '16'
            }
        });

        const data = await response.json();
        
        return NextResponse.json(data);
    } catch (error) {
        console.error('External Review API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }
}

