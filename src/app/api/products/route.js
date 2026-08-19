import { NextResponse } from "next/server";

import { getProducts } from "@/lib/shopify";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get("limit") || 250;
    const { body, status } = await getProducts(limit);


    if (status !== 200 || (body && body.errors)) {
      return NextResponse.json(
        { error: "Shopify API Error", details: body?.errors || body || "Unknown error" },
        { status: status === 200 ? 500 : status }
      );
    }


    const products = (body?.data?.products?.edges.map(edge => {
      const node = edge.node || {};
      return {
        ...node,
        handle: node.handle || String(node.id)
      };
    })) || [];

    return NextResponse.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
