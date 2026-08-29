"use client";

import React from "react";
import { ShoppingCart } from "lucide-react";
import { useCartSidebar } from "@/context/CartSidebarContext";

// --------------------
// ADD TO CART
// --------------------
export function AddToCart({ product, variant = null, qty = 1, isOutOfStock = false, price = null }) {
  const { cart, addToCart, updateQty, removeFromCart } = useCartSidebar();
  console.log("*---------------------***************************")
  console.log("variant", variant)
  console.log("product", product)
  console.log("*---------------------***************************")
  const variantId =
    variant?.id ||
    product?.variants?.edges?.[0]?.node?.id ||
    product?.variants?.[0]?.id ||
    product?.variant_ids?.[0] ||
    product?.id;

  const cartItem = cart.find((i) => i.variantId === variantId);
  const inCart = !!cartItem;

  console.log("variant", variantId)

  async function handleAddToCart(e) {
    e.preventDefault();
    e.stopPropagation();

    const priceAmount = Number(price || variant?.price?.amount || variant?.priceV2?.amount || product?.priceRange?.minVariantPrice?.amount || product?.price || 0);
    const totalValue = priceAmount * qty;

    if (typeof window !== "undefined") {
      if (window.fbq) {
        window.fbq('track', 'AddToCart', {
          content_name: product?.title,
          content_ids: [product?.id],
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
            item_id: product?.id,
            item_name: product?.title,
            price: priceAmount,
            quantity: qty
          }]
        });
      }
    }

    const firstV =
      product?.variants?.edges?.[0]?.node ||
      product?.variants?.[0] ||
      null;

    const activeVariant = variant || firstV;

    await addToCart(
      {
        ...product,
        selectedVariant: activeVariant,
      },
      qty
    );
  }
  // console.log("cart", cart);

  if (isOutOfStock) {
    return (
      <button
        disabled
        className="text-[10px] md:text-sm w-full flex items-center justify-center md:gap-2 gap-1 px-2 py-2.5 md:px-4 md:py-2.5 rounded-full text-gray-500 font-bold tracking-widest transition bg-gray-200 cursor-not-allowed uppercase shadow-none"
      >
        OUT OF STOCK
      </button>
    );
  }

  if (inCart) {
    return (
      <div
        className="w-full flex items-center justify-between gap-1 px-3 md:py-1.5 py-1 rounded-full bg-[#5e0404] text-white font-bold"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
      >
        <button
          onClick={() => updateQty(variantId, -1)}
          className="md:w-7 md:h-7 w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/20 transition text-lg leading-none"
        >
          −
        </button>
        <span className="md:text-sm text-[9px] font-bold min-w-[20px] text-center">{cartItem.qty}</span>
        <button
          onClick={() => updateQty(variantId, 1)}
          className="md:w-7 md:h-7 w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/20 transition text-lg leading-none"
        >
          +
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={(e) => { handleAddToCart(e); }}
      className="text-[10px] md:text-sm w-full flex items-center justify-center md:gap-2 gap-1 px-2 py-2.5 md:px-4 md:py-2.5 rounded-full text-white font-bold tracking-widest transition bg-[#700b10] hover:bg-[#5a090d] active:scale-95 shadow-md uppercase"
    >
      <ShoppingCart className="h-3.5 w-3.5 md:h-4 md:w-4" />
      <span>ADD TO CART</span>
    </button>
  );
}



// "use client";

// import React from "react";
// import { ShoppingCart } from "lucide-react";
// import { useCartSidebar } from "@/context/CartSidebarContext";

// // --------------------
// // ADD TO CART
// // --------------------
// export function AddToCart({ product, variant = null, qty = 1, isOutOfStock = false, price = null }) {
//   const { cart, addToCart, updateQty, removeFromCart } = useCartSidebar();
//   const variantId =
//     variant?.id ||
//     product?.variants?.edges?.[0]?.node?.id ||
//     product?.variants?.[0]?.id ||
//     product?.variant_ids?.[0] ||
//     product?.id;

//   const cartItem = cart.find((i) => i.variantId === variantId);
//   const inCart = !!cartItem;

//   async function handleAddToCart(e) {
//     e.preventDefault();
//     e.stopPropagation();

//     const firstV =
//       product?.variants?.edges?.[0]?.node ||
//       product?.variants?.[0] ||
//       null;

//     const activeVariant = variant || firstV;
//     const targetVariantId =
//       activeVariant?.id ||
//       product?.variants?.edges?.[0]?.node?.id ||
//       product?.variants?.[0]?.id ||
//       product?.variant_ids?.[0] ||
//       product?.id;

//     if (!targetVariantId) return;

//     const priceAmount = Number(
//       price ||
//       activeVariant?.price?.amount ||
//       activeVariant?.priceV2?.amount ||
//       activeVariant?.price ||
//       product?.priceRange?.minVariantPrice?.amount ||
//       product?.price ||
//       0
//     );
//     const totalValue = priceAmount * qty;
//     const cleanProductId = String(product?.id || product?.productId || "").replace(/^gid:\/\/shopify\/Product\//, "");

//     // Fire Analytics within user click gesture
//     if (typeof window !== "undefined") {
//       const itemObj = {
//         item_id: cleanProductId,
//         item_name: product?.title,
//         price: priceAmount,
//         quantity: qty
//       };
//       if (activeVariant?.title && activeVariant?.title !== 'Default Title') {
//         itemObj.item_variant = activeVariant.title;
//       }

//       const gtagPayload = {
//         currency: 'INR',
//         value: totalValue,
//         items: [itemObj]
//       };

//       if (window.gtag) {
//         window.gtag('event', 'add_to_cart', gtagPayload);
//       } else if (window.dataLayer) {
//         window.dataLayer.push({
//           event: 'add_to_cart',
//           ...gtagPayload
//         });
//       }

//       const metaPayload = {
//         content_name: product?.title,
//         content_ids: [cleanProductId],
//         content_type: 'product',
//         value: totalValue,
//         currency: 'INR'
//       };

//       if (typeof window.fbq === "function") {
//         try {
//           window.fbq('track', 'AddToCart', metaPayload);
//           window.fbq('trackSingle', '1455730108844531', 'AddToCart', metaPayload);
//         } catch (err) {
//           console.error('[Meta Pixel] AddToCart error:', err);
//         }
//       }
//     }

//     await addToCart(
//       {
//         ...product,
//         selectedVariant: activeVariant,
//       },
//       qty
//     );
//   }
//   // console.log("cart", cart);

//   if (isOutOfStock) {
//     return (
//       <button
//         disabled
//         className="text-[10px] md:text-sm w-full flex items-center justify-center md:gap-2 gap-1 px-2 py-2.5 md:px-4 md:py-2.5 rounded-full text-gray-500 font-bold tracking-widest transition bg-gray-200 cursor-not-allowed uppercase shadow-none"
//       >
//         OUT OF STOCK
//       </button>
//     );
//   }

//   if (inCart) {
//     return (
//       <div
//         className="w-full flex items-center justify-between gap-1 px-3 md:py-1.5 py-1 rounded-full bg-[#5e0404] text-white font-bold"
//         onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
//       >
//         <button
//           onClick={() => updateQty(variantId, -1)}
//           className="md:w-7 md:h-7 w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/20 transition text-lg leading-none"
//         >
//           −
//         </button>
//         <span className="md:text-sm text-[9px] font-bold min-w-[20px] text-center">{cartItem.qty}</span>
//         <button
//           onClick={() => updateQty(variantId, 1)}
//           className="md:w-7 md:h-7 w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/20 transition text-lg leading-none"
//         >
//           +
//         </button>
//       </div>
//     );
//   }

//   return (
//     <button
//       onClick={(e) => { handleAddToCart(e); }}
//       className="text-[10px] md:text-sm w-full flex items-center justify-center md:gap-2 gap-1 px-2 py-2.5 md:px-4 md:py-2.5 rounded-full text-white font-bold tracking-widest transition bg-[#700b10] hover:bg-[#5a090d] active:scale-95 shadow-md uppercase"
//     >
//       <ShoppingCart className="h-3.5 w-3.5 md:h-4 md:w-4" />
//       <span>ADD TO CART</span>
//     </button>
//   );
// }
