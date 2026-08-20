"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import Breadcrumbs from "./Breadcrumbs";
import CartSidebar from "./CartSidebar";
import WishlistSidebar from "./WishlistSidebar";
import FloatingWidgets from "./FloatingWidgets";
import LoginPopup from "./LoginPopup";
import { useWishlist } from "../context/WishlistContext";
import { Toaster } from "react-hot-toast";

export default function LayoutShell({ children }) {
  const pathname = usePathname();
  const { isLoginOpen, closeLogin } = useWishlist();
  const isHome = pathname === "/";
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Toaster position="bottom-center" />
      <Header />
      <main className="pt-25">
        <div
          className={`max-w-[90rem] mx-auto ${isHome ? "px-2 py-0 bg-transparent" : "px-1 lg:px-12 py-1"
            }`}
        >
          <Breadcrumbs />
        </div>
        {children}
      </main>
      <Footer />
      <CartSidebar />
      <WishlistSidebar />
      <LoginPopup isOpen={isLoginOpen} onClose={closeLogin} />
      {/* <SalesNotification /> */}
      <FloatingWidgets />
    </>
  );
}

