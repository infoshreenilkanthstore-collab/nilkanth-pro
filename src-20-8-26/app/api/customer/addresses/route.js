import { NextResponse } from "next/server";
import { shopfrontFetch } from "../../../../lib/shopify";

// --- Route Handlers ---

// GET /api/customer/addresses?customerId=xxx
export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get("customerId");
    if (!customerId || customerId === "null" || customerId === "undefined") {
        return NextResponse.json({ success: false, error: "Missing customerId" }, { status: 400 });
    }

    const token = req.headers.get("Authorization") || `Bearer ${searchParams.get("accessToken")}`;

    try {
        const { status, body } = await shopfrontFetch(`/api/customers/${customerId}/addresses`, {
            headers: { "Authorization": token }
        });

        if (status !== 200) {
            console.error("Addresses GET failed:", status, body);
            return NextResponse.json({ 
                success: false, 
                error: body?.message || body?.error || "Failed to fetch addresses",
                debug: body
            }, { status });
        }

        const addresses = (body.data || []).map(addr => ({
            id: addr.id,
            firstName: addr.first_name,
            lastName: addr.last_name,
            phone: addr.phone,
            address: addr.address_line1,
            city: addr.city,
            state: addr.state,
            pincode: addr.pincode,
            country: addr.country,
            isDefault: addr.is_default
        }));

        return NextResponse.json({ 
            success: true, 
            addresses, 
            defaultIndex: addresses.findIndex(a => a.isDefault) ?? 0 
        });
    } catch (err) {
        console.error("Addresses GET error:", err);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}

// POST /api/customer/addresses  — add a new address
export async function POST(req) {
    try {
        const { customerId, address } = await req.json();
        if (!customerId || customerId === "null" || customerId === "undefined") {
            return NextResponse.json({ success: false, error: "Missing customerId" }, { status: 400 });
        }

        const token = req.headers.get("Authorization");

        const payload = {
            first_name: address.firstName,
            last_name: address.lastName,
            phone: address.phone,
            address_line1: address.address,
            city: address.city,
            state: address.state,
            country: address.country || "India",
            pincode: address.pincode,
            is_default: address.isDefault || false
        };

        const { status, body } = await shopfrontFetch(`/api/customers/${customerId}/address`, {
            method: "POST",
            headers: { "Authorization": token },
            body: payload
        });

        if (status !== 201 && status !== 200) {
            console.error("Addresses POST failed:", status, body);
            return NextResponse.json({ 
                success: false, 
                error: body?.message || body?.error || "Failed to add address",
                debug: body
            }, { status });
        }

        return NextResponse.json({ success: true, message: "Address added" });
    } catch (err) {
        console.error("Addresses POST error:", err);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}

// PUT /api/customer/addresses
export async function PUT(req) {
    try {
        const data = await req.json();
        const { customerId, addressId, address, defaultIndex } = data;
        
        if (!customerId || customerId === "null" || customerId === "undefined") {
            return NextResponse.json({ success: false, error: "Missing customerId" }, { status: 400 });
        }

        const token = req.headers.get("Authorization");

        if (typeof defaultIndex === "number" && addressId) {
            // Set Default
            const { status, body: resBody } = await shopfrontFetch(`/api/customers/${customerId}/address/${addressId}/default`, {
                method: "PATCH",
                headers: { "Authorization": token }
            });
            if (status !== 200) {
                return NextResponse.json({ success: false, error: resBody?.message || resBody?.error || "Failed to set default" }, { status });
            }
            return NextResponse.json({ success: true });
        } else if (addressId && address) {
            // Update Address
            const payload = {
                first_name: address.firstName,
                last_name: address.lastName,
                phone: address.phone,
                address_line1: address.address,
                city: address.city,
                state: address.state,
                country: address.country || "India",
                pincode: address.pincode
            };
            const { status, body: resBody } = await shopfrontFetch(`/api/customers/${customerId}/address/${addressId}`, {
                method: "PUT",
                headers: { "Authorization": token },
                body: payload
            });
            if (status !== 200) {
                return NextResponse.json({ success: false, error: resBody?.message || resBody?.error || "Failed to update address" }, { status });
            }
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
    } catch (err) {
        console.error("Addresses PUT error:", err);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}

// DELETE /api/customer/addresses
export async function DELETE(req) {
    try {
        const { customerId, addressId } = await req.json();
        if (!customerId || customerId === "null" || customerId === "undefined") {
            return NextResponse.json({ success: false, error: "Missing customerId" }, { status: 400 });
        }

        const token = req.headers.get("Authorization");

        const { status, body } = await shopfrontFetch(`/api/customers/${customerId}/address/${addressId}`, {
            method: "DELETE",
            headers: { "Authorization": token }
        });

        if (status !== 200) {
            return NextResponse.json({ success: false, error: body?.message || body?.error || "Failed to delete address" }, { status });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Addresses DELETE error:", err);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
