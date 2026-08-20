// src\app\privacy-policy\page.js



import React from 'react';
import { FiShield, FiLock, FiUser, FiDatabase, FiInfo, FiMail, FiPhone, FiCheckCircle } from 'react-icons/fi';

export const metadata = {
    title: "Privacy Policy – Nilkanth Store Trade Name : ILAVIZ",
    description: "Your privacy is important to us. Learn how Nilkanth Store Trade Name : ILAVIZ collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen bg-[#FDFBF7] pb-20">
            {/* Header Section */}
            <header className="bg-[#700b10] text-white py-16 md:py-24 text-center px-4">
                <div className="max-w-4xl mx-auto space-y-4">
                    <h1 className="text-4xl md:text-6xl font-tenor tracking-tight uppercase">Privacy Policy</h1>
                    <div className="w-24 h-1 bg-[#EBD99C] mx-auto opacity-80"></div>
                    <p className="text-[#EBD99C] font-nunito font-semibold text-lg md:text-xl tracking-wide pt-4 opacity-90">
                        Effective Date: <span className="text-white">June 1, 2025</span>
                    </p>
                </div>
            </header>

            <article className="max-w-5xl mx-auto px-3 sm:px-6 md:px-8 mt-[-3rem]">
                <div className="bg-white rounded-3xl shadow-2xl p-5 sm:p-8 md:p-12 space-y-8 sm:space-y-12 border border-yellow-100/20">
                    
                    {/* Introduction */}
                    <section className="text-center max-w-3xl mx-auto space-y-4">
                        <p className="text-gray-700 text-lg md:text-xl leading-relaxed font-nunito italic">
                            "Welcome to Nilkanth Store Trade Name : ILAVIZ, your online destination for divine offerings and spiritual fulfillment."
                        </p>
                        <p className="text-gray-600 font-nunito leading-relaxed">
                            This Privacy Policy outlines how we handle your personal information on our website. We are committed to safeguarding your privacy and ensuring that your information is handled responsibly and in compliance with applicable laws.
                        </p>
                    </section>

                    {/* Information We Collect - Grid */}
                    <section className="space-y-8">
                        <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                            <span className="p-3 bg-blue-50 text-blue-600 rounded-xl"><FiDatabase size={24} /></span>
                            <h2 className="text-2xl md:text-3xl font-tenor text-[#700b10]">Information We Collect</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="p-6 bg-[#FDFBF7] rounded-2xl border border-yellow-100/50">
                                <h3 className="font-tenor text-lg text-[#700b10] mb-4">A. Personal Information</h3>
                                <ul className="space-y-2 text-gray-600 text-sm font-nunito">
                                    <li className="flex items-center gap-2"><FiCheckCircle className="text-[#C5A358]" /> Name</li>
                                    <li className="flex items-center gap-2"><FiCheckCircle className="text-[#C5A358]" /> Contact details</li>
                                    <li className="flex items-center gap-2"><FiCheckCircle className="text-[#C5A358]" /> Billing & Shipping address</li>
                                    <li className="flex items-center gap-2"><FiCheckCircle className="text-[#C5A358]" /> Payment information</li>
                                </ul>
                            </div>
                            <div className="p-6 bg-[#FDFBF7] rounded-2xl border border-yellow-100/50">
                                <h3 className="font-tenor text-lg text-[#700b10] mb-4">B. Transaction Details</h3>
                                <ul className="space-y-2 text-gray-600 text-sm font-nunito">
                                    <li className="flex items-center gap-2"><FiCheckCircle className="text-[#C5A358]" /> Order history</li>
                                    <li className="flex items-center gap-2"><FiCheckCircle className="text-[#C5A358]" /> Payment records</li>
                                    <li className="flex items-center gap-2"><FiCheckCircle className="text-[#C5A358]" /> Invoices and receipts</li>
                                </ul>
                            </div>
                            <div className="p-6 bg-[#FDFBF7] rounded-2xl border border-yellow-100/50">
                                <h3 className="font-tenor text-lg text-[#700b10] mb-4">C. Device & Usage</h3>
                                <ul className="space-y-2 text-gray-600 text-sm font-nunito">
                                    <li className="flex items-center gap-2"><FiCheckCircle className="text-[#C5A358]" /> IP address & Browser type</li>
                                    <li className="flex items-center gap-2"><FiCheckCircle className="text-[#C5A358]" /> Operating system</li>
                                    <li className="flex items-center gap-2"><FiCheckCircle className="text-[#C5A358]" /> Site interactions</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Collection & Purpose */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
                        <section className="space-y-4">
                            <h2 className="text-2xl font-tenor text-[#700b10] flex items-center gap-3">
                                <span className="p-2 bg-[#700b10]/5 rounded-lg"><FiUser /></span>
                                How We Collect
                            </h2>
                            <ul className="space-y-3 text-gray-600 font-nunito">
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 bg-[#C5A358] rounded-full mt-2.5 flex-shrink-0" />
                                    Creating an account
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 bg-[#C5A358] rounded-full mt-2.5 flex-shrink-0" />
                                    Making a purchase
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 bg-[#C5A358] rounded-full mt-2.5 flex-shrink-0" />
                                    Contacting customer support
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 bg-[#C5A358] rounded-full mt-2.5 flex-shrink-0" />
                                    Interacting with the website
                                </li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-tenor text-[#700b10] flex items-center gap-3">
                                <span className="p-2 bg-[#700b10]/5 rounded-lg"><FiShield /></span>
                                Purpose of Collection
                            </h2>
                            <ul className="space-y-3 text-gray-600 font-nunito">
                                <li className="flex items-start gap-3 font-medium">
                                    <FiCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
                                    Efficient order processing and fulfillment
                                </li>
                                <li className="flex items-start gap-3 font-medium">
                                    <FiCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
                                    Providing excellent customer support
                                </li>
                                <li className="flex items-start gap-3 font-medium">
                                    <FiCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
                                    Analyzing site usage to optimize experience
                                </li>
                                <li className="flex items-start gap-3 font-medium">
                                    <FiCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
                                    Complying with legal obligations
                                </li>
                            </ul>
                        </section>
                    </div>

                    {/* Sharing & Security */}
                    <section className="bg-gray-50 p-8 rounded-3xl space-y-8 border border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-4">
                                <h2 className="text-xl font-tenor text-[#700b10]">Sharing of Information</h2>
                                <p className="text-gray-600 font-nunito text-sm leading-relaxed">
                                    We may share Personal Information with service providers (e.g., payment processors, shipping companies) and legal authorities when required by law.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-xl font-tenor text-[#700b10]">Security Measures</h2>
                                <div className="flex items-start gap-4">
                                    <FiLock className="text-green-600 mt-1 flex-shrink-0" size={24} />
                                    <p className="text-gray-600 font-nunito text-sm leading-relaxed">
                                        We implement industry-standard security measures to protect your Personal Information from unauthorized access, disclosure, or alteration.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* User Rights Section */}
                    <section className="space-y-8">
                        <div className="text-center space-y-3">
                            <h2 className="text-3xl font-tenor text-[#700b10]">Your Privacy Rights</h2>
                            <p className="text-gray-500 font-nunito">As a user of Nilkanth Store Trade Name : ILAVIZ, you have absolute control over your data.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                "Access your Information", "Correct inaccuracies", "Withdraw consent",
                                "Request erasure", "Object to processing", "Data portability"
                            ].map((right, i) => (
                                <div key={i} className="flex items-center gap-4 p-5 bg-white border border-yellow-100 rounded-2xl hover:border-[#700b10] hover:shadow-md transition-all cursor-default">
                                    <span className="w-10 h-10 bg-yellow-50 text-[#C5A358] rounded-full flex items-center justify-center font-tenor font-bold">{i+1}</span>
                                    <span className="text-gray-700 font-nunito font-semibold">{right}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Legal Context */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                        <div className="p-8 bg-[#700b10] text-white rounded-3xl space-y-4 shadow-xl shadow-red-900/10">
                            <h2 className="text-2xl font-tenor uppercase tracking-wide">Governing Law</h2>
                            <p className="font-nunito opacity-90 leading-relaxed text-sm">
                                This Privacy Policy is governed by and construed in accordance with the laws of <strong>Rajpipla, Narmada, Gujarat</strong>. Disputes shall be subject to the exclusive jurisdiction of the courts in Rajpipla.
                            </p>
                        </div>
                        <div className="p-8 border-2 border-[#700b10] rounded-3xl space-y-4">
                            <h2 className="text-2xl font-tenor text-[#700b10] uppercase tracking-wide">Consent</h2>
                            <p className="text-gray-600 font-nunito leading-relaxed text-sm">
                                By using Nilkanth Store Trade Name : ILAVIZ, you consent to the collection and use of your Personal Information as outlined in this Privacy Policy.
                            </p>
                        </div>
                    </div>

                    {/* Contact Hub */}
                    <section className="bg-[#700b10] text-white p-8 md:p-12 rounded-[2rem] text-center space-y-8">
                        <h2 className="text-3xl font-tenor">Contact Information</h2>
                        <p className="font-nunito opacity-90 max-w-2xl mx-auto">
                            For inquiries or concerns regarding this Privacy Policy, please contact us at:
                        </p>
                        <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-16 pt-4">
                            <a href="mailto:shrinilkanthstore@gmail.com" className="flex items-center justify-center gap-3 hover:text-[#EBD99C] transition-colors group">
                                <span className="p-3 bg-white/10 rounded-full group-hover:bg-[#EBD99C]/20"><FiMail size={22} /></span>
                                <span className="text-lg font-nunito font-semibold">shrinilkanthstore@gmail.com</span>
                            </a>
                        </div>
                    </section>

                    <footer className="pt-12 text-center text-gray-500 font-nunito max-w-2xl mx-auto">
                        <p className="text-sm mb-6 italic">
                            Thank you for entrusting <span className="text-[#C5A358] font-bold">Nilkanth Store Trade Name : ILAVIZ</span> with your information. Your privacy is important to us.
                        </p>
                        <p className="text-[#700b10] font-bold text-lg md:text-xl">
                            Changes to Privacy Policy
                        </p>
                        <p className="text-sm mt-2">
                             We reserve the right to modify this Privacy Policy. Any changes will be effective immediately upon posting.
                        </p>
                    </footer>
                </div>
            </article>
        </main>
    );
}


// // src\app\privacy-policy\page.js



// import React from 'react';
// import { FiShield, FiLock, FiUser, FiDatabase, FiInfo, FiMail, FiPhone, FiCheckCircle } from 'react-icons/fi';

// export const metadata = {
//     title: "Privacy Policy – Nilkanth Store by ILAVIZ",
//     description: "Your privacy is important to us. Learn how Nilkanth Store by ILAVIZ collects, uses, and protects your personal information.",
// };

// export default function PrivacyPolicyPage() {
//     return (
//         <main className="min-h-screen bg-[#FDFBF7] pb-20">
//             {/* Header Section */}
//             <header className="bg-[#700b10] text-white py-16 md:py-24 text-center px-4">
//                 <div className="max-w-4xl mx-auto space-y-4">
//                     <h1 className="text-4xl md:text-6xl font-tenor tracking-tight uppercase">Privacy Policy</h1>
//                     <div className="w-24 h-1 bg-[#EBD99C] mx-auto opacity-80"></div>
//                     <p className="text-[#EBD99C] font-nunito font-semibold text-lg md:text-xl tracking-wide pt-4 opacity-90">
//                         Effective Date: <span className="text-white">June 1, 2025</span>
//                     </p>
//                 </div>
//             </header>

//             <article className="max-w-5xl mx-auto px-4 md:px-8 mt-[-3rem]">
//                 <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 space-y-12 border border-yellow-100/20">
                    
//                     {/* Introduction */}
//                     <section className="text-center max-w-3xl mx-auto space-y-4">
//                         <p className="text-gray-700 text-lg md:text-xl leading-relaxed font-nunito italic">
//                             "Welcome to Nilkanth Store by ILAVIZ, your online destination for divine offerings and spiritual fulfillment."
//                         </p>
//                         <p className="text-gray-600 font-nunito leading-relaxed">
//                             This Privacy Policy outlines how we handle your personal information on our website. We are committed to safeguarding your privacy and ensuring that your information is handled responsibly and in compliance with applicable laws.
//                         </p>
//                     </section>

//                     {/* Information We Collect - Grid */}
//                     <section className="space-y-8">
//                         <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
//                             <span className="p-3 bg-blue-50 text-blue-600 rounded-xl"><FiDatabase size={24} /></span>
//                             <h2 className="text-2xl md:text-3xl font-tenor text-[#700b10]">Information We Collect</h2>
//                         </div>
                        
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                             <div className="p-6 bg-[#FDFBF7] rounded-2xl border border-yellow-100/50">
//                                 <h3 className="font-tenor text-lg text-[#700b10] mb-4">A. Personal Information</h3>
//                                 <ul className="space-y-2 text-gray-600 text-sm font-nunito">
//                                     <li className="flex items-center gap-2"><FiCheckCircle className="text-[#C5A358]" /> Name</li>
//                                     <li className="flex items-center gap-2"><FiCheckCircle className="text-[#C5A358]" /> Contact details</li>
//                                     <li className="flex items-center gap-2"><FiCheckCircle className="text-[#C5A358]" /> Billing & Shipping address</li>
//                                     <li className="flex items-center gap-2"><FiCheckCircle className="text-[#C5A358]" /> Payment information</li>
//                                 </ul>
//                             </div>
//                             <div className="p-6 bg-[#FDFBF7] rounded-2xl border border-yellow-100/50">
//                                 <h3 className="font-tenor text-lg text-[#700b10] mb-4">B. Transaction Details</h3>
//                                 <ul className="space-y-2 text-gray-600 text-sm font-nunito">
//                                     <li className="flex items-center gap-2"><FiCheckCircle className="text-[#C5A358]" /> Order history</li>
//                                     <li className="flex items-center gap-2"><FiCheckCircle className="text-[#C5A358]" /> Payment records</li>
//                                     <li className="flex items-center gap-2"><FiCheckCircle className="text-[#C5A358]" /> Invoices and receipts</li>
//                                 </ul>
//                             </div>
//                             <div className="p-6 bg-[#FDFBF7] rounded-2xl border border-yellow-100/50">
//                                 <h3 className="font-tenor text-lg text-[#700b10] mb-4">C. Device & Usage</h3>
//                                 <ul className="space-y-2 text-gray-600 text-sm font-nunito">
//                                     <li className="flex items-center gap-2"><FiCheckCircle className="text-[#C5A358]" /> IP address & Browser type</li>
//                                     <li className="flex items-center gap-2"><FiCheckCircle className="text-[#C5A358]" /> Operating system</li>
//                                     <li className="flex items-center gap-2"><FiCheckCircle className="text-[#C5A358]" /> Site interactions</li>
//                                 </ul>
//                             </div>
//                         </div>
//                     </section>

//                     {/* Collection & Purpose */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
//                         <section className="space-y-4">
//                             <h2 className="text-2xl font-tenor text-[#700b10] flex items-center gap-3">
//                                 <span className="p-2 bg-[#700b10]/5 rounded-lg"><FiUser /></span>
//                                 How We Collect
//                             </h2>
//                             <ul className="space-y-3 text-gray-600 font-nunito">
//                                 <li className="flex items-start gap-3">
//                                     <span className="w-1.5 h-1.5 bg-[#C5A358] rounded-full mt-2.5 flex-shrink-0" />
//                                     Creating an account
//                                 </li>
//                                 <li className="flex items-start gap-3">
//                                     <span className="w-1.5 h-1.5 bg-[#C5A358] rounded-full mt-2.5 flex-shrink-0" />
//                                     Making a purchase
//                                 </li>
//                                 <li className="flex items-start gap-3">
//                                     <span className="w-1.5 h-1.5 bg-[#C5A358] rounded-full mt-2.5 flex-shrink-0" />
//                                     Contacting customer support
//                                 </li>
//                                 <li className="flex items-start gap-3">
//                                     <span className="w-1.5 h-1.5 bg-[#C5A358] rounded-full mt-2.5 flex-shrink-0" />
//                                     Interacting with the website
//                                 </li>
//                             </ul>
//                         </section>

//                         <section className="space-y-4">
//                             <h2 className="text-2xl font-tenor text-[#700b10] flex items-center gap-3">
//                                 <span className="p-2 bg-[#700b10]/5 rounded-lg"><FiShield /></span>
//                                 Purpose of Collection
//                             </h2>
//                             <ul className="space-y-3 text-gray-600 font-nunito">
//                                 <li className="flex items-start gap-3 font-medium">
//                                     <FiCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
//                                     Efficient order processing and fulfillment
//                                 </li>
//                                 <li className="flex items-start gap-3 font-medium">
//                                     <FiCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
//                                     Providing excellent customer support
//                                 </li>
//                                 <li className="flex items-start gap-3 font-medium">
//                                     <FiCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
//                                     Analyzing site usage to optimize experience
//                                 </li>
//                                 <li className="flex items-start gap-3 font-medium">
//                                     <FiCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
//                                     Complying with legal obligations
//                                 </li>
//                             </ul>
//                         </section>
//                     </div>

//                     {/* Sharing & Security */}
//                     <section className="bg-gray-50 p-8 rounded-3xl space-y-8 border border-gray-100">
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
//                             <div className="space-y-4">
//                                 <h2 className="text-xl font-tenor text-[#700b10]">Sharing of Information</h2>
//                                 <p className="text-gray-600 font-nunito text-sm leading-relaxed">
//                                     We may share Personal Information with service providers (e.g., payment processors, shipping companies) and legal authorities when required by law.
//                                 </p>
//                             </div>
//                             <div className="space-y-4">
//                                 <h2 className="text-xl font-tenor text-[#700b10]">Security Measures</h2>
//                                 <div className="flex items-start gap-4">
//                                     <FiLock className="text-green-600 mt-1 flex-shrink-0" size={24} />
//                                     <p className="text-gray-600 font-nunito text-sm leading-relaxed">
//                                         We implement industry-standard security measures to protect your Personal Information from unauthorized access, disclosure, or alteration.
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     </section>

//                     {/* User Rights Section */}
//                     <section className="space-y-8">
//                         <div className="text-center space-y-3">
//                             <h2 className="text-3xl font-tenor text-[#700b10]">Your Privacy Rights</h2>
//                             <p className="text-gray-500 font-nunito">As a user of Nilkanth Store by ILAVIZ, you have absolute control over your data.</p>
//                         </div>
//                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                             {[
//                                 "Access your Information", "Correct inaccuracies", "Withdraw consent",
//                                 "Request erasure", "Object to processing", "Data portability"
//                             ].map((right, i) => (
//                                 <div key={i} className="flex items-center gap-4 p-5 bg-white border border-yellow-100 rounded-2xl hover:border-[#700b10] hover:shadow-md transition-all cursor-default">
//                                     <span className="w-10 h-10 bg-yellow-50 text-[#C5A358] rounded-full flex items-center justify-center font-tenor font-bold">{i+1}</span>
//                                     <span className="text-gray-700 font-nunito font-semibold">{right}</span>
//                                 </div>
//                             ))}
//                         </div>
//                     </section>

//                     {/* Legal Context */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
//                         <div className="p-8 bg-[#700b10] text-white rounded-3xl space-y-4 shadow-xl shadow-red-900/10">
//                             <h2 className="text-2xl font-tenor uppercase tracking-wide">Governing Law</h2>
//                             <p className="font-nunito opacity-90 leading-relaxed text-sm">
//                                 This Privacy Policy is governed by and construed in accordance with the laws of <strong>Rajpipla, Narmada, Gujarat</strong>. Disputes shall be subject to the exclusive jurisdiction of the courts in Rajpipla.
//                             </p>
//                         </div>
//                         <div className="p-8 border-2 border-[#700b10] rounded-3xl space-y-4">
//                             <h2 className="text-2xl font-tenor text-[#700b10] uppercase tracking-wide">Consent</h2>
//                             <p className="text-gray-600 font-nunito leading-relaxed text-sm">
//                                 By using Nilkanth Store by ILAVIZ, you consent to the collection and use of your Personal Information as outlined in this Privacy Policy.
//                             </p>
//                         </div>
//                     </div>

//                     {/* Contact Hub */}
//                     <section className="bg-[#700b10] text-white p-8 md:p-12 rounded-[2rem] text-center space-y-8">
//                         <h2 className="text-3xl font-tenor">Contact Information</h2>
//                         <p className="font-nunito opacity-90 max-w-2xl mx-auto">
//                             For inquiries or concerns regarding this Privacy Policy, please contact us at:
//                         </p>
//                         <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-16 pt-4">
//                             <a href="mailto:shrinilkanthstore@gmail.com" className="flex items-center justify-center gap-3 hover:text-[#EBD99C] transition-colors group">
//                                 <span className="p-3 bg-white/10 rounded-full group-hover:bg-[#EBD99C]/20"><FiMail size={22} /></span>
//                                 <span className="text-lg font-nunito font-semibold">shrinilkanthstore@gmail.com</span>
//                             </a>
//                         </div>
//                     </section>

//                     <footer className="pt-12 text-center text-gray-500 font-nunito max-w-2xl mx-auto">
//                         <p className="text-sm mb-6 italic">
//                             Thank you for entrusting <span className="text-[#C5A358] font-bold">Nilkanth Store by ILAVIZ</span> with your information. Your privacy is important to us.
//                         </p>
//                         <p className="text-[#700b10] font-bold text-lg md:text-xl">
//                             Changes to Privacy Policy
//                         </p>
//                         <p className="text-sm mt-2">
//                              We reserve the right to modify this Privacy Policy. Any changes will be effective immediately upon posting.
//                         </p>
//                     </footer>
//                 </div>
//             </article>
//         </main>
//     );
// }


// // import React from 'react';
// // import { FiShield, FiLock, FiUser, FiDatabase, FiInfo, FiMail, FiPhone, FiCheckCircle } from 'react-icons/fi';

// // export const metadata = {
// //     title: "Privacy Policy – Shri Nilkanth Store",
// //     description: "Your privacy is important to us. Learn how Shri Nilkanth Store collects, uses, and protects your personal information.",
// // };

// // export default function PrivacyPolicyPage() {
// //     return (
// //         <main className="min-h-screen bg-[#FDFBF7] pb-20">
// //             {/* Header Section */}
// //             <header className="bg-[#700b10] text-white py-16 md:py-24 text-center px-4">
// //                 <div className="max-w-4xl mx-auto space-y-4">
// //                     <h1 className="text-4xl md:text-6xl font-tenor tracking-tight uppercase">Privacy Policy</h1>
// //                     <div className="w-24 h-1 bg-[#EBD99C] mx-auto opacity-80"></div>
// //                     <p className="text-[#EBD99C] font-nunito font-semibold text-lg md:text-xl tracking-wide pt-4 opacity-90">
// //                         Effective Date: <span className="text-white">June 1, 2025</span>
// //                     </p>
// //                 </div>
// //             </header>

// //             <article className="max-w-5xl mx-auto px-4 md:px-8 mt-[-3rem]">
// //                 <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 space-y-12 border border-yellow-100/20">
                    
// //                     {/* Introduction */}
// //                     <section className="text-center max-w-3xl mx-auto space-y-4">
// //                         <p className="text-gray-700 text-lg md:text-xl leading-relaxed font-nunito italic">
// //                             "Welcome to Shri Nilkanth Store, your online destination for divine offerings and spiritual fulfillment."
// //                         </p>
// //                         <p className="text-gray-600 font-nunito leading-relaxed">
// //                             This Privacy Policy outlines how we handle your personal information on our website. We are committed to safeguarding your privacy and ensuring that your information is handled responsibly and in compliance with applicable laws.
// //                         </p>
// //                     </section>

// //                     {/* Information We Collect - Grid */}
// //                     <section className="space-y-8">
// //                         <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
// //                             <span className="p-3 bg-blue-50 text-blue-600 rounded-xl"><FiDatabase size={24} /></span>
// //                             <h2 className="text-2xl md:text-3xl font-tenor text-[#700b10]">Information We Collect</h2>
// //                         </div>
                        
// //                         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
// //                             <div className="p-6 bg-[#FDFBF7] rounded-2xl border border-yellow-100/50">
// //                                 <h3 className="font-tenor text-lg text-[#700b10] mb-4">A. Personal Information</h3>
// //                                 <ul className="space-y-2 text-gray-600 text-sm font-nunito">
// //                                     <li className="flex items-center gap-2"><FiCheckCircle className="text-[#C5A358]" /> Name</li>
// //                                     <li className="flex items-center gap-2"><FiCheckCircle className="text-[#C5A358]" /> Contact details</li>
// //                                     <li className="flex items-center gap-2"><FiCheckCircle className="text-[#C5A358]" /> Billing & Shipping address</li>
// //                                     <li className="flex items-center gap-2"><FiCheckCircle className="text-[#C5A358]" /> Payment information</li>
// //                                 </ul>
// //                             </div>
// //                             <div className="p-6 bg-[#FDFBF7] rounded-2xl border border-yellow-100/50">
// //                                 <h3 className="font-tenor text-lg text-[#700b10] mb-4">B. Transaction Details</h3>
// //                                 <ul className="space-y-2 text-gray-600 text-sm font-nunito">
// //                                     <li className="flex items-center gap-2"><FiCheckCircle className="text-[#C5A358]" /> Order history</li>
// //                                     <li className="flex items-center gap-2"><FiCheckCircle className="text-[#C5A358]" /> Payment records</li>
// //                                     <li className="flex items-center gap-2"><FiCheckCircle className="text-[#C5A358]" /> Invoices and receipts</li>
// //                                 </ul>
// //                             </div>
// //                             <div className="p-6 bg-[#FDFBF7] rounded-2xl border border-yellow-100/50">
// //                                 <h3 className="font-tenor text-lg text-[#700b10] mb-4">C. Device & Usage</h3>
// //                                 <ul className="space-y-2 text-gray-600 text-sm font-nunito">
// //                                     <li className="flex items-center gap-2"><FiCheckCircle className="text-[#C5A358]" /> IP address & Browser type</li>
// //                                     <li className="flex items-center gap-2"><FiCheckCircle className="text-[#C5A358]" /> Operating system</li>
// //                                     <li className="flex items-center gap-2"><FiCheckCircle className="text-[#C5A358]" /> Site interactions</li>
// //                                 </ul>
// //                             </div>
// //                         </div>
// //                     </section>

// //                     {/* Collection & Purpose */}
// //                     <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
// //                         <section className="space-y-4">
// //                             <h2 className="text-2xl font-tenor text-[#700b10] flex items-center gap-3">
// //                                 <span className="p-2 bg-[#700b10]/5 rounded-lg"><FiUser /></span>
// //                                 How We Collect
// //                             </h2>
// //                             <ul className="space-y-3 text-gray-600 font-nunito">
// //                                 <li className="flex items-start gap-3">
// //                                     <span className="w-1.5 h-1.5 bg-[#C5A358] rounded-full mt-2.5 flex-shrink-0" />
// //                                     Creating an account
// //                                 </li>
// //                                 <li className="flex items-start gap-3">
// //                                     <span className="w-1.5 h-1.5 bg-[#C5A358] rounded-full mt-2.5 flex-shrink-0" />
// //                                     Making a purchase
// //                                 </li>
// //                                 <li className="flex items-start gap-3">
// //                                     <span className="w-1.5 h-1.5 bg-[#C5A358] rounded-full mt-2.5 flex-shrink-0" />
// //                                     Contacting customer support
// //                                 </li>
// //                                 <li className="flex items-start gap-3">
// //                                     <span className="w-1.5 h-1.5 bg-[#C5A358] rounded-full mt-2.5 flex-shrink-0" />
// //                                     Interacting with the website
// //                                 </li>
// //                             </ul>
// //                         </section>

// //                         <section className="space-y-4">
// //                             <h2 className="text-2xl font-tenor text-[#700b10] flex items-center gap-3">
// //                                 <span className="p-2 bg-[#700b10]/5 rounded-lg"><FiShield /></span>
// //                                 Purpose of Collection
// //                             </h2>
// //                             <ul className="space-y-3 text-gray-600 font-nunito">
// //                                 <li className="flex items-start gap-3 font-medium">
// //                                     <FiCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
// //                                     Efficient order processing and fulfillment
// //                                 </li>
// //                                 <li className="flex items-start gap-3 font-medium">
// //                                     <FiCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
// //                                     Providing excellent customer support
// //                                 </li>
// //                                 <li className="flex items-start gap-3 font-medium">
// //                                     <FiCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
// //                                     Analyzing site usage to optimize experience
// //                                 </li>
// //                                 <li className="flex items-start gap-3 font-medium">
// //                                     <FiCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
// //                                     Complying with legal obligations
// //                                 </li>
// //                             </ul>
// //                         </section>
// //                     </div>

// //                     {/* Sharing & Security */}
// //                     <section className="bg-gray-50 p-8 rounded-3xl space-y-8 border border-gray-100">
// //                         <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
// //                             <div className="space-y-4">
// //                                 <h2 className="text-xl font-tenor text-[#700b10]">Sharing of Information</h2>
// //                                 <p className="text-gray-600 font-nunito text-sm leading-relaxed">
// //                                     We may share Personal Information with service providers (e.g., payment processors, shipping companies) and legal authorities when required by law.
// //                                 </p>
// //                             </div>
// //                             <div className="space-y-4">
// //                                 <h2 className="text-xl font-tenor text-[#700b10]">Security Measures</h2>
// //                                 <div className="flex items-start gap-4">
// //                                     <FiLock className="text-green-600 mt-1 flex-shrink-0" size={24} />
// //                                     <p className="text-gray-600 font-nunito text-sm leading-relaxed">
// //                                         We implement industry-standard security measures to protect your Personal Information from unauthorized access, disclosure, or alteration.
// //                                     </p>
// //                                 </div>
// //                             </div>
// //                         </div>
// //                     </section>

// //                     {/* User Rights Section */}
// //                     <section className="space-y-8">
// //                         <div className="text-center space-y-3">
// //                             <h2 className="text-3xl font-tenor text-[#700b10]">Your Privacy Rights</h2>
// //                             <p className="text-gray-500 font-nunito">As a user of Shri Nilkanth Store, you have absolute control over your data.</p>
// //                         </div>
// //                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
// //                             {[
// //                                 "Access your Information", "Correct inaccuracies", "Withdraw consent",
// //                                 "Request erasure", "Object to processing", "Data portability"
// //                             ].map((right, i) => (
// //                                 <div key={i} className="flex items-center gap-4 p-5 bg-white border border-yellow-100 rounded-2xl hover:border-[#700b10] hover:shadow-md transition-all cursor-default">
// //                                     <span className="w-10 h-10 bg-yellow-50 text-[#C5A358] rounded-full flex items-center justify-center font-tenor font-bold">{i+1}</span>
// //                                     <span className="text-gray-700 font-nunito font-semibold">{right}</span>
// //                                 </div>
// //                             ))}
// //                         </div>
// //                     </section>

// //                     {/* Legal Context */}
// //                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
// //                         <div className="p-8 bg-[#700b10] text-white rounded-3xl space-y-4 shadow-xl shadow-red-900/10">
// //                             <h2 className="text-2xl font-tenor uppercase tracking-wide">Governing Law</h2>
// //                             <p className="font-nunito opacity-90 leading-relaxed text-sm">
// //                                 This Privacy Policy is governed by and construed in accordance with the laws of <strong>Rajpipla, Narmada, Gujarat</strong>. Disputes shall be subject to the exclusive jurisdiction of the courts in Rajpipla.
// //                             </p>
// //                         </div>
// //                         <div className="p-8 border-2 border-[#700b10] rounded-3xl space-y-4">
// //                             <h2 className="text-2xl font-tenor text-[#700b10] uppercase tracking-wide">Consent</h2>
// //                             <p className="text-gray-600 font-nunito leading-relaxed text-sm">
// //                                 By using Shri Nilkanth Store, you consent to the collection and use of your Personal Information as outlined in this Privacy Policy.
// //                             </p>
// //                         </div>
// //                     </div>

// //                     {/* Contact Hub */}
// //                     <section className="bg-[#700b10] text-white p-8 md:p-12 rounded-[2rem] text-center space-y-8">
// //                         <h2 className="text-3xl font-tenor">Contact Information</h2>
// //                         <p className="font-nunito opacity-90 max-w-2xl mx-auto">
// //                             For inquiries or concerns regarding this Privacy Policy, please contact us at:
// //                         </p>
// //                         <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-16 pt-4">
// //                             <a href="mailto:shrinilkanthstore@gmail.com" className="flex items-center justify-center gap-3 hover:text-[#EBD99C] transition-colors group">
// //                                 <span className="p-3 bg-white/10 rounded-full group-hover:bg-[#EBD99C]/20"><FiMail size={22} /></span>
// //                                 <span className="text-lg font-nunito font-semibold">shrinilkanthstore@gmail.com</span>
// //                             </a>
// //                         </div>
// //                     </section>

// //                     <footer className="pt-12 text-center text-gray-500 font-nunito max-w-2xl mx-auto">
// //                         <p className="text-sm mb-6 italic">
// //                             Thank you for entrusting <span className="text-[#C5A358] font-bold">Shri Nilkanth Store</span> with your information. Your privacy is important to us.
// //                         </p>
// //                         <p className="text-[#700b10] font-bold text-lg md:text-xl">
// //                             Changes to Privacy Policy
// //                         </p>
// //                         <p className="text-sm mt-2">
// //                              We reserve the right to modify this Privacy Policy. Any changes will be effective immediately upon posting.
// //                         </p>
// //                     </footer>
// //                 </div>
// //             </article>
// //         </main>
// //     );
// // }
