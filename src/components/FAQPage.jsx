import React, { useState } from "react";
import { Plus, Minus, HelpCircle, Mail, Phone, MessageCircle } from "lucide-react";
import { FAQS } from "../data/storeData";

export default function FAQPage({ onNavigate }) {
  const [openFaq, setOpenFaq] = useState(0); // Open first FAQ by default

  return (
    <div className="w-full bg-[#ffffff] min-h-screen text-[#1c1917] font-nunito pb-16 md:pb-24">
      {/* 1. Breadcrumb Bar */}
      <div className="w-full border-b border-stone-200/70 bg-white/80 backdrop-blur-sm">
        <div className="max-w-[95rem] mx-auto px-4 sm:px-6 lg:px-12 py-3.5 flex items-center gap-2 text-xs sm:text-sm text-stone-500">
          <button
            type="button"
            onClick={() => onNavigate?.("home")}
            className="hover:text-[#700b10] transition-colors font-medium cursor-pointer"
          >
            Home
          </button>
          <span>/</span>
          <span className="text-[#700b10] font-semibold">FAQs</span>
        </div>
      </div>

      {/* 2. Top Deep Maroon Header Section */}
      <section className="w-full bg-[#700b10] text-white pt-12 pb-24 sm:pt-16 sm:pb-32 px-4 text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-wider uppercase text-white mb-3">
            Frequently Asked Questions
          </h1>
          <div className="w-16 h-0.5 bg-[#ebd99c] mx-auto mb-3" />
          <p className="text-xs sm:text-sm text-stone-300 tracking-wide font-nunito">
            Find answers to commonly asked questions about our sacred products, orders, and delivery.
          </p>
        </div>
      </section>

      {/* 3. Main Floating Card with FAQ Content */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 -mt-16 sm:-mt-20 relative z-10">
        <div className="bg-white rounded-3xl p-6 sm:p-10 md:p-12 shadow-[0_12px_45px_rgba(0,0,0,0.08)] border border-stone-200/80">

          {/* FAQ 2-Column Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* Left: Illustration Image Card */}
            <div className="lg:col-span-5 flex flex-col items-center w-full lg:sticky lg:top-28">
              <div className="w-full max-w-[420px] aspect-square rounded-2xl overflow-hidden shadow-md border-4 border-stone-100 bg-[#faeed1] relative group flex items-center justify-center">
                <img
                  src="https://megaecomm.megascale.co.in/backend/media/16/general/c18c1d4e0e4c4401b13d3c013ea57e99.jpg"
                  alt="Frequently Asked Questions - Shri Nilkanth Store"
                  className="w-full h-full object-contain block transition-transform duration-500 group-hover:scale-105"
                  loading="eager"
                />
              </div>

              {/* Quick Help Card */}
              <div className="w-full max-w-[420px] mt-6 bg-[#fcfbf9] rounded-2xl p-5 border border-stone-200/80">
                <div className="flex items-center gap-2 text-[#700b10] mb-2 font-serif font-medium text-base">
                  <HelpCircle className="w-5 h-5 text-[#b8944d]" />
                  <span>Still have questions?</span>
                </div>
                <p className="text-xs text-stone-600 font-nunito leading-relaxed mb-4">
                  Can&rsquo;t find the answer you&rsquo;re looking for? Our devotional care team is available to assist you.
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate?.("contact")}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#700b10] hover:bg-[#851016] text-[#ebd99c] hover:text-white font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  Contact Our Support Team &gt;
                </button>
              </div>
            </div>

            {/* Right: Accordion List */}
            <div className="lg:col-span-7 space-y-1 divide-y divide-stone-200/80">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className={idx !== 0 ? "pt-2" : ""}>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full py-4 flex justify-between items-center text-left group transition-all cursor-pointer"
                      aria-expanded={isOpen}
                    >
                      <span
                        className={`text-sm sm:text-[15px] font-semibold transition-colors duration-200 pr-4 leading-snug font-nunito ${isOpen
                          ? "text-[#700b10] font-bold"
                          : "text-stone-800 group-hover:text-[#700b10]"
                          }`}
                      >
                        {faq.question}
                      </span>
                      <div className="flex-shrink-0 ml-3">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${isOpen
                            ? "bg-[#700b10] text-white shadow-xs"
                            : "bg-stone-100 text-stone-600 group-hover:text-[#700b10]"
                            }`}
                        >
                          {isOpen ? (
                            <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                          ) : (
                            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                          )}
                        </div>
                      </div>
                    </button>
                    {isOpen && (
                      <div className="pb-5 pt-1 text-stone-600 text-xs sm:text-[14px] leading-relaxed pr-6 animate-fadeIn font-nunito">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

          {/* Deep Maroon Contact Card at Bottom */}
          <div className="mt-12 bg-[#700b10] text-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center shadow-sm">
            <h3 className="font-serif text-xl sm:text-2xl text-white font-normal mb-2">
              Have More Questions?
            </h3>
            <p className="text-xs sm:text-[13.5px] text-stone-200 leading-relaxed max-w-lg mx-auto mb-5 font-light">
              Reach out to us directly via WhatsApp or phone. We are devoted to ensuring your satisfaction.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm">
              <a
                href="https://api.whatsapp.com/send/?phone=919726778118&text=Hello%21+I+would+like+to+inquire+about+your+products.&type=phone_number&app_absent=0"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-[#ebd99c] hover:text-white px-4 py-2.5 rounded-xl border border-white/15 transition-all font-semibold"
              >
                <svg className="w-4 h-4 fill-[#25D366] flex-shrink-0" viewBox="0 0 24 24">
                  <path d="M12.031 0C5.397 0 .001 5.397.001 12.032c0 2.118.552 4.184 1.6 6l-1.7 6.208 6.35-1.666a12.002 12.002 0 0 0 5.78 1.488h.005c6.633 0 12.03-5.397 12.03-12.032C24.066 5.397 18.667 0 12.031 0zm0 22.062a9.99 9.99 0 0 1-5.093-1.393l-.365-.217-3.779.991 1.008-3.684-.237-.378a9.99 9.99 0 1 1 8.466 4.681zm5.474-7.48c-.3-.15-1.774-.875-2.049-.975-.275-.1-.475-.15-.675.15-.2.3-.775.975-.95 1.175-.175.2-.35.225-.65.075-.3-.15-1.267-.467-2.413-1.489-.893-.796-1.495-1.78-1.67-2.08-.175-.3-.019-.462.131-.611.135-.134.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.675-1.625-.925-2.225-.244-.585-.492-.505-.675-.515-.175-.008-.375-.01-.575-.01-.2 0-.525.075-.8.375s-1.05 1.025-1.05 2.5 1.075 2.895 1.225 3.095c.15.2 2.115 3.23 5.125 4.53.716.31 1.275.495 1.71.634.719.229 1.373.197 1.89.12.577-.087 1.774-.725 2.024-1.425.25-.7.25-1.3.175-1.425-.075-.125-.275-.2-.575-.35z" />
                </svg>
                <span>WhatsApp: 97267 78118</span>
              </a>

              <a
                href="tel:+918238811190"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-[#ebd99c] hover:text-white px-4 py-2.5 rounded-xl border border-white/15 transition-all font-semibold"
              >
                <Phone className="w-4 h-4 text-[#ebd99c]" />
                <span>Call: +91 82388 11190</span>
              </a>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
