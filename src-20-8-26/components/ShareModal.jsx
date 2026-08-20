"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Copy, Check, Share2, MessageCircle, Mail, Globe } from "lucide-react";
import { FaWhatsapp, FaFacebookF, FaTwitter, FaTelegramPlane, FaPinterestP } from "react-icons/fa";
import toast from "react-hot-toast";

export default function ShareModal({ isOpen, onClose, product }) {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof navigator !== "undefined" && navigator.share) {
      setCanNativeShare(true);
    }
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKey);
      setCopied(false);
    }
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!mounted || !isOpen || !product) return null;

  const p = product?.node || product;
  const title = p.title || "Check out this product";
  const handle = p.handle || p.id;
  
  // Construct absolute URL
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const shareUrl = `${origin}/products/${handle}`;
  
  // Price formatting
  const price = p.priceRange?.minVariantPrice?.amount || p.price || (p.variants?.[0]?.price?.amount || p.variants?.[0]?.price) || "";
  const formattedPrice = price ? ` - ₹${Number(price).toLocaleString("en-IN")}` : "";
  const shareText = `Check out ${title}${formattedPrice} on Nilkanth Store:`;

  // First image for preview
  const firstImage = p.images?.edges?.[0]?.node?.url || p.images?.[0]?.url || p.images?.[0]?.src || p.image || "";

  const handleCopyLink = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = shareUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy link");
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Native share error:", err);
        }
      }
    }
  };

  const socialLinks = [
    {
      name: "WhatsApp",
      icon: FaWhatsapp,
      color: "bg-[#25D366] hover:bg-[#20ba59] text-white",
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
    },
    {
      name: "Facebook",
      icon: FaFacebookF,
      color: "bg-[#1877F2] hover:bg-[#166fe5] text-white",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "X (Twitter)",
      icon: FaTwitter,
      color: "bg-[#000000] hover:bg-[#222222] text-white",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "Telegram",
      icon: FaTelegramPlane,
      color: "bg-[#229ED9] hover:bg-[#1f8ec3] text-white",
      url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
    },
    {
      name: "Pinterest",
      icon: FaPinterestP,
      color: "bg-[#E60023] hover:bg-[#cc001f] text-white",
      url: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(firstImage)}&description=${encodeURIComponent(shareText)}`,
    },
    {
      name: "Email",
      icon: Mail,
      color: "bg-[#4B5563] hover:bg-[#374151] text-white",
      url: `mailto:?subject=${encodeURIComponent(`Product Recommendation: ${title}`)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`,
    },
  ];

  return createPortal(
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl z-10 border border-gray-100 transform transition-all animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#700b10]/10 flex items-center justify-center text-[#700b10]">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 font-nunito">Share Product</h3>
              <p className="text-[11px] text-gray-500 font-medium">Spread the word with friends & family</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Preview Snippet */}
        <div className="px-6 pt-4 pb-2">
          <div className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-2xl border border-gray-100">
            {firstImage ? (
              <img
                src={firstImage}
                alt={title}
                className="w-14 h-14 object-cover rounded-xl border border-gray-200 bg-white flex-shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-gray-200 flex items-center justify-center text-xs text-gray-400 flex-shrink-0">
                Item
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-gray-900 line-clamp-1 font-nunito">
                {title}
              </h4>
              {price && (
                <p className="text-xs font-extrabold text-[#700b10] mt-0.5">
                  ₹{Number(price).toLocaleString("en-IN")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Social Share Grid */}
        <div className="px-6 py-4">
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-3 font-nunito">
            Share via Social Apps
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-3 gap-2.5">
            {socialLinks.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    // if it's mailto, let default handle; otherwise open popup window
                    if (!item.url.startsWith("mailto:")) {
                      e.preventDefault();
                      window.open(item.url, "_blank", "width=600,height=500,scrollbars=yes,resizable=yes");
                    }
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl ${item.color} shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all duration-200 gap-1.5`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[11px] font-bold tracking-tight">{item.name}</span>
                </a>
              );
            })}
          </div>

          {canNativeShare && (
            <button
              onClick={handleNativeShare}
              className="mt-2.5 w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-2xl text-xs font-bold transition-all active:scale-[0.98]"
            >
              <Globe className="w-4 h-4 text-[#700b10]" />
              <span>More Sharing Options...</span>
            </button>
          )}
        </div>

        {/* Copy Link Section */}
        <div className="px-6 pb-6 pt-1">
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2 font-nunito">
            Or Copy Product Link
          </label>
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl p-1.5 focus-within:border-[#700b10] transition-colors">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-transparent px-3 text-xs text-gray-600 outline-none select-all font-mono"
            />
            <button
              onClick={handleCopyLink}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 shadow-sm ${
                copied
                  ? "bg-emerald-600 text-white"
                  : "bg-[#700b10] hover:bg-[#5a090d] text-white active:scale-95"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
