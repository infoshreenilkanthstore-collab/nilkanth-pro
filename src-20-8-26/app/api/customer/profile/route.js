import { NextResponse } from "next/server";
import { shopfrontFetch } from "../../../../lib/shopify";
// import connectDB from "@/lib/db";
// import User from "@/models/User";


// GET /api/customer/profile?customerId=xxx
export async function GET(req) {
    const { searchParams } = new URL(req.url);
    let accessToken = searchParams.get("accessToken");

    // Clean up strings that might be "null" or "undefined" from client-side template literal
    if (accessToken === "null" || accessToken === "undefined" || !accessToken) accessToken = null;
    
    console.log("Profile GET: accessToken present?", !!accessToken, accessToken ? `(${accessToken.substring(0, 5)}...)` : "");

    if (!accessToken) {

        return NextResponse.json({ success: false, error: "Authentication token required" }, { status: 401 });
    }

    try {
        // Fetch from Shopfront API: /customer/me
        const { status, body } = await shopfrontFetch(`/customer/me`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });

        if (status !== 200 || !body?.success) {
            console.error("Shopfront Customer GET error:", body);
            return NextResponse.json({ 
                success: false, 
                error: body?.message || "Failed to fetch customer profile" 
            }, { status });
        }

        const customer = body.data;

        return NextResponse.json({
            success: true,
            firstName: customer.firstName || customer.first_name || "",
            lastName: customer.lastName || customer.last_name || "",
            email: customer.email || "",
            phone: customer.phone || "",
            customerId: customer.id
        });
    } catch (err) {
        console.error("Profile GET error:", err);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}

// PUT /api/customer/profile
// Body: { firstName, lastName, accessToken }
export async function PUT(req) {
    try {
        const { firstName, lastName, accessToken } = await req.json();

        if (!accessToken) {
            return NextResponse.json({ success: false, error: "Authentication token required" }, { status: 401 });
        }

        // Update via Shopfront API: /customer/profile
        const { status, body } = await shopfrontFetch(`/customer/profile`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${accessToken}`
            },
            body: {
                first_name: firstName,
                last_name: lastName
            }
        });


        if (status !== 200 || !body?.success) {
            console.error("Shopfront Customer PUT error:", body);
            return NextResponse.json({ success: false, error: body.message || "Failed to update profile" }, { status });
        }

        return NextResponse.json({ success: true, ...body });
    } catch (err) {
        console.error("Profile PUT error:", err);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}


