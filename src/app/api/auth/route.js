import crypto from "crypto"
// import connectDB from "@/lib/db";
// import User from "@/models/User";

const OTP_STORE = new Map()

export async function GET() {
    return Response.json({ success: true, message: "Auth API is operational. Use POST for authentication actions." });
}

export async function POST(req) {
    const baseUrl = process.env.SHOPFRONT_API_URL;
    if (!baseUrl) {
        console.error("SHOPFRONT_API_URL is missing in environment variables");
        return Response.json({ success: false, message: "Server configuration error" }, { status: 500 });
    }

    const { action, phone, otp, cart_token } = await req.json()
    const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;

    // STEP 1: SEND OTP
    if (action === "send") {
        try {
            const res = await fetch(`${baseUrl}/api/shop/auth/send-otp`, {

                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Shopfront-Token": process.env.SHOPFRONT_TOKEN
                },
                body: JSON.stringify({ phone: formattedPhone })
            });

            const contentType = res.headers.get("content-type");
            let data;
            if (contentType && contentType.includes("application/json")) {
                data = await res.json();
            } else {
                const text = await res.text();
                console.error("Shopfront Send OTP non-JSON response:", text);
                return Response.json({ success: false, message: "Invalid response from auth service" }, { status: 500 });
            }

            
            if (!res.ok) {
                return Response.json({ success: false, message: data.message || "Failed to send OTP" }, { status: res.status });
            }

            return Response.json({ success: true, data });
        } catch (error) {
            console.error("Shopfront Send OTP Error:", error);
            return Response.json({ success: false, message: "Error connecting to auth service" }, { status: 500 });
        }
    }

    // STEP 2: VERIFY OTP
    if (action === "verify") {
        try {
            const res = await fetch(`${baseUrl}/api/shop/auth/verify-otp`, {

                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Shopfront-Token": process.env.SHOPFRONT_TOKEN
                },
                body: JSON.stringify({ 
                    phone: formattedPhone, 
                    otp,
                    cart_token: cart_token || "" 
                })
            });

            const contentType = res.headers.get("content-type");
            let data;
            if (contentType && contentType.includes("application/json")) {
                data = await res.json();
            } else {
                const text = await res.text();
                console.error("Shopfront Verify OTP non-JSON response:", text);
                return Response.json({ success: false, message: "Invalid response from auth service" }, { status: 500 });
            }

            if (!res.ok) {
                return Response.json({ success: false, message: data.message || "Invalid OTP" }, { status: res.status });
            }


            // Shopfront API returns customer authentication data
            const customerId = data.customerId || data.customer?.id;
            console.log("Shopfront Auth returned customerId:", customerId);


            if (customerId) {
                // // SYNC TO MONGODB (Optional, currently disabled)
                // try {
                //     await connectDB();
                //     await User.findOneAndUpdate(
                //         { shopifyCustomerId: customerId.toString() },
                //         { phone: formattedPhone, lastLogin: new Date() },
                //         { upsert: true }
                //     );
                // } catch (mongoError) {
                //     console.error("MongoDB Sync Error (Auth Verify):", mongoError);
                // }
            }

            return Response.json({
                success: true,
                customerId,
                ...data
            });
        } catch (error) {
            console.error("Shopfront Verify OTP Error:", error);
            return Response.json({ success: false, message: "Error verifying OTP" }, { status: 500 });
        }
    }

    return Response.json({ success: false, message: "Invalid action" }, { status: 400 });
}