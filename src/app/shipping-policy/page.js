// src\app\shipping-policy\page.js

import React from 'react';
import { FiTruck, FiClock, FiMapPin, FiPackage, FiInfo, FiMail, FiPhone, FiCheckCircle } from 'react-icons/fi';

export const metadata = {
    title: "Shipping Policy – Nilkanth Store Trade Name : ILAVIZ",
    description: "Learn about our shipping and delivery procedures at Nilkanth Store Trade Name : ILAVIZ. We offer reliable shipping services across India.",
};

export default function ShippingPolicyPage() {
    return (
        <main className="min-h-screen bg-[#FDFBF7] pb-20">
            {/* Header Section */}
            <header className="bg-[#700b10] text-white py-16 md:py-24 text-center px-4">
                <div className="max-w-4xl mx-auto space-y-4">
                    <h1 className="text-4xl md:text-6xl font-tenor tracking-tight uppercase">Shipping Policy</h1>
                    <div className="w-24 h-1 bg-[#EBD99C] mx-auto opacity-80"></div>
                    <p className="text-[#EBD99C] font-nunito font-semibold text-lg md:text-xl tracking-wide pt-4 opacity-90">
                        Effective Date: <span className="text-white">June 1, 2025</span>
                    </p>
                </div>
            </header>

            <article className="max-w-5xl mx-auto px-3 sm:px-6 md:px-8 mt-[-3rem]">
                <div className="bg-white rounded-3xl shadow-2xl p-5 sm:p-8 md:p-12 space-y-8 sm:space-y-12">
                    
                    {/* Introduction */}
                    <section className="text-center max-w-3xl mx-auto">
                        <p className="text-gray-600 text-lg md:text-xl leading-relaxed font-nunito">
                            Thank you for choosing <span className="text-[#700b10] font-bold">Nilkanth Store Trade Name : ILAVIZ</span> for your spiritual and wellness needs. Our Shipping Policy outlines the details of how we handle shipping and delivery of our products.
                        </p>
                    </section>

                    {/* Quick Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Processing Time */}
                        <div className="bg-[#FDFBF7] p-8 rounded-2xl border border-yellow-100/50 hover:shadow-md transition-shadow group">
                            <div className="flex items-center gap-4 mb-4">
                                <span className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
                                    <FiClock size={24} />
                                </span>
                                <h2 className="text-2xl font-tenor text-[#700b10]">Processing Time</h2>
                            </div>
                            <p className="text-gray-600 font-nunito leading-relaxed">
                                Orders are typically processed within <span className="text-[#700b10] font-bold">1–2 business days</span> from the date of purchase. Note that this may vary during peak seasons or holidays.
                            </p>
                        </div>

                        {/* Delivery Time */}
                        <div className="bg-[#FDFBF7] p-8 rounded-2xl border border-yellow-100/50 hover:shadow-md transition-shadow group">
                            <div className="flex items-center gap-4 mb-4">
                                <span className="p-3 bg-green-50 text-green-600 rounded-xl group-hover:scale-110 transition-transform">
                                    <FiTruck size={24} />
                                </span>
                                <h2 className="text-2xl font-tenor text-[#700b10]">Delivery Time</h2>
                            </div>
                            <p className="text-gray-600 font-nunito leading-relaxed">
                                Typically, orders are delivered within <span className="text-[#700b10] font-bold">5–10 business days</span> after processing, depending on your location and selected method.
                            </p>
                        </div>
                    </div>

                    {/* Policy Sections */}
                    <div className="space-y-12">
                        {/* Shipping Destinations */}
                        <section className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="p-4 bg-yellow-50 text-[#C5A358] rounded-2xl flex-shrink-0">
                                <FiMapPin size={32} />
                            </div>
                            <div className="space-y-3">
                                <h2 className="text-2xl font-tenor text-[#700b10]">Shipping Destinations</h2>
                                <p className="text-gray-600 font-nunito leading-relaxed">
                                    Nilkanth Store Trade Name : ILAVIZ currently offers shipping within India. We are committed to providing reliable and efficient shipping services to our valued customers across the country.
                                </p>
                            </div>
                        </section>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-gray-100 pt-12">
                            {/* Shipping Methods */}
                            <section className="space-y-4">
                                <h3 className="text-xl font-tenor text-[#700b10] flex items-center gap-2">
                                    <FiCheckCircle className="text-[#C5A358]" /> Shipping Methods
                                </h3>
                                <p className="text-gray-600 font-nunito leading-relaxed">
                                    We partner with trusted logistics providers to ensure the safe and timely delivery of your orders. Available methods will be displayed during checkout.
                                </p>
                            </section>

                            {/* Shipping Charges */}
                            <section className="space-y-4">
                                <h3 className="text-xl font-tenor text-[#700b10] flex items-center gap-2">
                                    <FiCheckCircle className="text-[#C5A358]" /> Shipping Charges
                                </h3>
                                <p className="text-gray-600 font-nunito leading-relaxed">
                                    Charges are calculated based on product weight, destination, and method. Total cost is displayed at checkout before completion.
                                </p>
                            </section>
                        </div>

                        {/* Order Tracking */}
                        <section className="bg-[#700b10]/5 p-8 rounded-3xl border border-[#700b10]/10 flex flex-col md:flex-row gap-8 items-center">
                            <div className="text-[#700b10] flex-shrink-0">
                                <FiPackage size={48} strokeWidth={1} />
                            </div>
                            <div className="space-y-3">
                                <h2 className="text-2xl font-tenor text-[#700b10]">Order Tracking</h2>
                                <p className="text-gray-700 font-nunito leading-relaxed">
                                    Once shipped, you'll receive a confirmation email with a tracking number and link. You can also track your order via the "Order History" in your Nilkanth Store Trade Name : ILAVIZ account.
                                </p>
                            </div>
                        </section>

                        {/* Logistics Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-gray-100 pt-12">
                            <section className="space-y-3">
                                <h2 className="text-xl font-tenor text-[#700b10]">Delivery Attempts</h2>
                                <p className="text-gray-600 font-nunito leading-relaxed">
                                    Our partners make reasonable attempts to deliver. If you're unavailable, they may leave a notification or contact you to reschedule.
                                </p>
                            </section>
                            <section className="space-y-3">
                                <h2 className="text-xl font-tenor text-[#700b10]">Shipping Updates</h2>
                                <p className="text-gray-600 font-nunito leading-relaxed">
                                    We provide regular updates via email, including order confirmation, shipment notification, and relevant tracking info.
                                </p>
                            </section>
                        </div>

                        {/* Shipping Restrictions */}
                        <section className="bg-red-50 p-6 rounded-2xl border border-red-100 flex items-start gap-4">
                            <FiInfo className="text-red-600 mt-1 flex-shrink-0" size={20} />
                            <div className="space-y-1">
                                <h2 className="text-lg font-bold font-tenor text-red-800">Shipping Restrictions</h2>
                                <p className="text-red-700 font-nunito text-sm leading-relaxed">
                                    Certain locations may be unavailable due to legal or logistical restrictions. We will notify you promptly and process a refund if your location is affected.
                                </p>
                            </div>
                        </section>
                    </div>

                    {/* Contact Section */}
                    <section className="bg-[#700b10] text-white p-8 md:p-12 rounded-[2rem] text-center space-y-8">
                        <h2 className="text-3xl font-tenor">Contact Information</h2>
                        <p className="font-nunito opacity-90 max-w-2xl mx-auto">
                            If you have any questions or concerns regarding our Shipping Policy, please contact our customer support team at:
                        </p>
                        <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-16 pt-4">
                            <a href="mailto:shrinilkanthstore@gmail.com" className="flex items-center justify-center gap-3 hover:text-[#EBD99C] transition-colors group">
                                <span className="p-3 bg-white/10 rounded-full group-hover:bg-[#EBD99C]/20"><FiMail size={22} /></span>
                                <span className="text-lg font-nunito font-semibold">shrinilkanthstore@gmail.com</span>
                            </a>
                            <a href="tel:+918238811190" className="flex items-center justify-center gap-3 hover:text-[#EBD99C] transition-colors group">
                                <span className="p-3 bg-white/10 rounded-full group-hover:bg-[#EBD99C]/20"><FiPhone size={22} /></span>
                                <span className="text-lg font-nunito font-semibold">+91 82388 11190</span>
                            </a>
                        </div>
                    </section>

                    <footer className="pt-12 text-center text-gray-500 font-nunito max-w-2xl mx-auto">
                        <p className="text-sm mb-6">
                            Nilkanth Store Trade Name : ILAVIZ reserves the right to modify this Shipping Policy. Any changes will be effective immediately upon posting on the website.
                        </p>
                        <p className="text-[#C5A358] font-bold text-lg md:text-xl italic">
                            Thank you for choosing Nilkanth Store Trade Name : ILAVIZ. 
                            <br />
                            We strive to provide you with an exceptional shopping experience.
                        </p>
                    </footer>
                </div>
            </article>
        </main>
    );
}



// // src\app\shipping-policy\page.js



// import React from 'react';
// import { FiTruck, FiClock, FiMapPin, FiPackage, FiInfo, FiMail, FiPhone, FiCheckCircle } from 'react-icons/fi';

// export const metadata = {
//     title: "Shipping Policy – Nilkanth Store by ILAVIZ",
//     description: "Learn about our shipping and delivery procedures at Nilkanth Store by ILAVIZ. We offer reliable shipping services across India.",
// };

// export default function ShippingPolicyPage() {
//     return (
//         <main className="min-h-screen bg-[#FDFBF7] pb-20">
//             {/* Header Section */}
//             <header className="bg-[#700b10] text-white py-16 md:py-24 text-center px-4">
//                 <div className="max-w-4xl mx-auto space-y-4">
//                     <h1 className="text-4xl md:text-6xl font-tenor tracking-tight uppercase">Shipping Policy</h1>
//                     <div className="w-24 h-1 bg-[#EBD99C] mx-auto opacity-80"></div>
//                     <p className="text-[#EBD99C] font-nunito font-semibold text-lg md:text-xl tracking-wide pt-4 opacity-90">
//                         Effective Date: <span className="text-white">June 1, 2025</span>
//                     </p>
//                 </div>
//             </header>

//             <article className="max-w-5xl mx-auto px-4 md:px-8 mt-[-3rem]">
//                 <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 space-y-12">
                    
//                     {/* Introduction */}
//                     <section className="text-center max-w-3xl mx-auto">
//                         <p className="text-gray-600 text-lg md:text-xl leading-relaxed font-nunito">
//                             Thank you for choosing <span className="text-[#700b10] font-bold">Nilkanth Store by ILAVIZ</span> for your spiritual and wellness needs. Our Shipping Policy outlines the details of how we handle shipping and delivery of our products.
//                         </p>
//                     </section>

//                     {/* Quick Info Grid */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                         {/* Processing Time */}
//                         <div className="bg-[#FDFBF7] p-8 rounded-2xl border border-yellow-100/50 hover:shadow-md transition-shadow group">
//                             <div className="flex items-center gap-4 mb-4">
//                                 <span className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
//                                     <FiClock size={24} />
//                                 </span>
//                                 <h2 className="text-2xl font-tenor text-[#700b10]">Processing Time</h2>
//                             </div>
//                             <p className="text-gray-600 font-nunito leading-relaxed">
//                                 Orders are typically processed within <span className="text-[#700b10] font-bold">1–2 business days</span> from the date of purchase. Note that this may vary during peak seasons or holidays.
//                             </p>
//                         </div>

//                         {/* Delivery Time */}
//                         <div className="bg-[#FDFBF7] p-8 rounded-2xl border border-yellow-100/50 hover:shadow-md transition-shadow group">
//                             <div className="flex items-center gap-4 mb-4">
//                                 <span className="p-3 bg-green-50 text-green-600 rounded-xl group-hover:scale-110 transition-transform">
//                                     <FiTruck size={24} />
//                                 </span>
//                                 <h2 className="text-2xl font-tenor text-[#700b10]">Delivery Time</h2>
//                             </div>
//                             <p className="text-gray-600 font-nunito leading-relaxed">
//                                 Typically, orders are delivered within <span className="text-[#700b10] font-bold">5–10 business days</span> after processing, depending on your location and selected method.
//                             </p>
//                         </div>
//                     </div>

//                     {/* Policy Sections */}
//                     <div className="space-y-12">
//                         {/* Shipping Destinations */}
//                         <section className="flex flex-col md:flex-row gap-6 items-start">
//                             <div className="p-4 bg-yellow-50 text-[#C5A358] rounded-2xl flex-shrink-0">
//                                 <FiMapPin size={32} />
//                             </div>
//                             <div className="space-y-3">
//                                 <h2 className="text-2xl font-tenor text-[#700b10]">Shipping Destinations</h2>
//                                 <p className="text-gray-600 font-nunito leading-relaxed">
//                                     Nilkanth Store by ILAVIZ currently offers shipping within India. We are committed to providing reliable and efficient shipping services to our valued customers across the country.
//                                 </p>
//                             </div>
//                         </section>

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-gray-100 pt-12">
//                             {/* Shipping Methods */}
//                             <section className="space-y-4">
//                                 <h3 className="text-xl font-tenor text-[#700b10] flex items-center gap-2">
//                                     <FiCheckCircle className="text-[#C5A358]" /> Shipping Methods
//                                 </h3>
//                                 <p className="text-gray-600 font-nunito leading-relaxed">
//                                     We partner with trusted logistics providers to ensure the safe and timely delivery of your orders. Available methods will be displayed during checkout.
//                                 </p>
//                             </section>

//                             {/* Shipping Charges */}
//                             <section className="space-y-4">
//                                 <h3 className="text-xl font-tenor text-[#700b10] flex items-center gap-2">
//                                     <FiCheckCircle className="text-[#C5A358]" /> Shipping Charges
//                                 </h3>
//                                 <p className="text-gray-600 font-nunito leading-relaxed">
//                                     Charges are calculated based on product weight, destination, and method. Total cost is displayed at checkout before completion.
//                                 </p>
//                             </section>
//                         </div>

//                         {/* Order Tracking */}
//                         <section className="bg-[#700b10]/5 p-8 rounded-3xl border border-[#700b10]/10 flex flex-col md:flex-row gap-8 items-center">
//                             <div className="text-[#700b10] flex-shrink-0">
//                                 <FiPackage size={48} strokeWidth={1} />
//                             </div>
//                             <div className="space-y-3">
//                                 <h2 className="text-2xl font-tenor text-[#700b10]">Order Tracking</h2>
//                                 <p className="text-gray-700 font-nunito leading-relaxed">
//                                     Once shipped, you'll receive a confirmation email with a tracking number and link. You can also track your order via the "Order History" in your Nilkanth Store by ILAVIZ account.
//                                 </p>
//                             </div>
//                         </section>

//                         {/* Logistics Details */}
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-gray-100 pt-12">
//                             <section className="space-y-3">
//                                 <h2 className="text-xl font-tenor text-[#700b10]">Delivery Attempts</h2>
//                                 <p className="text-gray-600 font-nunito leading-relaxed">
//                                     Our partners make reasonable attempts to deliver. If you're unavailable, they may leave a notification or contact you to reschedule.
//                                 </p>
//                             </section>
//                             <section className="space-y-3">
//                                 <h2 className="text-xl font-tenor text-[#700b10]">Shipping Updates</h2>
//                                 <p className="text-gray-600 font-nunito leading-relaxed">
//                                     We provide regular updates via email, including order confirmation, shipment notification, and relevant tracking info.
//                                 </p>
//                             </section>
//                         </div>

//                         {/* Shipping Restrictions */}
//                         <section className="bg-red-50 p-6 rounded-2xl border border-red-100 flex items-start gap-4">
//                             <FiInfo className="text-red-600 mt-1 flex-shrink-0" size={20} />
//                             <div className="space-y-1">
//                                 <h2 className="text-lg font-bold font-tenor text-red-800">Shipping Restrictions</h2>
//                                 <p className="text-red-700 font-nunito text-sm leading-relaxed">
//                                     Certain locations may be unavailable due to legal or logistical restrictions. We will notify you promptly and process a refund if your location is affected.
//                                 </p>
//                             </div>
//                         </section>
//                     </div>

//                     {/* Contact Section */}
//                     <section className="bg-[#700b10] text-white p-8 md:p-12 rounded-[2rem] text-center space-y-8">
//                         <h2 className="text-3xl font-tenor">Contact Information</h2>
//                         <p className="font-nunito opacity-90 max-w-2xl mx-auto">
//                             If you have any questions or concerns regarding our Shipping Policy, please contact our customer support team at:
//                         </p>
//                         <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-16 pt-4">
//                             <a href="mailto:shrinilkanthstore@gmail.com" className="flex items-center justify-center gap-3 hover:text-[#EBD99C] transition-colors group">
//                                 <span className="p-3 bg-white/10 rounded-full group-hover:bg-[#EBD99C]/20"><FiMail size={22} /></span>
//                                 <span className="text-lg font-nunito font-semibold">shrinilkanthstore@gmail.com</span>
//                             </a>
//                             <a href="tel:+918238811190" className="flex items-center justify-center gap-3 hover:text-[#EBD99C] transition-colors group">
//                                 <span className="p-3 bg-white/10 rounded-full group-hover:bg-[#EBD99C]/20"><FiPhone size={22} /></span>
//                                 <span className="text-lg font-nunito font-semibold">+91 82388 11190</span>
//                             </a>
//                         </div>
//                     </section>

//                     <footer className="pt-12 text-center text-gray-500 font-nunito max-w-2xl mx-auto">
//                         <p className="text-sm mb-6">
//                             Nilkanth Store by ILAVIZ reserves the right to modify this Shipping Policy. Any changes will be effective immediately upon posting on the website.
//                         </p>
//                         <p className="text-[#C5A358] font-bold text-lg md:text-xl italic">
//                             Thank you for choosing Nilkanth Store by ILAVIZ. 
//                             <br />
//                             We strive to provide you with an exceptional shopping experience.
//                         </p>
//                     </footer>
//                 </div>
//             </article>
//         </main>
//     );
// }


// // import React from 'react';
// // import { FiTruck, FiClock, FiMapPin, FiPackage, FiInfo, FiMail, FiPhone, FiCheckCircle } from 'react-icons/fi';

// // export const metadata = {
// //     title: "Shipping Policy – Shri Nilkanth Store",
// //     description: "Learn about our shipping and delivery procedures at Shri Nilkanth Store. We offer reliable shipping services across India.",
// // };

// // export default function ShippingPolicyPage() {
// //     return (
// //         <main className="min-h-screen bg-[#FDFBF7] pb-20">
// //             {/* Header Section */}
// //             <header className="bg-[#700b10] text-white py-16 md:py-24 text-center px-4">
// //                 <div className="max-w-4xl mx-auto space-y-4">
// //                     <h1 className="text-4xl md:text-6xl font-tenor tracking-tight uppercase">Shipping Policy</h1>
// //                     <div className="w-24 h-1 bg-[#EBD99C] mx-auto opacity-80"></div>
// //                     <p className="text-[#EBD99C] font-nunito font-semibold text-lg md:text-xl tracking-wide pt-4 opacity-90">
// //                         Effective Date: <span className="text-white">June 1, 2025</span>
// //                     </p>
// //                 </div>
// //             </header>

// //             <article className="max-w-5xl mx-auto px-4 md:px-8 mt-[-3rem]">
// //                 <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 space-y-12">
                    
// //                     {/* Introduction */}
// //                     <section className="text-center max-w-3xl mx-auto">
// //                         <p className="text-gray-600 text-lg md:text-xl leading-relaxed font-nunito">
// //                             Thank you for choosing <span className="text-[#700b10] font-bold">Shri Nilkanth Store</span> for your spiritual and wellness needs. Our Shipping Policy outlines the details of how we handle shipping and delivery of our products.
// //                         </p>
// //                     </section>

// //                     {/* Quick Info Grid */}
// //                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
// //                         {/* Processing Time */}
// //                         <div className="bg-[#FDFBF7] p-8 rounded-2xl border border-yellow-100/50 hover:shadow-md transition-shadow group">
// //                             <div className="flex items-center gap-4 mb-4">
// //                                 <span className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
// //                                     <FiClock size={24} />
// //                                 </span>
// //                                 <h2 className="text-2xl font-tenor text-[#700b10]">Processing Time</h2>
// //                             </div>
// //                             <p className="text-gray-600 font-nunito leading-relaxed">
// //                                 Orders are typically processed within <span className="text-[#700b10] font-bold">1–2 business days</span> from the date of purchase. Note that this may vary during peak seasons or holidays.
// //                             </p>
// //                         </div>

// //                         {/* Delivery Time */}
// //                         <div className="bg-[#FDFBF7] p-8 rounded-2xl border border-yellow-100/50 hover:shadow-md transition-shadow group">
// //                             <div className="flex items-center gap-4 mb-4">
// //                                 <span className="p-3 bg-green-50 text-green-600 rounded-xl group-hover:scale-110 transition-transform">
// //                                     <FiTruck size={24} />
// //                                 </span>
// //                                 <h2 className="text-2xl font-tenor text-[#700b10]">Delivery Time</h2>
// //                             </div>
// //                             <p className="text-gray-600 font-nunito leading-relaxed">
// //                                 Typically, orders are delivered within <span className="text-[#700b10] font-bold">5–10 business days</span> after processing, depending on your location and selected method.
// //                             </p>
// //                         </div>
// //                     </div>

// //                     {/* Policy Sections */}
// //                     <div className="space-y-12">
// //                         {/* Shipping Destinations */}
// //                         <section className="flex flex-col md:flex-row gap-6 items-start">
// //                             <div className="p-4 bg-yellow-50 text-[#C5A358] rounded-2xl flex-shrink-0">
// //                                 <FiMapPin size={32} />
// //                             </div>
// //                             <div className="space-y-3">
// //                                 <h2 className="text-2xl font-tenor text-[#700b10]">Shipping Destinations</h2>
// //                                 <p className="text-gray-600 font-nunito leading-relaxed">
// //                                     Shri Nilkanth Store currently offers shipping within India. We are committed to providing reliable and efficient shipping services to our valued customers across the country.
// //                                 </p>
// //                             </div>
// //                         </section>

// //                         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-gray-100 pt-12">
// //                             {/* Shipping Methods */}
// //                             <section className="space-y-4">
// //                                 <h3 className="text-xl font-tenor text-[#700b10] flex items-center gap-2">
// //                                     <FiCheckCircle className="text-[#C5A358]" /> Shipping Methods
// //                                 </h3>
// //                                 <p className="text-gray-600 font-nunito leading-relaxed">
// //                                     We partner with trusted logistics providers to ensure the safe and timely delivery of your orders. Available methods will be displayed during checkout.
// //                                 </p>
// //                             </section>

// //                             {/* Shipping Charges */}
// //                             <section className="space-y-4">
// //                                 <h3 className="text-xl font-tenor text-[#700b10] flex items-center gap-2">
// //                                     <FiCheckCircle className="text-[#C5A358]" /> Shipping Charges
// //                                 </h3>
// //                                 <p className="text-gray-600 font-nunito leading-relaxed">
// //                                     Charges are calculated based on product weight, destination, and method. Total cost is displayed at checkout before completion.
// //                                 </p>
// //                             </section>
// //                         </div>

// //                         {/* Order Tracking */}
// //                         <section className="bg-[#700b10]/5 p-8 rounded-3xl border border-[#700b10]/10 flex flex-col md:flex-row gap-8 items-center">
// //                             <div className="text-[#700b10] flex-shrink-0">
// //                                 <FiPackage size={48} strokeWidth={1} />
// //                             </div>
// //                             <div className="space-y-3">
// //                                 <h2 className="text-2xl font-tenor text-[#700b10]">Order Tracking</h2>
// //                                 <p className="text-gray-700 font-nunito leading-relaxed">
// //                                     Once shipped, you'll receive a confirmation email with a tracking number and link. You can also track your order via the "Order History" in your Shri Nilkanth Store account.
// //                                 </p>
// //                             </div>
// //                         </section>

// //                         {/* Logistics Details */}
// //                         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-gray-100 pt-12">
// //                             <section className="space-y-3">
// //                                 <h2 className="text-xl font-tenor text-[#700b10]">Delivery Attempts</h2>
// //                                 <p className="text-gray-600 font-nunito leading-relaxed">
// //                                     Our partners make reasonable attempts to deliver. If you're unavailable, they may leave a notification or contact you to reschedule.
// //                                 </p>
// //                             </section>
// //                             <section className="space-y-3">
// //                                 <h2 className="text-xl font-tenor text-[#700b10]">Shipping Updates</h2>
// //                                 <p className="text-gray-600 font-nunito leading-relaxed">
// //                                     We provide regular updates via email, including order confirmation, shipment notification, and relevant tracking info.
// //                                 </p>
// //                             </section>
// //                         </div>

// //                         {/* Shipping Restrictions */}
// //                         <section className="bg-red-50 p-6 rounded-2xl border border-red-100 flex items-start gap-4">
// //                             <FiInfo className="text-red-600 mt-1 flex-shrink-0" size={20} />
// //                             <div className="space-y-1">
// //                                 <h2 className="text-lg font-bold font-tenor text-red-800">Shipping Restrictions</h2>
// //                                 <p className="text-red-700 font-nunito text-sm leading-relaxed">
// //                                     Certain locations may be unavailable due to legal or logistical restrictions. We will notify you promptly and process a refund if your location is affected.
// //                                 </p>
// //                             </div>
// //                         </section>
// //                     </div>

// //                     {/* Contact Section */}
// //                     <section className="bg-[#700b10] text-white p-8 md:p-12 rounded-[2rem] text-center space-y-8">
// //                         <h2 className="text-3xl font-tenor">Contact Information</h2>
// //                         <p className="font-nunito opacity-90 max-w-2xl mx-auto">
// //                             If you have any questions or concerns regarding our Shipping Policy, please contact our customer support team at:
// //                         </p>
// //                         <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-16 pt-4">
// //                             <a href="mailto:shrinilkanthstore@gmail.com" className="flex items-center justify-center gap-3 hover:text-[#EBD99C] transition-colors group">
// //                                 <span className="p-3 bg-white/10 rounded-full group-hover:bg-[#EBD99C]/20"><FiMail size={22} /></span>
// //                                 <span className="text-lg font-nunito font-semibold">shrinilkanthstore@gmail.com</span>
// //                             </a>
// //                             <a href="tel:+918238811190" className="flex items-center justify-center gap-3 hover:text-[#EBD99C] transition-colors group">
// //                                 <span className="p-3 bg-white/10 rounded-full group-hover:bg-[#EBD99C]/20"><FiPhone size={22} /></span>
// //                                 <span className="text-lg font-nunito font-semibold">+91 82388 11190</span>
// //                             </a>
// //                         </div>
// //                     </section>

// //                     <footer className="pt-12 text-center text-gray-500 font-nunito max-w-2xl mx-auto">
// //                         <p className="text-sm mb-6">
// //                             Shri Nilkanth Store reserves the right to modify this Shipping Policy. Any changes will be effective immediately upon posting on the website.
// //                         </p>
// //                         <p className="text-[#C5A358] font-bold text-lg md:text-xl italic">
// //                             Thank you for choosing Shri Nilkanth Store. 
// //                             <br />
// //                             We strive to provide you with an exceptional shopping experience.
// //                         </p>
// //                     </footer>
// //                 </div>
// //             </article>
// //         </main>
// //     );
// // }
