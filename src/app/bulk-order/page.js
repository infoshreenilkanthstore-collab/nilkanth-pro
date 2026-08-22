"use client";
import React, { useState } from "react";
import BestSeller from "../../components/BestSeller";

export default function BulkOrderPage() {
    const [formData, setFormData] = useState({
        fullName: "",
        phoneNumber: "",
        requiredProduct: "",
        quantity: "",
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/bulk-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success) {
                alert("Bulk order enquiry submitted successfully!");
                setFormData({
                    fullName: "",
                    phoneNumber: "",
                    requiredProduct: "",
                    quantity: "",
                    message: ""
                });
            } else {
                alert(data.message || "Failed to submit enquiry");
            }
        } catch (error) {
            console.error("Bulk Order Error:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (<>
        <div className="w-full bg-white md:py-16 py-6 px-4">
            <div className="max-w-xl mx-auto text-center">

                {/* Title */}
                <h1 className="text-xl font-semibold mb-8 uppercase tracking-widest text-[#8B0000]">Bulk Order Enquiry</h1>

                {/* Form */}
                <form className="space-y-4" onSubmit={handleSubmit}>

                    {/* Full Name */}
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        placeholder="Full name"
                        className="w-full border border-gray-300 rounded-md px-4 py-3 bg-white focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
                    />

                    {/* Phone Row */}
                    <div className="flex gap-3">
                        <div className="flex items-center justify-center w-20 border border-gray-300 rounded-md bg-white">
                            🇮🇳
                        </div>

                        <input
                            type="text"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            required
                            placeholder="Phone +91"
                            className="flex-1 border border-gray-300 rounded-md px-4 py-3 bg-white focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
                        />
                    </div>

                    {/* Required Product */}
                    <input
                        type="text"
                        name="requiredProduct"
                        value={formData.requiredProduct}
                        onChange={handleInputChange}
                        required
                        placeholder="Required Product"
                        className="w-full border border-gray-300 rounded-md px-4 py-3 bg-white focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
                    />

                    {/* Quantity */}
                    <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        required
                        placeholder="Quantity"
                        className="w-full border border-gray-300 rounded-md px-4 py-3 bg-white focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
                    />

                    {/* Message */}
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows="3"
                        placeholder="Enquiry Message (Optional)"
                        className="w-full border border-gray-300 rounded-md px-4 py-3 bg-white focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
                    />

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#8B0000] text-white py-4 rounded-md hover:bg-[#700000] transition font-bold uppercase tracking-widest disabled:bg-gray-400"
                    >
                        {isSubmitting ? "Submitting..." : "Submit Enquiry"}
                    </button>

                </form>

            </div>

        </div>
        <BestSeller />
    </>
    );
}
