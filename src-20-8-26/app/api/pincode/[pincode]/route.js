import { NextResponse } from "next/server";
import connectDB from "../../../../lib/db";
import Pincode from "../../../../models/Pincode";

export async function GET(request, context) {
    try {
        const params = context.params;
        let pincode = params?.pincode;

        // Fallback if params is missing or empty
        if (!pincode) {
            const url = new URL(request.url);
            const segments = url.pathname.split('/');
            pincode = segments[segments.length - 1];
        }

        pincode = String(pincode).trim();
        
        if (!pincode || pincode.length !== 6) {
            return NextResponse.json({ success: false, message: `Invalid pincode: ${pincode}` }, { status: 400 });
        }

        await connectDB();
        const data = await Pincode.findOne({ DESTINATIONPINCODE: pincode }).lean();

        if (!data) {
            return NextResponse.json({ success: false, message: "Pincode not found in our database" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            city: data.CITY,
            state: data.STATE
        });
    } catch (error) {
        console.error("Pincode API Error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
