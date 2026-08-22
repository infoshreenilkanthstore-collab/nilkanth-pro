import { NextResponse } from "next/server";
import { shopifyAdminFetch } from "@/lib/shopify";

export const dynamic = "force-dynamic";

export async function POST(request) {
    try {
        const body_parsed = await request.json();
        const { cart, customerInfo, shipping, shippingLabel, paymentMethod } = body_parsed;

        console.log("CHECKOUT REQUEST RECEIVED:", JSON.stringify(body_parsed, null, 2));

        if (!process.env.SHOPIFY_STORE_DOMAIN) {
            console.error("CRITICAL: SHOPIFY_STORE_DOMAIN is not defined in environment variables.");
            return NextResponse.json({ error: "Server Configuration Error: Missing Shopify Domain" }, { status: 500 });
        }

        if (!cart || cart.length === 0) {
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
        }

        // Format line items for Shopify Draft Order
        const lineItems = cart.map(item => ({
            variantId: item.variantId,
            quantity: item.qty
        }));

        // Create Draft Order Mutation
        const draftOrderMutation = `
            mutation draftOrderCreate($input: DraftOrderInput!) {
                draftOrderCreate(input: $input) {
                    draftOrder {
                        id
                        name
                        invoiceUrl
                    }
                    userErrors { field message }
                }
            }
        `;

        // Complete Draft Order Mutation (for COD)
        const draftOrderCompleteMutation = `
            mutation draftOrderComplete($id: ID!, $paymentPending: Boolean) {
                draftOrderComplete(id: $id, paymentPending: $paymentPending) {
                    draftOrder {
                        id
                        name
                        order {
                            id
                            name
                        }
                    }
                    userErrors { field message }
                }
            }
        `;

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
                    address1: customerInfo.address,
                    city: customerInfo.city,
                    province: normalizedState,
                    provinceCode: stateCode,
                    zip: customerInfo.pincode,
                    firstName: resolvedFirstName,
                    lastName: resolvedLastName,
                    phone: formattedPhone,
                    countryCode: "IN"
                },
                billingAddress: {
                    address1: customerInfo.address,
                    city: customerInfo.city,
                    province: normalizedState,
                    provinceCode: stateCode,
                    zip: customerInfo.pincode,
                    firstName: resolvedFirstName,
                    lastName: resolvedLastName,
                    phone: formattedPhone,
                    countryCode: "IN"
                },
                shippingLine: {
                    title: shippingLabel || "Standard Shipping",
                    price: (Number(shipping) || 0).toFixed(2)
                }
            }
        };

        // 1. Create the Draft Order
        const { body: createBody, status: createStatus } = await shopifyAdminFetch({
            query: draftOrderMutation,
            variables
        });

        if (createStatus !== 200 || createBody?.data?.draftOrderCreate?.userErrors?.length > 0) {
            console.error("Draft Order Create Error:", createBody?.data?.draftOrderCreate?.userErrors || createBody?.errors);
            return NextResponse.json({
                error: "Failed to create order",
                details: createBody?.data?.draftOrderCreate?.userErrors || createBody?.errors
            }, { status: 400 });
        }

        const draftOrder = createBody.data.draftOrderCreate.draftOrder;

        // 2. If COD, complete the draft order immediately
        if (paymentMethod === "cod") {
            const { body: completeBody } = await shopifyAdminFetch({
                query: draftOrderCompleteMutation,
                variables: { 
                    id: draftOrder.id,
                    paymentPending: true
                }
            });

            if (completeBody?.data?.draftOrderComplete?.userErrors?.length > 0) {
                console.error("COD Completion User Errors:", completeBody.data.draftOrderComplete.userErrors);
                // Return the draft order anyway if completion fails? 
                // No, user specifically wants "Orders not Draft".
                return NextResponse.json({
                    error: "Failed to finalize COD order",
                    details: completeBody.data.draftOrderComplete.userErrors
                }, { status: 400 });
            }

            const finalOrder = completeBody.data.draftOrderComplete.draftOrder.order;
            return NextResponse.json({
                success: true,
                orderId: finalOrder?.id,
                orderName: finalOrder?.name || draftOrder.name,
                paymentMethod: "cod"
            });
        }

        // 3. For Online payment, return the invoice URL
        return NextResponse.json({
            success: true,
            checkoutUrl: draftOrder.invoiceUrl,
            orderId: draftOrder.id,
            orderName: draftOrder.name,
            paymentMethod: "online"
        });

    } catch (error) {
        console.error("Checkout API Error:", error);
        return NextResponse.json({
            error: "Internal Server Error",
            message: error.message
        }, { status: 500 });
    }
}
