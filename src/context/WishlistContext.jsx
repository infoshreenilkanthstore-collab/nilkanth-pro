import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { fetchWishlist, toggleWishlistItem, deleteWishlistItem, fetchProductByIdOrHandle } from "../services/api";

const WishlistContext = createContext(null);
const GUEST_WISHLIST_KEY = "nilkanth_guest_wishlist";

function isProductActive(item) {
  if (!item) return false;
  const prod = item.product || item;

  // Check is_active flag
  const isActive = item.is_active !== undefined ? item.is_active : prod.is_active;
  if (isActive !== undefined && (isActive === false || isActive === 0 || isActive === "0" || isActive === "false")) {
    return false;
  }

  // Check product_status and status fields
  const pStatus = (item.product_status || prod.product_status || item.status || prod.status)?.toString().toLowerCase();
  if (pStatus && pStatus !== "active") {
    return false;
  }

  return true;
}

function getGuestWishlist() {
  try {
    const raw = localStorage.getItem(GUEST_WISHLIST_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter(isProductActive) : [];
    }
  } catch (e) {
    console.error("Error reading guest wishlist:", e);
  }
  return [];
}

function saveGuestWishlist(items) {
  try {
    const activeOnly = (items || []).filter(isProductActive);
    localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(activeOnly));
  } catch (e) {
    console.error("Error saving guest wishlist:", e);
  }
}

function clearGuestWishlist() {
  try {
    localStorage.removeItem(GUEST_WISHLIST_KEY);
  } catch {
    // ignore
  }
}

export function WishlistProvider({ children, currentUser, onOpenAuth }) {
  const [wishlistItems, setWishlistItems] = useState(() => {
    // If user is already logged in with token, start empty until fetch
    const token = typeof window !== "undefined" ? localStorage.getItem("customer_token") : null;
    if (token) return [];
    return typeof window !== "undefined" ? getGuestWishlist() : [];
  });
  const [loading, setLoading] = useState(false);
  const [togglingIds, setTogglingIds] = useState(new Set());
  const [toastMessage, setToastMessage] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isSyncingRef = useRef(false);

  const openDrawer = useCallback(() => {
    setIsDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  // Listen for mobile back button to close wishlist drawer
  useEffect(() => {
    const handlePopState = () => {
      setIsDrawerOpen(false);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const showToast = useCallback((msg, type = "info") => {
    setToastMessage({ msg, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.msg === msg ? null : prev));
    }, 3200);
  }, []);

  // Sync any guest wishlist items from localStorage to the database
  const syncGuestWishlistToBackend = useCallback(async () => {
    const token = localStorage.getItem("customer_token");
    if (!token || isSyncingRef.current) return;

    const guestItems = getGuestWishlist();
    if (!guestItems || guestItems.length === 0) return;

    isSyncingRef.current = true;
    try {
      // 1. Fetch current server wishlist to avoid duplicate toggling
      const serverItems = await fetchWishlist();
      const serverList = Array.isArray(serverItems) ? serverItems : [];
      const serverProductIds = new Set(
        serverList.map((item) => Number(item.product_id || item.product?.id || item.id))
      );

      // 2. Find items in guest wishlist that are not yet on the server
      const itemsToSync = guestItems.filter((item) => {
        const pId = Number(item.product_id || item.product?.id || item.id);
        return pId && !serverProductIds.has(pId);
      });

      if (itemsToSync.length > 0) {
        // 3. Add each guest item to backend database
        await Promise.allSettled(
          itemsToSync.map((item) => {
            const pId = Number(item.product_id || item.product?.id || item.id);
            const vId = item.variant_id || item.product?.variant_id || null;
            return toggleWishlistItem(pId, vId);
          })
        );
        showToast(
          `${itemsToSync.length} saved ${itemsToSync.length === 1 ? "item" : "items"} synced to your account! ❤️`,
          "success"
        );
      }

      // 4. Clear local guest wishlist now that items are saved in the DB
      clearGuestWishlist();
    } catch (err) {
      console.error("Error syncing guest wishlist to backend:", err);
    } finally {
      isSyncingRef.current = false;
    }
  }, [showToast]);

  // Fetch wishlist when user logs in or on mount
  const refreshWishlist = useCallback(async () => {
    const token = localStorage.getItem("customer_token");
    if (!token) {
      // Guest user: load from local storage
      const local = getGuestWishlist();
      setWishlistItems(local);
      return;
    }

    setLoading(true);
    try {
      // If there are any guest items in localStorage, auto-sync them first
      const guestItems = getGuestWishlist();
      if (guestItems.length > 0) {
        await syncGuestWishlistToBackend();
      }

      const items = await fetchWishlist();
      const rawList = Array.isArray(items) ? items : [];

      // Hydrate product details if title/price is missing
      const enrichedList = await Promise.all(
        rawList.map(async (item) => {
          const prod = item.product || item;
          const pid = item.product_id || prod.id;
          const hasTitle = prod.title && prod.title !== "Spiritual Product";
          const hasPrice = prod.price || prod.priceRange?.minVariantPrice?.amount;

          if ((!hasTitle || !hasPrice) && pid) {
            try {
              const fullProd = await fetchProductByIdOrHandle(pid);
              if (fullProd) {
                return {
                  ...item,
                  product: {
                    ...prod,
                    ...fullProd,
                  },
                };
              }
            } catch {
              // ignore
            }
          }
          return item;
        })
      );

      const activeList = enrichedList.filter(isProductActive);
      setWishlistItems(activeList);
    } catch (err) {
      console.error("Error loading wishlist:", err);
    } finally {
      setLoading(false);
    }
  }, [syncGuestWishlistToBackend]);

  // Trigger sync and refresh on login or mount
  useEffect(() => {
    const token = localStorage.getItem("customer_token");
    if (token) {
      refreshWishlist();
    } else {
      const local = getGuestWishlist();
      setWishlistItems(local);
    }
  }, [currentUser, refreshWishlist]);

  // Listen for storage events across tabs or external auth updates
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "customer_token" || e.key === GUEST_WISHLIST_KEY) {
        refreshWishlist();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [refreshWishlist]);

  // Check if a product is in the wishlist
  const isWishlisted = useCallback(
    (productId) => {
      if (!productId) return false;
      const pId = Number(productId);
      return wishlistItems.some((item) => {
        const itemPid = Number(item.product_id || item.product?.id || item.id);
        return itemPid === pId;
      });
    },
    [wishlistItems]
  );

  // Toggle Wishlist item: works seamlessly for both guest and logged-in users!
  const toggleWishlist = useCallback(
    async (product, variantId = null) => {
      const prodId = Number(product?.id || product?.product_id || product);
      if (!prodId) return { success: false };

      const targetVariantId =
        variantId ||
        product?.variant_id ||
        product?.selectedVariant?.id ||
        product?.selected_variant_id ||
        product?.variants?.[0]?.id ||
        product?.default_variant_id ||
        null;

      const token = localStorage.getItem("customer_token");

      // ── CASE 1: GUEST USER (Local Storage) ──
      if (!token) {
        setTogglingIds((prev) => new Set(prev).add(prodId));
        try {
          const currentLocal = getGuestWishlist();
          const existingIndex = currentLocal.findIndex((item) => {
            const itemPid = Number(item.product_id || item.product?.id || item.id);
            return itemPid === prodId;
          });

          let updatedList;
          let isAdded = false;

          if (existingIndex >= 0) {
            // Remove from local storage
            updatedList = currentLocal.filter((_, idx) => idx !== existingIndex);
            showToast("Removed from wishlist", "info");
          } else {
            // Add to local storage
            const itemToSave = {
              id: prodId,
              product_id: prodId,
              variant_id: targetVariantId,
              product: typeof product === "object" ? product : { id: prodId },
              created_at: new Date().toISOString(),
            };
            updatedList = [itemToSave, ...currentLocal];
            isAdded = true;
            showToast("Added to wishlist ❤️", "success");
          }

          saveGuestWishlist(updatedList);
          setWishlistItems(updatedList);
          return { success: true, isAdded };
        } catch (err) {
          console.error("Local wishlist error:", err);
          showToast("Could not update wishlist", "error");
          return { success: false, message: err.message };
        } finally {
          setTogglingIds((prev) => {
            const next = new Set(prev);
            next.delete(prodId);
            return next;
          });
        }
      }

      // ── CASE 2: LOGGED IN USER (Save directly to DB via API) ──
      setTogglingIds((prev) => new Set(prev).add(prodId));
      try {
        const res = await toggleWishlistItem(prodId, targetVariantId);
        if (res.success) {
          await refreshWishlist();
          const currentlySaved = isWishlisted(prodId);
          if (res.isAdded || !currentlySaved) {
            showToast("Added to wishlist ❤️", "success");
          } else {
            showToast("Removed from wishlist", "info");
          }
        } else {
          showToast(res.message || "Could not update wishlist", "error");
        }
        return res;
      } catch (err) {
        console.error("Wishlist toggle error:", err);
        showToast("Something went wrong", "error");
        return { success: false, message: err.message };
      } finally {
        setTogglingIds((prev) => {
          const next = new Set(prev);
          next.delete(prodId);
          return next;
        });
      }
    },
    [refreshWishlist, isWishlisted, showToast]
  );

  // Remove by item/product ID
  const removeFromWishlist = useCallback(
    async (wishlistOrProductId) => {
      const token = localStorage.getItem("customer_token");

      // Guest user: remove from local storage
      if (!token) {
        const currentLocal = getGuestWishlist();
        const updatedList = currentLocal.filter((item) => {
          const itemPid = Number(item.product_id || item.product?.id || item.id);
          const targetId = Number(wishlistOrProductId);
          return itemPid !== targetId && item.id !== wishlistOrProductId;
        });
        saveGuestWishlist(updatedList);
        setWishlistItems(updatedList);
        showToast("Item removed from wishlist", "info");
        return;
      }

      // Logged in user: remove from database
      const match = wishlistItems.find(
        (item) =>
          item.id === wishlistOrProductId ||
          item.product_id === wishlistOrProductId ||
          item.product?.id === wishlistOrProductId
      );

      const targetId = match ? match.id : wishlistOrProductId;

      try {
        const res = await deleteWishlistItem(targetId);
        if (res.success) {
          showToast("Item removed from wishlist", "info");
          await refreshWishlist();
        } else {
          await toggleWishlistItem(wishlistOrProductId);
          await refreshWishlist();
          showToast("Item removed from wishlist", "info");
        }
      } catch (err) {
        console.error("Error removing from wishlist:", err);
      }
    },
    [wishlistItems, refreshWishlist, showToast]
  );

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount: wishlistItems.length,
        loading,
        togglingIds,
        isWishlisted,
        toggleWishlist,
        removeFromWishlist,
        refreshWishlist,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
      }}
    >
      {children}

      {/* Global floating toast for wishlist notifications */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-8 right-4 sm:right-8 z-50 animate-fadeIn pointer-events-none">
          <div className="bg-stone-900/95 backdrop-blur-md text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-2">
            <span>{toastMessage.msg}</span>
          </div>
        </div>
      )}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    return {
      wishlistItems: [],
      wishlistCount: 0,
      loading: false,
      togglingIds: new Set(),
      isWishlisted: () => false,
      toggleWishlist: () => {},
      removeFromWishlist: () => {},
      refreshWishlist: () => {},
      isDrawerOpen: false,
      openDrawer: () => {},
      closeDrawer: () => {},
    };
  }
  return ctx;
}

