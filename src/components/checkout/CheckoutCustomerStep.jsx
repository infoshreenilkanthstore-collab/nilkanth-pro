import React from "react";
import { User, Mail, Phone, Lock, CheckCircle2, AlertCircle } from "lucide-react";

export default function CheckoutCustomerStep({
  customer,
  onCustomerChange,
  currentUser,
  savedAddresses = [],
  selectedAddressId,
  onSelectSavedAddress,
  onOpenAuthModal,
  loading = false,
  isOneStep = true,
  errors = {},
  touched = {},
  onBlurField,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    let sanitizedValue = value;

    if (name === "phone") {
      // Keep only numbers up to 10 digits
      sanitizedValue = value.replace(/\D/g, "").slice(0, 10);
    }

    onCustomerChange({
      ...customer,
      [name]: sanitizedValue,
    });
  };

  const handleBlur = (fieldName) => {
    if (onBlurField) onBlurField(fieldName);
  };

  const isFirstNameInvalid = touched.firstName && errors.firstName;
  const isLastNameInvalid = touched.lastName && errors.lastName;
  const isEmailInvalid = touched.email && errors.email;
  const isPhoneInvalid = touched.phone && errors.phone;

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-7 shadow-xs">
      <div className="flex items-start sm:items-center justify-between gap-3 pb-4 border-b border-stone-100 mb-6">
        <div className="flex items-start sm:items-center gap-2.5 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-full bg-amber-50 text-[#700b10] border border-amber-200 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 sm:mt-0">
            1
          </div>
          <div className="min-w-0">
            <h2 className="font-serif text-base sm:text-lg font-bold text-stone-900 leading-tight">
              Customer Contact &amp; Identity
            </h2>
            <p className="text-[11px] sm:text-xs text-stone-500 font-sans mt-0.5 leading-snug">
              Provide your details for order confirmation receipts &amp; dispatch tracking.
            </p>
          </div>
        </div>

        {!currentUser && (
          <button
            type="button"
            onClick={onOpenAuthModal}
            className="shrink-0 whitespace-nowrap text-xs font-bold text-[#700b10] hover:text-[#54060b] bg-amber-50/80 hover:bg-amber-100 border border-amber-200/80 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
          >
            <Lock className="w-3.5 h-3.5 text-[#700b10] shrink-0" />
            <span>Sign In</span>
          </button>
        )}
      </div>

      {currentUser && (
        <div className="mb-6 p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#700b10] text-white flex items-center justify-center text-xs font-bold">
              {(currentUser.first_name || currentUser.name || "U")[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-xs font-bold text-stone-900">
                Logged in as {currentUser.first_name} {currentUser.last_name || ""}
              </p>
              <p className="text-[11px] text-stone-500">{currentUser.email || currentUser.phone}</p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
            Verified Member
          </span>
        </div>
      )}

      {/* Saved Addresses for Logged-in Customer */}
      {currentUser && savedAddresses && savedAddresses.length > 0 && (
        <div className="mb-6">
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2.5">
            Select Saved Shipping Address
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {savedAddresses.map((addr) => {
              const isSelected = selectedAddressId === addr.id;
              return (
                <div
                  key={addr.id}
                  onClick={() => onSelectSavedAddress && onSelectSavedAddress(addr)}
                  className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? "border-[#700b10] bg-amber-50/40 ring-1 ring-[#700b10]"
                      : "border-stone-200 hover:border-stone-300 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-stone-900">
                      {addr.first_name} {addr.last_name}
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-[#700b10] shrink-0" />}
                  </div>
                  <p className="text-stone-600 mt-1 leading-snug truncate">
                    {addr.address_line1 || addr.address1}
                  </p>
                  <p className="text-stone-500 text-[11px]">
                    {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                  <p className="text-stone-400 text-[11px] mt-0.5">{addr.phone}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Input Fields with Inline Validation */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isFirstNameInvalid ? "text-rose-400" : "text-stone-400"}`} />
              <input
                type="text"
                id="checkout-firstName"
                name="firstName"
                value={customer.firstName || ""}
                onChange={handleChange}
                onBlur={() => handleBlur("firstName")}
                placeholder="e.g. Shantanu"
                required
                className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-xs sm:text-sm text-stone-900 transition-all ${
                  isFirstNameInvalid
                    ? "bg-rose-50/30 border border-rose-400 focus:bg-white focus:outline-hidden focus:border-rose-600 focus:ring-1 focus:ring-rose-600"
                    : "bg-stone-50/50 border border-stone-300 focus:bg-white focus:outline-hidden focus:border-[#700b10] focus:ring-1 focus:ring-[#700b10]"
                }`}
              />
            </div>
            {isFirstNameInvalid && (
              <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1 animate-fadeIn">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.firstName}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="checkout-lastName"
              name="lastName"
              value={customer.lastName || ""}
              onChange={handleChange}
              onBlur={() => handleBlur("lastName")}
              placeholder="e.g. Kolhatkar"
              required
              className={`w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm text-stone-900 transition-all ${
                isLastNameInvalid
                  ? "bg-rose-50/30 border border-rose-400 focus:bg-white focus:outline-hidden focus:border-rose-600 focus:ring-1 focus:ring-rose-600"
                  : "bg-stone-50/50 border border-stone-300 focus:bg-white focus:outline-hidden focus:border-[#700b10] focus:ring-1 focus:ring-[#700b10]"
              }`}
            />
            {isLastNameInvalid && (
              <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1 animate-fadeIn">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.lastName}</span>
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isEmailInvalid ? "text-rose-400" : "text-stone-400"}`} />
              <input
                type="email"
                id="checkout-email"
                name="email"
                value={customer.email || ""}
                onChange={handleChange}
                onBlur={() => handleBlur("email")}
                placeholder="customer@example.com"
                required
                className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-xs sm:text-sm text-stone-900 transition-all ${
                  isEmailInvalid
                    ? "bg-rose-50/30 border border-rose-400 focus:bg-white focus:outline-hidden focus:border-rose-600 focus:ring-1 focus:ring-rose-600"
                    : "bg-stone-50/50 border border-stone-300 focus:bg-white focus:outline-hidden focus:border-[#700b10] focus:ring-1 focus:ring-[#700b10]"
                }`}
              />
            </div>
            {isEmailInvalid ? (
              <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1 animate-fadeIn">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.email}</span>
              </p>
            ) : (
              <span className="text-[10px] text-stone-400 mt-1 block">Invoices &amp; order updates sent here</span>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Mobile Phone <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isPhoneInvalid ? "text-rose-400" : "text-stone-400"}`} />
              <input
                type="tel"
                id="checkout-phone"
                name="phone"
                maxLength={10}
                value={customer.phone || ""}
                onChange={handleChange}
                onBlur={() => handleBlur("phone")}
                placeholder="98765 43210"
                required
                className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-xs sm:text-sm text-stone-900 tracking-wider transition-all ${
                  isPhoneInvalid
                    ? "bg-rose-50/30 border border-rose-400 focus:bg-white focus:outline-hidden focus:border-rose-600 focus:ring-1 focus:ring-rose-600"
                    : "bg-stone-50/50 border border-stone-300 focus:bg-white focus:outline-hidden focus:border-[#700b10] focus:ring-1 focus:ring-[#700b10]"
                }`}
              />
            </div>
            {isPhoneInvalid ? (
              <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1 animate-fadeIn">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.phone}</span>
              </p>
            ) : (
              <span className="text-[10px] text-stone-400 mt-1 block">10-digit number for delivery agent call &amp; WhatsApp updates</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
