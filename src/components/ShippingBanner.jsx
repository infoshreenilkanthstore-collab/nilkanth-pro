import React from "react";

const ShippingBanner = () => {
    return (
        <div className="w-full bg-[#EBD8A3] md:my-12 my-4 overflow-hidden">
            <div className="grid md:grid-cols-2 items-center">

                {/* LEFT SIDE - IMAGE */}
                <div className="w-full h-full flex justify-center items-center">
                    <img
                        src="https://cdn.shopify.com/s/files/1/0821/4767/2314/files/free_shipping_on_order_above_1000_5d7f0194-561a-4f3c-8960-44be1149ad59.webp?v=1773124138"
                        alt="Premium Sweets"
                        className="max-w-full h-auto object-contain"
                    />
                </div>

                {/* RIGHT SIDE - TEXT */}
                <div className="flex flex-col justify-self-center items-start md:px-10 px-4 md:py-16 py-8 space-y-6 text-start md:text-left">
                    <div className="flex flex-col gap-4">
                        <h2 className="font-nunito text-[#002B36] text-2xl md:text-3xl lg:text-4xl font-light">
                            Shop Now
                        </h2>

                        <p className="font-nunito text-[#334155] text-md md:text-lg max-w-md">
                            Fill Your Cart with Devotion – Get Free Shipping on Orders Above ₹999!
                        </p>

                        <button className="bg-[#700b10] hover:bg-[#5a090d] w-fit text-white md:px-10 px-4 md:py-4 py-2 rounded-full font-bold text-sm tracking-wider shadow-lg transition">
                            SHOP NOW
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShippingBanner;