// src\app\return-policy\page.js



import React from 'react';
import { FiPackage, FiRefreshCw, FiAlertCircle, FiTruck, FiCreditCard, FiMail, FiPhone } from 'react-icons/fi';

export const metadata = {
    title: "Return Policy – Nilkanth Store Trade Name : ILAVIZ",
    description: "Our straightforward return policy at Nilkanth Store Trade Name : ILAVIZ to ensure your satisfaction with every purchase.",
};

export default function ReturnPolicyPage() {
    return (
        <main className="min-h-screen bg-[#FDFBF7] pb-20">
            {/* Header Section */}
            <header className="bg-[#700b10] text-white py-16 md:py-24 text-center px-4">
                <div className="max-w-4xl mx-auto space-y-4">
                    <h1 className="text-4xl md:text-6xl font-tenor tracking-tight">Return Policy</h1>
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
                            At <span className="text-[#700b10] font-bold">Nilkanth Store Trade Name : ILAVIZ</span>, we value our customers and aim to ensure your satisfaction with every purchase. If for any reason you are not completely satisfied with your purchase, we offer a straightforward return policy to make the process as simple as possible.
                        </p>
                    </section>

                    {/* Eligibility & Non-Returnable Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                        {/* Eligibility */}
                        <div className="bg-[#FDFBF7] p-8 rounded-2xl border border-yellow-100/50 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4 mb-6">
                                <span className="p-3 bg-green-100 text-green-700 rounded-xl">
                                    <FiPackage size={24} />
                                </span>
                                <h2 className="text-2xl font-tenor text-[#700b10]">Eligibility for Returns</h2>
                            </div>
                            <ul className="space-y-4 text-gray-600 font-nunito font-medium">
                                <li className="flex items-start gap-3">
                                    <span className="mt-1 w-1.5 h-1.5 bg-[#C5A358] rounded-full flex-shrink-0" />
                                    The item must be in its original packaging.
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-1 w-1.5 h-1.5 bg-[#C5A358] rounded-full flex-shrink-0" />
                                    The item must be unused and in the same condition as received.
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-1 w-1.5 h-1.5 bg-[#C5A358] rounded-full flex-shrink-0" />
                                    You must initiate the return process within 1 day from the date of delivery.
                                </li>
                            </ul>
                        </div>

                        {/* Non-Returnable */}
                        <div className="bg-[#FDFBF7] p-8 rounded-2xl border border-red-50/50 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4 mb-6">
                                <span className="p-3 bg-red-50 text-red-600 rounded-xl">
                                    <FiAlertCircle size={24} />
                                </span>
                                <h2 className="text-2xl font-tenor text-[#700b10]">Non-Returnable Items</h2>
                            </div>
                            <ul className="space-y-4 text-gray-600 font-nunito font-medium">
                                <li className="flex items-start gap-3">
                                    <span className="mt-1 w-1.5 h-1.5 bg-[#C5A358] rounded-full flex-shrink-0" />
                                    Items marked as final sale or clearance.
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-1 w-1.5 h-1.5 bg-[#C5A358] rounded-full flex-shrink-0" />
                                    Customized or personalized items.
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-1 w-1.5 h-1.5 bg-[#C5A358] rounded-full flex-shrink-0" />
                                    Items damaged due to misuse, accidents, or neglect.
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Return Process */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                            <span className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                <FiRefreshCw size={24} />
                            </span>
                            <h2 className="text-2xl md:text-3xl font-tenor text-[#700b10]">Return Process</h2>
                        </div>
                        <p className="text-gray-600 font-nunito leading-loose">
                            To start a return, please follow these steps:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { step: "01", text: "Contact our customer support team at shrinilkanthstore@gmail.com." },
                                { step: "02", text: "Provide your order number, details of the item(s), and reason for return." },
                                { step: "03", text: "Follow our team's guidance to receive your return authorization." }
                            ].map((item, idx) => (
                                <div key={idx} className="relative p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
                                    <span className="absolute top-4 right-4 text-4xl font-tenor text-gray-100 font-black">{item.step}</span>
                                    <p className="text-gray-700 font-nunito font-medium relative z-10">{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Shipping & Refund Column */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
                        {/* Return Shipping */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <FiTruck className="text-[#C5A358]" size={22} />
                                <h2 className="text-xl font-tenor text-[#700b10]">Return Shipping</h2>
                            </div>
                            <p className="text-gray-600 font-nunito leading-relaxed">
                                Customers are responsible for the cost of return shipping unless the return is due to an error on our part or a defective product. For your protection, we recommend using a trackable shipping service when returning items.
                            </p>
                        </div>

                        {/* Refund Process */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <FiCreditCard className="text-[#C5A358]" size={22} />
                                <h2 className="text-xl font-tenor text-[#700b10]">Refund Process</h2>
                            </div>
                            <p className="text-gray-600 font-nunito leading-relaxed">
                                Once we receive the returned item and confirm its eligibility, we will process your refund. Refunds will be issued to the original payment method used for the purchase.
                            </p>
                        </div>
                    </div>

                    {/* Important Info Sections */}
                    <div className="space-y-10 border-t border-gray-100 pt-12">
                        <section className="bg-yellow-50/30 p-8 rounded-2xl">
                            <h2 className="text-xl font-tenor text-[#700b10] mb-3">Refund Timeframe</h2>
                            <p className="text-gray-600 font-nunito">
                                Please allow up to <span className="font-bold text-[#700b10]">7 business days</span> for the refund to be processed and reflected in your account. The exact timeframe may vary depending on your payment provider.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-tenor text-[#700b10] mb-3">Damaged or Defective Items</h2>
                            <p className="text-gray-600 font-nunito leading-relaxed">
                                If you receive a damaged or defective item, please contact our customer support team immediately for assistance. We will arrange for a replacement or issue a refund, depending on the circumstances.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-tenor text-[#700b10] mb-3">Exchange Policy</h2>
                            <p className="text-gray-600 font-nunito leading-relaxed">
                                Currently, Nilkanth Store Trade Name : ILAVIZ does not offer exchanges. If you require a different item, color, or size, please initiate a return for the unwanted item and place a new order for the desired item.
                            </p>
                        </section>
                    </div>

                    {/* Contact Information */}
                    <section className="bg-[#700b10] text-white p-8 md:p-12 rounded-[2rem] text-center space-y-8">
                        <h2 className="text-3xl font-tenor">Contact Information</h2>
                        <p className="font-nunito opacity-90 max-w-2xl mx-auto">
                            If you have any questions or concerns regarding our Return Policy, please do not hesitate to contact our customer support team at:
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
                            Nilkanth Store Trade Name : ILAVIZ reserves the right to update or modify this Return Policy as needed. Any changes will be effective immediately upon posting on our website.
                        </p>
                        <p className="text-[#C5A358] font-bold text-lg md:text-xl italic">
                            Thank you for choosing Nilkanth Store Trade Name : ILAVIZ. 
                            <br />
                            We appreciate your business and strive to provide a hassle-free shopping experience for all our customers.
                        </p>
                    </footer>
                </div>
            </article>
        </main>
    );
}


// // src\app\return-policy\page.js



// import React from 'react';
// import { FiPackage, FiRefreshCw, FiAlertCircle, FiTruck, FiCreditCard, FiMail, FiPhone } from 'react-icons/fi';

// export const metadata = {
//     title: "Return Policy – Nilkanth Store by ILAVIZ",
//     description: "Our straightforward return policy at Nilkanth Store by ILAVIZ to ensure your satisfaction with every purchase.",
// };

// export default function ReturnPolicyPage() {
//     return (
//         <main className="min-h-screen bg-[#FDFBF7] pb-20">
//             {/* Header Section */}
//             <header className="bg-[#700b10] text-white py-16 md:py-24 text-center px-4">
//                 <div className="max-w-4xl mx-auto space-y-4">
//                     <h1 className="text-4xl md:text-6xl font-tenor tracking-tight">Return Policy</h1>
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
//                             At <span className="text-[#700b10] font-bold">Nilkanth Store by ILAVIZ</span>, we value our customers and aim to ensure your satisfaction with every purchase. If for any reason you are not completely satisfied with your purchase, we offer a straightforward return policy to make the process as simple as possible.
//                         </p>
//                     </section>

//                     {/* Eligibility & Non-Returnable Grid */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
//                         {/* Eligibility */}
//                         <div className="bg-[#FDFBF7] p-8 rounded-2xl border border-yellow-100/50 hover:shadow-md transition-shadow">
//                             <div className="flex items-center gap-4 mb-6">
//                                 <span className="p-3 bg-green-100 text-green-700 rounded-xl">
//                                     <FiPackage size={24} />
//                                 </span>
//                                 <h2 className="text-2xl font-tenor text-[#700b10]">Eligibility for Returns</h2>
//                             </div>
//                             <ul className="space-y-4 text-gray-600 font-nunito font-medium">
//                                 <li className="flex items-start gap-3">
//                                     <span className="mt-1 w-1.5 h-1.5 bg-[#C5A358] rounded-full flex-shrink-0" />
//                                     The item must be in its original packaging.
//                                 </li>
//                                 <li className="flex items-start gap-3">
//                                     <span className="mt-1 w-1.5 h-1.5 bg-[#C5A358] rounded-full flex-shrink-0" />
//                                     The item must be unused and in the same condition as received.
//                                 </li>
//                                 <li className="flex items-start gap-3">
//                                     <span className="mt-1 w-1.5 h-1.5 bg-[#C5A358] rounded-full flex-shrink-0" />
//                                     You must initiate the return process within 1 day from the date of delivery.
//                                 </li>
//                             </ul>
//                         </div>

//                         {/* Non-Returnable */}
//                         <div className="bg-[#FDFBF7] p-8 rounded-2xl border border-red-50/50 hover:shadow-md transition-shadow">
//                             <div className="flex items-center gap-4 mb-6">
//                                 <span className="p-3 bg-red-50 text-red-600 rounded-xl">
//                                     <FiAlertCircle size={24} />
//                                 </span>
//                                 <h2 className="text-2xl font-tenor text-[#700b10]">Non-Returnable Items</h2>
//                             </div>
//                             <ul className="space-y-4 text-gray-600 font-nunito font-medium">
//                                 <li className="flex items-start gap-3">
//                                     <span className="mt-1 w-1.5 h-1.5 bg-[#C5A358] rounded-full flex-shrink-0" />
//                                     Items marked as final sale or clearance.
//                                 </li>
//                                 <li className="flex items-start gap-3">
//                                     <span className="mt-1 w-1.5 h-1.5 bg-[#C5A358] rounded-full flex-shrink-0" />
//                                     Customized or personalized items.
//                                 </li>
//                                 <li className="flex items-start gap-3">
//                                     <span className="mt-1 w-1.5 h-1.5 bg-[#C5A358] rounded-full flex-shrink-0" />
//                                     Items damaged due to misuse, accidents, or neglect.
//                                 </li>
//                             </ul>
//                         </div>
//                     </div>

//                     {/* Return Process */}
//                     <section className="space-y-6">
//                         <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
//                             <span className="p-3 bg-blue-50 text-blue-600 rounded-xl">
//                                 <FiRefreshCw size={24} />
//                             </span>
//                             <h2 className="text-2xl md:text-3xl font-tenor text-[#700b10]">Return Process</h2>
//                         </div>
//                         <p className="text-gray-600 font-nunito leading-loose">
//                             To start a return, please follow these steps:
//                         </p>
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                             {[
//                                 { step: "01", text: "Contact our customer support team at shrinilkanthstore@gmail.com." },
//                                 { step: "02", text: "Provide your order number, details of the item(s), and reason for return." },
//                                 { step: "03", text: "Follow our team's guidance to receive your return authorization." }
//                             ].map((item, idx) => (
//                                 <div key={idx} className="relative p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
//                                     <span className="absolute top-4 right-4 text-4xl font-tenor text-gray-100 font-black">{item.step}</span>
//                                     <p className="text-gray-700 font-nunito font-medium relative z-10">{item.text}</p>
//                                 </div>
//                             ))}
//                         </div>
//                     </section>

//                     {/* Shipping & Refund Column */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
//                         {/* Return Shipping */}
//                         <div className="space-y-4">
//                             <div className="flex items-center gap-3">
//                                 <FiTruck className="text-[#C5A358]" size={22} />
//                                 <h2 className="text-xl font-tenor text-[#700b10]">Return Shipping</h2>
//                             </div>
//                             <p className="text-gray-600 font-nunito leading-relaxed">
//                                 Customers are responsible for the cost of return shipping unless the return is due to an error on our part or a defective product. For your protection, we recommend using a trackable shipping service when returning items.
//                             </p>
//                         </div>

//                         {/* Refund Process */}
//                         <div className="space-y-4">
//                             <div className="flex items-center gap-3">
//                                 <FiCreditCard className="text-[#C5A358]" size={22} />
//                                 <h2 className="text-xl font-tenor text-[#700b10]">Refund Process</h2>
//                             </div>
//                             <p className="text-gray-600 font-nunito leading-relaxed">
//                                 Once we receive the returned item and confirm its eligibility, we will process your refund. Refunds will be issued to the original payment method used for the purchase.
//                             </p>
//                         </div>
//                     </div>

//                     {/* Important Info Sections */}
//                     <div className="space-y-10 border-t border-gray-100 pt-12">
//                         <section className="bg-yellow-50/30 p-8 rounded-2xl">
//                             <h2 className="text-xl font-tenor text-[#700b10] mb-3">Refund Timeframe</h2>
//                             <p className="text-gray-600 font-nunito">
//                                 Please allow up to <span className="font-bold text-[#700b10]">7 business days</span> for the refund to be processed and reflected in your account. The exact timeframe may vary depending on your payment provider.
//                             </p>
//                         </section>

//                         <section>
//                             <h2 className="text-xl font-tenor text-[#700b10] mb-3">Damaged or Defective Items</h2>
//                             <p className="text-gray-600 font-nunito leading-relaxed">
//                                 If you receive a damaged or defective item, please contact our customer support team immediately for assistance. We will arrange for a replacement or issue a refund, depending on the circumstances.
//                             </p>
//                         </section>

//                         <section>
//                             <h2 className="text-xl font-tenor text-[#700b10] mb-3">Exchange Policy</h2>
//                             <p className="text-gray-600 font-nunito leading-relaxed">
//                                 Currently, Nilkanth Store by ILAVIZ does not offer exchanges. If you require a different item, color, or size, please initiate a return for the unwanted item and place a new order for the desired item.
//                             </p>
//                         </section>
//                     </div>

//                     {/* Contact Information */}
//                     <section className="bg-[#700b10] text-white p-8 md:p-12 rounded-[2rem] text-center space-y-8">
//                         <h2 className="text-3xl font-tenor">Contact Information</h2>
//                         <p className="font-nunito opacity-90 max-w-2xl mx-auto">
//                             If you have any questions or concerns regarding our Return Policy, please do not hesitate to contact our customer support team at:
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
//                             Nilkanth Store by ILAVIZ reserves the right to update or modify this Return Policy as needed. Any changes will be effective immediately upon posting on our website.
//                         </p>
//                         <p className="text-[#C5A358] font-bold text-lg md:text-xl italic">
//                             Thank you for choosing Nilkanth Store by ILAVIZ. 
//                             <br />
//                             We appreciate your business and strive to provide a hassle-free shopping experience for all our customers.
//                         </p>
//                     </footer>
//                 </div>
//             </article>
//         </main>
//     );
// }


// // import React from 'react';
// // import { FiPackage, FiRefreshCw, FiAlertCircle, FiTruck, FiCreditCard, FiMail, FiPhone } from 'react-icons/fi';

// // export const metadata = {
// //     title: "Return Policy – Shri Nilkanth Store",
// //     description: "Our straightforward return policy at Shri Nilkanth Store to ensure your satisfaction with every purchase.",
// // };

// // export default function ReturnPolicyPage() {
// //     return (
// //         <main className="min-h-screen bg-[#FDFBF7] pb-20">
// //             {/* Header Section */}
// //             <header className="bg-[#700b10] text-white py-16 md:py-24 text-center px-4">
// //                 <div className="max-w-4xl mx-auto space-y-4">
// //                     <h1 className="text-4xl md:text-6xl font-tenor tracking-tight">Return Policy</h1>
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
// //                             At <span className="text-[#700b10] font-bold">Shri Nilkanth Store</span>, we value our customers and aim to ensure your satisfaction with every purchase. If for any reason you are not completely satisfied with your purchase, we offer a straightforward return policy to make the process as simple as possible.
// //                         </p>
// //                     </section>

// //                     {/* Eligibility & Non-Returnable Grid */}
// //                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
// //                         {/* Eligibility */}
// //                         <div className="bg-[#FDFBF7] p-8 rounded-2xl border border-yellow-100/50 hover:shadow-md transition-shadow">
// //                             <div className="flex items-center gap-4 mb-6">
// //                                 <span className="p-3 bg-green-100 text-green-700 rounded-xl">
// //                                     <FiPackage size={24} />
// //                                 </span>
// //                                 <h2 className="text-2xl font-tenor text-[#700b10]">Eligibility for Returns</h2>
// //                             </div>
// //                             <ul className="space-y-4 text-gray-600 font-nunito font-medium">
// //                                 <li className="flex items-start gap-3">
// //                                     <span className="mt-1 w-1.5 h-1.5 bg-[#C5A358] rounded-full flex-shrink-0" />
// //                                     The item must be in its original packaging.
// //                                 </li>
// //                                 <li className="flex items-start gap-3">
// //                                     <span className="mt-1 w-1.5 h-1.5 bg-[#C5A358] rounded-full flex-shrink-0" />
// //                                     The item must be unused and in the same condition as received.
// //                                 </li>
// //                                 <li className="flex items-start gap-3">
// //                                     <span className="mt-1 w-1.5 h-1.5 bg-[#C5A358] rounded-full flex-shrink-0" />
// //                                     You must initiate the return process within 1 day from the date of delivery.
// //                                 </li>
// //                             </ul>
// //                         </div>

// //                         {/* Non-Returnable */}
// //                         <div className="bg-[#FDFBF7] p-8 rounded-2xl border border-red-50/50 hover:shadow-md transition-shadow">
// //                             <div className="flex items-center gap-4 mb-6">
// //                                 <span className="p-3 bg-red-50 text-red-600 rounded-xl">
// //                                     <FiAlertCircle size={24} />
// //                                 </span>
// //                                 <h2 className="text-2xl font-tenor text-[#700b10]">Non-Returnable Items</h2>
// //                             </div>
// //                             <ul className="space-y-4 text-gray-600 font-nunito font-medium">
// //                                 <li className="flex items-start gap-3">
// //                                     <span className="mt-1 w-1.5 h-1.5 bg-[#C5A358] rounded-full flex-shrink-0" />
// //                                     Items marked as final sale or clearance.
// //                                 </li>
// //                                 <li className="flex items-start gap-3">
// //                                     <span className="mt-1 w-1.5 h-1.5 bg-[#C5A358] rounded-full flex-shrink-0" />
// //                                     Customized or personalized items.
// //                                 </li>
// //                                 <li className="flex items-start gap-3">
// //                                     <span className="mt-1 w-1.5 h-1.5 bg-[#C5A358] rounded-full flex-shrink-0" />
// //                                     Items damaged due to misuse, accidents, or neglect.
// //                                 </li>
// //                             </ul>
// //                         </div>
// //                     </div>

// //                     {/* Return Process */}
// //                     <section className="space-y-6">
// //                         <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
// //                             <span className="p-3 bg-blue-50 text-blue-600 rounded-xl">
// //                                 <FiRefreshCw size={24} />
// //                             </span>
// //                             <h2 className="text-2xl md:text-3xl font-tenor text-[#700b10]">Return Process</h2>
// //                         </div>
// //                         <p className="text-gray-600 font-nunito leading-loose">
// //                             To start a return, please follow these steps:
// //                         </p>
// //                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //                             {[
// //                                 { step: "01", text: "Contact our customer support team at shrinilkanthstore@gmail.com." },
// //                                 { step: "02", text: "Provide your order number, details of the item(s), and reason for return." },
// //                                 { step: "03", text: "Follow our team's guidance to receive your return authorization." }
// //                             ].map((item, idx) => (
// //                                 <div key={idx} className="relative p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
// //                                     <span className="absolute top-4 right-4 text-4xl font-tenor text-gray-100 font-black">{item.step}</span>
// //                                     <p className="text-gray-700 font-nunito font-medium relative z-10">{item.text}</p>
// //                                 </div>
// //                             ))}
// //                         </div>
// //                     </section>

// //                     {/* Shipping & Refund Column */}
// //                     <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
// //                         {/* Return Shipping */}
// //                         <div className="space-y-4">
// //                             <div className="flex items-center gap-3">
// //                                 <FiTruck className="text-[#C5A358]" size={22} />
// //                                 <h2 className="text-xl font-tenor text-[#700b10]">Return Shipping</h2>
// //                             </div>
// //                             <p className="text-gray-600 font-nunito leading-relaxed">
// //                                 Customers are responsible for the cost of return shipping unless the return is due to an error on our part or a defective product. For your protection, we recommend using a trackable shipping service when returning items.
// //                             </p>
// //                         </div>

// //                         {/* Refund Process */}
// //                         <div className="space-y-4">
// //                             <div className="flex items-center gap-3">
// //                                 <FiCreditCard className="text-[#C5A358]" size={22} />
// //                                 <h2 className="text-xl font-tenor text-[#700b10]">Refund Process</h2>
// //                             </div>
// //                             <p className="text-gray-600 font-nunito leading-relaxed">
// //                                 Once we receive the returned item and confirm its eligibility, we will process your refund. Refunds will be issued to the original payment method used for the purchase.
// //                             </p>
// //                         </div>
// //                     </div>

// //                     {/* Important Info Sections */}
// //                     <div className="space-y-10 border-t border-gray-100 pt-12">
// //                         <section className="bg-yellow-50/30 p-8 rounded-2xl">
// //                             <h2 className="text-xl font-tenor text-[#700b10] mb-3">Refund Timeframe</h2>
// //                             <p className="text-gray-600 font-nunito">
// //                                 Please allow up to <span className="font-bold text-[#700b10]">7 business days</span> for the refund to be processed and reflected in your account. The exact timeframe may vary depending on your payment provider.
// //                             </p>
// //                         </section>

// //                         <section>
// //                             <h2 className="text-xl font-tenor text-[#700b10] mb-3">Damaged or Defective Items</h2>
// //                             <p className="text-gray-600 font-nunito leading-relaxed">
// //                                 If you receive a damaged or defective item, please contact our customer support team immediately for assistance. We will arrange for a replacement or issue a refund, depending on the circumstances.
// //                             </p>
// //                         </section>

// //                         <section>
// //                             <h2 className="text-xl font-tenor text-[#700b10] mb-3">Exchange Policy</h2>
// //                             <p className="text-gray-600 font-nunito leading-relaxed">
// //                                 Currently, Shri Nilkanth Store does not offer exchanges. If you require a different item, color, or size, please initiate a return for the unwanted item and place a new order for the desired item.
// //                             </p>
// //                         </section>
// //                     </div>

// //                     {/* Contact Information */}
// //                     <section className="bg-[#700b10] text-white p-8 md:p-12 rounded-[2rem] text-center space-y-8">
// //                         <h2 className="text-3xl font-tenor">Contact Information</h2>
// //                         <p className="font-nunito opacity-90 max-w-2xl mx-auto">
// //                             If you have any questions or concerns regarding our Return Policy, please do not hesitate to contact our customer support team at:
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
// //                             Shri Nilkanth Store reserves the right to update or modify this Return Policy as needed. Any changes will be effective immediately upon posting on our website.
// //                         </p>
// //                         <p className="text-[#C5A358] font-bold text-lg md:text-xl italic">
// //                             Thank you for choosing Shri Nilkanth Store. 
// //                             <br />
// //                             We appreciate your business and strive to provide a hassle-free shopping experience for all our customers.
// //                         </p>
// //                     </footer>
// //                 </div>
// //             </article>
// //         </main>
// //     );
// // }
