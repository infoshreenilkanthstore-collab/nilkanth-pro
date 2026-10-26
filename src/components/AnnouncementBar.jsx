import React from "react";

export default function AnnouncementBar() {
  return (
    <div>
      <div className="bg-[#700b10] text-white py-1.5 overflow-hidden flex items-center shadow-md select-none sticky top-0 z-50 fixed">
        <div className="animate-marquee flex items-center">
          {[...Array(10)].map((_, i) => (
            <span
              key={i}
              className="font-nunito mx-12 sm:mx-14 text-[11px] sm:text-xs md:text-[13px] font-medium tracking-widest whitespace-nowrap"
            >
              Free Shipping On Orders Above ₹999 🚚✨
            </span>
          ))}
        </div>
      </div>

      <div className="sticky top-0 z-50 w-full bg-[#700b10] text-white shadow-md select-none">
        <div className="mx-auto flex w-full flex-wrap items-center justify-center gap-x-3 gap-y-2 px-3 py-2 sm:gap-x-4 sm:px-5">

          {/* Promotional Text */}
          <p className="text-center text-xs font-nunito tracking-tight sm:text-sm">
            Install Shri Nilkanth Store App &amp; Get{" "}
            <strong className="font-extrabold text-white">
              2% Extra Discount
            </strong>{" "}
            on App!
          </p>

          {/* Store Links */}
          <div className="flex shrink-0 items-center justify-center gap-2 sm:gap-3">

            <span className="hidden text-xs font-medium text-white/90 sm:inline">
              Available on:
            </span>

            {/* Google Play Store */}
            <a
              href="https://play.google.com/store/apps/details?id=com.megascale.pujanam&pcampaignid=web_share"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download Shri Nilkanth Store on Google Play"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-black px-3 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800 active:scale-95 sm:px-4"
            >
              <svg
                className="h-4 w-4 shrink-0"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="#34A853"
                  d="M3.6 1.8C3.2 2.2 3 2.8 3 3.4v17.2c0 .6.2 1.2.6 1.6l9.8-10z"
                />
                <path
                  fill="#4285F4"
                  d="m13.4 12.2-9.8 10c.4.4 1 .4 1.7.1l11.5-6.6z"
                />
                <path
                  fill="#FBBC04"
                  d="m16.8 15.7-3.4-3.5 3.4-3.5 4 2.3c1.1.6 1.1 1.7 0 2.4z"
                />
                <path
                  fill="#EA4335"
                  d="M3.6 1.8 13.4 12l3.4-3.3L5.3 2c-.7-.4-1.3-.3-1.7-.2"
                />
              </svg>
              <span>Play Store</span>
            </a>

            {/* Apple App Store */}
            <a
              href="YOUR_APPLE_APP_STORE_LINK"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download Shri Nilkanth Store on the App Store"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-black px-3 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800 active:scale-95 sm:px-4"
            >
              <svg
                className="h-4 w-4 shrink-0 fill-current"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M18.7 19.5c-.8 1.2-1.7 2.5-3 2.5-1.4 0-1.8-.8-3.3-.8s-2 .8-3.3.8c-1.3 0-2.3-1.3-3.1-2.5-2-3-3.5-8.5-1.7-11.6.9-1.5 2.4-2.5 4.1-2.5 1.3 0 2.5.9 3.3.9s2.3-1.1 3.8-.9c.7 0 2.5.3 3.7 2-.1.1-2.2 1.3-2.2 3.8 0 3 2.7 4 2.7 4.1-.1.1-.5 1.4-1.4 2.8M15.9 5c.7-.8 1.1-1.9 1-3-1 .1-2.2.7-2.9 1.5-.6.7-1.1 1.8-1 2.9 1.1.1 2.2-.6 2.9-1.4" />
              </svg>
              <span>App Store</span>
            </a>

          </div>
        </div>
      </div>

    </div>
  );
}
