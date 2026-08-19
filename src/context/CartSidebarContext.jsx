"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { getCheckoutSDK, buildOrderSuccessUrl, mapStoreCartItemToSdk } from "@/lib/checkout";

const CartSidebarContext = createContext();

export function CartSidebarProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState([]); // Global cart state
  const [isLoading, setIsLoading] = useState(true);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  // Helper to sync with localStorage
  const syncLocal = (newCart) => {
    localStorage.setItem("ns_cart", JSON.stringify(newCart));
  };

  // Centralized Sync with Shopify - Improved for robustness
  const syncShopify = async (currentCart) => {
    const customerId = localStorage.getItem("ns_customerId");
    if (!customerId) return;

    try {
      console.log("Syncing full cart to Shopify...");
      const res = await fetch("/api/customer/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          cart: currentCart
        }),
      });
      const data = await res.json();
      if (data.success) {
        console.log("Shopify sync successful");
      }
    } catch (err) {
      console.error("Shopify Cart Sync Error:", err);
    }
  };

  const syncCartToSDK = async (cartItems) => {
    const sdk = getCheckoutSDK();
    if (!sdk) {
      throw new Error("Checkout SDK not loaded. Refresh the page and try again.");
    }

    const items = (cartItems || [])
      .map(mapStoreCartItemToSdk)
      .filter((item) => item.variantId || item.productId);

    if (items.length === 0) {
      throw new Error("Your cart is empty");
    }

    await sdk.clearCart();
    for (const item of items) {
      await sdk.addToCart(item);
    }
  };
  // Debounce logic for cart sync
  useEffect(() => {
    const customerId = localStorage.getItem("ns_customerId");
    if (!customerId || isLoading) return;

    // Use a timer to batch rapid updates
    const timer = setTimeout(() => {
      syncShopify(cart);
    }, 500);

    return () => clearTimeout(timer);
  }, [cart, isLoading]);

  const addToCart = async (product, qty = 1) => {
    const variant = product.selectedVariant || product?.variants?.edges?.[0]?.node || product?.variants?.[0];
    const priceAmount = Number(variant?.price?.amount || product?.priceRange?.minVariantPrice?.amount || product?.price || 0);
    const totalValue = priceAmount * qty;

    if (typeof window !== "undefined") {
      if (window.fbq) {
        window.fbq('track', 'AddToCart', {
          content_name: product?.title,
          content_ids: [product?.id || product?.productId],
          content_type: 'product',
          value: totalValue,
          currency: 'INR'
        });
      }
      if (window.gtag) {
        window.gtag('event', 'add_to_cart', {
          currency: 'INR',
          value: totalValue,
          items: [{
            item_id: product?.id || product?.productId,
            item_name: product?.title,
            price: priceAmount,
            quantity: qty
          }]
        });
      }
    }
    // Prioritize selectedVariant from product details page or modal
    const variantId = product.selectedVariant?.id || product?.variants?.edges?.[0]?.node?.id || product?.variants?.[0]?.id || product?.variantId;
    const productId = product?.id || product?.productId;

    if (!variantId) return;

    const quantityToAdd = Number(qty);

    setCart(prevCart => {
      const existing = prevCart.find(i => i.variantId === variantId);
      let updatedCart;

      if (existing) {
        updatedCart = prevCart.map(i => i.variantId === variantId ? { ...i, qty: Number(i.qty) + quantityToAdd } : i);
      } else {
        const selectedVariant = product.selectedVariant || (product.variants?.edges?.find(e => e.node.id === variantId)?.node) || product.variants?.[0];

        const cartItem = {
          productId,
          variantId,
          qty: quantityToAdd,
          title: product.title,
          variantTitle: selectedVariant?.title || "",
          image: selectedVariant?.image?.url || product.images?.edges?.[0]?.node?.url || product.image || "/placeholder.png",
          price: selectedVariant?.price?.amount || product.priceRange?.minVariantPrice?.amount || product.price || "0.00",
          weight: selectedVariant?.weight || product.variants?.edges?.[0]?.node?.weight || 0,
          weightUnit: selectedVariant?.weightUnit || product.variants?.edges?.[0]?.node?.weightUnit || "GRAMS"
        };
        updatedCart = [...prevCart, cartItem];
      }

      syncLocal(updatedCart);
      return updatedCart;
    });
    openCart();
  };

  const updateQty = async (variantId, delta) => {
    setCart(prevCart => {
      const item = prevCart.find(i => i.variantId === variantId);
      if (!item) return prevCart;

      const newQty = Number(item.qty) + delta;
      let updatedCart;

      if (newQty <= 0) {
        updatedCart = prevCart.filter(i => i.variantId !== variantId);
      } else {
        updatedCart = prevCart.map(i => i.variantId === variantId ? { ...i, qty: newQty } : i);
      }

      syncLocal(updatedCart);
      return updatedCart;
    });
  };

  const removeFromCart = async (variantId) => {
    setCart(prevCart => {
      const updatedCart = prevCart.filter(i => i.variantId !== variantId);
      syncLocal(updatedCart);
      return updatedCart;
    });
  };

  // Load cart on initial mount
  useEffect(() => {
    async function fetchCart() {
      const customerId = localStorage.getItem("ns_customerId");
      setIsLoading(true);
      if (customerId) {
        try {
          const res = await fetch(`/api/customer/cart?customerId=${customerId}`);
          const data = await res.json();
          if (data.success) {
            setCart(data.cart);
            syncLocal(data.cart);
          }
        } catch (err) {
          console.error("Cart fetch error:", err);
        }
      } else {
        try {
          const local = localStorage.getItem("ns_cart");
          if (local) setCart(JSON.parse(local));
        } catch (err) {
          console.error("Local cart parse error:", err);
        }
      }
      setIsLoading(false);
    }
    fetchCart();
  }, []);

  const clearCart = async () => {
    setCart([]);
    syncLocal([]);
    await syncShopify([]);
  };
  
  const openMegaCheckout = useCallback(async (options = {}) => {
    const sdk = getCheckoutSDK();
    if (!sdk) {
      console.error("SDK not loaded");
      toast.error("Checkout is unavailable. Please refresh the page.");
      return;
    }

    const itemsToSync = options.cartItems ?? cart;
    if (!itemsToSync?.length) {
      toast.error("Your cart is empty");
      return;
    }

    const checkoutTotal = itemsToSync.reduce((sum, item) => sum + (Number(item.price || 0) * (item.qty || 1)), 0);
    const fbqContents = itemsToSync.map(i => ({ id: i.productId, quantity: i.qty }));
    const gtagItems = itemsToSync.map(i => ({ item_id: i.productId, item_name: i.title, price: Number(i.price || 0), quantity: i.qty }));

    if (typeof window !== "undefined") {
      if (window.fbq) {
        window.fbq('track', 'InitiateCheckout', {
          content_type: 'product',
          contents: fbqContents,
          currency: 'INR',
          value: checkoutTotal,
          num_items: itemsToSync.length
        });
      }
      if (window.gtag) {
        window.gtag('event', 'begin_checkout', {
          currency: 'INR',
          value: checkoutTotal,
          items: gtagItems
        });
      }
    }

    try {
      await syncCartToSDK(itemsToSync);

      const session = await sdk.syncCartWithBackend();
      const token = session?.token || session?.sessionToken;
      if (!token) {
        throw new Error("Could not start checkout session");
      }

      closeCart();

      sdk.openCheckout(token, {
        onSuccess: (data) => {
          clearCart();

          const statusUrl =
            data?.statusUrl ||
            (data?.sessionId ? buildOrderSuccessUrl(data.sessionId) : null);

          if (statusUrl) {
            window.location.href = statusUrl;
          }

          options.onSuccess?.(data);
        },

        onFailure: (err) => {
          console.error(err);
          toast.error(err?.message || "Payment failed. Please try again.");
          options.onFailure?.(err);
        },

        onClose: () => {
          options.onClose?.();
        },
      });
    } catch (err) {
      console.error("Checkout Error:", err);
      toast.error(err?.message || "Could not open checkout. Please try again.");
      options.onFailure?.(err);
    }
  }, [cart]);

  const openCartDrawer = useCallback(async (options = {}) => {
    const sdk = getCheckoutSDK();

    if (!sdk) {
      toast.error("Checkout is unavailable. Please refresh the page.");
      return;
    }

    if (!cart?.length) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      await syncCartToSDK(cart);

      const session = await sdk.syncCartWithBackend();
      const token = session?.token || session?.sessionToken;
      if (!token) {
        throw new Error("Could not start checkout session");
      }

      sdk.openCart(token, {
        onSuccess: options.onSuccess,
        onFailure: options.onFailure,
        onClose: options.onClose,
      });
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Could not open cart. Please try again.");
    }
  }, [cart]);

  const cartCount = cart.reduce(
    (sum, item) => sum + Number(item.qty || 0),
    0
  );

  const cartSubtotal = cart.reduce(
    (sum, item) =>
      sum + Number(item.price || 0) * Number(item.qty || 0),
    0
  );

  return (
    <CartSidebarContext.Provider value={{
      isOpen,
      openCart,
      closeCart,
      cart,
      setCart,
      isLoading,
      addToCart,
      updateQty,
      removeFromCart,
      clearCart,

      cartCount,
      cartSubtotal,

      openMegaCheckout,
      openCartDrawer
    }}>
      {children}
    </CartSidebarContext.Provider>
  );
}

export const useCartSidebar = () => useContext(CartSidebarContext);

// "use client";
// import { createContext, useContext, useState, useEffect } from "react";

// const CartSidebarContext = createContext();

// export function CartSidebarProvider({ children }) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [cart, setCart] = useState([]); // Global cart state
//   const [isLoading, setIsLoading] = useState(true);

//   const openCart = () => setIsOpen(true);
//   const closeCart = () => setIsOpen(false);

//   // Helper to sync with localStorage
//   const syncLocal = (newCart) => {
//     localStorage.setItem("ns_cart", JSON.stringify(newCart));
//   };

//   // Centralized Sync with Shopify - Improved for robustness
//   const syncShopify = async (currentCart) => {
//     const customerId = localStorage.getItem("ns_customerId");
//     if (!customerId) return;

//     try {
//       console.log("Syncing full cart to Shopify...");
//       const res = await fetch("/api/customer/cart", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           customerId,
//           cart: currentCart
//         }),
//       });
//       const data = await res.json();
//       if (data.success) {
//         console.log("Shopify sync successful");
//       }
//     } catch (err) {
//       console.error("Shopify Cart Sync Error:", err);
//     }
//   };

//   // Debounce logic for cart sync
//   useEffect(() => {
//     const customerId = localStorage.getItem("ns_customerId");
//     if (!customerId || isLoading) return;

//     // Use a timer to batch rapid updates
//     const timer = setTimeout(() => {
//       syncShopify(cart);
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [cart, isLoading]);

//   const addToCart = async (product, qty = 1) => {
//     // Prioritize selectedVariant from product details page or modal
//     const variantId = product.selectedVariant?.id || product?.variants?.edges?.[0]?.node?.id || product?.variants?.[0]?.id || product?.variantId;
//     const productId = product?.id || product?.productId;

//     if (!variantId) return;

//     const quantityToAdd = Number(qty);

//     setCart(prevCart => {
//       const existing = prevCart.find(i => i.variantId === variantId);
//       let updatedCart;

//       if (existing) {
//         updatedCart = prevCart.map(i => i.variantId === variantId ? { ...i, qty: Number(i.qty) + quantityToAdd } : i);
//       } else {
//         const selectedVariant = product.selectedVariant || (product.variants?.edges?.find(e => e.node.id === variantId)?.node) || product.variants?.[0];

//         const cartItem = {
//           productId,
//           variantId,
//           qty: quantityToAdd,
//           title: product.title,
//           variantTitle: selectedVariant?.title || "",
//           image: selectedVariant?.image?.url || product.images?.edges?.[0]?.node?.url || product.image || "/placeholder.png",
//           price: selectedVariant?.price?.amount || product.priceRange?.minVariantPrice?.amount || product.price || "0.00",
//           weight: selectedVariant?.weight || product.variants?.edges?.[0]?.node?.weight || 0,
//           weightUnit: selectedVariant?.weightUnit || product.variants?.edges?.[0]?.node?.weightUnit || "GRAMS"
//         };
//         updatedCart = [...prevCart, cartItem];
//       }

//       syncLocal(updatedCart);
//       return updatedCart;
//     });
//     openCart();
//   };

//   const updateQty = async (variantId, delta) => {
//     setCart(prevCart => {
//       const item = prevCart.find(i => i.variantId === variantId);
//       if (!item) return prevCart;

//       const newQty = Number(item.qty) + delta;
//       let updatedCart;

//       if (newQty <= 0) {
//         updatedCart = prevCart.filter(i => i.variantId !== variantId);
//       } else {
//         updatedCart = prevCart.map(i => i.variantId === variantId ? { ...i, qty: newQty } : i);
//       }

//       syncLocal(updatedCart);
//       return updatedCart;
//     });
//   };

//   const removeFromCart = async (variantId) => {
//     setCart(prevCart => {
//       const updatedCart = prevCart.filter(i => i.variantId !== variantId);
//       syncLocal(updatedCart);
//       return updatedCart;
//     });
//   };

//   // Load cart on initial mount
//   useEffect(() => {
//     async function fetchCart() {
//       const customerId = localStorage.getItem("ns_customerId");
//       setIsLoading(true);
//       if (customerId) {
//         try {
//           const res = await fetch(`/api/customer/cart?customerId=${customerId}`);
//           const data = await res.json();
//           if (data.success) {
//             setCart(data.cart);
//             syncLocal(data.cart);
//           }
//         } catch (err) {
//           console.error("Cart fetch error:", err);
//         }
//       } else {
//         try {
//           const local = localStorage.getItem("ns_cart");
//           if (local) setCart(JSON.parse(local));
//         } catch (err) {
//           console.error("Local cart parse error:", err);
//         }
//       }
//       setIsLoading(false);
//     }
//     fetchCart();
//   }, []);

//   const clearCart = async () => {
//     setCart([]);
//     syncLocal([]);
//     await syncShopify([]);
//   };

//   return (
//     <CartSidebarContext.Provider value={{
//       isOpen, openCart, closeCart,
//       cart, setCart, isLoading,
//       addToCart, updateQty, removeFromCart, clearCart
//     }}>
//       {children}
//     </CartSidebarContext.Provider>
//   );
// }

// export const useCartSidebar = () => useContext(CartSidebarContext);