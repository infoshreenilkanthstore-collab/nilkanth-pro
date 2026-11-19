import React, { useState, useMemo } from "react";
import { Plus, Minus } from "lucide-react";

/**
 * Parses raw FAQ string or object from product metafields
 * Supports:
 * - "Frequently Asked Questions...\n\nQ1. Question?\nAnswer\n\nQ2. Question?\nAnswer..."
 * - "Q1: Question?\nA: Answer..."
 * - JSON stringified arrays or objects
 */
export function parseFaqMetafield(metafields) {
  if (!Array.isArray(metafields) || metafields.length === 0) return [];

  const faqField = metafields.find(
    (m) =>
      (m?.key && String(m.key).trim().toLowerCase() === "faq") ||
      (m?.definition_name && String(m.definition_name).trim().toLowerCase() === "faq")
  );

  if (!faqField || !faqField.value) return [];
  const rawVal = faqField.value;

  // 1. JSON array/object handling
  if (Array.isArray(rawVal)) return rawVal;
  if (typeof rawVal === "string" && (rawVal.trim().startsWith("[") || rawVal.trim().startsWith("{"))) {
    try {
      const parsed = JSON.parse(rawVal);
      if (Array.isArray(parsed)) return parsed;
      if (parsed && Array.isArray(parsed.faqs)) return parsed.faqs;
    } catch (_) {}
  }

  if (typeof rawVal !== "string") return [];

  // 2. Parse text with Q1., Q2., Q:, Q., etc.
  const lines = rawVal
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const faqs = [];
  let currentQ = "";
  let currentA = [];
  const isQuestionLine = (l) => /^Q\d*[\.\:\-]\s*/i.test(l);

  for (const line of lines) {
    if (isQuestionLine(line)) {
      if (currentQ) {
        faqs.push({
          question: currentQ,
          answer: currentA.join(" ").trim(),
        });
      }
      currentQ = line;
      currentA = [];
    } else if (currentQ) {
      currentA.push(line);
    }
  }

  if (currentQ) {
    faqs.push({
      question: currentQ,
      answer: currentA.join(" ").trim(),
    });
  }

  // 3. Fallback: single block if no Q format detected
  if (faqs.length === 0 && rawVal.trim()) {
    return [{ question: "FAQ", answer: rawVal.trim() }];
  }

  return faqs;
}

export default function ProductFaqAccordion({ metafields, defaultOpen = false, className = "" }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const faqs = useMemo(() => parseFaqMetafield(metafields), [metafields]);

  // If no FAQ metafield exists for this product, render nothing
  if (!faqs || faqs.length === 0) {
    return null;
  }

  return (
    <div className={`pt-4 mt-4 border-t border-stone-200 ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-2 text-left group cursor-pointer"
        aria-expanded={isOpen}
      >
        <span className="font-serif text-base sm:text-lg text-stone-900 tracking-wide font-normal group-hover:text-[#700b10] transition-colors">
          FAQ
        </span>
        <div className="w-6 h-6 flex items-center justify-center text-stone-700 group-hover:text-[#700b10] transition-colors">
          {isOpen ? (
            <Minus className="w-4 h-4 stroke-[2]" />
          ) : (
            <Plus className="w-4 h-4 stroke-[2]" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="pt-3 pb-2 space-y-4 text-stone-700 text-xs sm:text-[13px] leading-relaxed font-sans animate-fadeIn">
          {faqs.map((item, idx) => (
            <div key={idx} className={idx > 0 ? "pt-3.5 border-t border-stone-100" : ""}>
              <h4 className="font-bold text-stone-900 mb-1 leading-snug">
                {item.question || item.q}
              </h4>
              <p className="text-stone-700 leading-relaxed font-normal">
                {item.answer || item.a}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
