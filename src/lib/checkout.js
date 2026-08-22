// Mega Checkout SDK config — SSR-safe (no top-level window)

export const CHECKOUT_SDK_URL =
  process.env.NEXT_PUBLIC_CHECKOUT_SDK_URL ||
  "https://checkout.bhagvatprasadam.com/v1/checkout.js";

export const CHECKOUT_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_CHECKOUT_PUBLIC_KEY || "mk_public_e6b43102";

export const CHECKOUT_SECRET_KEY =
  process.env.NEXT_PUBLIC_CHECKOUT_SECRET_KEY || "mk_secret_46701127";

export const CHECKOUT_STORE_ID =
  process.env.NEXT_PUBLIC_CHECKOUT_STORE_ID || "c63ffaef-8532-4906-af10-abb6ba1d5800";

export const CHECKOUT_API_BASE =
  process.env.NEXT_PUBLIC_CHECKOUT_API_BASE || "https://api-checkout.bhagvatprasadam.com/api";

export const CHECKOUT_UI_URL =
  process.env.NEXT_PUBLIC_CHECKOUT_UI_URL || "https://checkout.store.nilkanthdham.in";

/** Map Nilkanth cart row → SDK addToCart payload (price in rupees; SDK converts to paise). */
export function mapStoreCartItemToSdk(item) {
  const productId = String(item?.productId || "").split("/").pop();
  const variantId = String(item?.variantId || "").split("/").pop();

  return {
    productId,
    variantId,
    quantity: Number(item?.qty ?? item?.quantity) || 1,
    title: item?.title || "",
    variantTitle: item?.variantTitle || "",
    price: Number(item?.price) || 0,
    imageUrl: item?.image || item?.imageUrl || "",
    weight: Number(item?.weight) || 0,
    weightUnit: item?.weightUnit || "GRAMS",
  };
}

export function buildOrderSuccessUrl(sessionToken) {
  const params = new URLSearchParams({
    sessionId: sessionToken,
    publicKey: CHECKOUT_PUBLIC_KEY,
  });
  return `${CHECKOUT_UI_URL}/order-status?${params.toString()}`;
}

let checkoutSDKInstance = null;

/** Lazy init — safe during Next.js SSR / static prerender */
export function getCheckoutSDK() {
  if (typeof window === "undefined") return null;

  if (!window.CheckoutSDK) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[Mega Checkout] SDK script not loaded. Set NEXT_PUBLIC_CHECKOUT_SDK_URL in layout."
      );
    }
    return null;
  }

  if (!checkoutSDKInstance) {
    checkoutSDKInstance = window.CheckoutSDK.init({
      publicKey: CHECKOUT_PUBLIC_KEY,
      secretKey: CHECKOUT_SECRET_KEY,
      storeId: CHECKOUT_STORE_ID,
      baseUrl: CHECKOUT_API_BASE,
      checkoutUrl: CHECKOUT_UI_URL,
    });
  }

  return checkoutSDKInstance;
}
