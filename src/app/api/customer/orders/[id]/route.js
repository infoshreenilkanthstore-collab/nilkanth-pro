import { NextResponse } from "next/server";
import { shopfrontFetch } from "@/lib/shopify";

export async function GET(req, { params }) {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    let accessToken = searchParams.get("accessToken");
    const authHeader = req.headers.get("Authorization");

    if (authHeader && authHeader.startsWith("Bearer ")) {
        accessToken = authHeader.replace("Bearer ", "").trim();
    }

    if (!accessToken || accessToken === "null" || accessToken === "undefined") {
        return NextResponse.json({ success: false, error: "Authentication token required" }, { status: 401 });
    }

    if (!id) {
        return NextResponse.json({ success: false, error: "Order ID required" }, { status: 400 });
    }

    try {
        const { status, body } = await shopfrontFetch(`/orders/${id}`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });

        if (status !== 200 || !body?.success) {
            console.error(`Shopfront Order ${id} GET error:`, body);
            return NextResponse.json({ success: false, error: body?.message || "Failed to fetch order details" }, { status: status || 500 });
        }

        return NextResponse.json({ success: true, order: body.data });
    } catch (err) {
        console.error(`Order ${id} GET error:`, err);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
