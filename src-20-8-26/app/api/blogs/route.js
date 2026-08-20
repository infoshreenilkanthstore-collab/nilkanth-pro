import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
        const url = `${process.env.SHOPFRONT_API_URL}/api/shop/cms/blogs/news?limit=50`;
        const response = await fetch(url, {
            headers: {
                'X-Shopfront-Token': process.env.SHOPFRONT_TOKEN,
                'Content-Type': 'application/json'
            },
            next: { revalidate: 0 }
        });

        const data = await response.json();
        
        if (!data.success) {
            return NextResponse.json({ success: false, error: 'Failed to fetch from shopfront' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            articles: data.data?.posts || []
        });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch blogs' }, { status: 500 });
    }
}
