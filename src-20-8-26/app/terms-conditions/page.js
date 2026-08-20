// src\app\terms-conditions\page.js

import React from 'react';
import { FiInfo, FiShield, FiFileText, FiMapPin, FiMail, FiPhone } from 'react-icons/fi';

export const metadata = {
    title: "Terms & Conditions – Nilkanth Store Trade Name : ILAVIZ",
    description: "Please read our Terms and Conditions carefully to understand your rights and responsibilities when using Nilkanth Store Trade Name : ILAVIZ.",
};

export default function TermsConditionsPage() {
    const sections = [
        {
            id: "1",
            title: "SECTION 1 - ONLINE STORE TERMS",
            content: [
                "1.1 By agreeing to these Terms, you confirm that you are at least the age of majority in your state or province of residence.",
                "1.2 You may not use our products for any illegal or unauthorized purpose, nor violate any laws in your jurisdiction (including but not limited to copyright laws).",
                "1.3 You must not transmit any worms or viruses or any code of a destructive nature.",
                "1.4 A breach or violation of any of the Terms will result in an immediate termination of your Services."
            ]
        },
        {
            id: "2",
            title: "SECTION 2 - GENERAL CONDITIONS",
            content: [
                "2.1 We reserve the right to refuse service to anyone for any reason at any time.",
                "2.2 You understand that your content (not including credit card information) may be transferred unencrypted and involve (a) transmissions over various networks and (b) changes to conform and adapt to the technical requirements of connecting networks or devices.",
                "2.3 You agree not to reproduce, duplicate, copy, sell, resell, or exploit any portion of the Service, use of the Service, or access to the Service without express written permission by us."
            ]
        },
        {
            id: "3",
            title: "SECTION 3 - ACCURACY, COMPLETENESS AND TIMELINESS OF INFORMATION",
            content: [
                "3.1 We are not responsible if the information made available on this site is not accurate, complete, or current.",
                "3.2 The material on this site is provided for general information only and should not be relied upon as the sole basis for making decisions without consulting primary, more accurate, or more timely sources of information."
            ]
        },
        {
            id: "4",
            title: "SECTION 4 - MODIFICATIONS TO THE SERVICE AND PRICES",
            content: [
                "4.1 Prices for our products are subject to change without notice.",
                "4.2 We reserve the right to modify or discontinue the Service (or any part or content thereof) without notice at any time.",
                "4.3 We shall not be liable to you or to any third party for any modification, price change, suspension, or discontinuance of the Service."
            ]
        },
        {
            id: "5",
            title: "SECTION 5 - PRODUCTS OR SERVICES (if applicable)",
            content: [
                "5.1 Certain products or services may be available exclusively online through the website.",
                "5.2 We have made every effort to display as accurately as possible the colors and images of our products that appear at the store.",
                "5.3 We reserve the right, but are not obligated, to limit the sales of our products or Services to any person, geographic region, or jurisdiction."
            ]
        },
        {
            id: "6",
            title: "SECTION 6 - ACCURACY OF BILLING AND ACCOUNT INFORMATION",
            content: [
                "6.1 We reserve the right to refuse any order you place with us.",
                "6.2 You agree to provide current, complete, and accurate purchase and account information for all purchases made at our store.",
                "6.3 For more detail, please review our Returns Policy."
            ]
        },
        {
            id: "7",
            title: "SECTION 7 - OPTIONAL TOOLS",
            content: [
                "7.1 We may provide you with access to third-party tools over which we neither monitor nor have any control nor input.",
                "7.2 You acknowledge and agree that we provide access to such tools \"as is\" and \"as available\" without any warranties, representations, or conditions of any kind."
            ]
        },
        {
            id: "8",
            title: "SECTION 8 - THIRD-PARTY LINKS",
            content: [
                "8.1 Certain content, products, and services available via our Service may include materials from third-parties.",
                "8.2 Third-party links on this site may direct you to third-party websites that are not affiliated with us."
            ]
        },
        {
            id: "9",
            title: "SECTION 9 - USER COMMENTS, FEEDBACK AND OTHER SUBMISSIONS",
            content: [
                "9.1 If, at our request, you send certain specific submissions (for example, contest entries) or without a request from us you send creative ideas, suggestions, proposals, plans, or other materials, whether online, by email, by postal mail, or otherwise, you agree that we may, at any time, without restriction, edit, copy, publish, distribute, translate, and otherwise use in any medium any comments that you forward to us.",
                "9.2 We are and shall be under no obligation (1) to maintain any comments in confidence; (2) to pay compensation for any comments; or (3) to respond to any comments."
            ]
        },
        {
            id: "10",
            title: "SECTION 10 - PERSONAL INFORMATION",
            content: [
                "10.1 Your submission of personal information through the store is governed by our Privacy Policy."
            ]
        },
        {
            id: "11",
            title: "SECTION 11 - ERRORS, INACCURACIES AND OMISSIONS",
            content: [
                "11.1 Occasionally there may be information on our site or in the Service that contains typographical errors, inaccuracies, or omissions."
            ]
        },
        {
            id: "12",
            title: "SECTION 12 - PROHIBITED USES",
            content: [
                "12.1 In addition to other prohibitions as set forth in the Terms of Service, you are prohibited from using the site or its content for any unlawful purpose; to violate any laws; to infringe on intellectual property rights; to harass, abuse, or discriminate against others; or to submit false information."
            ]
        },
        {
            id: "13",
            title: "SECTION 13 - DISCLAIMER OF WARRANTIES; LIMITATION OF LIABILITY",
            content: [
                "13.1 We do not guarantee that your use of our service will be uninterrupted, timely, secure, or error-free.",
                "13.2 You expressly agree that your use of the service is at your sole risk. All products and services are provided \"as is\" and \"as available\" without warranties.",
                "13.3 In no case shall Nilkanth Store Trade Name : ILAVIZ or its affiliates be liable for any damages, including lost profits or savings, arising from your use of the Service."
            ]
        },
        {
            id: "14",
            title: "SECTION 14 - INDEMNIFICATION",
            content: [
                "14.1 You agree to indemnify and hold Nilkanth Store Trade Name : ILAVIZ harmless from any claim arising from your breach of these Terms or violation of any law."
            ]
        },
        {
            id: "15",
            title: "SECTION 15 - SEVERABILITY",
            content: [
                "15.1 If any provision of these Terms is deemed unlawful or unenforceable, it will be enforced to the fullest extent permitted, and the remainder of the Terms will remain in effect."
            ]
        },
        {
            id: "16",
            title: "SECTION 16 - TERMINATION",
            content: [
                "16.1 These Terms are effective unless and until terminated by you or us. We may terminate the agreement at any time for any breach or violation of these Terms."
            ]
        },
        {
            id: "17",
            title: "SECTION 17 - ENTIRE AGREEMENT",
            content: [
                "17.1 These Terms constitute the entire agreement between you and us and supersede any prior agreements."
            ]
        },
        {
            id: "18",
            title: "SECTION 18 - GOVERNING LAW",
            content: [
                "18.1 These Terms are governed by the laws of India."
            ]
        },
        {
            id: "19",
            title: "SECTION 19 - CHANGES TO TERMS OF SERVICE",
            content: [
                "19.1 We reserve the right to update or modify these Terms at any time. It is your responsibility to check this page for updates."
            ]
        }
    ];

    return (
        <main className="min-h-screen bg-[#FDFBF7] pb-20">
            {/* Header Section */}
            <header className="bg-[#700b10] text-white py-16 md:py-24 text-center px-4">
                <div className="max-w-4xl mx-auto space-y-4">
                    <h1 className="text-4xl md:text-6xl font-tenor tracking-tight uppercase">Terms & Conditions</h1>
                    <div className="w-24 h-1 bg-[#EBD99C] mx-auto opacity-80"></div>
                </div>
            </header>

            <article className="max-w-5xl mx-auto px-3 sm:px-6 md:px-8 mt-[-3rem]">
                <div className="bg-white rounded-3xl shadow-2xl p-5 sm:p-8 md:p-12 space-y-8 sm:space-y-12">
                    
                    {/* Overview */}
                    <section className="bg-yellow-50/50 p-8 rounded-2xl border-l-8 border-[#700b10]">
                        <h2 className="text-2xl font-tenor text-[#700b10] mb-4 flex items-center gap-3">
                            <FiInfo size={24} /> OVERVIEW
                        </h2>
                        <p className="text-gray-700 text-lg leading-relaxed font-nunito">
                            Welcome to <span className="text-[#700b10] font-bold">Nilkanth Store Trade Name : ILAVIZ</span>! These Terms and Conditions govern your use of our website and services. By accessing or using our website, you agree to comply with these terms. Please read them carefully before proceeding.
                        </p>
                    </section>

                    {/* Standard Sections */}
                    <div className="space-y-10">
                        {sections.map((section) => (
                            <section key={section.id} className="group">
                                <h3 className="text-xl md:text-2xl font-tenor text-[#700b10] border-b border-gray-100 pb-3 mb-6 group-hover:border-[#C5A358] transition-colors">
                                    {section.title}
                                </h3>
                                <div className="space-y-4 text-gray-600 font-nunito leading-loose">
                                    {section.content.map((para, idx) => (
                                        <p key={idx} className="pl-4 border-l-2 border-gray-50 group-hover:border-yellow-100 transition-colors">
                                            {para}
                                        </p>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>

                    {/* Contact Section 20 */}
                    <section className="bg-[#700b10] text-white p-8 md:p-12 rounded-[2rem] space-y-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-tenor uppercase tracking-wide">SECTION 20 - CONTACT INFORMATION</h2>
                            <p className="font-nunito opacity-90 mt-4">
                                Questions about the Terms of Service should be sent to us at:
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                            <div className="space-y-6">
                                <a href="mailto:shrinilkanthstore@gmail.com" className="flex items-center gap-4 hover:text-[#EBD99C] transition-colors group">
                                    <span className="p-3 bg-white/10 rounded-xl group-hover:bg-[#EBD99C]/20 flex-shrink-0"><FiMail size={22} /></span>
                                    <div className="flex flex-col">
                                        <span className="text-sm opacity-70 font-nunito">Email</span>
                                        <span className="text-lg font-nunito font-semibold">shrinilkanthstore@gmail.com</span>
                                    </div>
                                </a>
                                <a href="tel:+918238811190" className="flex items-center gap-4 hover:text-[#EBD99C] transition-colors group">
                                    <span className="p-3 bg-white/10 rounded-xl group-hover:bg-[#EBD99C]/20 flex-shrink-0"><FiPhone size={22} /></span>
                                    <div className="flex flex-col">
                                        <span className="text-sm opacity-70 font-nunito">Phone</span>
                                        <span className="text-lg font-nunito font-semibold">+91 82388 11190</span>
                                    </div>
                                </a>
                            </div>

                            <div className="flex items-start gap-4 p-6 bg-white/5 rounded-2xl border border-white/10">
                                <span className="p-3 bg-white/10 rounded-xl flex-shrink-0"><FiMapPin size={22} /></span>
                                <div className="flex flex-col">
                                    <span className="text-sm opacity-70 font-nunito">Postal Address</span>
                                    <address className="not-italic text-sm md:text-base font-nunito mt-1 leading-relaxed">
                                        Nilkanth Store Trade Name : ILAVIZ, Ground floor, <br />
                                        Block / Survey No - 557, <br />
                                        Shree Swaminarayan Gurukul Trust, <br />
                                        Poicha Swaminarayan Temple, <br />
                                        Narmada, Gujarat - 393145
                                    </address>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </article>
        </main>
    );
}



// // src\app\terms-conditions\page.js



// import React from 'react';
// import { FiInfo, FiShield, FiFileText, FiMapPin, FiMail, FiPhone } from 'react-icons/fi';

// export const metadata = {
//     title: "Terms & Conditions – Nilkanth Store by ILAVIZ",
//     description: "Please read our Terms and Conditions carefully to understand your rights and responsibilities when using Nilkanth Store by ILAVIZ.",
// };

// export default function TermsConditionsPage() {
//     const sections = [
//         {
//             id: "1",
//             title: "SECTION 1 - ONLINE STORE TERMS",
//             content: [
//                 "1.1 By agreeing to these Terms, you confirm that you are at least the age of majority in your state or province of residence.",
//                 "1.2 You may not use our products for any illegal or unauthorized purpose, nor violate any laws in your jurisdiction (including but not limited to copyright laws).",
//                 "1.3 You must not transmit any worms or viruses or any code of a destructive nature.",
//                 "1.4 A breach or violation of any of the Terms will result in an immediate termination of your Services."
//             ]
//         },
//         {
//             id: "2",
//             title: "SECTION 2 - GENERAL CONDITIONS",
//             content: [
//                 "2.1 We reserve the right to refuse service to anyone for any reason at any time.",
//                 "2.2 You understand that your content (not including credit card information) may be transferred unencrypted and involve (a) transmissions over various networks and (b) changes to conform and adapt to the technical requirements of connecting networks or devices.",
//                 "2.3 You agree not to reproduce, duplicate, copy, sell, resell, or exploit any portion of the Service, use of the Service, or access to the Service without express written permission by us."
//             ]
//         },
//         {
//             id: "3",
//             title: "SECTION 3 - ACCURACY, COMPLETENESS AND TIMELINESS OF INFORMATION",
//             content: [
//                 "3.1 We are not responsible if the information made available on this site is not accurate, complete, or current.",
//                 "3.2 The material on this site is provided for general information only and should not be relied upon as the sole basis for making decisions without consulting primary, more accurate, or more timely sources of information."
//             ]
//         },
//         {
//             id: "4",
//             title: "SECTION 4 - MODIFICATIONS TO THE SERVICE AND PRICES",
//             content: [
//                 "4.1 Prices for our products are subject to change without notice.",
//                 "4.2 We reserve the right to modify or discontinue the Service (or any part or content thereof) without notice at any time.",
//                 "4.3 We shall not be liable to you or to any third party for any modification, price change, suspension, or discontinuance of the Service."
//             ]
//         },
//         {
//             id: "5",
//             title: "SECTION 5 - PRODUCTS OR SERVICES (if applicable)",
//             content: [
//                 "5.1 Certain products or services may be available exclusively online through the website.",
//                 "5.2 We have made every effort to display as accurately as possible the colors and images of our products that appear at the store.",
//                 "5.3 We reserve the right, but are not obligated, to limit the sales of our products or Services to any person, geographic region, or jurisdiction."
//             ]
//         },
//         {
//             id: "6",
//             title: "SECTION 6 - ACCURACY OF BILLING AND ACCOUNT INFORMATION",
//             content: [
//                 "6.1 We reserve the right to refuse any order you place with us.",
//                 "6.2 You agree to provide current, complete, and accurate purchase and account information for all purchases made at our store.",
//                 "6.3 For more detail, please review our Returns Policy."
//             ]
//         },
//         {
//             id: "7",
//             title: "SECTION 7 - OPTIONAL TOOLS",
//             content: [
//                 "7.1 We may provide you with access to third-party tools over which we neither monitor nor have any control nor input.",
//                 "7.2 You acknowledge and agree that we provide access to such tools \"as is\" and \"as available\" without any warranties, representations, or conditions of any kind."
//             ]
//         },
//         {
//             id: "8",
//             title: "SECTION 8 - THIRD-PARTY LINKS",
//             content: [
//                 "8.1 Certain content, products, and services available via our Service may include materials from third-parties.",
//                 "8.2 Third-party links on this site may direct you to third-party websites that are not affiliated with us."
//             ]
//         },
//         {
//             id: "9",
//             title: "SECTION 9 - USER COMMENTS, FEEDBACK AND OTHER SUBMISSIONS",
//             content: [
//                 "9.1 If, at our request, you send certain specific submissions (for example, contest entries) or without a request from us you send creative ideas, suggestions, proposals, plans, or other materials, whether online, by email, by postal mail, or otherwise, you agree that we may, at any time, without restriction, edit, copy, publish, distribute, translate, and otherwise use in any medium any comments that you forward to us.",
//                 "9.2 We are and shall be under no obligation (1) to maintain any comments in confidence; (2) to pay compensation for any comments; or (3) to respond to any comments."
//             ]
//         },
//         {
//             id: "10",
//             title: "SECTION 10 - PERSONAL INFORMATION",
//             content: [
//                 "10.1 Your submission of personal information through the store is governed by our Privacy Policy."
//             ]
//         },
//         {
//             id: "11",
//             title: "SECTION 11 - ERRORS, INACCURACIES AND OMISSIONS",
//             content: [
//                 "11.1 Occasionally there may be information on our site or in the Service that contains typographical errors, inaccuracies, or omissions."
//             ]
//         },
//         {
//             id: "12",
//             title: "SECTION 12 - PROHIBITED USES",
//             content: [
//                 "12.1 In addition to other prohibitions as set forth in the Terms of Service, you are prohibited from using the site or its content for any unlawful purpose; to violate any laws; to infringe on intellectual property rights; to harass, abuse, or discriminate against others; or to submit false information."
//             ]
//         },
//         {
//             id: "13",
//             title: "SECTION 13 - DISCLAIMER OF WARRANTIES; LIMITATION OF LIABILITY",
//             content: [
//                 "13.1 We do not guarantee that your use of our service will be uninterrupted, timely, secure, or error-free.",
//                 "13.2 You expressly agree that your use of the service is at your sole risk. All products and services are provided \"as is\" and \"as available\" without warranties.",
//                 "13.3 In no case shall Nilkanth Store by ILAVIZ or its affiliates be liable for any damages, including lost profits or savings, arising from your use of the Service."
//             ]
//         },
//         {
//             id: "14",
//             title: "SECTION 14 - INDEMNIFICATION",
//             content: [
//                 "14.1 You agree to indemnify and hold Nilkanth Store by ILAVIZ harmless from any claim arising from your breach of these Terms or violation of any law."
//             ]
//         },
//         {
//             id: "15",
//             title: "SECTION 15 - SEVERABILITY",
//             content: [
//                 "15.1 If any provision of these Terms is deemed unlawful or unenforceable, it will be enforced to the fullest extent permitted, and the remainder of the Terms will remain in effect."
//             ]
//         },
//         {
//             id: "16",
//             title: "SECTION 16 - TERMINATION",
//             content: [
//                 "16.1 These Terms are effective unless and until terminated by you or us. We may terminate the agreement at any time for any breach or violation of these Terms."
//             ]
//         },
//         {
//             id: "17",
//             title: "SECTION 17 - ENTIRE AGREEMENT",
//             content: [
//                 "17.1 These Terms constitute the entire agreement between you and us and supersede any prior agreements."
//             ]
//         },
//         {
//             id: "18",
//             title: "SECTION 18 - GOVERNING LAW",
//             content: [
//                 "18.1 These Terms are governed by the laws of India."
//             ]
//         },
//         {
//             id: "19",
//             title: "SECTION 19 - CHANGES TO TERMS OF SERVICE",
//             content: [
//                 "19.1 We reserve the right to update or modify these Terms at any time. It is your responsibility to check this page for updates."
//             ]
//         }
//     ];

//     return (
//         <main className="min-h-screen bg-[#FDFBF7] pb-20">
//             {/* Header Section */}
//             <header className="bg-[#700b10] text-white py-16 md:py-24 text-center px-4">
//                 <div className="max-w-4xl mx-auto space-y-4">
//                     <h1 className="text-4xl md:text-6xl font-tenor tracking-tight uppercase">Terms & Conditions</h1>
//                     <div className="w-24 h-1 bg-[#EBD99C] mx-auto opacity-80"></div>
//                 </div>
//             </header>

//             <article className="max-w-5xl mx-auto px-4 md:px-8 mt-[-3rem]">
//                 <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 space-y-12">
                    
//                     {/* Overview */}
//                     <section className="bg-yellow-50/50 p-8 rounded-2xl border-l-8 border-[#700b10]">
//                         <h2 className="text-2xl font-tenor text-[#700b10] mb-4 flex items-center gap-3">
//                             <FiInfo size={24} /> OVERVIEW
//                         </h2>
//                         <p className="text-gray-700 text-lg leading-relaxed font-nunito">
//                             Welcome to <span className="text-[#700b10] font-bold">Nilkanth Store by ILAVIZ</span>! These Terms and Conditions govern your use of our website and services. By accessing or using our website, you agree to comply with these terms. Please read them carefully before proceeding.
//                         </p>
//                     </section>

//                     {/* Standard Sections */}
//                     <div className="space-y-10">
//                         {sections.map((section) => (
//                             <section key={section.id} className="group">
//                                 <h3 className="text-xl md:text-2xl font-tenor text-[#700b10] border-b border-gray-100 pb-3 mb-6 group-hover:border-[#C5A358] transition-colors">
//                                     {section.title}
//                                 </h3>
//                                 <div className="space-y-4 text-gray-600 font-nunito leading-loose">
//                                     {section.content.map((para, idx) => (
//                                         <p key={idx} className="pl-4 border-l-2 border-gray-50 group-hover:border-yellow-100 transition-colors">
//                                             {para}
//                                         </p>
//                                     ))}
//                                 </div>
//                             </section>
//                         ))}
//                     </div>

//                     {/* Contact Section 20 */}
//                     <section className="bg-[#700b10] text-white p-8 md:p-12 rounded-[2rem] space-y-8">
//                         <div className="text-center">
//                             <h2 className="text-3xl font-tenor uppercase tracking-wide">SECTION 20 - CONTACT INFORMATION</h2>
//                             <p className="font-nunito opacity-90 mt-4">
//                                 Questions about the Terms of Service should be sent to us at:
//                             </p>
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
//                             <div className="space-y-6">
//                                 <a href="mailto:shrinilkanthstore@gmail.com" className="flex items-center gap-4 hover:text-[#EBD99C] transition-colors group">
//                                     <span className="p-3 bg-white/10 rounded-xl group-hover:bg-[#EBD99C]/20 flex-shrink-0"><FiMail size={22} /></span>
//                                     <div className="flex flex-col">
//                                         <span className="text-sm opacity-70 font-nunito">Email</span>
//                                         <span className="text-lg font-nunito font-semibold">shrinilkanthstore@gmail.com</span>
//                                     </div>
//                                 </a>
//                                 <a href="tel:+918238811190" className="flex items-center gap-4 hover:text-[#EBD99C] transition-colors group">
//                                     <span className="p-3 bg-white/10 rounded-xl group-hover:bg-[#EBD99C]/20 flex-shrink-0"><FiPhone size={22} /></span>
//                                     <div className="flex flex-col">
//                                         <span className="text-sm opacity-70 font-nunito">Phone</span>
//                                         <span className="text-lg font-nunito font-semibold">+91 82388 11190</span>
//                                     </div>
//                                 </a>
//                             </div>

//                             <div className="flex items-start gap-4 p-6 bg-white/5 rounded-2xl border border-white/10">
//                                 <span className="p-3 bg-white/10 rounded-xl flex-shrink-0"><FiMapPin size={22} /></span>
//                                 <div className="flex flex-col">
//                                     <span className="text-sm opacity-70 font-nunito">Postal Address</span>
//                                     <address className="not-italic text-sm md:text-base font-nunito mt-1 leading-relaxed">
//                                         Nilkanth Store by ILAVIZ, Ground floor, <br />
//                                         Block / Survey No - 557, <br />
//                                         Shree Swaminarayan Gurukul Trust, <br />
//                                         Poicha Swaminarayan Temple, <br />
//                                         Narmada, Gujarat - 393145
//                                     </address>
//                                 </div>
//                             </div>
//                         </div>
//                     </section>
//                 </div>
//             </article>
//         </main>
//     );
// }


// // import React from 'react';
// // import { FiInfo, FiShield, FiFileText, FiMapPin, FiMail, FiPhone } from 'react-icons/fi';

// // export const metadata = {
// //     title: "Terms & Conditions – Shri Nilkanth Store",
// //     description: "Please read our Terms and Conditions carefully to understand your rights and responsibilities when using Shri Nilkanth Store.",
// // };

// // export default function TermsConditionsPage() {
// //     const sections = [
// //         {
// //             id: "1",
// //             title: "SECTION 1 - ONLINE STORE TERMS",
// //             content: [
// //                 "1.1 By agreeing to these Terms, you confirm that you are at least the age of majority in your state or province of residence.",
// //                 "1.2 You may not use our products for any illegal or unauthorized purpose, nor violate any laws in your jurisdiction (including but not limited to copyright laws).",
// //                 "1.3 You must not transmit any worms or viruses or any code of a destructive nature.",
// //                 "1.4 A breach or violation of any of the Terms will result in an immediate termination of your Services."
// //             ]
// //         },
// //         {
// //             id: "2",
// //             title: "SECTION 2 - GENERAL CONDITIONS",
// //             content: [
// //                 "2.1 We reserve the right to refuse service to anyone for any reason at any time.",
// //                 "2.2 You understand that your content (not including credit card information) may be transferred unencrypted and involve (a) transmissions over various networks and (b) changes to conform and adapt to the technical requirements of connecting networks or devices.",
// //                 "2.3 You agree not to reproduce, duplicate, copy, sell, resell, or exploit any portion of the Service, use of the Service, or access to the Service without express written permission by us."
// //             ]
// //         },
// //         {
// //             id: "3",
// //             title: "SECTION 3 - ACCURACY, COMPLETENESS AND TIMELINESS OF INFORMATION",
// //             content: [
// //                 "3.1 We are not responsible if the information made available on this site is not accurate, complete, or current.",
// //                 "3.2 The material on this site is provided for general information only and should not be relied upon as the sole basis for making decisions without consulting primary, more accurate, or more timely sources of information."
// //             ]
// //         },
// //         {
// //             id: "4",
// //             title: "SECTION 4 - MODIFICATIONS TO THE SERVICE AND PRICES",
// //             content: [
// //                 "4.1 Prices for our products are subject to change without notice.",
// //                 "4.2 We reserve the right to modify or discontinue the Service (or any part or content thereof) without notice at any time.",
// //                 "4.3 We shall not be liable to you or to any third party for any modification, price change, suspension, or discontinuance of the Service."
// //             ]
// //         },
// //         {
// //             id: "5",
// //             title: "SECTION 5 - PRODUCTS OR SERVICES (if applicable)",
// //             content: [
// //                 "5.1 Certain products or services may be available exclusively online through the website.",
// //                 "5.2 We have made every effort to display as accurately as possible the colors and images of our products that appear at the store.",
// //                 "5.3 We reserve the right, but are not obligated, to limit the sales of our products or Services to any person, geographic region, or jurisdiction."
// //             ]
// //         },
// //         {
// //             id: "6",
// //             title: "SECTION 6 - ACCURACY OF BILLING AND ACCOUNT INFORMATION",
// //             content: [
// //                 "6.1 We reserve the right to refuse any order you place with us.",
// //                 "6.2 You agree to provide current, complete, and accurate purchase and account information for all purchases made at our store.",
// //                 "6.3 For more detail, please review our Returns Policy."
// //             ]
// //         },
// //         {
// //             id: "7",
// //             title: "SECTION 7 - OPTIONAL TOOLS",
// //             content: [
// //                 "7.1 We may provide you with access to third-party tools over which we neither monitor nor have any control nor input.",
// //                 "7.2 You acknowledge and agree that we provide access to such tools \"as is\" and \"as available\" without any warranties, representations, or conditions of any kind."
// //             ]
// //         },
// //         {
// //             id: "8",
// //             title: "SECTION 8 - THIRD-PARTY LINKS",
// //             content: [
// //                 "8.1 Certain content, products, and services available via our Service may include materials from third-parties.",
// //                 "8.2 Third-party links on this site may direct you to third-party websites that are not affiliated with us."
// //             ]
// //         },
// //         {
// //             id: "9",
// //             title: "SECTION 9 - USER COMMENTS, FEEDBACK AND OTHER SUBMISSIONS",
// //             content: [
// //                 "9.1 If, at our request, you send certain specific submissions (for example, contest entries) or without a request from us you send creative ideas, suggestions, proposals, plans, or other materials, whether online, by email, by postal mail, or otherwise, you agree that we may, at any time, without restriction, edit, copy, publish, distribute, translate, and otherwise use in any medium any comments that you forward to us.",
// //                 "9.2 We are and shall be under no obligation (1) to maintain any comments in confidence; (2) to pay compensation for any comments; or (3) to respond to any comments."
// //             ]
// //         },
// //         {
// //             id: "10",
// //             title: "SECTION 10 - PERSONAL INFORMATION",
// //             content: [
// //                 "10.1 Your submission of personal information through the store is governed by our Privacy Policy."
// //             ]
// //         },
// //         {
// //             id: "11",
// //             title: "SECTION 11 - ERRORS, INACCURACIES AND OMISSIONS",
// //             content: [
// //                 "11.1 Occasionally there may be information on our site or in the Service that contains typographical errors, inaccuracies, or omissions."
// //             ]
// //         },
// //         {
// //             id: "12",
// //             title: "SECTION 12 - PROHIBITED USES",
// //             content: [
// //                 "12.1 In addition to other prohibitions as set forth in the Terms of Service, you are prohibited from using the site or its content for any unlawful purpose; to violate any laws; to infringe on intellectual property rights; to harass, abuse, or discriminate against others; or to submit false information."
// //             ]
// //         },
// //         {
// //             id: "13",
// //             title: "SECTION 13 - DISCLAIMER OF WARRANTIES; LIMITATION OF LIABILITY",
// //             content: [
// //                 "13.1 We do not guarantee that your use of our service will be uninterrupted, timely, secure, or error-free.",
// //                 "13.2 You expressly agree that your use of the service is at your sole risk. All products and services are provided \"as is\" and \"as available\" without warranties.",
// //                 "13.3 In no case shall Shri Nilkanth Store or its affiliates be liable for any damages, including lost profits or savings, arising from your use of the Service."
// //             ]
// //         },
// //         {
// //             id: "14",
// //             title: "SECTION 14 - INDEMNIFICATION",
// //             content: [
// //                 "14.1 You agree to indemnify and hold Shri Nilkanth Store harmless from any claim arising from your breach of these Terms or violation of any law."
// //             ]
// //         },
// //         {
// //             id: "15",
// //             title: "SECTION 15 - SEVERABILITY",
// //             content: [
// //                 "15.1 If any provision of these Terms is deemed unlawful or unenforceable, it will be enforced to the fullest extent permitted, and the remainder of the Terms will remain in effect."
// //             ]
// //         },
// //         {
// //             id: "16",
// //             title: "SECTION 16 - TERMINATION",
// //             content: [
// //                 "16.1 These Terms are effective unless and until terminated by you or us. We may terminate the agreement at any time for any breach or violation of these Terms."
// //             ]
// //         },
// //         {
// //             id: "17",
// //             title: "SECTION 17 - ENTIRE AGREEMENT",
// //             content: [
// //                 "17.1 These Terms constitute the entire agreement between you and us and supersede any prior agreements."
// //             ]
// //         },
// //         {
// //             id: "18",
// //             title: "SECTION 18 - GOVERNING LAW",
// //             content: [
// //                 "18.1 These Terms are governed by the laws of India."
// //             ]
// //         },
// //         {
// //             id: "19",
// //             title: "SECTION 19 - CHANGES TO TERMS OF SERVICE",
// //             content: [
// //                 "19.1 We reserve the right to update or modify these Terms at any time. It is your responsibility to check this page for updates."
// //             ]
// //         }
// //     ];

// //     return (
// //         <main className="min-h-screen bg-[#FDFBF7] pb-20">
// //             {/* Header Section */}
// //             <header className="bg-[#700b10] text-white py-16 md:py-24 text-center px-4">
// //                 <div className="max-w-4xl mx-auto space-y-4">
// //                     <h1 className="text-4xl md:text-6xl font-tenor tracking-tight uppercase">Terms & Conditions</h1>
// //                     <div className="w-24 h-1 bg-[#EBD99C] mx-auto opacity-80"></div>
// //                 </div>
// //             </header>

// //             <article className="max-w-5xl mx-auto px-4 md:px-8 mt-[-3rem]">
// //                 <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 space-y-12">
                    
// //                     {/* Overview */}
// //                     <section className="bg-yellow-50/50 p-8 rounded-2xl border-l-8 border-[#700b10]">
// //                         <h2 className="text-2xl font-tenor text-[#700b10] mb-4 flex items-center gap-3">
// //                             <FiInfo size={24} /> OVERVIEW
// //                         </h2>
// //                         <p className="text-gray-700 text-lg leading-relaxed font-nunito">
// //                             Welcome to <span className="text-[#700b10] font-bold">Shri Nilkanth Store</span>! These Terms and Conditions govern your use of our website and services. By accessing or using our website, you agree to comply with these terms. Please read them carefully before proceeding.
// //                         </p>
// //                     </section>

// //                     {/* Standard Sections */}
// //                     <div className="space-y-10">
// //                         {sections.map((section) => (
// //                             <section key={section.id} className="group">
// //                                 <h3 className="text-xl md:text-2xl font-tenor text-[#700b10] border-b border-gray-100 pb-3 mb-6 group-hover:border-[#C5A358] transition-colors">
// //                                     {section.title}
// //                                 </h3>
// //                                 <div className="space-y-4 text-gray-600 font-nunito leading-loose">
// //                                     {section.content.map((para, idx) => (
// //                                         <p key={idx} className="pl-4 border-l-2 border-gray-50 group-hover:border-yellow-100 transition-colors">
// //                                             {para}
// //                                         </p>
// //                                     ))}
// //                                 </div>
// //                             </section>
// //                         ))}
// //                     </div>

// //                     {/* Contact Section 20 */}
// //                     <section className="bg-[#700b10] text-white p-8 md:p-12 rounded-[2rem] space-y-8">
// //                         <div className="text-center">
// //                             <h2 className="text-3xl font-tenor uppercase tracking-wide">SECTION 20 - CONTACT INFORMATION</h2>
// //                             <p className="font-nunito opacity-90 mt-4">
// //                                 Questions about the Terms of Service should be sent to us at:
// //                             </p>
// //                         </div>

// //                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
// //                             <div className="space-y-6">
// //                                 <a href="mailto:shrinilkanthstore@gmail.com" className="flex items-center gap-4 hover:text-[#EBD99C] transition-colors group">
// //                                     <span className="p-3 bg-white/10 rounded-xl group-hover:bg-[#EBD99C]/20 flex-shrink-0"><FiMail size={22} /></span>
// //                                     <div className="flex flex-col">
// //                                         <span className="text-sm opacity-70 font-nunito">Email</span>
// //                                         <span className="text-lg font-nunito font-semibold">shrinilkanthstore@gmail.com</span>
// //                                     </div>
// //                                 </a>
// //                                 <a href="tel:+918238811190" className="flex items-center gap-4 hover:text-[#EBD99C] transition-colors group">
// //                                     <span className="p-3 bg-white/10 rounded-xl group-hover:bg-[#EBD99C]/20 flex-shrink-0"><FiPhone size={22} /></span>
// //                                     <div className="flex flex-col">
// //                                         <span className="text-sm opacity-70 font-nunito">Phone</span>
// //                                         <span className="text-lg font-nunito font-semibold">+91 82388 11190</span>
// //                                     </div>
// //                                 </a>
// //                             </div>

// //                             <div className="flex items-start gap-4 p-6 bg-white/5 rounded-2xl border border-white/10">
// //                                 <span className="p-3 bg-white/10 rounded-xl flex-shrink-0"><FiMapPin size={22} /></span>
// //                                 <div className="flex flex-col">
// //                                     <span className="text-sm opacity-70 font-nunito">Postal Address</span>
// //                                     <address className="not-italic text-sm md:text-base font-nunito mt-1 leading-relaxed">
// //                                         Shri Nilkanth Store, Ground floor, <br />
// //                                         Block / Survey No - 557, <br />
// //                                         Shree Swaminarayan Gurukul Trust, <br />
// //                                         Poicha Swaminarayan Temple, <br />
// //                                         Narmada, Gujarat - 393145
// //                                     </address>
// //                                 </div>
// //                             </div>
// //                         </div>
// //                     </section>
// //                 </div>
// //             </article>
// //         </main>
// //     );
// // }
