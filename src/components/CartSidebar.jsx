"use client";
import Link from "next/link";
import { useCartSidebar } from "@/context/CartSidebarContext";
import { X, Plus, Minus, Trash2, ShoppingCart } from "lucide-react";
import CartUpsell from "./CartUpsell";

export default function CartSidebar() {
  const {
    isOpen,
    closeCart,
    cart,
    isLoading,
    updateQty,
    removeFromCart,
    openMegaCheckout
  } = useCartSidebar();

  const handleProceedToCheckout = (e) => {
  e.preventDefault();

  openMegaCheckout({
    onClose: closeCart,
  });
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-auto">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500"
        onClick={closeCart}
      />

      {/* Sidebar Container - Adaptive width for desktop/mobile */}
      <div className="absolute right-0 top-0 h-full w-full md:max-w-4xl bg-white shadow-2xl flex flex-col md:flex-row transform transition-transform duration-500 ease-out">

        {/* DESKTOP: Left Side - You May Also Like */}
        <div className="hidden md:block md:w-[40%] w-0 bg-gray-50 border-r overflow-y-auto custom-scrollbar">
          <CartUpsell />
        </div>

        {/* Right Side - Your Cart content */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden md:max-w-[60%] w-full ml-auto">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b flex justify-between items-center bg-gray-50">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">YOUR CART</h2>
              <p className="text-xs text-gray-500 mt-0.5 sm:mt-1 uppercase tracking-widest">{cart.length} ITEMS SELECTED</p>
            </div>
            <button
              onClick={closeCart}
              className="p-2 hover:bg-white rounded-full transition shadow-sm border border-transparent hover:border-gray-200"
            >
              <X
                size={20}
                className="text-black transition-transform duration-500 hover:rotate-[90deg]"
              />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 scrollbar-hide">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5e0404]"></div>
              </div>
            ) : cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <ShoppingCart size={32} className="opacity-20" />
                </div>
                <p className="font-medium">Your cart is empty</p>
                <button onClick={closeCart} className="text-[#5e0404] font-bold text-sm underline uppercase tracking-widest hover:text-[#3a0303]">
                  Start Shopping
                </button>
              </div>
            ) : (
              <>
                {cart
                  .filter(item => item.title && item.title !== "Unknown Product")
                  .map((item) => (
                    <div key={item.variantId} className="flex gap-4 group">
                      <div className="w-20 h-20 bg-gray-50 overflow-hidden flex-shrink-0">
                        <img
                          src={item.image || "/placeholder.png"}
                          alt={item.title || "product"}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="text-sm font-bold text-gray-900 line-clamp-1 uppercase">
                            {item.title || "Loading..."}
                          </h3>
                          {item.variantTitle && item.variantTitle !== "Default Title" && (
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{item.variantTitle}</p>
                          )}
                          <button onClick={() => removeFromCart(item.variantId)} className="text-gray-400 hover:text-red-600 transition">
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 italic">Premium Quality</p>

                        <div className="flex justify-between items-center mt-3">
                          {/* Qty Controls */}
                          <div className="flex items-center border rounded-full px-2 py-1 gap-3">
                            <button onClick={() => updateQty(item.variantId, -1)} className="text-black hover:text-red-800"><Minus size={14} /></button>
                            <span className="text-xs font-bold w-4 text-center text-black">{item.qty}</span>
                            <button onClick={() => updateQty(item.variantId, 1)} className="text-black hover:text-red-800"><Plus size={14} /></button>
                          </div>
                          <span className="font-bold text-[#5e0404]">
                            ₹{(Number(item.price) * item.qty).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </>
            )}
          </div>

          {/* MOBILE ONLY: Suggested Products sticky above footer */}
          <div className="md:hidden">
            <CartUpsell isMobile />
          </div>

          {/* Footer / Checkout */}
          {cart.length > 0 && (
            <div className="md:p-6 p-3 border-t bg-gray-50">
              <div className="flex justify-between items-center mb-2 md:mb-4 text-lg font-bold">
                <span>Subtotal</span>
                <span>
                  ₹{cart.reduce((acc, item) => {
                    const price = Number(item.price || 0);
                    return acc + (price * item.qty);
                  }, 0).toFixed(2)}
                </span>
              </div>
              <p className="text-[10px] text-start text-gray-500 mb-2 md:mb-6 uppercase text-center tracking-tighter">
                Shipping & taxes calculated at checkout
              </p>
              <button
                onClick={handleProceedToCheckout}
                className="w-full bg-[#5e0404] text-white py-4 rounded-lg font-bold hover:bg-[#3a0303] transition-all transform active:scale-95 shadow-lg flex items-center justify-center"
              >
                PROCEED TO CHECKOUT
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// "use client";
// import Link from "next/link";
// import { useCartSidebar } from "@/context/CartSidebarContext";
// import { X, Plus, Minus, Trash2, ShoppingCart } from "lucide-react";
// import CartUpsell from "./CartUpsell";

// export default function CartSidebar() {
//   const { isOpen, closeCart, cart, isLoading, updateQty, removeFromCart } = useCartSidebar();

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-[100] pointer-events-auto">
//       {/* Backdrop */}
//       <div
//         className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500"
//         onClick={closeCart}
//       />

//       {/* Sidebar Container - Adaptive width for desktop/mobile */}
//       <div className="absolute right-0 top-0 h-full w-full md:max-w-4xl bg-white shadow-2xl flex flex-col md:flex-row transform transition-transform duration-500 ease-out">

//         {/* DESKTOP: Left Side - You May Also Like */}
//         <div className="hidden md:block md:w-[40%] w-0 bg-gray-50 border-r overflow-y-auto custom-scrollbar">
//           <CartUpsell />
//         </div>

//         {/* Right Side - Your Cart content */}
//         <div className="flex-1 flex flex-col bg-white overflow-hidden md:max-w-[60%] w-full ml-auto">
//           {/* Header */}
//           <div className="p-6 border-b flex justify-between items-center bg-gray-50">
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900 tracking-tight">YOUR CART</h2>
//               <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">{cart.length} ITEMS SELECTED</p>
//             </div>
//             <button
//               onClick={closeCart}
//               className="p-2 hover:bg-white rounded-full transition shadow-sm border border-transparent hover:border-gray-200"
//             >
//               <X
//                 size={20}
//                 className="text-black transition-transform duration-500 hover:rotate-[90deg]"
//               />
//             </button>
//           </div>

//           {/* Items */}
//           <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
//             {isLoading ? (
//               <div className="h-full flex items-center justify-center">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5e0404]"></div>
//               </div>
//             ) : cart.length === 0 ? (
//               <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
//                 <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
//                   <ShoppingCart size={32} className="opacity-20" />
//                 </div>
//                 <p className="font-medium">Your cart is empty</p>
//                 <button onClick={closeCart} className="text-[#5e0404] font-bold text-sm underline uppercase tracking-widest hover:text-[#3a0303]">
//                   Start Shopping
//                 </button>
//               </div>
//             ) : (
//               <>
//                 {cart
//                   .filter(item => item.title && item.title !== "Unknown Product")
//                   .map((item) => (
//                     <div key={item.variantId} className="flex gap-4 group">
//                       <div className="w-20 h-20 bg-gray-50 overflow-hidden flex-shrink-0">
//                         <img
//                           src={item.image || "/placeholder.png"}
//                           alt={item.title || "product"}
//                           className="w-full h-full object-cover"
//                         />
//                       </div>

//                       <div className="flex-1">
//                         <div className="flex justify-between">
//                           <h3 className="text-sm font-bold text-gray-900 line-clamp-1 uppercase">
//                             {item.title || "Loading..."}
//                           </h3>
//                           {item.variantTitle && item.variantTitle !== "Default Title" && (
//                             <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{item.variantTitle}</p>
//                           )}
//                           <button onClick={() => removeFromCart(item.variantId)} className="text-gray-400 hover:text-red-600 transition">
//                             <Trash2 size={16} />
//                           </button>
//                         </div>
//                         <p className="text-xs text-gray-500 mt-1 italic">Premium Quality</p>

//                         <div className="flex justify-between items-center mt-3">
//                           {/* Qty Controls */}
//                           <div className="flex items-center border rounded-full px-2 py-1 gap-3">
//                             <button onClick={() => updateQty(item.variantId, -1)} className="text-black hover:text-red-800"><Minus size={14} /></button>
//                             <span className="text-xs font-bold w-4 text-center text-black">{item.qty}</span>
//                             <button onClick={() => updateQty(item.variantId, 1)} className="text-black hover:text-red-800"><Plus size={14} /></button>
//                           </div>
//                           <span className="font-bold text-[#5e0404]">
//                             ₹{(Number(item.price) * item.qty).toFixed(2)}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//               </>
//             )}
//           </div>

//           {/* MOBILE ONLY: Suggested Products sticky above footer */}
//           <div className="md:hidden">
//             <CartUpsell isMobile />
//           </div>

//           {/* Footer / Checkout */}
//           {cart.length > 0 && (
//             <div className="md:p-6 p-3 border-t bg-gray-50">
//               <div className="flex justify-between items-center mb-2 md:mb-4 text-lg font-bold">
//                 <span>Subtotal</span>
//                 <span>
//                   ₹{cart.reduce((acc, item) => {
//                     const price = Number(item.price || 0);
//                     return acc + (price * item.qty);
//                   }, 0).toFixed(2)}
//                 </span>
//               </div>
//               <p className="text-[10px] text-start text-gray-500 mb-2 md:mb-6 uppercase text-center tracking-tighter">
//                 Shipping & taxes calculated at checkout
//               </p>
//               <Link
//                 href="/checkout"
//                 onClick={closeCart}
//                 className="w-full bg-[#5e0404] text-white py-4 rounded-lg font-bold hover:bg-[#3a0303] transition-all transform active:scale-95 shadow-lg flex items-center justify-center"
//               >
//                 PROCEED TO CHECKOUT
//               </Link>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }