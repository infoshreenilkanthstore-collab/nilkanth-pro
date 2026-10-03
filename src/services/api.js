const API_BASE = import.meta.env.VITE_API_BASE_URL;
const API_TOKEN = import.meta.env.VITE_API_SHOPFRONT_TOKEN;

const headers = {
  "X-Shopfront-Token": API_TOKEN,
  "Content-Type": "application/json",
};

// In-memory cache + sessionStorage for zero-latency instant reloads
const cache = {
  products: null,
  productDetails: {},
};

function getSessionCache(key) {
  try {
    const raw = sessionStorage.getItem(`nilkanth_${key}`);
    if (raw) return JSON.parse(raw);
  } catch {
    // sessionStorage unavailable or private mode
  }
  return null;
}

function setSessionCache(key, data) {
  try {
    sessionStorage.setItem(`nilkanth_${key}`, JSON.stringify(data));
  } catch {
    // quota exceeded or disabled
  }
}

export async function fetchProducts({ page = 1, limit = 20 } = {}) {
  const cacheKey = `products_${page}_${limit}`;
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }
  const sessionData = getSessionCache(cacheKey);
  if (sessionData) {
    cache[cacheKey] = sessionData;
    return sessionData;
  }

  try {
    const res = await fetch(`${API_BASE}/products?page=${page}&limit=${limit}`, {
      headers,
    });
    if (!res.ok) throw new Error(`Failed to fetch products: ${res.statusText}`);
    const data = await res.json();
    cache[cacheKey] = data;
    setSessionCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return { data: [], pagination: {} };
  }
}

export async function fetchProductByIdOrHandle(identifier) {
  if (!identifier) return null;
  if (cache.productDetails[identifier]) {
    return cache.productDetails[identifier];
  }

  try {
    const res = await fetch(`${API_BASE}/products/${encodeURIComponent(identifier)}`, {
      headers,
    });
    if (res.ok) {
      const data = await res.json();
      if (data && (data.success || data.data)) {
        const prodData = data.data || data;
        if (prodData && prodData.id) {
          try {
            // Also fetch all reviews for this product from reviews/product/:id
            const revRes = await fetch(`${API_BASE}/reviews/product/${prodData.id}?page=1&limit=100`, { headers });
            if (revRes.ok) {
              const revData = await revRes.json();
              if (revData.data?.reviews && Array.isArray(revData.data.reviews)) {
                prodData.reviews = revData.data.reviews;
                prodData.total_reviews = revData.data.pagination?.total || revData.data.reviews.length;
              }
            }
          } catch (e) {
            // keep existing reviews if fail
          }
        }
        cache.productDetails[identifier] = data;
        return data;
      }
    }

    // Fallback: If direct /products/:identifier fails (e.g. handle vs ID issue), search in all products
    const listRes = await fetch(`${API_BASE}/products?limit=100`, { headers });
    if (listRes.ok) {
      const listData = await listRes.json();
      const list = Array.isArray(listData) ? listData : (listData.data || []);
      const matched = list.find(
        (p) =>
          String(p.id) === String(identifier) ||
          p.handle === identifier ||
          p.slug === identifier ||
          (p.title && p.title.toLowerCase().replace(/\s+/g, "-") === String(identifier).toLowerCase())
      );
      if (matched) {
        // If matched has full details or id, try fetching by id
        if (matched.variants && matched.variants.length > 0) {
          const wrapper = { success: true, data: matched };
          cache.productDetails[identifier] = wrapper;
          return wrapper;
        } else if (matched.id && matched.id !== identifier) {
          const detailByIdRes = await fetch(`${API_BASE}/products/${matched.id}`, { headers });
          if (detailByIdRes.ok) {
            const detailData = await detailByIdRes.json();
            cache.productDetails[identifier] = detailData;
            return detailData;
          }
        }
      }
    }

    return null;
  } catch (error) {
    console.error(`Error fetching product ${identifier}:`, error);
    return null;
  }
}

export async function fetchCollections() {
  const cacheKey = "collections_all";
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }
  const sessionData = getSessionCache(cacheKey);
  if (sessionData) {
    cache[cacheKey] = sessionData;
    return sessionData;
  }

  try {
    const res = await fetch(`${API_BASE}/collections`, {
      headers,
    });
    if (!res.ok) throw new Error(`Failed to fetch collections: ${res.statusText}`);
    const data = await res.json();
    cache[cacheKey] = data;
    setSessionCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error("Error fetching collections:", error);
    return { data: [] };
  }
}

export async function fetchCollectionByHandle(handle) {
  const cacheKey = `collection_${handle}`;
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  try {
    const res = await fetch(`${API_BASE}/collections/${handle}`, {
      headers,
    });
    if (!res.ok) throw new Error(`Failed to fetch collection ${handle}: ${res.statusText}`);
    const data = await res.json();
    cache[cacheKey] = data;
    return data;
  } catch (error) {
    console.error(`Error fetching collection ${handle}:`, error);
    return null;
  }
}

// ---------------- BLOGS API ---------------- //
export async function fetchBlogs() {
  const cacheKey = "cms_blogs_list";
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  try {
    const res = await fetch(`${API_BASE}/cms/blogs`, {
      headers,
    });
    if (!res.ok) throw new Error(`Failed to fetch blogs: ${res.statusText}`);
    const data = await res.json();
    cache[cacheKey] = data;
    return data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return { success: false, data: [] };
  }
}

export async function fetchBlogNews({ page = 1, limit = 12 } = {}) {
  const cacheKey = `cms_blog_news_${page}_${limit}`;
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  try {
    const res = await fetch(`${API_BASE}/cms/blogs/news?page=${page}&limit=${limit}`, {
      headers,
    });
    if (!res.ok) throw new Error(`Failed to fetch blog news: ${res.statusText}`);
    const data = await res.json();
    cache[cacheKey] = data;
    return data;
  } catch (error) {
    console.error("Error fetching blog news:", error);
    return { success: false, data: { posts: [] } };
  }
}

export async function fetchBlogPostByHandle(handle) {
  if (!handle) return null;
  const cacheKey = `cms_post_${handle}`;
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  try {
    // 1. First attempt direct endpoint or handle query if available
    const directRes = await fetch(`${API_BASE}/cms/blogs/news?handle=${encodeURIComponent(handle)}`, {
      headers,
    });
    if (directRes.ok) {
      const result = await directRes.json();
      if (result.data?.posts && Array.isArray(result.data.posts)) {
        const directMatch = result.data.posts.find((p) => p.handle === handle);
        if (directMatch) {
          cache[cacheKey] = directMatch;
          return directMatch;
        }
      }
    }

    // 2. Fetch full blog news list up to 100 to locate article with complete content
    const allRes = await fetch(`${API_BASE}/cms/blogs/news?limit=100`, {
      headers,
    });
    if (allRes.ok) {
      const allData = await allRes.json();
      const post = (allData.data?.posts || []).find((p) => p.handle === handle);
      if (post) {
        cache[cacheKey] = post;
        return post;
      }
    }

    return null;
  } catch (error) {
    console.error(`Error fetching post ${handle}:`, error);
    return null;
  }
}

export async function fetchAllProductReviews(currentProduct) {
  const currentReviews = Array.isArray(currentProduct?.reviews) ? currentProduct.reviews : [];

  if (cache["all_store_reviews"]) {
    // Return cached combined reviews, with current product's reviews first
    const otherReviews = cache["all_store_reviews"].filter(
      (r) => !currentReviews.some((cr) => cr.id === r.id)
    );
    return [...currentReviews, ...otherReviews];
  }

  try {
    // Fetch products list to aggregate authentic customer reviews
    const productsRes = await fetch(`${API_BASE}/products?limit=25`, { headers });
    if (!productsRes.ok) return currentReviews;
    const productsData = await productsRes.json();
    const productsList = productsData.data || [];

    const reviewMap = new Map();
    // Insert current product's reviews first
    currentReviews.forEach((r) => reviewMap.set(r.id, r));

    // Fetch details for products in parallel to get their dynamic reviews
    const detailPromises = productsList.slice(0, 15).map(async (p) => {
      if (p.handle === currentProduct?.handle || p.id === currentProduct?.id) return;
      try {
        const d = await fetchProductByIdOrHandle(p.handle || p.id);
        const pReviews = d?.data?.reviews || d?.reviews || [];
        pReviews.forEach((r) => {
          if (!reviewMap.has(r.id)) {
            reviewMap.set(r.id, r);
          }
        });
      } catch (err) {
        // ignore individual failed fetch
      }
    });

    await Promise.all(detailPromises);
    const allReviewsList = Array.from(reviewMap.values());
    cache["all_store_reviews"] = allReviewsList;
    return allReviewsList;
  } catch (err) {
    console.error("Failed aggregating all reviews:", err);
    return currentReviews;
  }
}

// ---------------- SITE-WIDE SEARCH AGGREGATOR ---------------- //
export async function fetchAllSearchData() {
  if (cache["search_all_data"]) {
    return cache["search_all_data"];
  }
  const sessionData = getSessionCache("search_all_data");
  if (sessionData) {
    cache["search_all_data"] = sessionData;
    return sessionData;
  }

  try {
    const [productsRes, collectionsRes, blogsRes] = await Promise.all([
      fetchProducts({ page: 1, limit: 100 }),
      fetchCollections(),
      fetchBlogNews({ page: 1, limit: 100 }),
    ]);

    const products = Array.isArray(productsRes) ? productsRes : (productsRes?.data || []);

    // Filter active visible collections
    const rawCols = Array.isArray(collectionsRes) ? collectionsRes : (collectionsRes?.data || []);
    const collections = rawCols.filter(
      (c) => c.is_active === true && c.is_display === true && c.image_url && parseInt(c.product_count || 0, 10) > 0
    );

    const rawBlogs = blogsRes?.data?.posts || blogsRes?.posts || [];
    const blogs = Array.isArray(rawBlogs) ? rawBlogs : [];

    const result = {
      products,
      collections,
      blogs,
    };

    cache["search_all_data"] = result;
    setSessionCache("search_all_data", result);
    return result;
  } catch (error) {
    console.error("Failed to load search data:", error);
    return {
      products: [],
      collections: [],
      blogs: [],
    };
  }
}

// ---------------- CUSTOMER AUTHENTICATION (PHONE / WHATSAPP OTP) ---------------- //
export async function sendOtp(phone) {
  const cleanPhone = String(phone).replace(/\D/g, "");
  try {
    const res = await fetch(`${API_BASE}/auth/send-otp`, {
      method: "POST",
      headers,
      body: JSON.stringify({ phone: cleanPhone }),
    });
    const data = await res.json();
    return {
      success: res.ok && (data.success !== false),
      data: data.data || data,
      message: data.message || (res.ok ? "OTP sent successfully" : "Failed to send OTP"),
    };
  } catch (error) {
    console.error("Error sending OTP:", error);
    return {
      success: false,
      message: error.message || "Failed to send OTP. Please check your network connection.",
    };
  }
}

export async function verifyOtp(phone, otp) {
  const cleanPhone = String(phone).replace(/\D/g, "");
  const cleanOtp = String(otp).trim();
  try {
    const res = await fetch(`${API_BASE}/auth/verify-otp`, {
      method: "POST",
      headers,
      body: JSON.stringify({ phone: cleanPhone, otp: cleanOtp }),
    });
    const data = await res.json();
    const token = data.token || data.data?.token || data.data?.jwt;
    const customer = data.customer || data.data?.customer || data.data?.user;

    if (res.ok && (data.success !== false) && token) {
      localStorage.setItem("customer_token", token);
      if (customer) {
        localStorage.setItem("customer_profile", JSON.stringify(customer));
      }
    }

    return {
      success: res.ok && (data.success !== false),
      token,
      customer,
      data: data.data || data,
      message: data.message || (res.ok ? "Logged in successfully" : "Invalid OTP"),
    };
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return {
      success: false,
      message: error.message || "Verification failed. Please try again.",
    };
  }
}

export async function fetchCustomerProfile() {
  const token = localStorage.getItem("customer_token");
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE}/customer/me`, {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      if (res.status === 401) {
        localStorage.removeItem("customer_token");
        localStorage.removeItem("customer_profile");
      }
      return null;
    }
    const data = await res.json();
    const customer = data.data || data.customer || data;
    if (customer) {
      localStorage.setItem("customer_profile", JSON.stringify(customer));
    }
    return customer;
  } catch (err) {
    console.error("Error fetching customer profile:", err);
    return null;
  }
}

export function logoutCustomer() {
  localStorage.removeItem("customer_token");
  localStorage.removeItem("customer_profile");
}

export async function updateCustomerProfile({ first_name, last_name, email }) {
  const token = localStorage.getItem("customer_token");
  if (!token) return { success: false, message: "Please log in first" };

  try {
    const res = await fetch(`${API_BASE}/customer/profile`, {
      method: "PUT",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ first_name, last_name, email }),
    });
    const data = await res.json();
    if (res.ok && (data.success !== false)) {
      const updated = data.data || data.customer || { first_name, last_name, email };
      localStorage.setItem("customer_profile", JSON.stringify(updated));
      return { success: true, customer: updated, message: "Profile updated successfully" };
    }
    return { success: false, message: data.message || "Failed to update profile" };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, message: error.message };
  }
}

// ---------------- CUSTOMER ADDRESSES ---------------- //
export async function fetchCustomerAddresses() {
  const token = localStorage.getItem("customer_token");
  if (!token) return { success: false, data: [], message: "Not authenticated" };

  try {
    const res = await fetch(`${API_BASE}/customer/addresses`, {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) return { success: false, data: [], message: "Failed to fetch addresses" };
    const data = await res.json();
    const addresses = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
    return { success: true, data: addresses };
  } catch (err) {
    console.error("Error fetching addresses:", err);
    return { success: false, data: [], message: err.message };
  }
}

export async function addCustomerAddress(addressData) {
  const token = localStorage.getItem("customer_token");
  if (!token) return { success: false, message: "Please log in first" };

  try {
    const res = await fetch(`${API_BASE}/customer/addresses`, {
      method: "POST",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(addressData),
    });
    const data = await res.json();
    return {
      success: res.ok && (data.success !== false),
      data: data.data || data,
      message: data.message || (res.ok ? "Address added successfully" : "Failed to add address"),
    };
  } catch (err) {
    console.error("Error adding address:", err);
    return { success: false, message: err.message };
  }
}

export async function updateCustomerAddress(addressId, addressData) {
  const token = localStorage.getItem("customer_token");
  if (!token) return { success: false, message: "Please log in first" };

  try {
    const res = await fetch(`${API_BASE}/customer/addresses/${addressId}`, {
      method: "PUT",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(addressData),
    });
    const data = await res.json();
    return {
      success: res.ok && (data.success !== false),
      data: data.data || data,
      message: data.message || (res.ok ? "Address updated successfully" : "Failed to update address"),
    };
  } catch (err) {
    console.error("Error updating address:", err);
    return { success: false, message: err.message };
  }
}

export async function deleteCustomerAddress(addressId) {
  const token = localStorage.getItem("customer_token");
  if (!token) return { success: false, message: "Please log in first" };

  try {
    const res = await fetch(`${API_BASE}/customer/addresses/${addressId}`, {
      method: "DELETE",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json().catch(() => ({}));
    return {
      success: res.ok,
      message: data.message || (res.ok ? "Address deleted" : "Failed to delete address"),
    };
  } catch (err) {
    console.error("Error deleting address:", err);
    return { success: false, message: err.message };
  }
}

export async function setDefaultCustomerAddress(addressId) {
  const token = localStorage.getItem("customer_token");
  if (!token) return { success: false, message: "Please log in first" };

  try {
    const res = await fetch(`${API_BASE}/customer/addresses/${addressId}/default`, {
      method: "PATCH",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json().catch(() => ({}));
    return {
      success: res.ok,
      message: data.message || (res.ok ? "Default address updated" : "Failed to update default address"),
    };
  } catch (err) {
    console.error("Error setting default address:", err);
    return { success: false, message: err.message };
  }
}

// ---------------- CUSTOMER ORDERS ---------------- //
export async function fetchCustomerOrders() {
  const token = localStorage.getItem("customer_token");
  if (!token) return [];

  // Endpoints to fetch customer order history
  const endpoints = [
    `${API_BASE}/customer/orders`,
    `${API_BASE}/customer/me/orders`,
    `${API_BASE}/orders`,
  ];

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        headers: {
          ...headers,
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data)
          ? data
          : data.data?.orders || data.data || data.orders || [];
        if (Array.isArray(list) && list.length > 0) return list;
      }
    } catch (err) {
      // Continue to next candidate
    }
  }

  // Fallback: Check if cached customer profile has orders
  try {
    const cachedProfile = localStorage.getItem("customer_profile");
    if (cachedProfile) {
      const parsed = JSON.parse(cachedProfile);
      if (Array.isArray(parsed.orders) && parsed.orders.length > 0) {
        return parsed.orders;
      }
    }
  } catch (e) {
    // ignore
  }

  return [];
}

/**
 * Fetch Order by ID (GET /shop/orders/:id or /customer/orders/:id)
 */
export async function fetchOrderById(orderId) {
  return (await fetchOrderDetails(orderId))?.data || null;
}

// =========================================================================
// CUSTOMER WISHLIST (Requires Customer Token + .env Shopfront Token)
// =========================================================================

export async function fetchWishlist() {
  const token = localStorage.getItem("customer_token");
  if (!token) return [];

  try {
    const res = await fetch(`${API_BASE}/wishlist`, {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data.data || []);
  } catch (err) {
    console.error("Error fetching wishlist:", err);
    return [];
  }
}

export async function toggleWishlistItem(productOrId, variantId = null) {
  const token = localStorage.getItem("customer_token");
  if (!token) {
    return { success: false, requireAuth: true, message: "Please sign in to save items to your wishlist" };
  }

  let prodId = productOrId;
  let resolvedVariantId = variantId;

  if (typeof productOrId === "object" && productOrId !== null) {
    prodId = productOrId.id || productOrId.product_id;
    if (!resolvedVariantId) {
      resolvedVariantId =
        productOrId.variant_id ||
        productOrId.selectedVariant?.id ||
        productOrId.selected_variant_id ||
        productOrId.variants?.[0]?.id ||
        productOrId.default_variant_id ||
        null;
    }
  }

  const payload = {
    product_id: Number(prodId),
  };

  if (resolvedVariantId) {
    payload.variant_id = Number(resolvedVariantId);
  }

  try {
    const res = await fetch(`${API_BASE}/wishlist/toggle`, {
      method: "POST",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    return {
      success: res.ok,
      data: data.data || data,
      message: data.message || (res.ok ? "Wishlist updated" : "Failed to update wishlist"),
      isAdded: data.action === "added" || data.status === "added" || data.added === true || (res.ok && !data.action?.includes("remove")),
    };
  } catch (err) {
    console.error("Error toggling wishlist item:", err);
    return { success: false, message: err.message };
  }
}

export async function deleteWishlistItem(wishlistId) {
  const token = localStorage.getItem("customer_token");
  if (!token) {
    return { success: false, requireAuth: true, message: "Please sign in first" };
  }

  try {
    const res = await fetch(`${API_BASE}/wishlist/${wishlistId}`, {
      method: "DELETE",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json().catch(() => ({}));
    return {
      success: res.ok,
      message: data.message || (res.ok ? "Item removed from wishlist" : "Failed to remove item"),
    };
  } catch (err) {
    console.error("Error deleting wishlist item:", err);
    return { success: false, message: err.message };
  }
}

// ---------------- CART MANAGEMENT APIS (FROM checkout.md) ---------------- //

export function getCartToken() {
  let cartToken = localStorage.getItem("cart_token");
  if (!cartToken) {
    cartToken = "cart_" + Math.random().toString(36).substring(2, 15) + "_" + Date.now();
    localStorage.setItem("cart_token", cartToken);
  }
  return cartToken;
}

function getCartHeaders() {
  const cartToken = getCartToken();
  const customerToken = localStorage.getItem("customer_token");
  const h = {
    ...headers,
    "X-Cart-Token": cartToken,
  };
  if (customerToken) {
    h["Authorization"] = `Bearer ${customerToken}`;
  }
  return h;
}

export async function fetchCart() {
  try {
    const res = await fetch(`${API_BASE}/cart`, {
      method: "GET",
      headers: getCartHeaders(),
    });
    const data = await res.json().catch(() => ({}));
    return {
      success: res.ok && data.success !== false,
      data: data.data || { items: [], total_amount: "0.00", item_count: 0 },
    };
  } catch (err) {
    console.error("Error fetching cart:", err);
    return {
      success: false,
      data: { items: [], total_amount: "0.00", item_count: 0 },
      error: err.message,
    };
  }
}

export async function addToCartApi({ productId, variantId = null, quantity = 1 }) {
  try {
    const payload = {
      product_id: Number(productId),
      quantity: Number(quantity) || 1,
    };
    if (variantId) {
      payload.variant_id = Number(variantId);
    }

    const res = await fetch(`${API_BASE}/cart/add`, {
      method: "POST",
      headers: getCartHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    return {
      success: res.ok && data.success !== false,
      data: data.data || null,
      message: data.message || (res.ok ? "Item added to cart" : "Failed to add item"),
    };
  } catch (err) {
    console.error("Error adding to cart:", err);
    return { success: false, message: err.message };
  }
}

export async function updateCartItemApi(itemOrId, quantity) {
  try {
    const payload = {
      quantity: Number(quantity),
    };

    if (typeof itemOrId === "object" && itemOrId !== null) {
      if (itemOrId.variant_id) payload.variant_id = Number(itemOrId.variant_id);
      if (itemOrId.product_id) payload.product_id = Number(itemOrId.product_id);
      if (itemOrId.cart_item_id) payload.cart_item_id = String(itemOrId.cart_item_id);
      if (itemOrId.id) payload.id = String(itemOrId.id);
    } else {
      payload.cart_item_id = String(itemOrId);
      payload.id = String(itemOrId);
      if (Number(itemOrId)) {
        payload.variant_id = Number(itemOrId);
      }
    }

    const res = await fetch(`${API_BASE}/cart/update`, {
      method: "POST",
      headers: getCartHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    return {
      success: res.ok && data.success !== false,
      data: data.data || null,
      message: data.message || "Cart updated",
    };
  } catch (err) {
    console.error("Error updating cart item:", err);
    return { success: false, message: err.message };
  }
}

export async function removeCartItemApi(itemOrId) {
  try {
    const payload = {};
    if (typeof itemOrId === "object" && itemOrId !== null) {
      if (itemOrId.variant_id) payload.variant_id = Number(itemOrId.variant_id);
      if (itemOrId.product_id) payload.product_id = Number(itemOrId.product_id);
      if (itemOrId.cart_item_id) payload.cart_item_id = String(itemOrId.cart_item_id);
      if (itemOrId.id) payload.id = String(itemOrId.id);
    } else {
      payload.cart_item_id = String(itemOrId);
      payload.id = String(itemOrId);
      if (Number(itemOrId)) {
        payload.variant_id = Number(itemOrId);
      }
    }

    const res = await fetch(`${API_BASE}/cart/remove`, {
      method: "POST",
      headers: getCartHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    return {
      success: res.ok && data.success !== false,
      data: data.data || null,
      message: data.message || "Item removed from cart",
    };
  } catch (err) {
    console.error("Error removing cart item:", err);
    return { success: false, message: err.message };
  }
}

export async function clearCartApi() {
  try {
    const res = await fetch(`${API_BASE}/cart/clear`, {
      method: "POST",
      headers: getCartHeaders(),
    });
    const data = await res.json().catch(() => ({}));
    return {
      success: res.ok && data.success !== false,
      data: data.data || null,
      message: data.message || "Cart cleared",
    };
  } catch (err) {
    console.error("Error clearing cart:", err);
    return { success: false, message: err.message };
  }
}

// -------------------------------------------------------------
// PRODUCT REVIEWS API (from api.md)
// -------------------------------------------------------------

export async function fetchProductReviews(productId, { page = 1, limit = 100, fetchAll = true } = {}) {
  if (!productId) return { success: false, data: { reviews: [], pagination: {} } };

  try {
    const firstRes = await fetch(`${API_BASE}/reviews/product/${productId}?page=${page}&limit=${limit}`, {
      headers: {
        "X-Shopfront-Token": API_TOKEN,
        Accept: "application/json",
      },
    });

    if (!firstRes.ok) throw new Error(`Failed to fetch reviews: ${firstRes.statusText}`);
    const firstData = await firstRes.json();
    let allReviews = firstData.data?.reviews || [];
    const pagination = firstData.data?.pagination || {};

    // If fetchAll is true and there are more pages, fetch remaining pages automatically
    if (fetchAll && pagination.total_pages && pagination.total_pages > 1) {
      const remainingPagePromises = [];
      for (let p = 2; p <= pagination.total_pages; p++) {
        remainingPagePromises.push(
          fetch(`${API_BASE}/reviews/product/${productId}?page=${p}&limit=${limit}`, {
            headers: {
              "X-Shopfront-Token": API_TOKEN,
              Accept: "application/json",
            },
          })
            .then((r) => r.json())
            .then((d) => d.data?.reviews || [])
            .catch(() => [])
        );
      }
      const restResults = await Promise.all(remainingPagePromises);
      restResults.forEach((pageItems) => {
        allReviews = allReviews.concat(pageItems);
      });
    }

    return {
      success: true,
      data: {
        reviews: allReviews,
        pagination: {
          ...pagination,
          total: allReviews.length,
        },
      },
    };
  } catch (error) {
    console.error(`Error fetching reviews for product ${productId}:`, error);
    return { success: false, data: { reviews: [], pagination: {} }, error: error.message };
  }
}

export async function submitProductReview({
  productId,
  customerName,
  rating = 5,
  title = "",
  description = "",
  images = [],
}) {
  if (!productId) return { success: false, message: "Missing product ID" };

  const customerToken = localStorage.getItem("customer_token");

  try {
    if (customerToken) {
      // 2. Add Review as a Logged-in Customer
      const res = await fetch(`${API_BASE}/reviews/customer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopfront-Token": API_TOKEN,
          Authorization: `Bearer ${customerToken}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          product_id: Number(productId),
          rating: Number(rating),
          title: title || "",
          description: description || "",
          images: Array.isArray(images) ? images : [],
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success !== false) {
        return { success: true, data: data.data, message: data.message || "Review submitted successfully" };
      }
    }

    // 3. Fallback: Add Review as Guest / Public
    const res = await fetch(`${API_BASE}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopfront-Token": API_TOKEN,
        Accept: "application/json",
      },
      body: JSON.stringify({
        product_id: Number(productId),
        customer_name: customerName || "Devoted Customer",
        rating: Number(rating),
        title: title || "",
        description: description || "",
        images: Array.isArray(images) ? images : [],
      }),
    });

    const data = await res.json().catch(() => ({}));
    return {
      success: res.ok && data.success !== false,
      data: data.data || null,
      message: data.message || (res.ok ? "Review submitted successfully" : "Failed to submit review"),
    };
  } catch (error) {
    console.error("Error submitting product review:", error);
    return { success: false, message: error.message };
  }
}

// -------------------------------------------------------------
// CHECKOUT, SHIPPING, TAX & PAYMENT GATEWAY APIS (FROM checkout.md & api.md)
// -------------------------------------------------------------

/**
 * Auto lookup city, state and country for a given 6-digit Indian PIN code
 */
export async function fetchPincodeDetails(pincode) {
  if (!pincode || String(pincode).trim().length < 6) {
    return { success: false, message: "Invalid PIN code" };
  }
  const cleanPin = String(pincode).trim();
  try {
    const res = await fetch(`${API_BASE}/pincode/${cleanPin}`, {
      headers: {
        "X-Shopfront-Token": API_TOKEN,
        Accept: "application/json",
      },
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success !== false && data.data) {
      return {
        success: true,
        data: {
          city: data.data.city || data.data.district || "",
          state: data.data.state || "",
          country: data.data.country || "India",
          pincode: cleanPin,
        },
      };
    }
    return { success: false, message: data.message || "PIN code not found" };
  } catch (err) {
    console.error("Error fetching pincode details:", err);
    return { success: false, message: err.message };
  }
}

/**
 * Fetch active payment gateways (Razorpay, ICICI, Easebuzz, COD)
 */
export async function fetchPaymentGateways() {
  try {
    const res = await fetch(`${API_BASE}/checkout/payment-gateways`, {
      headers: {
        "X-Shopfront-Token": API_TOKEN,
        Accept: "application/json",
      },
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success !== false && Array.isArray(data.data)) {
      return { success: true, data: data.data };
    }
    // Fallback if empty or failed
    return {
      success: true,
      data: [
        {
          provider: "razorpay",
          name: "Razorpay Secure Checkout",
          display_title: "Razorpay (Cards, UPI, Netbanking, Wallets)",
          is_test_mode: true,
          public_credentials: { key_id: "rzp_test_1234567890abcdef" },
          metadata: { icon: "razorpay", description: "Pay securely via UPI, Credit/Debit Cards, NetBanking" },
        },
        {
          provider: "cod",
          name: "Cash on Delivery",
          display_title: "Cash on Delivery (COD)",
          is_test_mode: false,
          public_credentials: {},
          metadata: { icon: "cod", min_order_amount: 0, max_order_amount: 50000, extra_fee: 0, instructions: "Pay cash upon delivery." },
        },
      ],
    };
  } catch (err) {
    console.error("Error fetching payment gateways:", err);
    return {
      success: false,
      data: [
        {
          provider: "razorpay",
          name: "Razorpay Secure Checkout",
          display_title: "Razorpay (Cards, UPI, Netbanking, Wallets)",
          is_test_mode: true,
          public_credentials: {},
          metadata: { icon: "razorpay", description: "Pay securely via UPI, Cards, NetBanking" },
        },
        {
          provider: "cod",
          name: "Cash on Delivery",
          display_title: "Cash on Delivery (COD)",
          is_test_mode: false,
          public_credentials: {},
          metadata: { icon: "cod", instructions: "Pay cash upon delivery." },
        },
      ],
      message: err.message,
    };
  }
}

/**
 * Fetch store shipping rates using POST /shipping/rates
 */
export async function fetchShippingRates(payload = {}) {
  try {
    const body = {
      address: {
        country: payload.address?.country || "India",
        state: payload.address?.state || "Maharashtra",
        pincode: payload.address?.pincode || "400001",
        city: payload.address?.city || "Mumbai",
      },
      order_amount: Number(payload.order_amount || payload.orderAmount || 0),
      items: Array.isArray(payload.items)
        ? payload.items.map((it) => ({
          variant_id: Number(it.variant_id || it.variantId || it.id || 0),
          quantity: Number(it.quantity || 1),
        }))
        : [],
    };

    const res = await fetch(`${API_BASE}/shipping/rates`, {
      method: "POST",
      headers: getCartHeaders(),
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success !== false) {
      const rawRates = Array.isArray(data.data) ? data.data : (data.rates || (data.data?.rates ? data.data.rates : []));
      if (rawRates && rawRates.length > 0) {
        const normalized = rawRates.map((r, idx) => {
          const costVal = Number(r.cost !== undefined ? r.cost : (r.rate !== undefined ? r.rate : 0));
          return {
            ...r,
            id: String(r.method_id || r.id || `rate_${idx}`),
            method_id: String(r.method_id || r.id || `rate_${idx}`),
            name: r.name || "Standard Shipping",
            type: r.type || "standard",
            cost: costVal,
            rate: costVal,
            transit_time: r.transit_time || r.estimated_days || "3-5 business days",
            estimated_days: r.transit_time || r.estimated_days || "3-5 business days",
          };
        });

        // Group by method name and pick the minimum cost option
        const rateMap = {};
        for (const rate of normalized) {
          const key = (rate.name || "shipping").trim().toLowerCase();
          if (!rateMap[key] || rate.cost < rateMap[key].cost) {
            rateMap[key] = rate;
          }
        }
        const lowestCostRates = Object.values(rateMap).sort((a, b) => a.cost - b.cost);

        return { success: true, data: lowestCostRates };
      }
    }
    const fallbackCost = Number(payload.order_amount || payload.orderAmount || 0) >= 999 ? 0 : 50;
    return {
      success: true,
      data: [
        {
          id: "standard",
          method_id: "standard",
          name: fallbackCost === 0 ? "Free Express Delivery" : "Standard Delivery",
          cost: fallbackCost,
          rate: fallbackCost,
          min_amount: 0,
          transit_time: "3-5 business days",
          estimated_days: "3-5 Business Days",
        },
      ],
    };
  } catch (err) {
    console.error("Error fetching shipping rates:", err);
    const fallbackCost = Number(payload.order_amount || payload.orderAmount || 0) >= 999 ? 0 : 50;
    return {
      success: true,
      data: [
        {
          id: "standard",
          method_id: "standard",
          name: fallbackCost === 0 ? "Free Express Delivery" : "Standard Delivery",
          cost: fallbackCost,
          rate: fallbackCost,
          min_amount: 0,
          transit_time: "3-5 business days",
          estimated_days: "3-5 Business Days",
        },
      ],
    };
  }
}

/**
 * Validate discount coupon using POST /checkout/validate-coupon
 */
export async function validateCoupon({ code, order_amount }) {
  try {
    const customerToken = localStorage.getItem("customer_token");
    const h = {
      "Content-Type": "application/json",
      "X-Shopfront-Token": API_TOKEN,
    };
    if (customerToken) {
      h["Authorization"] = `Bearer ${customerToken}`;
    }

    const payload = {
      code: String(code || "").trim().toUpperCase(),
      order_amount: Number(order_amount || 0),
    };

    const res = await fetch(`${API_BASE}/checkout/validate-coupon`, {
      method: "POST",
      headers: h,
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success !== false) {
      const couponData = data.data || data;
      let calculatedDiscount = 0;
      if (couponData.discount_amount !== undefined) {
        calculatedDiscount = Number(couponData.discount_amount) || 0;
      } else if (couponData.discount !== undefined) {
        calculatedDiscount = Number(couponData.discount) || 0;
      } else if (couponData.discount_type === "percentage" || couponData.type === "percentage") {
        const pct = Number(couponData.discount_value || couponData.value || 0);
        calculatedDiscount = (Number(order_amount) * pct) / 100;
      } else if (couponData.discount_value !== undefined || couponData.value !== undefined) {
        calculatedDiscount = Number(couponData.discount_value || couponData.value || 0);
      }

      return {
        success: true,
        data: couponData,
        discount_amount: calculatedDiscount,
        message: data.message || `Coupon ${payload.code} applied successfully!`,
      };
    }

    return {
      success: false,
      message: data.message || "Invalid coupon code or not applicable to this order",
      data: null,
    };
  } catch (err) {
    console.error("Error validating coupon:", err);
    return {
      success: false,
      message: err.message || "Failed to validate coupon code",
    };
  }
}

/**
 * Sync Abandoned Checkout (Step 1 of checkout)
 */
export async function syncAbandonedCheckout(payload) {
  try {
    const customerToken = localStorage.getItem("customer_token");
    const h = {
      "Content-Type": "application/json",
      "X-Shopfront-Token": API_TOKEN,
    };
    if (customerToken) {
      h["Authorization"] = `Bearer ${customerToken}`;
    }

    const checkoutPayload = {
      ...payload,
      device_type: "desktop",
      is_mobile: false,
    };

    const res = await fetch(`${API_BASE}/checkout/abandoned/sync`, {
      method: "POST",
      headers: h,
      body: JSON.stringify(checkoutPayload),
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success !== false) {
      return {
        success: true,
        data: data.data || { id: data.id, order_number: data.order_number, status: "abandoned" },
        message: data.message || "Abandoned checkout synced successfully",
      };
    }
    return {
      success: false,
      message: data.message || "Failed to sync checkout session",
      data: null,
    };
  } catch (err) {
    console.error("Error syncing abandoned checkout:", err);
    return { success: false, message: err.message };
  }
}

/**
 * Initiate Payment (Step 2 of checkout: Razorpay, ICICI, Easebuzz, COD)
 */
// export async function initiatePayment({
//   order_id,
//   provider,
//   return_url,
//   customer,
//   amount,
//   productinfo,
//   items,
//   shipping_address,
// }) {
//   try {
//     const customerToken = localStorage.getItem("customer_token");
//     const h = {
//       "Content-Type": "application/json",
//       "X-Shopfront-Token": API_TOKEN,
//     };
//     if (customerToken) {
//       h["Authorization"] = `Bearer ${customerToken}`;
//     }

//     const cleanPhone = String(customer?.phone || "").replace(/\D/g, "").slice(-10) || "9876543210";
//     const cleanEmail = String(customer?.email || "").trim() || "customer@example.com";
//     const fullName = String(customer?.name || `${customer?.firstName || ""} ${customer?.lastName || ""}`).trim() || "Customer";
//     const cleanFirstName = String(customer?.firstName || fullName.split(" ")[0] || "Customer").replace(/[^a-zA-Z0-9]/g, "") || "Customer";
//     const cleanLastName = String(customer?.lastName || fullName.split(" ").slice(1).join(" ") || "").replace(/[^a-zA-Z0-9]/g, "");

//     const formattedAmount = amount !== undefined ? Number(Number(amount).toFixed(2)) : undefined;
//     const cleanProductInfo = String(productinfo || `Order #${order_id}`).replace(/[^a-zA-Z0-9, -]/g, "").slice(0, 95) || "Order";

//     const defaultReturnUrl =
//       return_url || `${typeof window !== "undefined" ? window.location.origin : ""}/checkout/callback/${provider}`;

//     const payload = {
//       order_id: Number(order_id),
//       provider: String(provider).toLowerCase(),
//       return_url: defaultReturnUrl,
//       surl: defaultReturnUrl,
//       furl: defaultReturnUrl,
//       customer: {
//         name: fullName,
//         firstName: cleanFirstName,
//         lastName: cleanLastName,
//         email: cleanEmail,
//         phone: cleanPhone,
//       },
//       firstname: cleanFirstName,
//       lastname: cleanLastName,
//       email: cleanEmail,
//       phone: cleanPhone,
//       productinfo: cleanProductInfo,
//     };

//     if (formattedAmount !== undefined) {
//       payload.amount = formattedAmount;
//       payload.order_amount = formattedAmount;
//     }
//     if (items) {
//       payload.items = items;
//     }
//     if (shipping_address) {
//       payload.shipping_address = shipping_address;
//     }

//     const res = await fetch(`${API_BASE}/checkout/initiate-payment`, {
//       method: "POST",
//       headers: h,
//       body: JSON.stringify(payload),
//     });

//     const data = await res.json().catch(() => ({}));
//     if (res.ok && data.success !== false) {
//       return {
//         success: true,
//         data: data.data || data,
//         message: data.message || "Payment initiated successfully",
//       };
//     }
//     return {
//       success: false,
//       message: data.message || "Failed to initiate payment",
//       data: null,
//     };
//   } catch (err) {
//     console.error("Error initiating payment:", err);
//     return { success: false, message: err.message };
//   }
// }

export async function initiatePayment({
  order_id,
  provider,
  return_url,
  customer,
  amount,
  productinfo,
  items,
  shipping_address,
}) {
  try {
    const customerToken = localStorage.getItem("customer_token");
    const h = {
      "Content-Type": "application/json",
      "X-Shopfront-Token": API_TOKEN,
    };
    if (customerToken) {
      h["Authorization"] = `Bearer ${customerToken}`;
    }
    const cleanPhone = String(customer?.phone || "").replace(/\D/g, "").slice(-10) || "9876543210";
    const cleanEmail = String(customer?.email || "").trim() || "customer@example.com";
    const fullName = String(customer?.name || `${customer?.firstName || ""} ${customer?.lastName || ""}`).trim() || "Customer";
    const cleanFirstName = String(customer?.firstName || fullName.split(" ")[0] || "Customer").replace(/[^a-zA-Z0-9]/g, "") || "Customer";
    const cleanLastName = String(customer?.lastName || fullName.split(" ").slice(1).join(" ") || "").replace(/[^a-zA-Z0-9]/g, "");
    const formattedAmount = amount !== undefined ? Number(Number(amount).toFixed(2)) : undefined;
    const cleanProductInfo = String(productinfo || `Order #${order_id}`).replace(/[^a-zA-Z0-9, -]/g, "").slice(0, 95) || "Order";
    const defaultReturnUrl =
      return_url || `${typeof window !== "undefined" ? window.location.origin : ""}/api/checkout/callback/${provider}`;
    const payload = {
      order_id: Number(order_id),
      provider: String(provider).toLowerCase(),
      return_url: defaultReturnUrl,
      surl: defaultReturnUrl,
      furl: defaultReturnUrl,
      customer: {
        name: fullName,
        firstName: cleanFirstName,
        lastName: cleanLastName,
        email: cleanEmail,
        phone: cleanPhone,
      },
      firstname: cleanFirstName,
      lastname: cleanLastName,
      email: cleanEmail,
      phone: cleanPhone,
      productinfo: cleanProductInfo,
    };
    if (formattedAmount !== undefined) {
      payload.amount = formattedAmount;
      payload.order_amount = formattedAmount;
    }
    if (items) {
      payload.items = items;
    }
    if (shipping_address) {
      payload.shipping_address = shipping_address;
    }
    // 🔍 DEBUG LOGS: Outgoing Initiate Payment Request
    console.group("🚀 [Checkout] Initiating Payment");
    console.log("Endpoint:", `${API_BASE}/checkout/initiate-payment`);
    console.log("Provider:", provider);
    console.log("Order ID:", order_id);
    console.log("Request Headers:", h);
    console.log("Request Payload:", payload);
    console.groupEnd();
    const res = await fetch(`${API_BASE}/checkout/initiate-payment`, {
      method: "POST",
      headers: h,
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    // 🔍 DEBUG LOGS: Backend Response
    console.group("📥 [Checkout] Initiate Payment Response");
    console.log("HTTP Status:", res.status, res.statusText);
    console.log("Response Body:", data);
    console.groupEnd();
    if (res.ok && data.success !== false) {
      console.log("✅ Payment initiated successfully:", data);
      return {
        success: true,
        data: data.data || data,
        message: data.message || "Payment initiated successfully",
      };
    }
    console.error("❌ Payment initiation rejected:", data?.message || res.statusText);
    return {
      success: false,
      message: data.message || "Failed to initiate payment",
      data: null,
    };
  } catch (err) {
    console.error("🚨 Error initiating payment:", err);
    return { success: false, message: err.message };
  }
}

/**
 * Verify Payment (Step 3: Verification HMAC Signature / Callback Tokens)
 */
export async function verifyPayment(payload) {
  try {
    const customerToken = localStorage.getItem("customer_token");
    const h = {
      "Content-Type": "application/json",
      "X-Shopfront-Token": API_TOKEN,
    };
    if (customerToken) {
      h["Authorization"] = `Bearer ${customerToken}`;
    }

    const res = await fetch(`${API_BASE}/checkout/verify-payment`, {
      method: "POST",
      headers: h,
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success !== false) {
      return {
        success: true,
        data: data.data || data,
        message: data.message || "Payment verified successfully",
      };
    }
    return {
      success: false,
      message: data.message || "Payment verification failed",
      data: null,
    };
  } catch (err) {
    console.error("Error verifying payment:", err);
    return { success: false, message: err.message };
  }
}

/**
 * Final Original Order Creation (Step 4: POST /checkout/sync)
 * Converts abandoned draft (#ABN-104) into official confirmed order (#ORD-589)
 */
export async function syncFinalOrder(payload) {
  try {
    const customerToken = localStorage.getItem("customer_token");
    const h = {
      "Content-Type": "application/json",
      "X-Shopfront-Token": API_TOKEN,
    };
    if (customerToken) {
      h["Authorization"] = `Bearer ${customerToken}`;
    }

    const orderPayload = {
      ...payload,
      device_type: "desktop",
      is_mobile: false,
    };

    const res = await fetch(`${API_BASE}/checkout/sync`, {
      method: "POST",
      headers: h,
      body: JSON.stringify(orderPayload),
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success !== false) {
      return {
        success: true,
        data: data.data || data,
        message: data.message || "Order placed successfully",
      };
    }
    return {
      success: false,
      message: data.message || "Failed to create official order",
      data: null,
    };
  } catch (err) {
    console.error("Error syncing final order:", err);
    return { success: false, message: err.message };
  }
}

/**
 * Abandoned Draft Order Cleanup (Step 5: DELETE /backend/api/orders/:id)
 * Deletes the temporary #ABN draft after official #ORD is placed
 */
export async function deleteAbandonedOrder(abandonedId) {
  if (!abandonedId) return { success: false };
  try {
    const rootBase = API_BASE.replace(/\/shop\/?$/, "");
    const h = getCartHeaders();

    // Call DELETE https://megaecomm.megascale.co.in/backend/api/orders/:id
    let res = await fetch(`${rootBase}/orders/${abandonedId}`, {
      method: "DELETE",
      headers: h,
    }).catch(() => null);

    if (!res || !res.ok) {
      res = await fetch(`${API_BASE}/orders/${abandonedId}`, {
        method: "DELETE",
        headers: h,
      }).catch(() => null);
    }

    if (res && res.ok) {
      const data = await res.json().catch(() => ({}));
      return { success: true, message: data.message || "Order deleted successfully" };
    }

    return { success: true };
  } catch (err) {
    console.warn("Non-blocking cleanup notice:", err);
    return { success: true };
  }
}

/**
 * Fetch Order Details by Order ID
 */
export async function fetchOrderDetails(orderId) {
  if (!orderId) return { success: false, message: "Missing order ID" };
  try {
    const customerToken = localStorage.getItem("customer_token");
    const h = {
      "X-Shopfront-Token": API_TOKEN,
      Accept: "application/json",
    };
    if (customerToken) {
      h["Authorization"] = `Bearer ${customerToken}`;
    }

    const res = await fetch(`${API_BASE}/orders/${orderId}`, {
      headers: h,
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success !== false) {
      return { success: true, data: data.data || data };
    }
    return { success: false, message: data.message || "Order not found" };
  } catch (err) {
    console.error("Error fetching order details:", err);
    return { success: false, message: err.message };
  }
}

/**
 * Fetch Store Info
 */
export async function fetchStoreInfo() {
  try {
    const res = await fetch(`${API_BASE}/info`, {
      headers: {
        "X-Shopfront-Token": API_TOKEN,
        Accept: "application/json",
      },
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success !== false) {
      return { success: true, data: data.data || data };
    }
    return { success: false, message: data.message || "Store info unavailable" };
  } catch (err) {
    console.error("Error fetching store info:", err);
    return { success: false, message: err.message };
  }
}

/**
 * Submit Shop Enquiry / Contact Us form
 * @param {Object} enquiryData
 * @param {string} enquiryData.first_name
 * @param {string} enquiryData.last_name
 * @param {string} enquiryData.email
 * @param {string} enquiryData.mobile
 * @param {string} enquiryData.message
 */
export async function submitEnquiry(enquiryData) {
  try {
    const res = await fetch(`${API_BASE}/enquiries`, {
      method: "POST",
      headers: {
        "X-Shopfront-Token": API_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(enquiryData),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success !== false) {
      return { success: true, data: data.data || data, message: data.message };
    }
    return {
      success: false,
      message: data.message || data.error || "Failed to submit enquiry. Please try again.",
    };
  } catch (err) {
    console.error("Error submitting enquiry:", err);
    return { success: false, message: err.message || "Network error. Please try again." };
  }
}


