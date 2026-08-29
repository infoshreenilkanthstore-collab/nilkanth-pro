"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqData = [
  {
    question: "Why Is COD (Cash On Delivery) Not Available At Shree Nilkanth Store?",
    answer: "To ensure smooth order processing and avoid returns of fragile pooja items like kalash, murtis, and copper products, we currently accept only prepaid orders.",
  },
  {
    question: "What Is Shree Nilkanth Store?",
    answer: "Shree Nilkanth Store is an online spiritual and pooja essentials shop offering Pital & Copper items, Pooja Samagri, Attar & Aroma products, Agarbatti–Dhoop, Aushadhi, Cosmetics, and devotional gift items.",
  },
  {
    question: "How Are Shree Nilkanth Store Products Different From Others?",
    answer: "At Shree Nilkanth Store, many of our pooja items are first offered to the divine before they reach you. This makes every product not just a purchase, but a blessed offering filled with spiritual value and purity.",
  },
  {
    question: "Are Shree Nilkanth Store Products Completely Suitable For Pooja?",
    answer: "Yes. All items—from Kalash and Lota to Chandan Powder, Agarbatti, Kanthi Mala, and Murti—are pooja-friendly and prepared according to spiritual standards.",
  },
  {
    question: "Is Shree Nilkanth Store Only For Religious Purposes?",
    answer: "While most products are pooja-related, we also offer everyday-use items such as attars, perfumes, herbal cosmetics, and decorative gift items suitable for home and personal use.",
  },
  {
    question: "What Varieties Of Pooja Items Do You Offer?",
    answer: "We offer Pital & Copper items, Murti, Kanthi Mala, Chandan Powder, Toran, Agarbatti–Dhoop, Attar, Perfumes, Air Fresheners, Aushadhi, Face & Hair products, and many spiritual accessories..",
  },
  {
    question: "How Do You Ensure Quality And Purity?",
    answer: "Every item is checked for authenticity—metal products for material purity, pooja samagri for freshness, and aushadhi–cosmetic items for herbal safety and quality.",
  },
  {
    question: "Can Shree Nilkanth Store Products Be Given As A Gift?",
    answer: "Yes. Items like murtis, car stands, toran, attars, and decorative pooja products make beautiful and meaningful spiritual gifts for any occasion.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-white py-4 md:py-8">
      <div className="max-w-7xl mx-auto px-2">
        {/* Section Heading */}
        <h2 className="text-center text-2xl md:text-5xl font-nunito text-[#700b10] font-bold md:mb-16 mb-4 tracking-tight">
          Frequently Asked Questions
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 md:gap-12 gap-6 items-start">
          {/* Left Side: Image Placeholder */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl group border-4 border-white">
            <div className="aspect-square bg-gray-200">
              {/* User can replace this src with their actual image */}
              <img
                src="https://cdn.shopify.com/s/files/1/0804/0867/4532/files/unnamed_16.jpg?v=1774250403"
                alt="FAQ Illustration"
                className="w-full h-full object-cover transition-transform duration-700 "
              />
            </div>
          </div>

          {/* Right Side: Accordion */}
          <div className="space-y-4">
            {faqData.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="border-b border-gray-200 last:border-0"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full md:py-5 py-2 flex justify-between items-center text-left group transition-all"
                  >
                    <span
                      className={`text-sm md:text-base font-bold transition-colors duration-300 ${isOpen ? "text-[#700b10]" : "text-gray-900 group-hover:text-[#700b10]"
                        }`}
                    >
                      {faq.question}
                    </span>
                    <div className="flex-shrink-0 ml-4">
                      {isOpen ? (
                        <Minus size={20} className="text-[#700b10]" />
                      ) : (
                        <Plus size={20} className="text-gray-400 group-hover:text-[#700b10]" />
                      )}
                    </div>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[500px] pb-6 opacity-100" : "max-h-0 opacity-0"
                      }`}
                  >
                    <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
