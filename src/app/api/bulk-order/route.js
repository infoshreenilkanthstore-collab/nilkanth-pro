import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import BulkOrder from '@/models/BulkOrder';

export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();
        const { fullName, phoneNumber, requiredProduct, quantity, message } = body;

        if (!fullName || !phoneNumber || !requiredProduct || !quantity) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        const bulkOrder = await BulkOrder.create({
            fullName,
            phoneNumber,
            requiredProduct,
            quantity,
            message,
        });

        return NextResponse.json({ success: true, data: bulkOrder }, { status: 201 });
    } catch (error) {
        console.error("Bulk Order submission error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        await connectDB();
        const bulkOrders = await BulkOrder.find().sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: bulkOrders });
    } catch (error) {
        console.error("Bulk Order fetch error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
