import { NextResponse } from 'next/server';
import { shopfrontFetch } from '@/lib/shopify';

export async function POST(request) {
    try {
        const { productId, productHandle, name, rating, comment } = await request.json();

        if (!productId || !name || !rating || !comment) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const apiUrl = process.env.SHOPFRONT_API_URL || 'https://megaecomm.megascale.co.in/backend';
        const apiToken = process.env.SHOPFRONT_TOKEN || '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d3690e704f526300';

        let targetProductId = String(productId).split('/').pop();

        async function submitToBackend(pid) {
            return await fetch(`${apiUrl}/api/shop/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopfront-Token': apiToken,
                    'x-store-id': '16'
                },
                body: JSON.stringify({
                    product_id: Number(pid) || pid,
                    customer_name: name,
                    rating: Number(rating),
                    title: comment,
                    description: comment,
                    images: []
                })
            });
        }

        // 1. Try submitting with targetProductId
        let postResponse = await submitToBackend(targetProductId);
        let postData = await postResponse.json();

        // 2. If attempt failed (e.g. invalid ID format or foreign key constraint), resolve real megaecomm product ID
        if (!postResponse.ok || !postData.success) {
            console.warn(`Initial review submit failed for product ID "${targetProductId}". Attempting megaecomm product resolution...`, postData);

            let resolvedId = null;
            const handleToSearch = productHandle || targetProductId;

            if (handleToSearch) {
                try {
                    const directRes = await shopfrontFetch(`/products/${handleToSearch}`);
                    if (directRes.status === 200 && directRes.body?.success && directRes.body?.data?.id) {
                        resolvedId = directRes.body.data.id;
                    }
                } catch (e) {
                    console.error("Direct handle lookup error:", e);
                }

                if (!resolvedId) {
                    try {
                        const searchTerms = handleToSearch.replace(/gid:\/\/shopify\/Product\//g, '').replace(/-/g, ' ');
                        const searchRes = await shopfrontFetch(`/products?search=${encodeURIComponent(searchTerms)}`);
                        if (searchRes.status === 200 && searchRes.body?.success && Array.isArray(searchRes.body?.data) && searchRes.body.data.length > 0) {
                            resolvedId = searchRes.body.data[0].id;
                        }
                    } catch (e) {
                        console.error("Product search lookup error:", e);
                    }
                }
            }

            if (resolvedId && String(resolvedId) !== String(targetProductId)) {
                console.log(`Resolved real megaecomm product ID: ${resolvedId}. Retrying review submission...`);
                targetProductId = resolvedId;
                postResponse = await submitToBackend(targetProductId);
                postData = await postResponse.json();
            }
        }

        if (!postResponse.ok || !postData.success) {
            console.error('Shopfront Review Submit Error:', postData);
            return NextResponse.json({ error: postData.message || 'Failed to save review' }, { status: 500 });
        }

        const submittedReview = {
            id: String(postData.data?.id || Date.now()),
            customer_name: name,
            name: name,
            rating: Number(rating),
            title: comment,
            description: comment,
            comment: comment,
            created_at: new Date().toISOString(),
            date: new Date().toISOString()
        };

        // 3. Fetch approved reviews list and prepend newly submitted review
        let updatedReviews = [];
        try {
            const getResponse = await fetch(`${apiUrl}/api/shop/reviews/product/${targetProductId}?limit=10000`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopfront-Token': apiToken,
                    'x-store-id': '16'
                }
            });
            const getData = await getResponse.json();
            if (getData && getData.success && getData.data && Array.isArray(getData.data.reviews)) {
                updatedReviews = getData.data.reviews;
            }
        } catch (getErr) {
            console.error('Error fetching updated reviews:', getErr);
        }

        const reviews = [submittedReview, ...updatedReviews.filter(r => String(r.id) !== String(submittedReview.id))];

        return NextResponse.json({ success: true, reviews });
    } catch (error) {
        console.error('Review API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}


