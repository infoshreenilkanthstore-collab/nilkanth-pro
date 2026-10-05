import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  fetchCart,
  addToCartApi,
  updateCartItemApi,
  removeCartItemApi,
  clearCartApi,
  fetchShippingRates,
} from "../services/api";
import { trackAddToCart } from "../services/analytics";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState({
    items: [],
    total_amount: "0.00",
    item_count: 0,
  });
  const [loading, setLoading] = useState(false);
  const [updatingIds, setUpdatingIds] = useState(new Set());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [shippingRate, setShippingRate] = useState(null);
  const [shippingLoading, setShippingLoading] = useState(false);

  const openCart = useCallback(() => {
    setIsCartOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  // Listen for mobile back button to close cart
  useEffect(() => {
    const handlePopState = () => {
      setIsCartOpen(false);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const showToast = useCallback((msg, type = "success") => {
    setToastMessage({ msg, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.msg === msg ? null : prev));
    }, 3200);
  }, []);

  const calculateShippingRate = useCallback(async (currentCart = cart) => {
    const items = currentCart?.items || [];
    const total = Number(currentCart?.total_amount) || 0;
    if (items.length === 0) {
      setShippingRate(null);
      return;
    }

    setShippingLoading(true);
    try {
      const res = await fetchShippingRates({
        order_amount: total,
        items: items,
      });
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setShippingRate(res.data[0]);
      } else {
        const fallbackCost = total >= 999 ? 0 : 50;
        setShippingRate({
          cost: fallbackCost,
          rate: fallbackCost,
          name: fallbackCost === 0 ? "Free Delivery" : "Standard Delivery",
        });
      }
    } catch (err) {
      console.error("Failed calculating shipping rate:", err);
      const fallbackCost = total >= 999 ? 0 : 50;
      setShippingRate({
        cost: fallbackCost,
        rate: fallbackCost,
        name: fallbackCost === 0 ? "Free Delivery" : "Standard Delivery",
      });
    } finally {
      setShippingLoading(false);
    }
  }, [cart]);

  const refreshCart = useCallback(async () => {
    try {
      const res = await fetchCart();
      if (res.success && res.data) {
        setCart({
          items: Array.isArray(res.data.items) ? res.data.items : [],
          total_amount: res.data.total_amount || "0.00",
          item_count: Number(res.data.item_count) || (res.data.items?.length || 0),
        });
      }
    } catch (e) {
      console.error("Failed to refresh cart:", e);
    }
  }, []);

  // Fetch cart on mount
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  // Add Item to Cart
  const addToCart = useCallback(
    async (arg1, arg2 = 1, arg3 = null, arg4 = true) => {
      let product, variantId, quantity, openDrawer;

      if (arg1 && typeof arg1 === "object" && ("product" in arg1 || "id" in arg1)) {
        if ("product" in arg1) {
          product = arg1.product;
          variantId = arg1.variantId !== undefined ? arg1.variantId : (product?.variants?.[0]?.id || null);
          quantity = arg1.quantity || 1;
          openDrawer = arg1.openDrawer !== undefined ? arg1.openDrawer : true;
        } else {
          // Passed product object directly as first arg: addToCart(product, quantity, variantId, openDrawer)
          product = arg1;
          quantity = typeof arg2 === "number" ? arg2 : 1;
          variantId = arg3 || product?.variants?.[0]?.id || null;
          openDrawer = arg4 !== undefined ? arg4 : true;
        }
      } else {
        return { success: false, message: "Invalid product" };
      }

      const productId = product?.id || product?.product_id;
      if (!productId) return { success: false, message: "Invalid product ID" };

      // ── Fire GA4 add_to_cart + Meta Pixel AddToCart immediately on user click ──
      const variantObj =
        product?.variants?.find((v) => v.id === variantId) ||
        product?.variants?.[0] ||
        null;
      trackAddToCart(product, variantObj, quantity);

      setLoading(true);
      try {
        const res = await addToCartApi({
          productId,
          variantId,
          quantity,
        });

        if (res.success) {
          await refreshCart();
          showToast(`Added "${product?.title || "Item"}" to cart!`, "success");
          if (openDrawer) {
            setIsCartOpen(true);
          }
          return { success: true };
        } else {
          showToast(res.message || "Failed to add item to cart", "error");
          return { success: false, message: res.message };
        }
      } catch (err) {
        console.error("Add to cart error:", err);
        showToast("Error adding item to cart", "error");
        return { success: false, message: err.message };
      } finally {
        setLoading(false);
      }
    },
    [refreshCart, showToast]
  );
  // Remove Item from Cart
  const removeItem = useCallback(
    async (itemOrId) => {
      let targetItem = null;
      let cartItemId = null;

      if (typeof itemOrId === "object" && itemOrId !== null) {
        targetItem = itemOrId;
        cartItemId = itemOrId.cart_item_id || itemOrId.id;
      } else {
        cartItemId = itemOrId;
        targetItem = cart.items.find(
          (it) => it.cart_item_id === cartItemId || it.id === cartItemId || it.variant_id === cartItemId
        );
      }

      setUpdatingIds((prev) => new Set(prev).add(cartItemId));
      try {
        const payload = targetItem || { cart_item_id: cartItemId, id: cartItemId };
        const res = await removeCartItemApi(payload);
        if (res.success) {
          // If server returns updated cart in res.data, update directly or refresh
          if (res.data && Array.isArray(res.data.items)) {
            setCart({
              items: res.data.items,
              total_amount: res.data.total_amount || "0.00",
              item_count: Number(res.data.item_count) || res.data.items.length,
            });
          } else {
            await refreshCart();
          }
          showToast("Item removed from cart", "info");
        } else {
          showToast(res.message || "Failed to remove item", "error");
        }
      } catch (err) {
        console.error("Remove item error:", err);
      } finally {
        setUpdatingIds((prev) => {
          const next = new Set(prev);
          next.delete(cartItemId);
          return next;
        });
      }
    },
    [cart.items, refreshCart, showToast]
  );
  // Update Item Quantity
  const updateQuantity = useCallback(
    async (itemOrId, newQty) => {
      let targetItem = null;
      let itemId = null;

      if (typeof itemOrId === "object" && itemOrId !== null) {
        targetItem = itemOrId;
        itemId = itemOrId.cart_item_id || itemOrId.variant_id || itemOrId.id;
      } else {
        itemId = itemOrId;
        targetItem = cart.items.find(
          (it) => it.cart_item_id === itemId || it.id === itemId || it.variant_id === itemId
        );
      }

      if (newQty <= 0) {
        return removeItem(targetItem || itemId);
      }

      setUpdatingIds((prev) => new Set(prev).add(itemId));
      try {
        const payload = targetItem || { cart_item_id: itemId, variant_id: itemId, id: itemId };
        const res = await updateCartItemApi(payload, newQty);
        if (res.success) {
          if (res.data && Array.isArray(res.data.items)) {
            setCart({
              items: res.data.items,
              total_amount: res.data.total_amount || "0.00",
              item_count: Number(res.data.item_count) || res.data.items.length,
            });
          } else {
            await refreshCart();
          }
        } else {
          showToast(res.message || "Failed to update quantity", "error");
        }
      } catch (err) {
        console.error("Update quantity error:", err);
      } finally {
        setUpdatingIds((prev) => {
          const next = new Set(prev);
          next.delete(itemId);
          return next;
        });
      }
    },
    [cart.items, refreshCart, removeItem, showToast]
  );



  // Restore Cart Items from Abandoned Checkout Session
  const restoreCartItems = useCallback((items) => {
    if (!Array.isArray(items) || items.length === 0) return;
    const formattedItems = items.map((it, idx) => {
      const pId = it.productId || it.product_id || it.id;
      const vId = it.variantId || it.variant_id || null;
      const priceNum = Number(it.price) || 0;
      const qtyNum = Number(it.quantity) || 1;
      return {
        id: it.cart_item_id || it.id || vId || pId || idx,
        cart_item_id: it.cart_item_id || it.id || vId || idx,
        product_id: pId,
        productId: pId,
        variant_id: vId,
        variantId: vId,
        title: it.title || it.product_title || it.name || "Item",
        price: priceNum,
        quantity: qtyNum,
        image: it.image || it.featured_image || it.images?.[0] || "",
        total: Number(it.total) || (priceNum * qtyNum),
      };
    });
    const totalAmount = formattedItems.reduce((sum, it) => sum + (it.price * it.quantity), 0);
    const count = formattedItems.reduce((sum, it) => sum + it.quantity, 0);
    setCart({
      items: formattedItems,
      total_amount: totalAmount.toFixed(2),
      item_count: count,
    });
  }, []);

  // Clear Cart
  const clearCart = useCallback(async () => {
    setLoading(true);
    try {
      const res = await clearCartApi();
      if (res.success) {
        await refreshCart();
        showToast("Cart cleared", "info");
      }
    } catch (err) {
      console.error("Clear cart error:", err);
    } finally {
      setLoading(false);
    }
  }, [refreshCart, showToast]);

  const value = {
    cart,
    cartItems: cart.items || [],
    cartCount: Number(cart.item_count) || (cart.items?.length || 0),
    cartTotal: Number(cart.total_amount) || 0,
    loading,
    updatingIds,
    isCartOpen,
    openCart,
    closeCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    refreshCart,
    restoreCartItems,
    shippingRate,
    shippingLoading,
    calculateShippingRate,
  };

  return (
    <CartContext.Provider value={value}>
      {children}

      {/* Floating Global Cart Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-[100] max-w-sm pointer-events-none animate-fadeIn"
        >
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-2.5 backdrop-blur-md text-xs sm:text-sm font-nunito font-semibold ${toastMessage.type === "success"
                ? "bg-[#700b10] text-[#ebd99c] border-amber-300/40 shadow-rose-950/20"
                : toastMessage.type === "error"
                  ? "bg-rose-900 text-rose-100 border-rose-700/60 shadow-rose-950/30"
                  : "bg-stone-900 text-stone-100 border-stone-700 shadow-black/30"
              }`}
          >
            <span>{toastMessage.msg}</span>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
