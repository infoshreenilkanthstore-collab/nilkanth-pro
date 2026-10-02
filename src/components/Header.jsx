import React, { useState } from "react";
import { Search, Heart, ShoppingCart, User, Menu, X } from "lucide-react";
import { LOGO_URL } from "../data/storeData";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

export default function Header({
  activePage = "home",
  onNavigate,
  onOpenSearch,
  onOpenAuth,
  currentUser
}) {
  const { wishlistCount, openDrawer } = useWishlist();
  const { cartCount, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (e, page) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(page);
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="sticky top-[33px] z-40 w-full px-2 sm:px-4 lg:px-6 pb-2 transition-all duration-300">
      <header className="max-w-[90rem] mx-auto bg-white/95 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-[4rem] border border-amber-100/60 transition-all duration-300 relative z-50">
        <div className="px-4 sm:px-6 lg:px-12 h-16 lg:h-14 flex items-center justify-between relative text-[#700b10] bg-white rounded-[4rem]">
          {/* Mobile & Tablet Menu Button (shown on md and below, hidden on xl) */}
          <div className="xl:hidden flex items-center justify-start z-50">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -ml-2 rounded-full hover:bg-stone-100 transition-colors text-[#700b10] cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Desktop Left Navigation Links (shown only on xl and above) */}
          <nav className="hidden xl:flex flex-1 items-center gap-5 2xl:gap-8 justify-start">
            <a
              href="/"
              onClick={(e) => handleNav(e, "home")}
              className={`font-nunito text-[14px] 2xl:text-[15px] transition-colors py-2 whitespace-nowrap cursor-pointer ${activePage === "home"
                ? "font-bold text-[#700b10] border-b-2 border-[#700b10]"
                : "font-medium text-stone-700 hover:text-[#700b10]"
                }`}
            >
              Home
            </a>
            <a
              href="/shop"
              onClick={(e) => handleNav(e, "shop")}
              className={`font-nunito text-[14px] 2xl:text-[15px] transition-colors py-2 whitespace-nowrap cursor-pointer ${activePage === "shop"
                ? "font-bold text-[#700b10] border-b-2 border-[#700b10]"
                : "font-medium text-stone-700 hover:text-[#700b10]"
                }`}
            >
              Shop
            </a>
            <a
              href="/collections"
              onClick={(e) => handleNav(e, "collections")}
              className={`font-nunito text-[14px] 2xl:text-[15px] transition-colors py-2 whitespace-nowrap cursor-pointer ${activePage === "collections"
                ? "font-bold text-[#700b10] border-b-2 border-[#700b10]"
                : "font-medium text-stone-700 hover:text-[#700b10]"
                }`}
            >
              Our Collections
            </a>
          </nav>

          {/* Central Authentic Floating Logo from store.nilkanthdham.in */}
          <a
            href="/"
            onClick={(e) => handleNav(e, "home")}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center z-50 group cursor-pointer"
          >
            {/* Transparent Circular Container with delicate golden halo */}
            <div className="relative w-28 h-28 sm:w-28 sm:h-28 lg:w-32 lg:h-32 flex items-center justify-center p-1 sm:p-2 transform group-hover:scale-105 transition-transform duration-300">
              <img
                src={LOGO_URL}
                alt="Shri Nilkanth Store Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </a>

          {/* Desktop Right Navigation + Quick Action Buttons */}
          <div className="flex flex-1 items-center gap-2 sm:gap-3 lg:gap-5 justify-end">
            <nav className="hidden xl:flex items-center gap-5 2xl:gap-8">
              {/* <a
                href="https://megaship.megascale.co.in/track-orders"
                onClick={(e) => handleNav(e, "about")}
                className={`font-nunito text-[14px] 2xl:text-[15px] transition-colors py-2 whitespace-nowrap cursor-pointer ${activePage === "about"
                  ? "font-bold text-[#700b10] border-b-2 border-[#700b10]"
                  : "font-medium text-stone-700 hover:text-[#700b10]"
                  }`}
              >
                Track Order
              </a> */}
              <a
                href="/about"
                onClick={(e) => handleNav(e, "about")}
                className={`font-nunito text-[14px] 2xl:text-[15px] transition-colors py-2 whitespace-nowrap cursor-pointer ${activePage === "about"
                  ? "font-bold text-[#700b10] border-b-2 border-[#700b10]"
                  : "font-medium text-stone-700 hover:text-[#700b10]"
                  }`}
              >
                About Us
              </a>
              <a
                href="/blogs"
                onClick={(e) => handleNav(e, "blogs")}
                className={`font-nunito text-[14px] 2xl:text-[15px] transition-colors py-2 whitespace-nowrap cursor-pointer ${activePage === "blogs" || activePage === "blog-post"
                  ? "font-bold text-[#700b10] border-b-2 border-[#700b10]"
                  : "font-medium text-stone-700 hover:text-[#700b10]"
                  }`}
              >
                Blogs
              </a>
              <a
                href="/contact"
                onClick={(e) => handleNav(e, "contact")}
                className={`font-nunito text-[14px] 2xl:text-[15px] transition-colors py-2 whitespace-nowrap cursor-pointer ${activePage === "contact"
                  ? "font-bold text-[#700b10] border-b-2 border-[#700b10]"
                  : "font-medium text-stone-700 hover:text-[#700b10]"
                  }`}
              >
                Contact Us
              </a>
            </nav>

            <div className="flex items-center gap-1 sm:gap-2">
              <button
                type="button"
                onClick={() => onOpenSearch ? onOpenSearch() : onNavigate?.("shop")}
                className="w-8 h-8 sm:w-9 sm:h-9 bg-white shadow-xs border border-stone-200/80 rounded-full hover:bg-stone-50 transition-all hover:scale-105 text-[#700b10] cursor-pointer flex items-center justify-center flex-shrink-0"
                aria-label="Search"
                title="Search products, blogs & collections"
              >
                <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate?.("wishlist")}
                className="relative w-8 h-8 sm:w-9 sm:h-9 bg-white shadow-xs border border-stone-200/80 rounded-full hover:bg-stone-50 transition-all hover:scale-105 text-[#700b10] cursor-pointer flex items-center justify-center flex-shrink-0"
                aria-label="Wishlist"
                title={`Wishlist (${wishlistCount})`}
              >
                <Heart className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${wishlistCount > 0 ? "fill-[#700b10]" : ""}`} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 bg-[#700b10] text-white text-[9.5px] font-extrabold font-nunito rounded-full flex items-center justify-center border-1.5 border-white shadow-xs leading-none pointer-events-none">
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={openCart}
                className="relative hidden sm:flex w-8 h-8 sm:w-9 sm:h-9 bg-white shadow-xs border border-stone-200/80 rounded-full hover:bg-stone-50 transition-all hover:scale-105 text-[#700b10] cursor-pointer items-center justify-center flex-shrink-0"
                aria-label="Shopping Cart"
                title={`Shopping Cart (${cartCount})`}
              >
                <ShoppingCart className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 bg-[#700b10] text-white text-[9.5px] font-extrabold font-nunito rounded-full flex items-center justify-center border-1.5 border-white shadow-xs leading-none pointer-events-none">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (currentUser) {
                    onNavigate?.("profile");
                  } else {
                    onOpenAuth?.();
                  }
                }}
                className={`hidden md:flex p-1.5 sm:p-2 rounded-full border transition-all hover:scale-105 cursor-pointer items-center gap-1.5 ${currentUser
                  ? "bg-[#700b10] text-white border-[#700b10] px-2.5"
                  : "bg-white text-[#700b10] border-stone-200/80 hover:bg-stone-50"
                  }`}
                aria-label="User Account"
                title={currentUser ? `Signed in as ${currentUser.phone || currentUser.first_name || 'Customer'}` : "Sign In with Phone"}
              >
                <User className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                {currentUser && (
                  <span className="text-xs font-bold font-nunito max-w-[80px] truncate hidden lg:inline">
                    {currentUser.first_name || (currentUser.phone ? `+91 ${String(currentUser.phone).slice(-4)}` : "Account")}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile & Tablet Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-amber-100/60 bg-white/95 backdrop-blur-md rounded-b-[2rem] px-6 py-4 flex flex-col gap-2 text-center shadow-lg">
            {/* Quick Sign In / Profile button in mobile menu */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (currentUser) {
                  onNavigate?.("profile");
                } else {
                  onOpenAuth?.();
                }
              }}
              className="flex items-center justify-between w-full px-4 py-2.5 bg-amber-50/70 hover:bg-amber-100 text-[#700b10] rounded-xl text-sm font-bold transition-all mb-1 border border-amber-200/60 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>
                  {currentUser
                    ? `Account: ${currentUser.first_name || currentUser.phone || 'My Profile'}`
                    : "Sign In with WhatsApp"}
                </span>
              </div>
              <span className="text-[11px] bg-[#700b10] text-white px-2 py-0.5 rounded font-bold">
                {currentUser ? "View Profile" : "Login"}
              </span>
            </button>
            {/* Quick Search bar trigger in mobile menu */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSearch?.();
              }}
              className="flex items-center justify-between w-full px-4 py-2.5 bg-stone-100/80 hover:bg-stone-100 text-stone-600 rounded-xl text-sm font-semibold transition-all mb-1 border border-stone-200/80"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-[#700b10]" />
                <span>Search all items...</span>
              </div>
              <span className="text-[11px] bg-white px-2 py-0.5 rounded shadow-2xs text-[#700b10] font-bold">
                Search
              </span>
            </button>

            <a
              href="/"
              onClick={(e) => handleNav(e, "home")}
              className={`font-medium py-2 rounded-lg cursor-pointer ${activePage === "home"
                ? "bg-[#700b10] text-white"
                : "text-[#700b10] hover:bg-stone-50"
                }`}
            >
              Home
            </a>
            <a
              href="/shop"
              onClick={(e) => handleNav(e, "shop")}
              className={`font-medium py-2 rounded-lg cursor-pointer ${activePage === "shop"
                ? "bg-[#700b10] text-white"
                : "text-[#700b10] hover:bg-stone-50"
                }`}
            >
              Shop
            </a>
            <a
              href="/collections"
              onClick={(e) => handleNav(e, "collections")}
              className={`font-medium py-2 rounded-lg cursor-pointer ${activePage === "collections"
                ? "bg-[#700b10] text-white"
                : "text-[#700b10] hover:bg-stone-50"
                }`}
            >
              Our Collections
            </a>
            <a
              href="/about"
              onClick={(e) => handleNav(e, "about")}
              className={`font-medium py-2 rounded-lg cursor-pointer ${activePage === "about"
                ? "bg-[#700b10] text-white"
                : "text-[#700b10] hover:bg-stone-50"
                }`}
            >
              About Us
            </a>
            <a
              href="/blogs"
              onClick={(e) => handleNav(e, "blogs")}
              className={`font-medium py-2 rounded-lg cursor-pointer ${activePage === "blogs" || activePage === "blog-post"
                ? "bg-[#700b10] text-white"
                : "text-[#700b10] hover:bg-stone-50"
                }`}
            >
              Blogs &amp; News
            </a>
            <a
              href="/contact"
              onClick={(e) => handleNav(e, "contact")}
              className={`font-medium py-2 rounded-lg cursor-pointer ${activePage === "contact"
                ? "bg-[#700b10] text-white"
                : "text-[#700b10] hover:bg-stone-50"
                }`}
            >
              Contact Us
            </a>
          </div>
        )}
      </header>
    </div>
  );
}


// import React, { useState } from "react";
// import { Search, Heart, ShoppingCart, User, Menu, X } from "lucide-react";
// import { LOGO_URL } from "../data/storeData";
// import { useWishlist } from "../context/WishlistContext";
// import { useCart } from "../context/CartContext";

// export default function Header({
//   activePage = "home",
//   onNavigate,
//   onOpenSearch,
//   onOpenAuth,
//   currentUser
// }) {
//   const { wishlistCount, openDrawer } = useWishlist();
//   const { cartCount, openCart } = useCart();
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   const handleNav = (e, page) => {
//     e.preventDefault();
//     if (onNavigate) {
//       onNavigate(page);
//     }
//     setMobileMenuOpen(false);
//   };

//   return (
//     <div className="sticky top-[33px] z-40 w-full px-2 sm:px-4 lg:px-6 pb-2 transition-all duration-300">
//       <header className="max-w-[90rem] mx-auto bg-white/95 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-[4rem] border border-amber-100/60 transition-all duration-300 relative z-50">
//         <div className="px-4 sm:px-6 lg:px-12 h-16 lg:h-14 flex items-center justify-between relative text-[#700b10] bg-white rounded-[4rem]">
//           {/* Mobile & Tablet Menu Button (shown on md and below, hidden on xl) */}
//           <div className="xl:hidden flex items-center justify-start z-50">
//             <button
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               className="p-2 -ml-2 rounded-full hover:bg-stone-100 transition-colors text-[#700b10] cursor-pointer"
//               aria-label="Toggle Menu"
//             >
//               {mobileMenuOpen ? (
//                 <X className="w-6 h-6" />
//               ) : (
//                 <Menu className="w-6 h-6" />
//               )}
//             </button>
//           </div>

//           {/* Desktop Left Navigation Links (shown only on xl and above) */}
//           <nav className="hidden xl:flex flex-1 items-center gap-5 2xl:gap-8 justify-start">
//             <a
//               href="/"
//               onClick={(e) => handleNav(e, "home")}
//               className={`font-nunito text-[14px] 2xl:text-[15px] transition-colors py-2 whitespace-nowrap cursor-pointer ${activePage === "home"
//                 ? "font-bold text-[#700b10] border-b-2 border-[#700b10]"
//                 : "font-medium text-stone-700 hover:text-[#700b10]"
//                 }`}
//             >
//               Home
//             </a>
//             <a
//               href="/shop"
//               onClick={(e) => handleNav(e, "shop")}
//               className={`font-nunito text-[14px] 2xl:text-[15px] transition-colors py-2 whitespace-nowrap cursor-pointer ${activePage === "shop"
//                 ? "font-bold text-[#700b10] border-b-2 border-[#700b10]"
//                 : "font-medium text-stone-700 hover:text-[#700b10]"
//                 }`}
//             >
//               Shop
//             </a>
//             <a
//               href="/collections"
//               onClick={(e) => handleNav(e, "collections")}
//               className={`font-nunito text-[14px] 2xl:text-[15px] transition-colors py-2 whitespace-nowrap cursor-pointer ${activePage === "collections"
//                 ? "font-bold text-[#700b10] border-b-2 border-[#700b10]"
//                 : "font-medium text-stone-700 hover:text-[#700b10]"
//                 }`}
//             >
//               Our Collections
//             </a>
//           </nav>

//           {/* Central Authentic Floating Logo from store.nilkanthdham.in */}
//           <a
//             href="/"
//             onClick={(e) => handleNav(e, "home")}
//             className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center z-50 group cursor-pointer"
//           >
//             {/* Transparent Circular Container with delicate golden halo */}
//             <div className="relative w-28 h-28 sm:w-28 sm:h-28 lg:w-32 lg:h-32 flex items-center justify-center p-1 sm:p-2 transform group-hover:scale-105 transition-transform duration-300">
//               <img
//                 src={LOGO_URL}
//                 alt="Shri Nilkanth Store Logo"
//                 className="w-full h-full object-contain"
//               />
//             </div>
//           </a>

//           {/* Desktop Right Navigation + Quick Action Buttons */}
//           <div className="flex flex-1 items-center gap-2 sm:gap-3 lg:gap-5 justify-end">
//             <nav className="hidden xl:flex items-center gap-5 2xl:gap-8">
//               <a
//                 href="/about"
//                 onClick={(e) => handleNav(e, "about")}
//                 className={`font-nunito text-[14px] 2xl:text-[15px] transition-colors py-2 whitespace-nowrap cursor-pointer ${activePage === "about"
//                   ? "font-bold text-[#700b10] border-b-2 border-[#700b10]"
//                   : "font-medium text-stone-700 hover:text-[#700b10]"
//                   }`}
//               >
//                 About Us
//               </a>
//               <a
//                 href="/blogs"
//                 onClick={(e) => handleNav(e, "blogs")}
//                 className={`font-nunito text-[14px] 2xl:text-[15px] transition-colors py-2 whitespace-nowrap cursor-pointer ${activePage === "blogs" || activePage === "blog-post"
//                   ? "font-bold text-[#700b10] border-b-2 border-[#700b10]"
//                   : "font-medium text-stone-700 hover:text-[#700b10]"
//                   }`}
//               >
//                 Blogs
//               </a>
//               <a
//                 href="/contact"
//                 onClick={(e) => handleNav(e, "contact")}
//                 className={`font-nunito text-[14px] 2xl:text-[15px] transition-colors py-2 whitespace-nowrap cursor-pointer ${activePage === "contact"
//                   ? "font-bold text-[#700b10] border-b-2 border-[#700b10]"
//                   : "font-medium text-stone-700 hover:text-[#700b10]"
//                   }`}
//               >
//                 Contact Us
//               </a>
//             </nav>

//             <div className="flex items-center gap-1 sm:gap-2">
//               <button
//                 type="button"
//                 onClick={() => onOpenSearch ? onOpenSearch() : onNavigate?.("shop")}
//                 className="w-8 h-8 sm:w-9 sm:h-9 bg-white shadow-xs border border-stone-200/80 rounded-full hover:bg-stone-50 transition-all hover:scale-105 text-[#700b10] cursor-pointer flex items-center justify-center flex-shrink-0"
//                 aria-label="Search"
//                 title="Search products, blogs & collections"
//               >
//                 <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
//               </button>
//               <button
//                 type="button"
//                 onClick={() => onNavigate?.("wishlist")}
//                 className="relative w-8 h-8 sm:w-9 sm:h-9 bg-white shadow-xs border border-stone-200/80 rounded-full hover:bg-stone-50 transition-all hover:scale-105 text-[#700b10] cursor-pointer flex items-center justify-center flex-shrink-0"
//                 aria-label="Wishlist"
//                 title={`Wishlist (${wishlistCount})`}
//               >
//                 <Heart className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${wishlistCount > 0 ? "fill-[#700b10]" : ""}`} />
//                 {wishlistCount > 0 && (
//                   <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 bg-[#700b10] text-white text-[9.5px] font-extrabold font-nunito rounded-full flex items-center justify-center border-1.5 border-white shadow-xs leading-none pointer-events-none">
//                     {wishlistCount > 99 ? "99+" : wishlistCount}
//                   </span>
//                 )}
//               </button>
//               <button
//                 type="button"
//                 onClick={openCart}
//                 className="relative hidden sm:flex w-8 h-8 sm:w-9 sm:h-9 bg-white shadow-xs border border-stone-200/80 rounded-full hover:bg-stone-50 transition-all hover:scale-105 text-[#700b10] cursor-pointer items-center justify-center flex-shrink-0"
//                 aria-label="Shopping Cart"
//                 title={`Shopping Cart (${cartCount})`}
//               >
//                 <ShoppingCart className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
//                 {cartCount > 0 && (
//                   <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 bg-[#700b10] text-white text-[9.5px] font-extrabold font-nunito rounded-full flex items-center justify-center border-1.5 border-white shadow-xs leading-none pointer-events-none">
//                     {cartCount > 99 ? "99+" : cartCount}
//                   </span>
//                 )}
//               </button>
//               <button
//                 type="button"
//                 onClick={() => {
//                   if (currentUser) {
//                     onNavigate?.("profile");
//                   } else {
//                     onOpenAuth?.();
//                   }
//                 }}
//                 className={`hidden md:flex p-1.5 sm:p-2 rounded-full border transition-all hover:scale-105 cursor-pointer items-center gap-1.5 ${currentUser
//                   ? "bg-[#700b10] text-white border-[#700b10] px-2.5"
//                   : "bg-white text-[#700b10] border-stone-200/80 hover:bg-stone-50"
//                   }`}
//                 aria-label="User Account"
//                 title={currentUser ? `Signed in as ${currentUser.phone || currentUser.first_name || 'Customer'}` : "Sign In with Phone"}
//               >
//                 <User className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
//                 {currentUser && (
//                   <span className="text-xs font-bold font-nunito max-w-[80px] truncate hidden lg:inline">
//                     {currentUser.first_name || (currentUser.phone ? `+91 ${String(currentUser.phone).slice(-4)}` : "Account")}
//                   </span>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Mobile & Tablet Dropdown Menu */}
//         {mobileMenuOpen && (
//           <div className="xl:hidden border-t border-amber-100/60 bg-white/95 backdrop-blur-md rounded-b-[2rem] px-6 py-4 flex flex-col gap-2 text-center shadow-lg">
//             {/* Quick Sign In / Profile button in mobile menu */}
//             <button
//               type="button"
//               onClick={() => {
//                 setMobileMenuOpen(false);
//                 if (currentUser) {
//                   onNavigate?.("profile");
//                 } else {
//                   onOpenAuth?.();
//                 }
//               }}
//               className="flex items-center justify-between w-full px-4 py-2.5 bg-amber-50/70 hover:bg-amber-100 text-[#700b10] rounded-xl text-sm font-bold transition-all mb-1 border border-amber-200/60 cursor-pointer"
//             >
//               <div className="flex items-center gap-2">
//                 <User className="w-4 h-4" />
//                 <span>
//                   {currentUser
//                     ? `Account: ${currentUser.first_name || currentUser.phone || 'My Profile'}`
//                     : "Sign In with WhatsApp"}
//                 </span>
//               </div>
//               <span className="text-[11px] bg-[#700b10] text-white px-2 py-0.5 rounded font-bold">
//                 {currentUser ? "View Profile" : "Login"}
//               </span>
//             </button>
//             {/* Quick Search bar trigger in mobile menu */}
//             <button
//               type="button"
//               onClick={() => {
//                 setMobileMenuOpen(false);
//                 onOpenSearch?.();
//               }}
//               className="flex items-center justify-between w-full px-4 py-2.5 bg-stone-100/80 hover:bg-stone-100 text-stone-600 rounded-xl text-sm font-semibold transition-all mb-1 border border-stone-200/80"
//             >
//               <div className="flex items-center gap-2">
//                 <Search className="w-4 h-4 text-[#700b10]" />
//                 <span>Search all items...</span>
//               </div>
//               <span className="text-[11px] bg-white px-2 py-0.5 rounded shadow-2xs text-[#700b10] font-bold">
//                 Search
//               </span>
//             </button>

//             <a
//               href="/"
//               onClick={(e) => handleNav(e, "home")}
//               className={`font-medium py-2 rounded-lg cursor-pointer ${activePage === "home"
//                 ? "bg-[#700b10] text-white"
//                 : "text-[#700b10] hover:bg-stone-50"
//                 }`}
//             >
//               Home
//             </a>
//             <a
//               href="/shop"
//               onClick={(e) => handleNav(e, "shop")}
//               className={`font-medium py-2 rounded-lg cursor-pointer ${activePage === "shop"
//                 ? "bg-[#700b10] text-white"
//                 : "text-[#700b10] hover:bg-stone-50"
//                 }`}
//             >
//               Shop
//             </a>
//             <a
//               href="/collections"
//               onClick={(e) => handleNav(e, "collections")}
//               className={`font-medium py-2 rounded-lg cursor-pointer ${activePage === "collections"
//                 ? "bg-[#700b10] text-white"
//                 : "text-[#700b10] hover:bg-stone-50"
//                 }`}
//             >
//               Our Collections
//             </a>
//             <a
//               href="/about"
//               onClick={(e) => handleNav(e, "about")}
//               className={`font-medium py-2 rounded-lg cursor-pointer ${activePage === "about"
//                 ? "bg-[#700b10] text-white"
//                 : "text-[#700b10] hover:bg-stone-50"
//                 }`}
//             >
//               About Us
//             </a>
//             <a
//               href="/blogs"
//               onClick={(e) => handleNav(e, "blogs")}
//               className={`font-medium py-2 rounded-lg cursor-pointer ${activePage === "blogs" || activePage === "blog-post"
//                 ? "bg-[#700b10] text-white"
//                 : "text-[#700b10] hover:bg-stone-50"
//                 }`}
//             >
//               Blogs &amp; News
//             </a>
//             <a
//               href="/contact"
//               onClick={(e) => handleNav(e, "contact")}
//               className={`font-medium py-2 rounded-lg cursor-pointer ${activePage === "contact"
//                 ? "bg-[#700b10] text-white"
//                 : "text-[#700b10] hover:bg-stone-50"
//                 }`}
//             >
//               Contact Us
//             </a>
//           </div>
//         )}
//       </header>
//     </div>
//   );
// }
