"use client";
import React, { useState } from "react";
// import BestSeller from "@/components/BestSeller";
import { Mail, Phone, Loader2, CheckCircle } from "lucide-react";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        message: ""
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: "", text: "" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: "", text: "" });

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (data.success) {
                setStatus({ type: "success", text: data.message });
                setFormData({
                    firstName: "",
                    lastName: "",
                    phone: "",
                    email: "",
                    message: ""
                });
            } else {
                setStatus({ type: "error", text: data.message || "Failed to submit" });
            }
        } catch (error) {
            setStatus({ type: "error", text: "Something went wrong. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* 1. TOP BANNER SECTION */}
            <div className="max-w-[100rem] mx-auto mb-8">
                <div className="relative w-full h-[300px] md:h-[400px] lg:h-[450px] overflow-hidden rounded-none md:rounded-2xl bg-white shadow-md border-0 md:border border-yellow-100/50 flex items-center justify-center">
                    {/* Background Image */}
                    <img
                        src="https://cdn.shopify.com/s/files/1/0804/0867/4532/files/Untitled_design_64.webp?v=1774262255"
                        className="absolute inset-0 w-full h-full object-cover object-center"
                        alt="Contact Us Banner"
                    />

                    {/* Foreground Overlay Box */}
                    <div className="relative z-10 bg-white/85 backdrop-blur-sm px-6 sm:px-10 md:px-16 py-4 sm:py-6 md:py-8 rounded-xl md:rounded-2xl shadow-2xl border border-white/50 transform transition-all duration-700 hover:scale-105">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-tenor text-[#700b10] tracking-tight">
                            Contact Us
                        </h1>
                    </div>
                </div>
            </div>

            <div className="w-full bg-[#f3f3f3] py-14 px-4">
                <div className="max-w-xl mx-auto text-center">

                    {/* Feedback Message */}
                    {status.text && (
                        <div className={`mb-6 p-4 rounded-md text-sm flex items-center gap-2 ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                            {status.type === 'success' ? <CheckCircle size={18} /> : null}
                            {status.text}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">

                        <input
                            type="text"
                            name="firstName"
                            placeholder="First name"
                            required
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-4 py-3 bg-white focus:outline-none"
                        />

                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last name"
                            required
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-4 py-3 bg-white focus:outline-none"
                        />

                        {/* Phone Section */}
                        <div className="flex gap-3">
                            <div className="flex items-center justify-center w-20 border border-gray-300 rounded-md bg-white">
                                🇮🇳
                            </div>

                            <input
                                type="text"
                                name="phone"
                                placeholder="Phone +91"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                className="flex-1 border border-gray-300 rounded-md px-4 py-3 bg-white focus:outline-none"
                            />
                        </div>

                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-4 py-3 bg-white focus:outline-none"
                        />

                        <textarea
                            name="message"
                            placeholder="Enquiry Message"
                            rows="3"
                            required
                            value={formData.message}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-4 py-3 bg-white focus:outline-none"
                        />

                        {/* Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#1f1f1f] text-white py-3 rounded-md hover:bg-black transition flex items-center justify-center gap-2 disabled:bg-gray-500"
                        >
                            {loading && <Loader2 className="animate-spin" size={18} />}
                            {loading ? "Submitting..." : "Submit"}
                        </button>
                    </form>
                </div>

                {/* Contact Info Box */}
                <div className="max-w-5xl mx-auto mt-14 bg-[#ececec] rounded-xl py-10 px-6 text-center">

                    <div className="flex items-center justify-center gap-2 mb-3">
                        <Mail size={18} />
                        <span>
                            <strong>Email:</strong>{" "}
                            <a
                                href="mailto:bprasadam@sgrs.org"
                                className="text-blue-600"
                            >
                                contact@nilkanthstore.com
                            </a>
                        </span>
                    </div>

                    <div className="flex items-center justify-center gap-2 mb-3">
                        <Phone size={18} />
                        <span>
                            <strong>Phone:</strong>{" "}
                            <a href="tel:+918866794111" className="text-blue-600">
                                +91 88667 94111
                            </a>
                        </span>
                    </div>

                    <p className="font-medium">Time: 8:30 to 6:00</p>
                </div>
            </div>
            <section className="relative w-full h-[300px] sm:h-[400px] md:h-[500px]">

                {/* Google Map */}
                <iframe
                    src="https://www.google.com/maps?q=Nilkanth%20Store%20NiketanDham%20Rd%20Poicha%20Rajpipla&output=embed"
                    className="w-full h-full border-0"
                    loading="lazy"
                />

                {/* Location Card */}
                {/* <div className="
    absolute 
    left-1/2 md:left-10 
    bottom-4 md:top-1/2 
    -translate-x-1/2 md:translate-x-0 
    md:-translate-y-1/2 
    bg-white shadow-xl rounded-xl 
    p-4 sm:p-6 md:p-8 
    w-[90%] sm:max-w-md
  ">

                    <h2 className="text-xl sm:text-2xl md:text-3xl font-nunito font-semibold mb-3 sm:mb-4 text-center">
                        Our Location
                    </h2>

                    <p className="text-center text-gray-700 text-sm sm:text-base mb-4 sm:mb-6">
                        Nilkanth Store NiketanDham Rd, Poicha, Rajpipla,<br />
                        Gujarat 393145
                    </p>

                    <div className="flex justify-center">
                        <a
                            href="https://maps.google.com/?q=Nilkanth+Store+Poicha"
                            target="_blank"
                            className="bg-[#8B0000] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-full flex items-center gap-2 text-sm sm:text-base hover:bg-red-800 transition"
                        >
                            📍 GET DIRECTIONS
                        </a>
                    </div>

                </div> */}

            </section>
            {/* <BestSeller /> */}

        </>
    );
}