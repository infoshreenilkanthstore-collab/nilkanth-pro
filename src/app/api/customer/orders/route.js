import { NextResponse } from "next/server";
import { shopfrontFetch } from "@/lib/shopify";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const accessToken = searchParams.get("accessToken");

    if (!accessToken || accessToken === "null" || accessToken === "undefined") {
        return NextResponse.json({ success: false, error: "Authentication token required" }, { status: 401 });
    }

    try {
        // Fetch from Shopfront API: /customer/me (which includes orders)
        const { status, body } = await shopfrontFetch(`/customer/me`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });

        if (status !== 200 || !body?.success) {
            console.error("Shopfront Orders GET error:", body);
            return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: status });
        }

        const customer = body.data;
        const rawOrders = customer.orders || [];
        
        // Format the orders to send to the frontend
        const orders = rawOrders.map(order => ({
            id: order.id,
            orderNumber: order.name || order.order_number || `#${order.id}`,
            createdAt: order.created_at || order.createdAt,
            totalPrice: order.total_price || order.totalPrice,
            currency: order.currency || order.currency_code || "INR",
            financialStatus: order.financial_status || order.financialStatus,
            fulfillmentStatus: order.fulfillment_status || order.fulfillmentStatus || "unfulfilled",
            items: (order.line_items || order.lineItems || []).map(item => ({
                id: item.id,
                title: item.title,
                quantity: item.quantity,
                price: item.price
            }))
        }));

        return NextResponse.json({ success: true, orders });
    } catch (err) {
        console.error("Orders GET error:", err);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}

