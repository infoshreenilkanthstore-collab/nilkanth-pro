/**
 * analytics.js — Centralized GA4 + Meta Pixel + Product Schema utility
 * Google Analytics ID : G-0VTQFMW2S2
 * Meta Pixel ID       : 1455730108844531
 *
 * All functions are safe no-ops if the scripts are blocked by an ad blocker.
 */

// ─── Safe wrappers ────────────────────────────────────────────────────────────

function _gtag(...args) {
  try {
    if (typeof window !== "undefined") {
      if (typeof window.gtag === "function") {
        window.gtag(...args);
      }
    }
  } catch (_) {}
}

function _fbq(...args) {
  try {
    if (typeof window !== "undefined") {
      if (typeof window.fbq === "function") {
        window.fbq(...args);
        console.log("🎯 [Meta Pixel Fired]:", args[0], args[1], args[2] || "");
      } else {
        console.warn("⚠️ [Meta Pixel]: window.fbq is not available", args);
      }
    }
  } catch (err) {
    console.error("❌ [Meta Pixel Error]:", err);
  }
}

// ─── Page View ───────────────────────────────────────────────────────────────

/**
 * Track a SPA page view. Call this on every handleNavigate() call.
 * @param {string} [url] - Defaults to current window.location.href
 */
export function trackPageView(url) {
  const pageUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  _gtag("event", "page_view", { page_location: pageUrl });
  _fbq("track", "PageView");
}

// ─── Product View ─────────────────────────────────────────────────────────────

/**
 * Track product detail page view.
 * Also injects / updates the JSON-LD product schema in <head>.
 * @param {object} prod - The product data object from the API
 */
export function trackProductView(prod) {
  if (!prod) return;
  const product = prod.product || prod.data || prod;

  const price = Number(
    product.price ||
    product.variants?.[0]?.price?.amount ||
    product.variants?.[0]?.price ||
    product.priceRange?.minVariantPrice?.amount ||
    0
  );
  const productId = String(product.id || product.product_id || product.handle || "");
  const productName = product.title || product.product_title || product.name || "";
  const category = product.category || product.product_type || product.type || "Devotional";

  // GA4 — view_item
  _gtag("event", "view_item", {
    currency: "INR",
    value: price,
    items: [
      {
        item_id: productId,
        item_name: productName,
        item_category: category,
        price,
        quantity: 1,
      },
    ],
  });

  // Meta Pixel — ViewContent
  _fbq("track", "ViewContent", {
    content_ids: [productId],
    content_name: productName,
    content_category: category,
    content_type: "product",
    value: price,
    currency: "INR",
  });

  // Inject / update JSON-LD product schema
  _injectProductSchema(product);
}

// ─── Add To Cart ─────────────────────────────────────────────────────────────

/**
 * Track add-to-cart event.
 * @param {object} product  - Product data
 * @param {object} variant  - Selected variant (may be null)
 * @param {number} quantity - Quantity added
 */
export function trackAddToCart(product, variant, quantity = 1) {
  if (!product) return;

  const price = Number(
    variant?.price?.amount ||
    variant?.price ||
    product.price ||
    product.priceRange?.minVariantPrice?.amount ||
    0
  );
  const productId = String(product.id || product.product_id || product.handle || "");
  const productName = product.title || product.product_title || product.name || "";
  const variantTitle = variant?.title || variant?.variant_title || "";
  const qty = Number(quantity) || 1;

  // GA4 — add_to_cart
  _gtag("event", "add_to_cart", {
    currency: "INR",
    value: price * qty,
    items: [
      {
        item_id: productId,
        item_name: productName,
        item_variant: variantTitle,
        price,
        quantity: qty,
      },
    ],
  });

  // Meta Pixel — AddToCart
  _fbq("track", "AddToCart", {
    content_ids: [productId],
    content_name: productName,
    content_type: "product",
    value: price * qty,
    currency: "INR",
    num_items: qty,
  });
}

// ─── Initiate Checkout ────────────────────────────────────────────────────────

/**
 * Track checkout initiation. Call once when CheckoutPage mounts with items.
 * @param {Array}  cartItems  - Array of cart line items
 * @param {number} cartTotal  - Subtotal value in INR
 */
export function trackInitiateCheckout(cartItems, cartTotal) {
  if (!cartItems || cartItems.length === 0) return;

  const ids = cartItems.map((it) => String(it.product_id || it.id || ""));
  const numItems = cartItems.reduce((s, it) => s + (Number(it.quantity) || 1), 0);
  const totalVal = Number(cartTotal) || cartItems.reduce((s, it) => s + (Number(it.price) || 0) * (Number(it.quantity) || 1), 0);

  // GA4 — begin_checkout
  _gtag("event", "begin_checkout", {
    currency: "INR",
    value: totalVal,
    items: cartItems.map((it) => ({
      item_id: String(it.product_id || it.id || ""),
      item_name: it.title || it.product_title || "",
      price: Number(it.price || 0),
      quantity: Number(it.quantity) || 1,
    })),
  });

  // Meta Pixel — InitiateCheckout
  _fbq("track", "InitiateCheckout", {
    content_ids: ids,
    content_type: "product",
    num_items: numItems,
    value: totalVal,
    currency: "INR",
  });
}

// ─── Add Payment Info ────────────────────────────────────────────────────────

/**
 * Track addition/confirmation of payment information.
 * Call when the customer confirms and submits their payment method at checkout.
 * @param {Array}  cartItems   - Array of cart line items
 * @param {number} totalValue  - Total value in INR
 * @param {string} paymentType - Provider name ('razorpay', 'icici', 'easebuzz', 'cod', etc.)
 */
export function trackAddPaymentInfo(cartItems, totalValue, paymentType = "online") {
  if (!cartItems || cartItems.length === 0) return;

  const ids = cartItems.map((it) => String(it.product_id || it.productId || it.id || ""));
  const numItems = cartItems.reduce((s, it) => s + (Number(it.quantity) || 1), 0);
  const total = Number(totalValue) || cartItems.reduce((s, it) => s + (Number(it.price) || 0) * (Number(it.quantity) || 1), 0);

  // GA4 — add_payment_info
  _gtag("event", "add_payment_info", {
    currency: "INR",
    value: total,
    payment_type: paymentType,
    items: cartItems.map((it) => ({
      item_id: String(it.product_id || it.productId || it.id || ""),
      item_name: it.title || it.product_title || "",
      price: Number(it.price || 0),
      quantity: Number(it.quantity || 1),
    })),
  });

  // Meta Pixel — AddPaymentInfo
  _fbq("track", "AddPaymentInfo", {
    content_ids: ids,
    content_type: "product",
    contents: cartItems.map((it) => ({
      id: String(it.product_id || it.productId || it.id || ""),
      quantity: Number(it.quantity || 1),
      item_price: Number(it.price || 0),
    })),
    currency: "INR",
    value: total,
    num_items: numItems,
    payment_type: paymentType,
  });
}

// ─── Purchase ─────────────────────────────────────────────────────────────────

const _trackedPurchaseIds = new Set();

/**
 * Track completed purchase. Call after payment verified / COD placed.
 * @param {object} order - Confirmed order object
 */
export function trackPurchase(order) {
  if (!order) return;

  const orderId = String(order.id || order.order_number || "");
  if (!orderId) return;

  // Deduplicate in-session purchase events to prevent duplicate reporting
  const purchaseSessionKey = `nilkanth_tracked_purchase_${orderId}`;
  if (_trackedPurchaseIds.has(orderId)) return;
  try {
    if (sessionStorage.getItem(purchaseSessionKey)) return;
    sessionStorage.setItem(purchaseSessionKey, "true");
  } catch (e) {}
  _trackedPurchaseIds.add(orderId);

  const total = Number(order.total || order.amount || 0);
  const items = Array.isArray(order.items) ? order.items : [];

  // GA4 — purchase
  _gtag("event", "purchase", {
    transaction_id: orderId,
    value: total,
    currency: "INR",
    items: items.map((it) => ({
      item_id: String(it.product_id || it.productId || it.id || ""),
      item_name: it.title || it.product_title || "",
      price: Number(it.price || 0),
      quantity: Number(it.quantity || 1),
    })),
  });

  // Meta Pixel — Purchase
  _fbq("track", "Purchase", {
    content_ids: items.map((it) => String(it.product_id || it.productId || it.id || "")),
    content_type: "product",
    value: total,
    currency: "INR",
    num_items: items.reduce((s, it) => s + (Number(it.quantity) || 1), 0),
  });
}

// ─── JSON-LD Product Schema ───────────────────────────────────────────────────

const SCHEMA_SCRIPT_ID = "nilkanth-product-schema";

/**
 * Inject or update the JSON-LD Product schema in <head>.
 * Reuses the same <script> tag so it works across SPA product navigations.
 * @param {object} product
 */
function _injectProductSchema(product) {
  if (typeof document === "undefined") return;

  const price = Number(
    product.price ||
    product.priceRange?.minVariantPrice?.amount ||
    0
  ).toFixed(2);

  const availability =
    product.available !== false
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock";

  // Strip HTML tags from description if body_html is provided
  const rawDescription = product.description || product.body_html || "";
  const cleanDescription = rawDescription.replace(/<[^>]+>/g, "").trim();

  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.title || product.name || "",
    description: cleanDescription,
    image:
      product.image_url ||
      product.images?.[0]?.url ||
      product.images?.[0]?.src ||
      "",
    brand: {
      "@type": "Brand",
      name: product.vendor || "Shri Nilkanth Store",
    },
    sku: String(product.id || product.handle || ""),
    offers: {
      "@type": "Offer",
      url: `${window.location.origin}/products/${product.handle || product.id}`,
      priceCurrency: "INR",
      price,
      availability,
      seller: {
        "@type": "Organization",
        name: "Shri Nilkanth Store",
      },
    },
  };

  // Find existing tag or create a new one
  let tag = document.getElementById(SCHEMA_SCRIPT_ID);
  if (!tag) {
    tag = document.createElement("script");
    tag.id = SCHEMA_SCRIPT_ID;
    tag.type = "application/ld+json";
    document.head.appendChild(tag);
  }

  // Overwrite content — this is the key to dynamic per-product schema
  tag.textContent = JSON.stringify(schema, null, 0);
}

/**
 * Remove the product schema tag from <head>.
 * Call in ProductPage useEffect cleanup (when leaving the product page).
 */
export function removeProductSchema() {
  if (typeof document === "undefined") return;
  const tag = document.getElementById(SCHEMA_SCRIPT_ID);
  if (tag) tag.remove();
}
