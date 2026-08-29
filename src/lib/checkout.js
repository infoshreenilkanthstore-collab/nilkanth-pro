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

/** Calculate a safe, strictly positive weight to satisfy checkout backend validation */
export function getPositiveWeight(rawWeight, rawUnit, ...titleCandidates) {
  let weight = Number(rawWeight);
  let u = String(rawUnit || "g").trim().toLowerCase();
  let weightUnit = (u === "grams" || u === "gram" || u === "gm" || u === "g")
    ? "g"
    : (u === "kilograms" || u === "kilogram" || u === "kg" ? "kg" : (u || "g"));

  if (!weight || isNaN(weight) || weight <= 0) {
    const combinedTitles = titleCandidates.filter(Boolean).join(" ");
    const match = combinedTitles.match(/(\d+(?:\.\d+)?)\s*(gm|g|kg|ml|l)\b/i);
    if (match) {
      weight = parseFloat(match[1]);
      const matchedUnit = match[2].toLowerCase();
      weightUnit = (matchedUnit === "kg" || matchedUnit === "l") ? "kg" : "g";
    }
  }

  // Backend strictly requires: "cartItems.X.weight must be a positive number"
  if (!weight || isNaN(weight) || weight <= 0) {
    weight = 100;
    weightUnit = "g";
  }

  return { weight, weightUnit };
}

/** Map Nilkanth cart row → SDK addToCart payload (price in rupees; SDK converts to paise). */
export function mapStoreCartItemToSdk(item) {
  const productId = String(item?.productId || "").split("/").pop();
  const variantId = String(item?.variantId || "").split("/").pop();

  const { weight, weightUnit } = getPositiveWeight(
    item?.weight,
    item?.weightUnit || item?.weight_unit,
    item?.variantTitle,
    item?.title
  );
  const grams = (weightUnit === "kg" || weightUnit === "kilograms") ? weight * 1000 : weight;

  return {
    productId,
    variantId,
    quantity: Number(item?.qty ?? item?.quantity) || 1,
    title: item?.title || "",
    variantTitle: item?.variantTitle || "",
    price: Number(item?.price) || 0,
    imageUrl: item?.image || item?.imageUrl || "",
    weight,
    weightUnit,
    weight_unit: weightUnit,
    grams,
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

    if (checkoutSDKInstance) {
      // Ensure syncCartWithBackend includes weight, weightUnit, weight_unit, and grams in PATCH /items
      checkoutSDKInstance.syncCartWithBackend = async function () {
        const cartItems = (this.cartItems || []).map((s) => {
          const { weight, weightUnit } = getPositiveWeight(
            s.weight,
            s.weightUnit || s.weight_unit,
            s.variantTitle,
            s.title,
            s.name
          );
          const grams = (weightUnit === "kg" || weightUnit === "kilograms") ? weight * 1000 : weight;

          return {
            productId: String(s.productId),
            variantId: String(s.variantId),
            name: s.title || s.name || "",
            title: s.title || s.name || "",
            variantTitle: s.variantTitle || "",
            sku: s.sku || "",
            price: Math.round(Number(s.price) * 100),
            quantity: Number(s.quantity) || 1,
            imageUrl: s.imageUrl || s.image || "",
            weight,
            weightUnit
          };
        });

        if (this.activeSessionToken) {
          try {
            const res = await this.http.request(
              "PATCH",
              `/checkout/session/${this.activeSessionToken}/items`,
              { currency: "INR", cartItems }
            );
            const data = res.data || res;
            const session = {
              ...data,
              token: data.sessionToken || data.token || this.activeSessionToken,
            };
            this.activeSessionToken = session.token;
            this.saveCartToCookie?.();
            return session;
          } catch (err) {
            const msg = String(err?.message || "");
            if (/not found|invalid|unauthorized|401|404/i.test(msg)) {
              console.warn("Checkout session invalid, creating new session:", msg);
              this.activeSessionToken = null;
            } else {
              console.warn("Checkout session sync deferred:", msg);
              throw err;
            }
          }
        }

        const newSession = await this.createCheckoutSession({
          currency: "INR",
          cartItems,
        });
        this.activeSessionToken = newSession.token;
        this.saveCartToCookie?.();
        return newSession;
      };
    }
  }

  return checkoutSDKInstance;
}
