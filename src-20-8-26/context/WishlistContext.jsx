"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const toggleWishlistSidebar = () => setIsOpen(!isOpen);
  const openWishlist = () => setIsOpen(true);
  const closeWishlist = () => setIsOpen(false);
  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);

  // Helper to extract numeric ID from Shopify GID or return as-is
  const extractId = (id) => {
    if (!id) return null;
    const strId = String(id);
    if (strId.includes("gid://")) {
      const parts = strId.split("/");
      return parts[parts.length - 1];
    }
    return strId;
  };

  const fetchWishlist = useCallback(async () => {
    const token = localStorage.getItem("ns_accessToken");
    if (!token) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log("Wishlist API Response:", data);

      if (data.success) {
        // Handle various possible response structures from Shopfront API
        const items = data.wishlist || data.data || data.items || [];
        setWishlist(Array.isArray(items) ? items : []);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setIsLoading(false);
    }

  }, []);

  const toggleWishlist = async (product, variantId) => {
    if (isLoading) return false; // Prevent multiple clicks
    console.log("Toggling Wishlist for Product:", product);

    const token = typeof window !== "undefined" ? localStorage.getItem("ns_accessToken") : null;
    if (!token) {
      setIsLoginOpen(true);
      return false;
    }

    const productId = extractId(product.id || product.productId || product._id || product.product_id);
    let finalVId = extractId(variantId || product.variant_id || product.variantId || product.variants?.[0]?.id || product.variants?.edges?.[0]?.node?.id || product.selectedVariant?.id);

    // SMART DISCOVERY: If variant ID is missing or identical to Product ID, fetch full details
    if (!finalVId || finalVId === "undefined" || finalVId === "null" || finalVId === productId) {
      console.log("SMART DISCOVERY: Fetching full details for:", product.handle);
      try {
        const detailRes = await fetch(`/api/product/${product.handle}`);
        const detailData = await detailRes.json();
        const fullProduct = detailData.product || detailData.data;
        if (fullProduct) {
          const firstV = fullProduct.variants?.edges?.[0]?.node || fullProduct.variants?.[0];
          if (firstV?.id) {
            finalVId = extractId(firstV.id);
            console.log("SMART DISCOVERY: Found Proper Variant ID:", finalVId);
          }
        }
      } catch (e) {
        console.error("SMART DISCOVERY: Failed to fetch proper variant ID:", e);
      }
    }

    if (!productId) {
      console.error("Wishlist Error: Could not find Product ID in object:", product);
      return false;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: productId,
          variant_id: (finalVId && finalVId !== "undefined" && finalVId !== "null") ? finalVId : productId,
        }),
      });

      const data = await response.json();
      if (data.success) {

        // Refresh wishlist
        await fetchWishlist();
        return true;
      } else {
        if (data.message?.includes("duplicate key")) {
          await fetchWishlist();
          return true;
        }
        return false;
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };


  const removeFromWishlist = async (itemId) => {
    if (!itemId || itemId === "undefined" || itemId === "null") {
      console.error("Cannot remove item: ID is invalid", itemId);
      return;
    }

    const token = localStorage.getItem("ns_accessToken");
    if (!token) return;

    try {
      const response = await fetch(`/api/wishlist?id=${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        await fetchWishlist();
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  const isInWishlist = (productId) => {
    const cleanId = extractId(productId);
    return wishlist.some(item => String(item.product_id) === String(cleanId));
  };

  useEffect(() => {
    fetchWishlist();

    // Listen for custom login events or storage changes
    const handleStorageChange = (e) => {
      if (e.key === "ns_accessToken") {
        if (e.newValue) fetchWishlist();
        else setWishlist([]);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    // Poll for login state change as a fallback (since storage event doesn't fire in the same tab)
    const interval = setInterval(() => {
      const token = localStorage.getItem("ns_accessToken");
      if (token && wishlist.length === 0 && !isLoading) {
        // Check if we should fetch (simplistic check)
        // If token exists but wishlist is empty, try one fetch
      }
    }, 2000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [fetchWishlist]);

  return (
    <WishlistContext.Provider value={{
      wishlist,
      isLoading,
      isOpen,
      openWishlist,
      closeWishlist,
      toggleWishlistSidebar,
      toggleWishlist,
      removeFromWishlist,
      isInWishlist,
      refreshWishlist: fetchWishlist,
      isLoginOpen,
      setIsLoginOpen,
      openLogin,
      closeLogin
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
