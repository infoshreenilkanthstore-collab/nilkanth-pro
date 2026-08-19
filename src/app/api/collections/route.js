import { NextResponse } from "next/server";
import { shopfrontFetch } from "@/lib/shopify";

export async function getCollections() {
    const { status, body } = await shopfrontFetch('/collections?limit=50');
    
    if (status !== 200 || !body?.success) {
        return { status, body };
    }

    const edges = (body.data || []).map(collection => ({
        node: {
            ...collection,
            image: collection.image_url ? { url: collection.image_url, altText: collection.title } : null,
        }
    }));

    return {
        status: 200,
        body: {
            data: {
                collections: { edges }
            }
        }
    };
}

export async function GET(request) {
    try {
        const { body, status } = await getCollections();

        if (status !== 200 || (body && body.errors)) {
            return NextResponse.json(
                { error: "Shopfront API Error", details: body?.errors || body || "Unknown error" },
                { status: status === 200 ? 500 : status }
            );
        }


        let collections = body?.data?.collections?.edges.map(edge => edge.node) || [];

        const hideEmpty = request?.url ? new URL(request.url).searchParams.get("hide_empty") !== "false" : true;

        if (hideEmpty) {
            collections = collections.filter(c => {
                const count = Number(c.product_count ?? c.products_count ?? c.productsCount ?? (c.products?.length || 0));
                return count > 0;
            });
        }

        return NextResponse.json({
            success: true,
            count: collections.length,
            collections
        });
    } catch (error) {
        console.error("API Route Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error", message: error.message },
            { status: 500 }
        );
    }
}
