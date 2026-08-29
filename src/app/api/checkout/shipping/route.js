import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Pincode from "@/models/Pincode";
import ShippingSlab from "@/models/ShippingSlab";

export async function POST(request) {
    try {
        const { pincode, totalWeightInGrams } = await request.json();

        if (!pincode || typeof totalWeightInGrams !== 'number') {
            return NextResponse.json({ error: "Pincode and valid Cart Weight are required" }, { status: 400 });
        }

        await connectDB();

        // 1. Find Pincode in DB
        const dbPincode = await Pincode.findOne({ DESTINATIONPINCODE: pincode }).populate('slabIds');
        console.log(`[Shipping API] Found Pincode: ${pincode}, Slabs count: ${dbPincode?.slabIds?.length || 0}`);

        if (!dbPincode) {
            // Un-serviceable
            return NextResponse.json({
                success: false,
                isDeliverable: false,
                message: "We currently do not deliver to this pincode. Please try a different location."
            });
        }

        // 2. Base Cost (legacy) + Master Slabs match
        // Note: Use nullish coalescing to allow 0 (Free)
        let applicableCost = (dbPincode.price !== undefined && dbPincode.price !== null) ? dbPincode.price : 99;
        let matchedSlabName = null;

        if (dbPincode.slabIds && dbPincode.slabIds.length > 0) {
            const totalWeightInKg = totalWeightInGrams / 1000;
            console.log(`[Shipping API] Calculating for ${totalWeightInKg}kg`);

            // Check through all mapped master slabs for the right weight bracket
            for (const masterSlab of dbPincode.slabIds) {
                console.log(`[Shipping API] Checking slab group: ${masterSlab.name}`);
                if (masterSlab.slabs && masterSlab.slabs.length > 0) {
                    const matchingTier = masterSlab.slabs.find(
                        tier => totalWeightInKg >= tier.minWeight && totalWeightInKg < tier.maxWeight // Use < for upper bound consistency
                    );

                    // If not found with <, try <= for the exact max weight case
                    const finalMatch = matchingTier || masterSlab.slabs.find(tier => totalWeightInKg === tier.maxWeight);

                    if (finalMatch) {
                        applicableCost = finalMatch.isFree ? 0 : finalMatch.price;
                        matchedSlabName = masterSlab.name;
                        console.log(`[Shipping API] Match found! Slab: ${matchedSlabName}, Cost: ${applicableCost}`);
                        break; // Found the precise match, stop checking other slabs
                    }
                }
            }
        }

        return NextResponse.json({
            success: true,
            shippingCost: applicableCost,
            appliedSlab: matchedSlabName,
            isDeliverable: true,
            city: dbPincode.CITY,
            state: dbPincode.STATE
        });

    } catch (error) {
        console.error("Shipping Calculation API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
