import React, { useState } from 'react';
import { Phone, MessageCircle, Plus, Minus } from 'lucide-react';
import { LOGO_URL } from '../data/storeData';

export default function Footer({ onNavigate }) {
  // Mobile / tablet accordion dropdown states
  const [openSections, setOpenSections] = useState({
    explore: false,
    information: false,
    discover: false,
  });

  const toggleSection = (key) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <footer id="contact" className="w-full bg-[#700b10] text-white border-t border-[#851016]">
      {/* ── App Download Banner Strip (matches footer palette) ── */}
      <div className="w-full bg-[#faeed0] text-[#2c1d1a] border-b border-[#e5caa0] py-2.5 sm:py-3 px-4">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-center gap-2.5 sm:gap-4 md:gap-6 text-center">
          <p className="text-[13px] sm:text-[14px] md:text-[14.5px] font-nunito tracking-tight text-[#2d221e]">
            Install Shri Nilkanth Store App &amp; Get{' '}
            <strong className="text-[#700b10] font-extrabold font-nunito tracking-normal">2% Extra Discount</strong>{' '}
            on App!
          </p>

          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap justify-center">
            <span className="text-[12px] sm:text-[13px] font-nunito text-[#5a423a] font-medium">
              Available on:
            </span>

            {/* Google Play Store Badge */}
            <a
              href="https://play.google.com/store/apps/details?id=com.megascale.pujanam&pcampaignid=web_share"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download Shri Nilkanth Store on Google Play Store"
              className="inline-flex items-center gap-1.5 bg-black hover:bg-stone-900 text-white text-[11.5px] sm:text-[12px] font-semibold px-3 sm:px-3.5 py-1.5 rounded-full shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#fff" d="M3.609 1.814C3.226 2.225 3 2.781 3 3.385v17.23c0 .604.226 1.16.609 1.571l.081.077 9.68-9.68v-.226l-9.68-9.68-.081.077z" />
                <path fill="#fff" fillOpacity="0.85" d="M16.738 15.533l-3.368-3.367v-.226l3.368-3.367.076.044 3.992 2.27c1.14.648 1.14 1.706 0 2.354l-3.992 2.27-.076.022z" />
                <path fill="#fff" fillOpacity="0.75" d="M13.447 12.166L3.609 22.004c.376.399.98.448 1.64.073l11.564-6.578-3.366-3.333z" />
                <path fill="#fff" fillOpacity="0.95" d="M13.447 11.834l3.366-3.333L5.249 1.923c-.66-.375-1.264-.326-1.64.073l9.838 9.838z" />
              </svg>
              <span>Play Store</span>
            </a>

            {/* Apple App Store Badge */}
            <a
              href="https://www.apple.com/app-store/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download Shri Nilkanth Store on Apple App Store"
              className="inline-flex items-center gap-1.5 bg-black hover:bg-stone-900 text-white text-[11.5px] sm:text-[12px] font-semibold px-3 sm:px-3.5 py-1.5 rounded-full shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 fill-current flex-shrink-0" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.96c.64-.78 1.08-1.86.96-2.96-1 .04-2.16.67-2.84 1.46-.59.68-1.12 1.79-.98 2.87 1.12.09 2.22-.59 2.86-1.37z" />
              </svg>
              <span>App Store</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-14 pt-10 md:pt-14 pb-14 md:pb-10">

        {/* Main Columns: Grid with responsive column spans for mobile, tablet, laptop & desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-6 xl:gap-8 pb-8 lg:pb-10">

          {/* Column 1: Brand & Logo */}
          <div className="pb-5 lg:pb-0 lg:col-span-4 xl:col-span-3 lg:pr-2">
            <a href="/" className="inline-flex items-center gap-3.5 group">
              <div className="w-[50px] h-[50px] min-w-[50px] rounded-full overflow-hidden bg-white p-1 shadow-md flex items-center justify-center flex-shrink-0">
                <img
                  src={LOGO_URL}
                  alt="Shri Nilkanth Store Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="font-tenor text-[19px] sm:text-[20px] font-normal tracking-wide text-white leading-tight">
                  Shri Nilkanth Store
                </h3>
                <span className="text-[10px] sm:text-[10.5px] tracking-[0.22em] uppercase text-[#ebd99c] font-bold block mt-0.5">
                  STORE &amp; POOJA SAMAGRI
                </span>
              </div>
            </a>
            <p className="mt-4 text-[13.5px] sm:text-[14px] lg:text-[13.5px] leading-relaxed text-stone-200/90 font-nunito w-full lg:max-w-[290px]">
              Shri Nilkanth Store brings you authentic pooja samagri, pure attars, premium dhoop and agarbatti crafted with pure devotion, high quality, and tradition.
            </p>
          </div>

          {/* Column 2: EXPLORE MORE */}
          <div className="border-t border-white/15 lg:border-t-0 py-2 sm:py-2.5 lg:py-0 col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-2 xl:col-span-2">
            <button
              type="button"
              onClick={() => toggleSection('explore')}
              className="w-full flex items-center justify-between lg:cursor-default text-left py-1 lg:py-0 group"
            >
              <h4 className="text-[13.5px] sm:text-[14.5px] lg:text-[15px] font-bold uppercase tracking-wider text-white font-nunito group-hover:text-[#ebd99c] lg:group-hover:text-white transition-colors">
                EXPLORE MORE
              </h4>
              <span className="lg:hidden text-[#ebd99c] p-0.5 flex items-center justify-center">
                {openSections.explore ? <Minus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" /> : <Plus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />}
              </span>
            </button>
            <div className={`${openSections.explore ? 'block pt-2 sm:pt-2.5' : 'hidden'} lg:block lg:pt-3.5 transition-all duration-200`}>
              <ul className="space-y-2 sm:space-y-2.5 text-[13.5px] sm:text-[14px] lg:text-[14.5px] text-stone-200 font-nunito">
                <li>
                  <a
                    href="/collections/perfume"
                    onClick={(e) => { e.preventDefault(); onNavigate?.('collections', { collectionHandle: 'perfume' }); }}
                    className="hover:text-[#ebd99c] hover:translate-x-1 inline-block transition-all cursor-pointer"
                  >
                    Perfume
                  </a>
                </li>
                <li>
                  <a
                    href="/collections/dhoop"
                    onClick={(e) => { e.preventDefault(); onNavigate?.('collections', { collectionHandle: 'dhoop' }); }}
                    className="hover:text-[#ebd99c] hover:translate-x-1 inline-block transition-all cursor-pointer"
                  >
                    Dhoop
                  </a>
                </li>
                <li>
                  <a
                    href="/collections/attar"
                    onClick={(e) => { e.preventDefault(); onNavigate?.('collections', { collectionHandle: 'attar' }); }}
                    className="hover:text-[#ebd99c] hover:translate-x-1 inline-block transition-all cursor-pointer"
                  >
                    Attar
                  </a>
                </li>
                <li>
                  <a
                    href="/collections/air-freshner"
                    onClick={(e) => { e.preventDefault(); onNavigate?.('collections', { collectionHandle: 'air-freshner' }); }}
                    className="hover:text-[#ebd99c] hover:translate-x-1 inline-block transition-all cursor-pointer"
                  >
                    Air Freshner
                  </a>
                </li>
                <li>
                  <a
                    href="/collections/agarbatti"
                    onClick={(e) => { e.preventDefault(); onNavigate?.('collections', { collectionHandle: 'agarbatti' }); }}
                    className="hover:text-[#ebd99c] hover:translate-x-1 inline-block transition-all cursor-pointer"
                  >
                    Agarbatti
                  </a>
                </li>
                <li className="pt-1">
                  <button
                    type="button"
                    onClick={() => onNavigate?.('collections')}
                    className="text-[#ebd99c] font-bold hover:underline inline-flex items-center gap-1.5 text-[13.5px] sm:text-[14px] lg:text-[15px] cursor-pointer"
                  >
                    All Collections →
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 3: INFORMATION */}
          <div className="border-t border-white/15 lg:border-t-0 py-2 sm:py-2.5 lg:py-0 col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-2 xl:col-span-2">
            <button
              type="button"
              onClick={() => toggleSection('information')}
              className="w-full flex items-center justify-between lg:cursor-default text-left py-1 lg:py-0 group"
            >
              <h4 className="text-[13.5px] sm:text-[14.5px] lg:text-[15px] font-bold uppercase tracking-wider text-white font-nunito group-hover:text-[#ebd99c] lg:group-hover:text-white transition-colors">
                INFORMATION
              </h4>
              <span className="lg:hidden text-[#ebd99c] p-0.5 flex items-center justify-center">
                {openSections.information ? <Minus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" /> : <Plus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />}
              </span>
            </button>
            <div className={`${openSections.information ? 'block pt-2 sm:pt-2.5' : 'hidden'} lg:block lg:pt-3.5 transition-all duration-200`}>
              <ul className="space-y-2 sm:space-y-2.5 text-[13.5px] sm:text-[14px] text-stone-200 font-nunito">
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate?.('return-policy')}
                    className="hover:text-[#ebd99c] hover:translate-x-1 inline-block transition-all text-left cursor-pointer"
                  >
                    Order &amp; Return Policy
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate?.('return-policy')}
                    className="hover:text-[#ebd99c] hover:translate-x-1 inline-block transition-all text-left cursor-pointer"
                  >
                    Return &amp; Exchange Policy
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate?.('privacy-policy')}
                    className="hover:text-[#ebd99c] hover:translate-x-1 inline-block transition-all text-left cursor-pointer"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate?.('terms')}
                    className="hover:text-[#ebd99c] hover:translate-x-1 inline-block transition-all text-left cursor-pointer"
                  >
                    Terms &amp; Conditions
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate?.('shipping')}
                    className="hover:text-[#ebd99c] hover:translate-x-1 inline-block transition-all text-left cursor-pointer"
                  >
                    Shipping Policy
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate?.('faq')}
                    className="hover:text-[#ebd99c] hover:translate-x-1 inline-block transition-all text-left cursor-pointer"
                  >
                    FAQ&apos;s
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 4: DISCOVER */}
          <div className="border-t border-white/15 lg:border-t-0 py-2 sm:py-2.5 lg:py-0 col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-2 xl:col-span-2">
            <button
              type="button"
              onClick={() => toggleSection('discover')}
              className="w-full flex items-center justify-between lg:cursor-default text-left py-1 lg:py-0 group"
            >
              <h4 className="text-[13.5px] sm:text-[14.5px] lg:text-[15px] font-bold uppercase tracking-wider text-white font-nunito group-hover:text-[#ebd99c] lg:group-hover:text-white transition-colors">
                DISCOVER
              </h4>
              <span className="lg:hidden text-[#ebd99c] p-0.5 flex items-center justify-center">
                {openSections.discover ? <Minus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" /> : <Plus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />}
              </span>
            </button>
            <div className={`${openSections.discover ? 'block pt-2 sm:pt-2.5' : 'hidden'} lg:block lg:pt-3.5 transition-all duration-200`}>
              <ul className="space-y-2 sm:space-y-2.5 text-[13.5px] sm:text-[14px] text-stone-200 font-nunito">
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate?.('blogs')}
                    className="hover:text-[#ebd99c] hover:translate-x-1 inline-block transition-all text-left cursor-pointer"
                  >
                    Blogs &amp; News
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate?.('about')}
                    className="hover:text-[#ebd99c] hover:translate-x-1 inline-block transition-all text-left cursor-pointer"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate?.('search')}
                    className="hover:text-[#ebd99c] hover:translate-x-1 inline-block transition-all text-left cursor-pointer"
                  >
                    Search Store
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate?.('shop')}
                    className="hover:text-[#ebd99c] hover:translate-x-1 inline-block transition-all text-left cursor-pointer"
                  >
                    All Products
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate?.('contact')}
                    className="hover:text-[#ebd99c] hover:translate-x-1 inline-block transition-all text-left cursor-pointer"
                  >
                    Contact Us
                  </button>
                </li>
                <li><a href="#" className="hover:text-[#ebd99c] hover:translate-x-1 inline-block transition-all">My Profile</a></li>
              </ul>
            </div>
          </div>

          {/* Column 5: FOLLOW US, SUPPORT & PAYMENTS */}
          <div className="border-t border-white/15 lg:border-t-0 pt-5 sm:pt-6 lg:pt-0 col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-2 xl:col-span-3 space-y-5 lg:pl-2">
            {/* Follow Us Icons */}
            <div>
              <h4 className="text-[14px] sm:text-[15px] font-bold uppercase tracking-wider text-white font-nunito mb-3">
                FOLLOW US
              </h4>
              <div className="flex items-center gap-3">
                {/* Facebook */}
                <a
                  href="https://www.facebook.com/profile.php?id=61579659694888"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#831e24] hover:bg-[#ebd99c] text-white hover:text-[#700b10] flex items-center justify-center transition-all duration-200 shadow-xs hover:scale-105"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.667 5H18V0h-3.808C10.597 0 9 1.583 9 4.615V8z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/shrinilkanthstore//"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#831e24] hover:bg-[#ebd99c] text-white hover:text-[#700b10] flex items-center justify-center transition-all duration-200 shadow-xs hover:scale-105"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>

                {/* WhatsApp Community */}
                <a
                  href="https://api.whatsapp.com/send/?phone=919726778118&text=Hello%21+I+would+like+to+inquire+about+your+products.&type=phone_number&app_absent=0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#831e24] hover:bg-[#ebd99c] text-white hover:text-[#700b10] flex items-center justify-center transition-all duration-200 shadow-xs hover:scale-105"
                  aria-label="WhatsApp Community"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 0C5.397 0 .001 5.397.001 12.032c0 2.118.552 4.184 1.6 6l-1.7 6.208 6.35-1.666a12.002 12.002 0 0 0 5.78 1.488h.005c6.633 0 12.03-5.397 12.03-12.032C24.066 5.397 18.667 0 12.031 0zm0 22.062a9.99 9.99 0 0 1-5.093-1.393l-.365-.217-3.779.991 1.008-3.684-.237-.378a9.99 9.99 0 1 1 8.466 4.681zm5.474-7.48c-.3-.15-1.774-.875-2.049-.975-.275-.1-.475-.15-.675.15-.2.3-.775.975-.95 1.175-.175.2-.35.225-.65.075-.3-.15-1.267-.467-2.413-1.489-.893-.796-1.495-1.78-1.67-2.08-.175-.3-.019-.462.131-.611.135-.134.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.675-1.625-.925-2.225-.244-.585-.492-.505-.675-.515-.175-.008-.375-.01-.575-.01-.2 0-.525.075-.8.375s-1.05 1.025-1.05 2.5 1.075 2.895 1.225 3.095c.15.2 2.115 3.23 5.125 4.53.716.31 1.275.495 1.71.634.719.229 1.373.197 1.89.12.577-.087 1.774-.725 2.024-1.425.25-.7.25-1.3.175-1.425-.075-.125-.275-.2-.575-.35z" />
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="https://www.youtube.com/@ShreeNilkanthStore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#831e24] hover:bg-[#ebd99c] text-white hover:text-[#700b10] flex items-center justify-center transition-all duration-200 shadow-xs hover:scale-105"
                  aria-label="YouTube"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Support section */}
            <div className="space-y-3 pt-1">
              <h4 className="text-[15px] sm:text-[16px] font-bold uppercase tracking-wider text-white font-nunito">
                SUPPORT
              </h4>

              <div>
                <span className="text-[12px] text-stone-300 block font-nunito">Sales Support</span>
                <a
                  href="https://api.whatsapp.com/send/?phone=919726778118&text=Hello%21+I+would+like+to+inquire+about+your+products.&type=phone_number&app_absent=0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#ebd99c] hover:text-white font-bold font-nunito text-[16px] sm:text-[17px] transition-colors"
                  aria-label="WhatsApp Sales Support 9726778118"
                >
                  <svg className="w-4 h-4 fill-[#25D366] flex-shrink-0" viewBox="0 0 24 24">
                    <path d="M12.031 0C5.397 0 .001 5.397.001 12.032c0 2.118.552 4.184 1.6 6l-1.7 6.208 6.35-1.666a12.002 12.002 0 0 0 5.78 1.488h.005c6.633 0 12.03-5.397 12.03-12.032C24.066 5.397 18.667 0 12.031 0zm0 22.062a9.99 9.99 0 0 1-5.093-1.393l-.365-.217-3.779.991 1.008-3.684-.237-.378a9.99 9.99 0 1 1 8.466 4.681zm5.474-7.48c-.3-.15-1.774-.875-2.049-.975-.275-.1-.475-.15-.675.15-.2.3-.775.975-.95 1.175-.175.2-.35.225-.65.075-.3-.15-1.267-.467-2.413-1.489-.893-.796-1.495-1.78-1.67-2.08-.175-.3-.019-.462.131-.611.135-.134.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.675-1.625-.925-2.225-.244-.585-.492-.505-.675-.515-.175-.008-.375-.01-.575-.01-.2 0-.525.075-.8.375s-1.05 1.025-1.05 2.5 1.075 2.895 1.225 3.095c.15.2 2.115 3.23 5.125 4.53.716.31 1.275.495 1.71.634.719.229 1.373.197 1.89.12.577-.087 1.774-.725 2.024-1.425.25-.7.25-1.3.175-1.425-.075-.125-.275-.2-.575-.35z" />
                  </svg>
                  <span>9726778118</span>
                </a>
              </div>

              <div>
                <span className="text-[12px] text-stone-300 block font-nunito">After Sales Support</span>
                <a
                  href="tel:+919310501040"
                  className="inline-flex items-center gap-1.5 text-[#ebd99c] hover:text-white font-bold font-nunito text-[16px] sm:text-[17px] transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#ebd99c]" /> 9310501040
                </a>
              </div>

              <div>
                <span className="text-[12px] text-stone-300 block font-nunito">Complain &amp; Grievance</span>
                <a
                  href="tel:+919824878118"
                  className="inline-flex items-center gap-1.5 text-[#ebd99c] hover:text-white font-bold font-nunito text-[16px] sm:text-[17px] transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#ebd99c]" /> 9824878118
                </a>
              </div>
            </div>

            {/* Working Hours */}
            <div className="pt-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-300 block font-nunito">
                WORKING HOURS:
              </span>
              <p className="text-[12.5px] text-stone-200 font-nunito mt-0.5">
                10:00 AM - 7:00 PM (Monday - Saturday)
              </p>
            </div>

            {/* Secure Payment Badges */}
            <div className="pt-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-300 block font-nunito mb-2">
                SECURE PAYMENT
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-white text-[#1a1f71] text-[10px] font-black px-2 py-1 rounded shadow-sm">VISA</span>
                <span className="bg-white text-[#eb001b] text-[10px] font-black px-2 py-1 rounded shadow-sm">Mastercard</span>
                <span className="bg-white text-[#0f7c90] text-[10px] font-black px-2 py-1 rounded shadow-sm">UPI</span>
                <span className="bg-white text-[#005a9c] text-[10px] font-black px-2 py-1 rounded shadow-sm">RuPay</span>
                <span className="bg-white text-[#2557a7] text-[10px] font-black px-2 py-1 rounded shadow-sm">AMEX</span>
              </div>
            </div>

          </div>

        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-white/15 my-2" />

        {/* Subfooter */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px] font-nunito text-stone-300/90 text-center sm:text-left">
          <p>© 2026 , <strong className="text-white font-bold">Shri Nilkanth Store (Trade Name: ILAVIZ)</strong>. All rights reserved.</p>
          <div className="flex items-center gap-3.5">
            <button
              type="button"
              onClick={() => onNavigate?.('privacy-policy')}
              className="hover:text-[#ebd99c] transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span className="text-white/40">•</span>
            <button
              type="button"
              onClick={() => onNavigate?.('terms')}
              className="hover:text-[#ebd99c] transition-colors cursor-pointer"
            >
              Terms
            </button>
            <span className="text-white/40">•</span>
            <button
              type="button"
              onClick={() => onNavigate?.('shipping')}
              className="hover:text-[#ebd99c] transition-colors cursor-pointer"
            >
              Shipping
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
