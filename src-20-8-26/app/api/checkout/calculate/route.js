import { NextResponse } from "next/server";
import { calculateDraftOrder } from "../../../../lib/shopify";

export const dynamic = "force-dynamic";

export async function POST(request) {
    try {
        const body_parsed = await request.json();
        const { cart, customerInfo, shipping, shippingLabel } = body_parsed;

        if (!cart || cart.length === 0) {
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
        }

        // Format line items for Shopify Draft Order
        const lineItems = cart.map(item => ({
            variantId: item.variantId,
            quantity: item.qty
        }));

        // Helper to map and normalize Indian States and their codes
        const stateMap = {
            "andhra pradesh": { name: "Andhra Pradesh", code: "AP" },
            "arunachal pradesh": { name: "Arunachal Pradesh", code: "AR" },
            "assam": { name: "Assam", code: "AS" },
            "bihar": { name: "Bihar", code: "BR" },
            "chhattisgarh": { name: "Chhattisgarh", code: "CG" },
            "goa": { name: "Goa", code: "GA" },
            "gujarat": { name: "Gujarat", code: "GJ" },
            "haryana": { name: "Haryana", code: "HR" },
            "himachal pradesh": { name: "Himachal Pradesh", code: "HP" },
            "jharkhand": { name: "Jharkhand", code: "JH" },
            "karnataka": { name: "Karnataka", code: "KA" },
            "kerala": { name: "Kerala", code: "KL" },
            "madhya pradesh": { name: "Madhya Pradesh", code: "MP" },
            "maharashtra": { name: "Maharashtra", code: "MH" },
            "manipur": { name: "Manipur", code: "MN" },
            "meghalaya": { name: "Meghalaya", code: "ML" },
            "mizoram": { name: "Mizoram", code: "MZ" },
            "nagaland": { name: "Nagaland", code: "NL" },
            "odisha": { name: "Odisha", code: "OR" },
            "punjab": { name: "Punjab", code: "PB" },
            "rajasthan": { name: "Rajasthan", code: "RJ" },
            "sikkim": { name: "Sikkim", code: "SK" },
            "tamil nadu": { name: "Tamil Nadu", code: "TN" },
            "telangana": { name: "Telangana", code: "TG" },
            "tripura": { name: "Tripura", code: "TR" },
            "uttar pradesh": { name: "Uttar Pradesh", code: "UP" },
            "uttarakhand": { name: "Uttarakhand", code: "UK" },
            "west bengal": { name: "West Bengal", code: "WB" },
            "delhi": { name: "Delhi", code: "DL" }
        };

        const stateInfo = stateMap[customerInfo.state?.toLowerCase().trim()] || { name: customerInfo.state, code: undefined };
        const normalizedState = stateInfo.name;
        const stateCode = stateInfo.code;

        // Format phone to E.164 (Shopify requirement)
        let formattedPhone = customerInfo.phone?.replace(/\s/g, '');
        if (formattedPhone && !formattedPhone.startsWith('+')) {
            const cleanPhone = formattedPhone.replace(/\D/g, '');
            if (cleanPhone.length === 10) {
                formattedPhone = `+91${cleanPhone}`;
            } else {
                formattedPhone = `+${cleanPhone}`;
            }
        }

        let resolvedFirstName = customerInfo.firstName?.trim() || "Customer";
        let resolvedLastName = customerInfo.lastName?.trim() || "";

        const variables = {
            input: {
                lineItems,
                email: customerInfo.email || undefined,
                phone: formattedPhone,
                shippingAddress: {
                    address1: customerInfo.address || "TBD",
                    city: customerInfo.city || "TBD",
                    province: normalizedState || "TBD",
                    provinceCode: stateCode,
                    zip: customerInfo.pincode || "TBD",
                    firstName: resolvedFirstName,
                    lastName: resolvedLastName,
                    countryCode: "IN"
                },
                billingAddress: {
                    address1: customerInfo.address || "TBD",
                    city: customerInfo.city || "TBD",
                    province: normalizedState || "TBD",
                    provinceCode: stateCode,
                    zip: customerInfo.pincode || "TBD",
                    firstName: resolvedFirstName,
                    lastName: resolvedLastName,
                    countryCode: "IN"
                },
                shippingLine: {
                    title: shippingLabel || "Standard Shipping",
                    price: (Number(shipping) || 0).toFixed(2)
                }
            }
        };

        const { body, status: shopifyStatus } = await calculateDraftOrder(variables);

        if (shopifyStatus !== 200) {
            return NextResponse.json({
                error: "Shopify Connectivity Error",
                details: body
            }, { status: shopifyStatus });
        }

        let calculatedDraftOrder = body?.data?.draftOrderCalculate?.calculatedDraftOrder;

        if (!calculatedDraftOrder) {
            return NextResponse.json({
                error: "Failed to calculate taxes",
                details: body?.errors || body?.data?.draftOrderCalculate?.userErrors
            }, { status: 400 });
        }

        let { totalTax, subtotalPrice, totalPrice, taxLines } = calculatedDraftOrder;
        totalTax = parseFloat(totalTax);
        taxLines = [...(taxLines || [])];

        // Specific fix for Gujarat: Ensure both CGST and SGST are present if only one (usually SGST) is returned
        if (stateCode === "GJ" && taxLines.length === 1 && (taxLines[0].title.toUpperCase() === "SGST" || taxLines[0].title.toUpperCase() === "CGST")) {
            const originalTax = taxLines[0];
            const taxTitle = originalTax.title.toUpperCase();
            const partnerTitle = taxTitle === "SGST" ? "CGST" : "SGST";
            
            // Add the missing partner tax line
            taxLines.push({
                title: partnerTitle,
                rate: originalTax.rate,
                price: originalTax.price
            });

            // Update total tax and total price
            const additionalTax = parseFloat(originalTax.price);
            totalTax += additionalTax;
            totalPrice = (parseFloat(totalPrice) + additionalTax).toFixed(2);
        }

        return NextResponse.json({
            success: true,
            totalTax: totalTax,
            subtotalPrice: parseFloat(subtotalPrice),
            totalPrice: parseFloat(totalPrice),
            taxLines: taxLines
        });

    } catch (error) {
        console.error("Tax Calculation API Error:", error);
        return NextResponse.json({
            error: "Internal Server Error",
            message: error.message
        }, { status: 500 });
    }
}
