import React, { useState, useEffect, lazy, Suspense } from "react";
import AnnouncementBar from "./components/AnnouncementBar";
import Header from "./components/Header";
import HeroBanner from "./components/HeroBanner";
import ProductMarquee from "./components/ProductMarquee";
import HomeCollectionsSection from "./components/HomeCollectionsSection";
import NewArrivalsSlider from "./components/NewArrivalsSlider";
import FeaturedCollection from "./components/FeaturedCollection";
import BestSellerSection from "./components/BestSellerSection";
import FAQSection from "./components/FAQSection";
import DualPromoBanners from "./components/DualPromoBanners";
import CategoryGrid from "./components/CategoryGrid";
import TrustMarquee from "./components/TrustMarquee";
import SeoAccordions from "./components/SeoAccordions";
import WishlistDrawer from "./components/WishlistDrawer";
import CartDrawer from "./components/CartDrawer";
import Footer from "./components/Footer";
import FloatingActions from "./components/FloatingActions";
import MobileDock from "./components/MobileDock";
import { WishlistProvider } from "./context/WishlistContext";
import { CartProvider } from "./context/CartContext";
import { fetchCustomerProfile } from "./services/api";
import { trackPageView } from "./services/analytics";

// Lazy-loaded secondary pages (downloaded on-demand when navigated to)
const ProductPage = lazy(() => import("./components/ProductPage"));
const ShopPage = lazy(() => import("./components/ShopPage"));
const CollectionsPage = lazy(() => import("./components/CollectionsPage"));
const AboutUsPage = lazy(() => import("./components/AboutUsPage"));
const ContactUsPage = lazy(() => import("./components/ContactUsPage"));
const ReturnPolicyPage = lazy(() => import("./components/ReturnPolicyPage"));
const PrivacyPolicyPage = lazy(() => import("./components/PrivacyPolicyPage"));
const TermsAndConditionsPage = lazy(() => import("./components/TermsAndConditionsPage"));
const ShippingPolicyPage = lazy(() => import("./components/ShippingPolicyPage"));
const FAQPage = lazy(() => import("./components/FAQPage"));
const BlogListPage = lazy(() => import("./components/BlogListPage"));
const BlogPostDetailPage = lazy(() => import("./components/BlogPostDetailPage"));
const SearchPage = lazy(() => import("./components/SearchPage"));
const ProfilePage = lazy(() => import("./components/ProfilePage"));
const WishlistPage = lazy(() => import("./components/WishlistPage"));

// Lazy-loaded checkout & payment gateway pages
const CheckoutPage = lazy(() => import("./components/checkout/CheckoutPage"));
const CheckoutSuccessPage = lazy(() => import("./components/checkout/CheckoutSuccessPage"));
const GatewayCallbackPage = lazy(() => import("./components/checkout/GatewayCallbackPage"));

// Lazy-loaded modals
const ProductDetailModal = lazy(() => import("./components/ProductDetailModal"));
const SearchModal = lazy(() => import("./components/SearchModal"));
const AuthModal = lazy(() => import("./components/AuthModal"));

function PageLoadingFallback() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center py-20">
      <div className="w-8 h-8 border-3 border-stone-200 border-t-[#700b10] rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [completedOrderData, setCompletedOrderData] = useState(() => {
    try {
      const saved = sessionStorage.getItem("nilkanth_pending_checkout");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("customer_profile");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Verify and refresh profile in background if token exists
  useEffect(() => {
    if (localStorage.getItem("customer_token")) {
      fetchCustomerProfile().then((profile) => {
        if (profile) setCurrentUser(profile);
      });
    }
  }, []);

  // ── Track initial page view on app load ──
  useEffect(() => {
    trackPageView();
  }, []);

  // Helper to extract page, collection handle, and product handle from window.location
  const getRouteInfo = () => {
    const pathname = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search;
    const fullPath = pathname + hash + search;

    // 0. Check for search: /search
    if (fullPath.includes("/search") || fullPath.includes("?q=")) {
      const urlParams = new URLSearchParams(window.location.search);
      const queryParam = urlParams.get("q") || "";
      return {
        page: "search",
        collectionHandle: null,
        productHandle: null,
        postHandle: null,
        searchQuery: queryParam,
      };
    }

    // 1. Check for specific product: /products/:handle
    const productMatch = pathname.match(/\/products\/([^/?#]+)/i);
    if (productMatch && productMatch[1]) {
      return {
        page: "product",
        collectionHandle: null,
        productHandle: decodeURIComponent(productMatch[1]),
        searchQuery: ""
      };
    }

    // 2. Check for specific collection: /collections/:handle
    const collectionMatch = pathname.match(/\/collections\/([^/?#]+)/i);
    if (collectionMatch && collectionMatch[1]) {
      return {
        page: "collections",
        collectionHandle: decodeURIComponent(collectionMatch[1]),
        productHandle: null,
        postHandle: null,
        searchQuery: ""
      };
    }

    // 3. Check for specific blog post: /blogs/:category/:handle or /blogs/:handle or /blog/:handle
    const blogPostMatch = pathname.match(/\/blogs?\/(?:news\/)?([^/?#]+)/i);
    if (blogPostMatch && blogPostMatch[1] && blogPostMatch[1] !== "news") {
      return {
        page: "blog-post",
        collectionHandle: null,
        productHandle: null,
        postHandle: decodeURIComponent(blogPostMatch[1]),
        searchQuery: ""
      };
    }

    if (fullPath.includes("/checkout/callback/icici")) {
      return { page: "callback-icici", collectionHandle: null, productHandle: null, postHandle: null, searchQuery: "" };
    }
    if (fullPath.includes("/checkout/callback/easebuzz")) {
      return { page: "callback-easebuzz", collectionHandle: null, productHandle: null, postHandle: null, searchQuery: "" };
    }
    if (fullPath.includes("/checkout/success") || fullPath.includes("checkout-success")) {
      return { page: "checkout-success", collectionHandle: null, productHandle: null, postHandle: null, searchQuery: "" };
    }
    if (fullPath.includes("/checkout")) {
      return { page: "checkout", collectionHandle: null, productHandle: null, postHandle: null, searchQuery: "" };
    }

    if (fullPath.includes("blog") || fullPath.includes("news")) {
      return { page: "blogs", collectionHandle: null, productHandle: null, postHandle: null, searchQuery: "" };
    }

    if (fullPath.includes("faq")) {
      return { page: "faq", collectionHandle: null, productHandle: null, postHandle: null, searchQuery: "" };
    }
    if (fullPath.includes("shipping")) {
      return { page: "shipping-policy", collectionHandle: null, productHandle: null, searchQuery: "" };
    }
    if (fullPath.includes("terms") || fullPath.includes("condition")) {
      return { page: "terms", collectionHandle: null, productHandle: null, searchQuery: "" };
    }
    if (fullPath.includes("privacy")) {
      return { page: "privacy-policy", collectionHandle: null, productHandle: null, searchQuery: "" };
    }
    if (fullPath.includes("return") || fullPath.includes("refund")) {
      return { page: "return-policy", collectionHandle: null, productHandle: null, searchQuery: "" };
    }
    if (fullPath.includes("contact")) {
      return { page: "contact", collectionHandle: null, productHandle: null, searchQuery: "" };
    }
    if (fullPath.includes("wishlist")) {
      return { page: "wishlist", collectionHandle: null, productHandle: null, postHandle: null, searchQuery: "" };
    }
    if (fullPath.includes("profile") || fullPath.includes("account")) {
      return { page: "profile", collectionHandle: null, productHandle: null, postHandle: null, searchQuery: "" };
    }
    if (fullPath.includes("about")) {
      return { page: "about", collectionHandle: null, productHandle: null, searchQuery: "" };
    }
    if (fullPath.includes("collections")) {
      return { page: "collections", collectionHandle: null, productHandle: null, searchQuery: "" };
    }
    if (fullPath.includes("shop")) {
      return { page: "shop", collectionHandle: null, productHandle: null, searchQuery: "" };
    }
    return { page: "home", collectionHandle: null, productHandle: null, searchQuery: "" };
  };

  const initialRoute = getRouteInfo();
  const [activePage, setActivePage] = useState(initialRoute.page);
  const [currentCollectionHandle, setCurrentCollectionHandle] = useState(initialRoute.collectionHandle);
  const [currentProductHandle, setCurrentProductHandle] = useState(initialRoute.productHandle);
  const [currentPostHandle, setCurrentPostHandle] = useState(initialRoute.postHandle);
  const [searchQuery, setSearchQuery] = useState(initialRoute.searchQuery || "");

  // Sync state if user clicks browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const route = getRouteInfo();
      setActivePage(route.page);
      setCurrentCollectionHandle(route.collectionHandle);
      setCurrentProductHandle(route.productHandle);
      setCurrentPostHandle(route.postHandle);
      setSearchQuery(route.searchQuery || "");
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const handleNavigate = (page, options = {}) => {
    let targetPage = page;
    let colHandle = options.collectionHandle || null;
    let prodHandle = options.productHandle || null;

    if (page === "product" && prodHandle) {
      targetPage = "product";
      setCurrentProductHandle(prodHandle);
      setCurrentCollectionHandle(null);
      window.history.pushState(
        { page: "product", productHandle: prodHandle },
        "",
        `/products/${prodHandle}`
      );
    } else if (colHandle || page === "collection-detail") {
      targetPage = "collections";
      setCurrentCollectionHandle(colHandle);
      setCurrentProductHandle(null);
      window.history.pushState(
        { page: "collections", collectionHandle: colHandle },
        "",
        `/collections/${colHandle}`
      );

    } else if (page === "blog-post" && (options.postHandle || options.handle)) {
      const pHandle = options.postHandle || options.handle;
      targetPage = "blog-post";
      setCurrentPostHandle(pHandle);
      setCurrentCollectionHandle(null);
      setCurrentProductHandle(null);
      window.history.pushState(
        { page: "blog-post", postHandle: pHandle },
        "",
        `/blogs/news/${pHandle}`
      );
    } else if (page === "blogs" || page === "blog" || page === "news") {
      targetPage = "blogs";
      setCurrentPostHandle(null);
      setCurrentCollectionHandle(null);
      setCurrentProductHandle(null);
      window.history.pushState({ page: "blogs" }, "", "/blogs/news");
    } else if (page === "faq" || page === "faqs") {
      targetPage = "faq";
      setCurrentPostHandle(null);
      setCurrentCollectionHandle(null);
      setCurrentProductHandle(null);
      window.history.pushState({ page: "faq" }, "", "/faq");
    } else if (page === "shipping" || page === "shipping-policy") {
      targetPage = "shipping-policy";
      setCurrentCollectionHandle(null);
      setCurrentProductHandle(null);
      window.history.pushState({ page: "shipping-policy" }, "", "/shipping-policy");
    } else if (page === "terms" || page === "terms-and-conditions") {
      targetPage = "terms";
      setCurrentCollectionHandle(null);
      setCurrentProductHandle(null);
      window.history.pushState({ page: "terms" }, "", "/terms");
    } else if (page === "privacy-policy" || page === "privacy") {
      targetPage = "privacy-policy";
      setCurrentCollectionHandle(null);
      setCurrentProductHandle(null);
      window.history.pushState({ page: "privacy-policy" }, "", "/privacy-policy");
    } else if (page === "return-policy" || page === "refund-policy") {
      targetPage = "return-policy";
      setCurrentCollectionHandle(null);
      setCurrentProductHandle(null);
      window.history.pushState({ page: "return-policy" }, "", "/return-policy");
    } else if (page === "contact") {
      targetPage = "contact";
      setCurrentCollectionHandle(null);
      setCurrentProductHandle(null);
      window.history.pushState({ page: "contact" }, "", "/contact");
    } else if (page === "about") {
      targetPage = "about";
      setCurrentCollectionHandle(null);
      setCurrentProductHandle(null);
      window.history.pushState({ page: "about" }, "", "/about");
    } else if (page === "profile" || page === "account") {
      targetPage = "profile";
      setCurrentCollectionHandle(null);
      setCurrentProductHandle(null);
      setCurrentPostHandle(null);
      window.history.pushState({ page: "profile" }, "", "/account");
    } else if (page === "wishlist") {
      targetPage = "wishlist";
      setCurrentCollectionHandle(null);
      setCurrentProductHandle(null);
      setCurrentPostHandle(null);
      window.history.pushState({ page: "wishlist" }, "", "/wishlist");
    } else if (page === "collections") {
      targetPage = "collections";
      setCurrentCollectionHandle(null);
      setCurrentProductHandle(null);
      window.history.pushState({ page: "collections" }, "", "/collections");
    } else if (page === "shop") {
      targetPage = "shop";
      setCurrentCollectionHandle(null);
      setCurrentProductHandle(null);
      window.history.pushState({ page: "shop" }, "", "/shop");
    } else if (page === "checkout") {
      targetPage = "checkout";
      setCurrentCollectionHandle(null);
      setCurrentProductHandle(null);
      setCurrentPostHandle(null);
      window.history.pushState({ page: "checkout" }, "", "/checkout");
    } else if (page === "checkout-success") {
      targetPage = "checkout-success";
      if (options.orderData) {
        setCompletedOrderData(options.orderData);
      }
      setCurrentCollectionHandle(null);
      setCurrentProductHandle(null);
      setCurrentPostHandle(null);
      window.history.pushState({ page: "checkout-success" }, "", "/checkout/success");
    } else if (page === "callback-icici") {
      targetPage = "callback-icici";
      setCurrentCollectionHandle(null);
      setCurrentProductHandle(null);
      setCurrentPostHandle(null);
      window.history.pushState({ page: "callback-icici" }, "", "/checkout/callback/icici");
    } else if (page === "callback-easebuzz") {
      targetPage = "callback-easebuzz";
      setCurrentCollectionHandle(null);
      setCurrentProductHandle(null);
      setCurrentPostHandle(null);
      window.history.pushState({ page: "callback-easebuzz" }, "", "/checkout/callback/easebuzz");
    } else if (page === "search") {
      targetPage = "search";
      const q = options.q || options.query || "";
      setSearchQuery(q);
      setCurrentCollectionHandle(null);
      setCurrentProductHandle(null);
      setCurrentPostHandle(null);
      const searchUrl = q ? `/search?q=${encodeURIComponent(q)}` : "/search";
      window.history.pushState({ page: "search", searchQuery: q }, "", searchUrl);
    } else {
      targetPage = "home";
      setCurrentCollectionHandle(null);
      setCurrentProductHandle(null);
      window.history.pushState({ page: "home" }, "", "/");
    }

    setActivePage(targetPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
    // ── Fire GA4 page_view + Meta Pixel PageView on every SPA navigation ──
    trackPageView();
  };

  // Handler when any product is clicked anywhere across the app
  const handleProductSelect = (prod) => {
    if (!prod) return;
    const handle = typeof prod === "string" ? prod : (prod.handle || prod.id);
    if (handle) {
      handleNavigate("product", { productHandle: handle });
    }
  };

  return (
    <CartProvider>
      <WishlistProvider
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
      >
        <div className="min-h-screen bg-[#ffffff] text-[#1c1917] font-nunito flex flex-col antialiased pb-16 md:pb-0">
          {/* Top Free Shipping Banner */}
          <AnnouncementBar />

          {/* Floating Pill Header with Centered Overlapping Logo */}
          <Header
            activePage={activePage}
            onNavigate={handleNavigate}
            onOpenSearch={() => setSearchModalOpen(true)}
            onOpenAuth={() => setAuthModalOpen(true)}
            currentUser={currentUser}
          />

          {/* Main Content */}
          <main className="flex-1">
            <Suspense fallback={<PageLoadingFallback />}>
              {activePage === "checkout" ? (
                /* Dedicated Multi-Step Checkout & Abandoned Cart Recovery Page */
                <CheckoutPage
                  currentUser={currentUser}
                  onNavigate={handleNavigate}
                  onOpenAuthModal={() => setAuthModalOpen(true)}
                  onOrderCompleted={(order) => setCompletedOrderData(order)}
                />
              ) : activePage === "checkout-success" ? (
                /* Dedicated Order Confirmation Page */
                <CheckoutSuccessPage
                  orderData={completedOrderData}
                  onNavigate={handleNavigate}
                />
              ) : activePage === "callback-icici" ? (
                /* ICICI Eazypay Payment Callback */
                <GatewayCallbackPage
                  provider="icici"
                  onNavigate={handleNavigate}
                  onPaymentVerified={(order) => setCompletedOrderData(order)}
                />
              ) : activePage === "callback-easebuzz" ? (
                /* Easebuzz Payment Callback */
                <GatewayCallbackPage
                  provider="easebuzz"
                  onNavigate={handleNavigate}
                  onPaymentVerified={(order) => setCompletedOrderData(order)}
                />
              ) : activePage === "search" ? (
                /* Dedicated Universal Search Page */
                <SearchPage
                  initialQuery={searchQuery}
                  onNavigate={handleNavigate}
                  onSelectProduct={handleProductSelect}
                />
              ) : activePage === "product" && currentProductHandle ? (
                /* Dedicated Full-Page Product Details */
                <ProductPage
                  key={`product_${currentProductHandle}`}
                  productHandle={currentProductHandle}
                  onNavigate={handleNavigate}
                  onSelectProduct={handleProductSelect}
                />

              ) : activePage === "blog-post" && currentPostHandle ? (
                /* Dedicated Dynamic Single Blog Post Detail Page */
                <BlogPostDetailPage
                  key={`blog_post_${currentPostHandle}`}
                  postHandle={currentPostHandle}
                  onNavigate={handleNavigate}
                  onSelectPost={(postHandle) => handleNavigate("blog-post", { postHandle })}
                  onSelectProduct={handleProductSelect}
                />
              ) : activePage === "blogs" ? (
                /* Dedicated Dynamic Blog List Page */
                <BlogListPage
                  onNavigate={handleNavigate}
                  onSelectPost={(postHandle) => handleNavigate("blog-post", { postHandle })}
                />
              ) : activePage === "faq" ? (
                /* Dedicated FAQ Page */
                <FAQPage onNavigate={handleNavigate} />
              ) : activePage === "shipping-policy" ? (
                /* Dedicated Shipping Policy Page */
                <ShippingPolicyPage onNavigate={handleNavigate} />
              ) : activePage === "terms" ? (
                /* Dedicated Terms & Conditions Page */
                <TermsAndConditionsPage onNavigate={handleNavigate} />
              ) : activePage === "privacy-policy" ? (
                /* Dedicated Privacy Policy Page */
                <PrivacyPolicyPage onNavigate={handleNavigate} />
              ) : activePage === "return-policy" ? (
                /* Dedicated Return Policy Page */
                <ReturnPolicyPage onNavigate={handleNavigate} />
              ) : activePage === "contact" ? (
                /* Dedicated Contact Us Page matching reference website */
                <ContactUsPage onNavigate={handleNavigate} />
              ) : activePage === "about" ? (
                /* Dedicated About Us Page matching reference website */
                <AboutUsPage onNavigate={handleNavigate} />
              ) : activePage === "profile" || activePage === "account" ? (
                /* Dedicated Customer Profile & Account Page matching reference design */
                <ProfilePage
                  currentUser={currentUser}
                  onLogout={() => setCurrentUser(null)}
                  onNavigate={handleNavigate}
                  onOpenAuth={() => setAuthModalOpen(true)}
                />
              ) : activePage === "wishlist" ? (
                /* Dedicated Customer Wishlist Page */
                <WishlistPage
                  onNavigate={handleNavigate}
                  onSelectProduct={handleProductSelect}
                />
              ) : activePage === "collections" ? (
                /* Dedicated Our Collections Page from live megaecomm API */
                <CollectionsPage
                  key={`collections_${currentCollectionHandle || 'all'}`}
                  collectionHandle={currentCollectionHandle}
                  onNavigate={handleNavigate}
                  onSelectProduct={handleProductSelect}
                  onSelectCollection={(col) => {
                    const handle = col.handle || col.slug || col.title.toLowerCase().replace(/\s+/g, '-');
                    handleNavigate("collections", { collectionHandle: handle });
                  }}
                />
              ) : activePage === "shop" ? (
                /* Dedicated Shop Page */
                <ShopPage
                  key={`shop_${currentCollectionHandle || 'all'}`}
                  collectionHandle={currentCollectionHandle}
                  onNavigate={handleNavigate}
                  onSelectProduct={handleProductSelect}
                />
              ) : (
                /* Homepage Layout */
                <>
                  {/* Dynamic Responsive Hero Carousel (Desktop + Mobile) */}
                  <HeroBanner />

                  {/* Dynamic Product Running Marquee (Directly Below Hero Banner, Touching with 0 Top Space) */}
                  <ProductMarquee
                    onSelectProduct={handleProductSelect}
                  />

                  {/* Dynamic Collections Showcase: 5 Columns on Desktop/Laptop & 2-Column Slider on Mobile/Tablet */}
                  <HomeCollectionsSection
                    onNavigate={handleNavigate}
                    onSelectCollection={(col) => {
                      const handle = col.handle || col.slug || col.title.toLowerCase().replace(/\s+/g, "-");
                      handleNavigate("collections", { collectionHandle: handle });
                    }}
                  />

                  {/* New Arrivals Auto-Slide Section */}
                  <NewArrivalsSlider
                    onSelectProduct={handleProductSelect}
                  />

                  {/* Mandir Decor Feature Collection */}
                  <FeaturedCollection onNavigate={handleNavigate} />

                  {/* Best Seller Circular Showcase (Directly Below Featured Collection) */}
                  <BestSellerSection
                    onSelectProduct={handleProductSelect}
                  />

                  {/* Annakut Prasad (Bhagvat Prasadam) & Pooja Samagri (Shri Nilkanth Store) Dual Promo Banners */}
                  <DualPromoBanners onNavigate={handleNavigate} />

                  {/* Frequently Asked Questions */}
                  <FAQSection />

                  {/* Image Gallery */}
                  <CategoryGrid onNavigate={handleNavigate} />

                  {/* 8,00,000+ Devotees Trust Us Ticker */}
                  <TrustMarquee />

                  {/* SEO Dropdown Accordions (Directly Below Trust Marquee) */}
                  <SeoAccordions onNavigate={handleNavigate} />
                </>
              )}
            </Suspense>
          </main>

          {/* Footer */}
          <Footer onNavigate={handleNavigate} />

          {/* Product Detail Modal / Quick View (if a product is clicked) */}
          {selectedProduct && (
            <Suspense fallback={null}>
              <ProductDetailModal
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
              />
            </Suspense>
          )}

          {/* Global Interactive Instant Search Modal (across products, collections, blogs) */}
          {searchModalOpen && (
            <Suspense fallback={null}>
              <SearchModal
                isOpen={searchModalOpen}
                onClose={() => setSearchModalOpen(false)}
                onNavigate={handleNavigate}
                onSelectProduct={handleProductSelect}
              />
            </Suspense>
          )}

          {/* Customer Login & Phone/WhatsApp OTP Modal */}
          {authModalOpen && (
            <Suspense fallback={null}>
              <AuthModal
                isOpen={authModalOpen}
                onClose={() => setAuthModalOpen(false)}
                onLoginSuccess={(customer) => {
                  setCurrentUser(customer);
                  handleNavigate("profile");
                }}
              />
            </Suspense>
          )}

          {/* Slide-out Wishlist Sidebar Drawer */}
          <WishlistDrawer
            onNavigate={handleNavigate}
            onSelectProduct={handleProductSelect}
            onOpenAuth={() => setAuthModalOpen(true)}
            currentUser={currentUser}
          />

          {/* Slide-out Shopping Cart Sidebar Drawer */}
          <CartDrawer
            onNavigate={handleNavigate}
            onSelectProduct={handleProductSelect}
          />

          {/* WhatsApp & Scroll-to-top Buttons */}
          <FloatingActions />

          {/* Mobile Bottom Dock */}
          <MobileDock
            activePage={activePage}
            onNavigate={handleNavigate}
            onOpenSearch={() => setSearchModalOpen(true)}
            onOpenAuth={() => setAuthModalOpen(true)}
            currentUser={currentUser}
          />
        </div>
      </WishlistProvider>
    </CartProvider>
  );
}
