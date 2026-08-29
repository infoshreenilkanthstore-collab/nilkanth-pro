import { NextResponse } from "next/server";
import { shopfrontFetch } from "@/lib/shopify";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    let accessToken = searchParams.get("accessToken");
    const authHeader = req.headers.get("Authorization");

    if (authHeader && authHeader.startsWith("Bearer ")) {
        accessToken = authHeader.replace("Bearer ", "").trim();
    }

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
            return NextResponse.json({ success: false, error: body?.message || "Failed to fetch orders" }, { status: status || 500 });
        }

        const customer = body.data;
        const rawOrders = customer?.orders || [];
        
        // Format the orders to send to the frontend
        const orders = rawOrders.map(order => ({
            id: order.id,
            orderNumber: order.order_number || order.name || order.orderNumber || `#${order.id}`,
            createdAt: order.created_at || order.createdAt,
            totalPrice: order.total_amount ?? order.total_price ?? order.totalPrice ?? "0.00",
            currency: order.currency || order.currency_code || "INR",
            status: order.status,
            financialStatus: order.financial_status || order.financialStatus || (order.status === 'paid' ? 'paid' : order.status) || "paid",
            fulfillmentStatus: order.fulfillment_status || order.fulfillmentStatus || order.status || "unfulfilled",
            items: (order.items || order.line_items || order.lineItems || []).map(item => ({
                id: item.id,
                title: item.title || item.name || item.product_name || "Product",
                quantity: item.quantity || 1,
                price: item.price ?? item.total_amount ?? "0.00",
                totalAmount: item.total_amount ?? item.price ?? "0.00",
                productImage: item.product_image || item.image_url || item.image || item.featured_image || null,
                imageUrl: item.image_url || item.product_image || item.image || item.featured_image || null,
                productId: item.product_id,
                variantId: item.variant_id,
                sku: item.sku
            }))
        }));

        return NextResponse.json({ success: true, orders });
    } catch (err) {
        console.error("Orders GET error:", err);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
