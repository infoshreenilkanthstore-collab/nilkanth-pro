import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import AbandonedCheckout from "@/models/AbandonedCheckout";

export const dynamic = "force-dynamic";

export async function POST(request) {
    try {
        const data = await request.json();
        const { phone, firstName, lastName, email, address, city, state, pincode, cart, subtotal, isDeliverable } = data;

        if (!phone || phone.length < 10) {
            return NextResponse.json({ success: false, message: "Valid phone number required" }, { status: 400 });
        }

        await connectDB();

        if (data.status === 'completed') {
            await AbandonedCheckout.findOneAndUpdate(
                { phone: phone, status: 'draft' },
                { status: 'completed' }
            );
            return NextResponse.json({ success: true, message: "Draft marked as completed" });
        }

        // Upsert based on phone number (and keep it as draft)
        const draft = await AbandonedCheckout.findOneAndUpdate(
            { phone: phone, status: 'draft' },
            { 
                firstName, 
                lastName, 
                email, 
                address, 
                city, 
                state, 
                pincode, 
                cart, 
                subtotal,
                isDeliverable
            },
            { upsert: true, new: true }
        );

        return NextResponse.json({ success: true, draft });

    } catch (error) {
        console.error("Draft Save API Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
