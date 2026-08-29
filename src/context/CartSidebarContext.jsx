"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { getCheckoutSDK, buildOrderSuccessUrl, mapStoreCartItemToSdk, getPositiveWeight } from "@/lib/checkout";

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
        const rawWeight = selectedVariant?.weight || product.variants?.edges?.[0]?.node?.weight || product.weight;
        const rawUnit = selectedVariant?.weightUnit || product.variants?.edges?.[0]?.node?.weightUnit || product.weightUnit;
        const { weight: safeWeight, weightUnit: safeUnit } = getPositiveWeight(rawWeight, rawUnit, selectedVariant?.title, product.title);

        const cartItem = {
          productId,
          variantId,
          qty: quantityToAdd,
          title: product.title,
          variantTitle: selectedVariant?.title || "",
          image: selectedVariant?.image?.url || product.images?.edges?.[0]?.node?.url || product.image || "/placeholder.png",
          price: selectedVariant?.price?.amount || product.priceRange?.minVariantPrice?.amount || product.price || "0.00",
          weight: safeWeight,
          weightUnit: safeUnit
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
// import { createContext, useContext, useState, useEffect, useCallback } from "react";
// import toast from "react-hot-toast";
// import { getCheckoutSDK, buildOrderSuccessUrl, mapStoreCartItemToSdk } from "@/lib/checkout";

// function normalizeWeightUnit(unit) {
//   if (!unit) return "g";
//   const u = String(unit).trim().toLowerCase();
//   if (u === "grams" || u === "gram" || u === "gm" || u === "g") return "g";
//   if (u === "kilograms" || u === "kilogram" || u === "kg") return "kg";
//   if (u === "ml") return "ml";
//   if (u === "l" || u === "liter" || u === "litre") return "l";
//   return u;
// }

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

//   const syncCartToSDK = async (cartItems) => {
//     const sdk = getCheckoutSDK();
//     if (!sdk) {
//       throw new Error("Checkout SDK not loaded. Refresh the page and try again.");
//     }

//     const items = (cartItems || [])
//       .map(mapStoreCartItemToSdk)
//       .filter((item) => item.variantId || item.productId);

//     if (items.length === 0) {
//       throw new Error("Your cart is empty");
//     }

//     await sdk.clearCart();
//     for (const item of items) {
//       await sdk.addToCart(item);
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

//     if (!variantId) return false;

//     const quantityToAdd = Number(qty);

//     setCart(prevCart => {
//       const existing = prevCart.find(i => i.variantId === variantId);
//       let updatedCart;

//       if (existing) {
//         updatedCart = prevCart.map(i => i.variantId === variantId ? { ...i, qty: Number(i.qty) + quantityToAdd } : i);
//       } else {
//         const rawVariants = Array.isArray(product.variants)
//           ? product.variants
//           : (product.variants?.edges?.map(e => e.node) || []);

//         const selectedVariant =
//           product.selectedVariant ||
//           rawVariants.find(v => String(v.id || v._id) === String(variantId)) ||
//           rawVariants[0] ||
//           null;

//         const isSingleVariant = rawVariants.length <= 1;
//         const variantWeight = Number(selectedVariant?.weight || 0);
//         const productWeight = Number(product.weight || product.min_weight || 0);

//         let weightVal = 0;
//         let weightUnit = "g";

//         if (isSingleVariant) {
//           // If only one variant, take directly from product root
//           weightVal = productWeight > 0 ? productWeight : (variantWeight > 0 ? variantWeight : 0);
//           weightUnit = product?.weight_unit || product?.weightUnit || selectedVariant?.weightUnit || selectedVariant?.weight_unit || "g";
//         } else {
//           // Multiple variants: prioritize variant weight
//           weightVal = variantWeight > 0 ? variantWeight : (productWeight > 0 ? productWeight : 0);
//           weightUnit = (variantWeight > 0 && (selectedVariant?.weightUnit || selectedVariant?.weight_unit))
//             ? (selectedVariant.weightUnit || selectedVariant.weight_unit)
//             : (product?.weight_unit || product?.weightUnit || selectedVariant?.weightUnit || selectedVariant?.weight_unit || "g");
//         }

//         // Fallback: extract weight from variant title if weight is still 0 (e.g. "8ml", "50gm", "100g", "1kg")
//         if (weightVal === 0) {
//           const titleStr = selectedVariant?.title || product.title || "";
//           const match = titleStr.match(/(\d+(?:\.\d+)?)\s*(gm|g|kg|ml|l)\b/i);
//           if (match) {
//             weightVal = parseFloat(match[1]);
//             const unit = match[2].toLowerCase();
//             weightUnit = (unit === "kg" || unit === "l") ? "kg" : "g";
//           }
//         }

//         const cartItem = {
//           productId,
//           variantId,
//           qty: quantityToAdd,
//           title: product.title,
//           variantTitle: selectedVariant?.title || "",
//           image: selectedVariant?.image?.url || product.images?.edges?.[0]?.node?.url || product.image || "/placeholder.png",
//           price: selectedVariant?.price?.amount || selectedVariant?.price || product.priceRange?.minVariantPrice?.amount || product.price || "0.00",
//           weight: isNaN(weightVal) ? 0 : weightVal,
//           weightUnit: normalizeWeightUnit(weightUnit),
//         };
//         updatedCart = [...prevCart, cartItem];
//       }

//       syncLocal(updatedCart);
//       return updatedCart;
//     });
//     openCart();
//     return true;
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
  
//   const openMegaCheckout = useCallback(async (options = {}) => {
//     const sdk = getCheckoutSDK();
//     if (!sdk) {
//       console.error("SDK not loaded");
//       toast.error("Checkout is unavailable. Please refresh the page.");
//       return;
//     }

//     const itemsToSync = options.cartItems ?? cart;
//     if (!itemsToSync?.length) {
//       toast.error("Your cart is empty");
//       return;
//     }

//     const checkoutTotal = itemsToSync.reduce((sum, item) => sum + (Number(item.price || 0) * (item.qty || 1)), 0);
//     const fbqContents = itemsToSync.map(i => ({ id: i.productId, quantity: i.qty }));
//     const gtagItems = itemsToSync.map(i => ({ item_id: i.productId, item_name: i.title, price: Number(i.price || 0), quantity: i.qty }));

//     if (typeof window !== "undefined") {
//       if (window.fbq) {
//         window.fbq('track', 'InitiateCheckout', {
//           content_type: 'product',
//           contents: fbqContents,
//           currency: 'INR',
//           value: checkoutTotal,
//           num_items: itemsToSync.length
//         });
//       }
//       if (window.gtag) {
//         window.gtag('event', 'begin_checkout', {
//           currency: 'INR',
//           value: checkoutTotal,
//           items: gtagItems
//         });
//       }
//     }

//     try {
//       await syncCartToSDK(itemsToSync);

//       const session = await sdk.syncCartWithBackend();
//       const token = session?.token || session?.sessionToken;
//       if (!token) {
//         throw new Error("Could not start checkout session");
//       }

//       closeCart();

//       sdk.openCheckout(token, {
//         onSuccess: (data) => {
//           clearCart();

//           const statusUrl =
//             data?.statusUrl ||
//             (data?.sessionId ? buildOrderSuccessUrl(data.sessionId) : null);

//           if (statusUrl) {
//             window.location.href = statusUrl;
//           }

//           options.onSuccess?.(data);
//         },

//         onFailure: (err) => {
//           console.error(err);
//           toast.error(err?.message || "Payment failed. Please try again.");
//           options.onFailure?.(err);
//         },

//         onClose: () => {
//           options.onClose?.();
//         },
//       });
//     } catch (err) {
//       console.error("Checkout Error:", err);
//       toast.error(err?.message || "Could not open checkout. Please try again.");
//       options.onFailure?.(err);
//     }
//   }, [cart]);

//   const openCartDrawer = useCallback(async (options = {}) => {
//     const sdk = getCheckoutSDK();

//     if (!sdk) {
//       toast.error("Checkout is unavailable. Please refresh the page.");
//       return;
//     }

//     if (!cart?.length) {
//       toast.error("Your cart is empty");
//       return;
//     }

//     try {
//       await syncCartToSDK(cart);

//       const session = await sdk.syncCartWithBackend();
//       const token = session?.token || session?.sessionToken;
//       if (!token) {
//         throw new Error("Could not start checkout session");
//       }

//       sdk.openCart(token, {
//         onSuccess: options.onSuccess,
//         onFailure: options.onFailure,
//         onClose: options.onClose,
//       });
//     } catch (err) {
//       console.error(err);
//       toast.error(err?.message || "Could not open cart. Please try again.");
//     }
//   }, [cart]);

//   const cartCount = cart.reduce(
//     (sum, item) => sum + Number(item.qty || 0),
//     0
//   );

//   const cartSubtotal = cart.reduce(
//     (sum, item) =>
//       sum + Number(item.price || 0) * Number(item.qty || 0),
//     0
//   );

//   return (
//     <CartSidebarContext.Provider value={{
//       isOpen,
//       openCart,
//       closeCart,
//       cart,
//       setCart,
//       isLoading,
//       addToCart,
//       updateQty,
//       removeFromCart,
//       clearCart,

//       cartCount,
//       cartSubtotal,

//       openMegaCheckout,
//       openCartDrawer
//     }}>
//       {children}
//     </CartSidebarContext.Provider>
//   );
// }

// export const useCartSidebar = () => useContext(CartSidebarContext);

// // "use client";
// // import { createContext, useContext, useState, useEffect } from "react";

// // const CartSidebarContext = createContext();

// // export function CartSidebarProvider({ children }) {
// //   const [isOpen, setIsOpen] = useState(false);
// //   const [cart, setCart] = useState([]); // Global cart state
// //   const [isLoading, setIsLoading] = useState(true);

// //   const openCart = () => setIsOpen(true);
// //   const closeCart = () => setIsOpen(false);

// //   // Helper to sync with localStorage
// //   const syncLocal = (newCart) => {
// //     localStorage.setItem("ns_cart", JSON.stringify(newCart));
// //   };

// //   // Centralized Sync with Shopify - Improved for robustness
// //   const syncShopify = async (currentCart) => {
// //     const customerId = localStorage.getItem("ns_customerId");
// //     if (!customerId) return;

// //     try {
// //       console.log("Syncing full cart to Shopify...");
// //       const res = await fetch("/api/customer/cart", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({
// //           customerId,
// //           cart: currentCart
// //         }),
// //       });
// //       const data = await res.json();
// //       if (data.success) {
// //         console.log("Shopify sync successful");
// //       }
// //     } catch (err) {
// //       console.error("Shopify Cart Sync Error:", err);
// //     }
// //   };

// //   // Debounce logic for cart sync
// //   useEffect(() => {
// //     const customerId = localStorage.getItem("ns_customerId");
// //     if (!customerId || isLoading) return;

// //     // Use a timer to batch rapid updates
// //     const timer = setTimeout(() => {
// //       syncShopify(cart);
// //     }, 500);

// //     return () => clearTimeout(timer);
// //   }, [cart, isLoading]);

// //   const addToCart = async (product, qty = 1) => {
// //     // Prioritize selectedVariant from product details page or modal
// //     const variantId = product.selectedVariant?.id || product?.variants?.edges?.[0]?.node?.id || product?.variants?.[0]?.id || product?.variantId;
// //     const productId = product?.id || product?.productId;

// //     if (!variantId) return;

// //     const quantityToAdd = Number(qty);

// //     setCart(prevCart => {
// //       const existing = prevCart.find(i => i.variantId === variantId);
// //       let updatedCart;

// //       if (existing) {
// //         updatedCart = prevCart.map(i => i.variantId === variantId ? { ...i, qty: Number(i.qty) + quantityToAdd } : i);
// //       } else {
// //         const selectedVariant = product.selectedVariant || (product.variants?.edges?.find(e => e.node.id === variantId)?.node) || product.variants?.[0];

// //         const cartItem = {
// //           productId,
// //           variantId,
// //           qty: quantityToAdd,
// //           title: product.title,
// //           variantTitle: selectedVariant?.title || "",
// //           image: selectedVariant?.image?.url || product.images?.edges?.[0]?.node?.url || product.image || "/placeholder.png",
// //           price: selectedVariant?.price?.amount || product.priceRange?.minVariantPrice?.amount || product.price || "0.00",
// //           weight: selectedVariant?.weight || product.variants?.edges?.[0]?.node?.weight || 0,
// //           weightUnit: selectedVariant?.weightUnit || product.variants?.edges?.[0]?.node?.weightUnit || "GRAMS"
// //         };
// //         updatedCart = [...prevCart, cartItem];
// //       }

// //       syncLocal(updatedCart);
// //       return updatedCart;
// //     });
// //     openCart();
// //   };

// //   const updateQty = async (variantId, delta) => {
// //     setCart(prevCart => {
// //       const item = prevCart.find(i => i.variantId === variantId);
// //       if (!item) return prevCart;

// //       const newQty = Number(item.qty) + delta;
// //       let updatedCart;

// //       if (newQty <= 0) {
// //         updatedCart = prevCart.filter(i => i.variantId !== variantId);
// //       } else {
// //         updatedCart = prevCart.map(i => i.variantId === variantId ? { ...i, qty: newQty } : i);
// //       }

// //       syncLocal(updatedCart);
// //       return updatedCart;
// //     });
// //   };

// //   const removeFromCart = async (variantId) => {
// //     setCart(prevCart => {
// //       const updatedCart = prevCart.filter(i => i.variantId !== variantId);
// //       syncLocal(updatedCart);
// //       return updatedCart;
// //     });
// //   };

// //   // Load cart on initial mount
// //   useEffect(() => {
// //     async function fetchCart() {
// //       const customerId = localStorage.getItem("ns_customerId");
// //       setIsLoading(true);
// //       if (customerId) {
// //         try {
// //           const res = await fetch(`/api/customer/cart?customerId=${customerId}`);
// //           const data = await res.json();
// //           if (data.success) {
// //             setCart(data.cart);
// //             syncLocal(data.cart);
// //           }
// //         } catch (err) {
// //           console.error("Cart fetch error:", err);
// //         }
// //       } else {
// //         try {
// //           const local = localStorage.getItem("ns_cart");
// //           if (local) setCart(JSON.parse(local));
// //         } catch (err) {
// //           console.error("Local cart parse error:", err);
// //         }
// //       }
// //       setIsLoading(false);
// //     }
// //     fetchCart();
// //   }, []);

// //   const clearCart = async () => {
// //     setCart([]);
// //     syncLocal([]);
// //     await syncShopify([]);
// //   };

// //   return (
// //     <CartSidebarContext.Provider value={{
// //       isOpen, openCart, closeCart,
// //       cart, setCart, isLoading,
// //       addToCart, updateQty, removeFromCart, clearCart
// //     }}>
// //       {children}
// //     </CartSidebarContext.Provider>
// //   );
// // }

// // export const useCartSidebar = () => useContext(CartSidebarContext);