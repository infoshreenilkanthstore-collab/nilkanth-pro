//src\app\layout.js


import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartSidebarProvider } from "../context/CartSidebarContext";
import { BreadcrumbProvider } from "../context/BreadcrumbContext";
import { WishlistProvider } from "../context/WishlistContext";
import LayoutShell from "../components/LayoutShell";
import Script from "next/script";
import MarketingScriptInjector from "../components/MarketingScriptInjector";
import AnalyticsTracker from "../components/AnalyticsTracker";
import { CHECKOUT_SDK_URL } from "@/lib/checkout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://store.nilkanthdham.in";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "./",
  },
  title: {
    default: "Nilkanth Store",
    template: "%s | Nilkanth Store",
  },
  description: "Discover traditional religious and spiritual products including Pooja Saman, Vastu items, Yantras, Murtis, Pital & Copper products, Perfume, Attar, Agarbatti, Dhoop, and more.",
  openGraph: {
    siteName: "Nilkanth Store",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-0VTQFMW2S2"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-0VTQFMW2S2');
            `,
          }}
        />

        {/* Meta Pixel Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1455730108844531');
              fbq('track', 'PageView');

              // Global ViewContent helper
              window.trackFbViewContent = function(productId, productName, productPrice) {
                if (window.fbq) {
                  fbq('track', 'ViewContent', {
                    content_ids: [String(productId)],
                    content_name: String(productName),
                    content_type: 'product',
                    value: Number(productPrice) || 0,
                    currency: 'INR'
                  });
                }
              };
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1455730108844531&ev=PageView&noscript=1"
            alt="facebook pixel"
          />
        </noscript>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased pb-16 md:pb-0`}
      >
        <Script src={CHECKOUT_SDK_URL} strategy="afterInteractive" />
        <AnalyticsTracker />
        <MarketingScriptInjector />
        <WishlistProvider>
          <CartSidebarProvider>
            <BreadcrumbProvider>
              <LayoutShell>{children}</LayoutShell>
            </BreadcrumbProvider>
          </CartSidebarProvider>
        </WishlistProvider>
      </body>
    </html>
  );
}