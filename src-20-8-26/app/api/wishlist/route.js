import { NextResponse } from "next/server";

const SHOPFRONT_API_URL = process.env.SHOPFRONT_API_URL || "http://10.27.1.208:4000";
const SHOPFRONT_TOKEN = process.env.SHOPFRONT_TOKEN;

export async function GET(request) {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        const response = await fetch(`${SHOPFRONT_API_URL}/api/shop/wishlist`, {
            headers: {
                "X-Shopfront-Token": SHOPFRONT_TOKEN,
                "Authorization": authHeader,
                "x-store-id": process.env.SHOPFRONT_STORE_ID,
            },
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Wishlist GET Error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request) {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const response = await fetch(`${SHOPFRONT_API_URL}/api/shop/wishlist/toggle`, {
            method: "POST",
            headers: {
                "X-Shopfront-Token": SHOPFRONT_TOKEN,
                "Authorization": authHeader,
                "Content-Type": "application/json",
                "x-store-id": process.env.SHOPFRONT_STORE_ID,
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Wishlist POST Error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(request) {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
        return NextResponse.json({ success: false, message: "Missing item ID" }, { status: 400 });
    }

    try {
        const response = await fetch(`${SHOPFRONT_API_URL}/api/shop/wishlist/${id}`, {
            method: "DELETE",
            headers: {
                "X-Shopfront-Token": SHOPFRONT_TOKEN,
                "Authorization": authHeader,
                "x-store-id": process.env.SHOPFRONT_STORE_ID,
            },
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Wishlist DELETE Error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
