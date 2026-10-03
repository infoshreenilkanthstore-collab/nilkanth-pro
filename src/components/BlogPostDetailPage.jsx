import React, { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  Check,
  Tag,
  BookOpen,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { fetchBlogPostByHandle, fetchBlogNews } from "../services/api";
import { LOGO_URL } from "../data/storeData";

export default function BlogPostDetailPage({
  postHandle,
  onNavigate,
  onSelectPost,
  onSelectProduct,
}) {
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    window.scrollTo({ top: 0, behavior: "smooth" });

    async function loadPostData() {
      if (!postHandle) return;
      setLoading(true);
      try {
        const currentPost = await fetchBlogPostByHandle(postHandle);
        if (isMounted) {
          setPost(currentPost);
        }

        // Fetch recent/related articles for sidebar or bottom recommendations
        const allPostsRes = await fetchBlogNews({ page: 1, limit: 12 });
        if (isMounted && allPostsRes?.data?.posts) {
          const others = allPostsRes.data.posts.filter(
            (p) => p.handle !== postHandle,
          );
          setRelatedPosts(others.slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to load blog post detail:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadPostData();
    return () => {
      isMounted = false;
    };
  }, [postHandle]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Nilkanth Dham";
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "Nilkanth Dham";
    }
  };

  // Estimate reading time
  const getReadTime = (content) => {
    const text = (content || "").replace(/<[^>]*>/g, " ");
    const wordCount = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(wordCount / 180);
    return `${Math.max(2, minutes || 3)} min read`;
  };

  // Normalize HTML content from store.nilkanthdham.in to local relative routes
  const sanitizedContent = useMemo(() => {
    if (!post?.content) return post?.excerpt ? `<p>${post.excerpt}</p>` : "";
    return post.content
      .replace(/https?:\/\/store\.nilkanthdham\.in/gi, "")
      .replace(/https?:\/\/nilkanthdham\.in\/store/gi, "")
      .replace(/https?:\/\/nilkanthstore\.in/gi, "");
  }, [post?.content, post?.excerpt]);

  // Intercept links inside rendered HTML for smooth in-app SPA navigation
  const handleContentClick = (e) => {
    const link = e.target.closest("a");
    if (!link) return;

    const href = link.getAttribute("href") || "";
    if (!href || href === "#") return;

    const isExternal =
      (href.startsWith("http://") || href.startsWith("https://")) &&
      !href.includes(window.location.host) &&
      !href.includes("store.nilkanthdham.in") &&
      !href.includes("nilkanthdham.in");

    if (isExternal) {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
      return;
    }

    e.preventDefault();

    // 1. Product Match: /products/:handle
    const productMatch = href.match(/\/products\/([^/?#]+)/i);
    if (productMatch && productMatch[1]) {
      const productHandle = decodeURIComponent(productMatch[1]);
      if (onSelectProduct) {
        onSelectProduct(productHandle);
      } else if (onNavigate) {
        onNavigate("product", { productHandle });
      }
      return;
    }

    // 2. Collection Match: /collections/:handle or /collections
    const collectionMatch = href.match(/\/collections\/([^/?#]+)/i);
    if (collectionMatch && collectionMatch[1]) {
      const collectionHandle = decodeURIComponent(collectionMatch[1]);
      onNavigate?.("collections", { collectionHandle });
      return;
    } else if (href.includes("/collections")) {
      onNavigate?.("collections");
      return;
    }

    // 3. Blog Post Match: /blogs/:category/:handle or /blogs/:handle or /blog/:handle
    const blogMatch = href.match(/\/blogs?\/(?:news\/)?([^/?#]+)/i);
    if (blogMatch && blogMatch[1] && blogMatch[1] !== "news") {
      const pHandle = decodeURIComponent(blogMatch[1]);
      if (onSelectPost) {
        onSelectPost(pHandle);
      } else {
        onNavigate?.("blog-post", { postHandle: pHandle });
      }
      return;
    } else if (href.includes("/blogs") || href.includes("/blog")) {
      onNavigate?.("blogs");
      return;
    }

    // 4. Shop and Static Pages
    if (href.includes("/shop")) {
      onNavigate?.("shop");
    } else if (href.includes("/about")) {
      onNavigate?.("about");
    } else if (href.includes("/contact")) {
      onNavigate?.("contact");
    } else if (href.includes("/faq")) {
      onNavigate?.("faq");
    } else if (href.includes("/shipping")) {
      onNavigate?.("shipping-policy");
    } else if (href.includes("/return") || href.includes("/refund")) {
      onNavigate?.("return-policy");
    } else if (href.includes("/privacy")) {
      onNavigate?.("privacy-policy");
    } else if (href.includes("/terms")) {
      onNavigate?.("terms");
    } else {
      onNavigate?.("home");
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-[#ffffff] min-h-screen text-[#1c1917] font-nunito pb-24">
        {/* Breadcrumb Bar Skeleton */}
        <div className="w-full border-b border-stone-200/70 bg-white/80 py-3.5">
          <div className="max-w-[85rem] mx-auto px-4 sm:px-6">
            <div className="h-4 w-48 bg-stone-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Hero Skeleton */}
        <div className="w-full bg-[#700b10] py-16 px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="h-4 w-32 bg-white/20 rounded mx-auto animate-pulse" />
            <div className="h-10 w-3/4 bg-white/30 rounded mx-auto animate-pulse" />
            <div className="h-4 w-1/2 bg-white/20 rounded mx-auto animate-pulse" />
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="max-w-4xl mx-auto px-4 -mt-12">
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-md border border-stone-200 space-y-6">
            <div className="w-full h-80 bg-stone-200 rounded-2xl animate-pulse" />
            <div className="h-4 bg-stone-200 rounded w-full animate-pulse" />
            <div className="h-4 bg-stone-200 rounded w-5/6 animate-pulse" />
            <div className="h-4 bg-stone-200 rounded w-4/6 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="w-full bg-[#ffffff] min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20 font-nunito">
        <BookOpen className="w-16 h-16 text-[#b8944d] mb-4 opacity-50" />
        <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 mb-3">
          Article Not Found
        </h2>
        <p className="text-stone-500 text-sm max-w-md mb-6 leading-relaxed">
          The blog article you are looking for may have been moved or is
          currently unavailable.
        </p>
        <button
          type="button"
          onClick={() => onNavigate?.("blogs")}
          className="bg-[#700b10] hover:bg-[#851016] text-[#ebd99c] px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold shadow-md transition-colors cursor-pointer"
        >
          &larr; Back to All Blogs
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#ffffff] min-h-screen text-[#1c1917] font-nunito pb-20 sm:pb-28">
      {/* 1. Breadcrumb Bar */}
      <div className="w-full border-b border-stone-200/70 bg-white/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-500 truncate mr-4">
            <button
              type="button"
              onClick={() => onNavigate?.("home")}
              className="hover:text-[#700b10] transition-colors font-medium cursor-pointer"
            >
              Home
            </button>
            <span>/</span>
            <button
              type="button"
              onClick={() => onNavigate?.("blogs")}
              className="hover:text-[#700b10] transition-colors font-medium cursor-pointer"
            >
              Blogs
            </button>
            <span>/</span>
            <span className="text-[#700b10] font-semibold truncate max-w-[200px] sm:max-w-xs md:max-w-md">
              {post.title}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onNavigate?.("blogs")}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#700b10] hover:text-[#851016] bg-[#faedc4]/40 hover:bg-[#faedc4] px-3.5 py-1.5 rounded-full transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All Blogs
          </button>
        </div>
      </div>

      {/* 2. Top Deep Maroon Header Section */}
      <section className="w-full bg-[#700b10] text-white pt-10 pb-28 sm:pt-14 sm:pb-36 px-4 relative overflow-hidden text-center">
        {/* Decorative Golden Orbs */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-[#b8944d]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#ebd99c]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Tag & Source Badge */}

          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-white mb-4 leading-tight tracking-wide">
            {post.title}
          </h1>

          <div className="w-20 h-0.5 bg-[#ebd99c] mx-auto mb-4" />

          {/* Meta Information Bar */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-stone-300 font-medium">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#ebd99c]" />
              {formatDate(post.published_at)}
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#ebd99c]" />
              {getReadTime(post.content)}
            </span>
            <span>•</span>
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-[#ebd99c] hover:text-white transition-colors cursor-pointer bg-white/10 px-3 py-1 rounded-full"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300 text-xs">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="text-xs">Share</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* 3. Main Floating Article Card */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 -mt-20 sm:-mt-24 relative z-10">
        <article className="bg-white rounded-3xl p-5 sm:p-8 md:p-12 shadow-[0_15px_50px_rgba(0,0,0,0.08)] border border-stone-200/80">
          {/* Render Rich HTML Article Content with Clean Custom Styling */}
          <div
            onClick={handleContentClick}
            className="blog-detail-content prose prose-stone max-w-none 
              prose-headings:font-serif prose-headings:text-stone-900 prose-headings:font-normal
              prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:text-[#700b10]
              prose-h3:text-xl sm:prose-h3:text-2xl prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-stone-800
              prose-p:text-stone-700 prose-p:text-sm sm:prose-p:text-base prose-p:leading-relaxed prose-p:mb-4
              prose-a:text-[#700b10] prose-a:font-bold hover:prose-a:text-[#900e14] prose-a:underline
              prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6 prose-li:text-stone-700 prose-li:text-sm sm:prose-li:text-base prose-li:mb-2
              prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6 prose-li:text-stone-700 prose-li:text-sm sm:prose-li:text-base prose-li:mb-2
              prose-hr:border-stone-200 prose-hr:my-8"
            dangerouslySetInnerHTML={{
              __html: sanitizedContent,
            }}
          />

          {/* Devotional Footer Card inside Article */}
          <div className="mt-12 pt-8 border-t border-stone-200">
            <div className="bg-gradient-to-r from-[#fcfbf9] to-[#faf6ed] rounded-2xl p-5 sm:p-7 md:p-8 border border-[#ebd99c]/60 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6">
              <div className="flex items-center gap-4 text-center sm:text-left">
                {/* Official Authentic Brand Emblem Logo */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white p-1.5 shadow-[0_4px_18px_rgba(112,11,16,0.12)] border-2 border-[#ebd99c] flex items-center justify-center shrink-0">
                  <img
                    src={LOGO_URL}
                    alt="Shri Nilkanth Store Emblem"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h4 className="font-serif text-base sm:text-lg md:text-[19px] font-bold text-stone-900 tracking-wide">
                    Bhagvat Poojan &amp; Shri Nilkanth Store
                  </h4>
                  <p className="text-xs sm:text-[13px] text-stone-500 font-nunito mt-1 leading-snug">
                    Authentic Pooja Essentials, Natural Attars, and Pure Ayurvedic Care
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate?.("shop")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#700b10] hover:bg-[#851016] text-[#ebd99c] hover:text-white px-6 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md hover:shadow-lg shrink-0 group"
              >
                <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>Explore Shop</span>
              </button>
            </div>
          </div>
        </article>

        {/* 4. Related / Recent Articles Section */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 sm:mt-20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-serif text-2xl sm:text-3xl text-stone-900">
                  More Articles
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 mt-1">
                  Continue reading stories on devotional living and fragrances
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigate?.("blogs")}
                className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#700b10] hover:text-[#851016] cursor-pointer"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((item, idx) => (
                <div
                  key={item.handle || idx}
                  onClick={() => {
                    if (onSelectPost) onSelectPost(item.handle);
                    else onNavigate?.("blog-post", { postHandle: item.handle });
                  }}
                  className="bg-white rounded-2xl border border-stone-200/80 p-4 hover:border-[#b8944d] hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    {item.image_url && (
                      <div className="w-full h-40 rounded-xl overflow-hidden bg-stone-100 mb-3.5">
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="text-[11px] text-stone-400 font-medium mb-1.5 flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-[#b8944d]" />
                      {formatDate(item.published_at)}
                    </div>
                    <h4 className="font-serif text-base font-bold text-stone-800 group-hover:text-[#700b10] transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h4>
                  </div>

                  <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-[#700b10]">
                    <span>Read Article</span>
                    <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
