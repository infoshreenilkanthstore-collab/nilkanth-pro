import React, { useState, useEffect } from "react";
import {
  MapPin, Truck, ChevronLeft, ChevronRight, Loader2,
  CheckCircle2, AlertCircle, Plus, Home,
} from "lucide-react";
import { fetchPincodeDetails } from "../../services/api";

const EMPTY_ADDRESS = {
  address1: "",
  address2: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
};

export default function CheckoutShippingStep({
  shippingAddress,
  onShippingAddressChange,
  shippingRates = [],
  selectedShippingRate,
  onSelectShippingRate,
  onBackStep,
  onNextStep,
  loading = false,
  isOneStep = true,
  // For logged-in customers
  currentUser = null,
  savedAddresses = [],
  selectedAddressId,
  onSelectSavedAddress,
  onSaveNewAddress,           // async fn(addressData) → { success, data, message }
  onAddressListUpdated,       // fn(newAddressList) to refresh parent savedAddresses
  errors = {},
  touched = {},
  onBlurField,
}) {
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeSuccess, setPincodeSuccess] = useState(false);
  const [pincodeError, setPincodeError] = useState("");

  // "new" means show the blank form; a saved addr id means use that address
  const [addressMode, setAddressMode] = useState(
    savedAddresses.length > 0 ? "saved" : "new"
  );
  const [savingNew, setSavingNew] = useState(false);
  const [saveNewError, setSaveNewError] = useState("");

  // When savedAddresses loads in (async), switch mode accordingly
  useEffect(() => {
    if (savedAddresses.length > 0 && addressMode === "new" && selectedAddressId) {
      setAddressMode("saved");
    }
  }, [savedAddresses.length]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let sanitizedValue = value;
    if (name === "pincode") {
      sanitizedValue = value.replace(/\D/g, "").slice(0, 6);
    }
    onShippingAddressChange({
      ...shippingAddress,
      [name]: sanitizedValue,
    });
  };

  const handleBlur = (fieldName) => {
    if (onBlurField) onBlurField(fieldName);
  };

  const isPincodeInvalid = touched.pincode && errors.pincode;
  const isAddress1Invalid = touched.address1 && errors.address1;
  const isCityInvalid = touched.city && errors.city;
  const isStateInvalid = touched.state && errors.state;

  const handleSelectSaved = (addr) => {
    setAddressMode("saved");
    setSaveNewError("");
    if (onSelectSavedAddress) onSelectSavedAddress(addr);
  };

  const handleUseNewAddress = () => {
    setAddressMode("new");
    setSaveNewError("");
    onShippingAddressChange({ ...EMPTY_ADDRESS });
  };

  // Auto-detect city & state when pincode reaches 6 digits
  useEffect(() => {
    const pin = String(shippingAddress.pincode || "").trim();
    if (pin.length === 6 && /^\d+$/.test(pin)) {
      let isSubscribed = true;
      setPincodeLoading(true);
      setPincodeError("");
      setPincodeSuccess(false);

      fetchPincodeDetails(pin)
        .then((res) => {
          if (!isSubscribed) return;
          if (res.success && res.data) {
            onShippingAddressChange({
              ...shippingAddress,
              pincode: pin,
              city: res.data.city || shippingAddress.city || "",
              state: res.data.state || shippingAddress.state || "",
              country: res.data.country || "India",
            });
            setPincodeSuccess(true);
            setPincodeError("");
          } else {
            setPincodeError(res.message || "Could not auto-detect location for this PIN");
          }
        })
        .catch(() => {
          if (!isSubscribed) return;
          setPincodeError("Network error checking PIN");
        })
        .finally(() => {
          if (isSubscribed) setPincodeLoading(false);
        });

      return () => { isSubscribed = false; };
    } else {
      setPincodeSuccess(false);
      setPincodeError("");
    }
  }, [shippingAddress.pincode]);

  const isFormValid =
    shippingAddress.address1?.trim() &&
    shippingAddress.city?.trim() &&
    shippingAddress.state?.trim() &&
    shippingAddress.pincode?.trim()?.length === 6;

  // When in "new" mode and logged in, save address to account before proceeding
  const handleProceed = async () => {
    if (!isFormValid) return;

    if (addressMode === "new" && currentUser && onSaveNewAddress) {
      setSavingNew(true);
      setSaveNewError("");
      try {
        const payload = {
          address_line1: shippingAddress.address1,
          address_line2: shippingAddress.address2 || "",
          city: shippingAddress.city,
          state: shippingAddress.state,
          pincode: shippingAddress.pincode,
          country: shippingAddress.country || "India",
          first_name: "",
          last_name: "",
          phone: "",
          is_default: false,
        };
        const res = await onSaveNewAddress(payload);
        if (!res.success) {
          setSaveNewError(res.message || "Could not save address. Proceeding anyway.");
        }
        if (onAddressListUpdated && res.success) {
          onAddressListUpdated();
        }
      } catch (err) {
        setSaveNewError("Could not save address. Proceeding anyway.");
      } finally {
        setSavingNew(false);
      }
    }

    if (onNextStep) onNextStep();
  };

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-7 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-amber-50 text-[#700b10] border border-amber-200 flex items-center justify-center font-bold text-xs">
            2
          </div>
          <div>
            <h2 className="font-serif text-lg font-bold text-stone-900 leading-tight">
              Shipping &amp; Delivery Destination
            </h2>
            <p className="text-xs text-stone-500 font-sans">
              Select a saved address or add a new delivery address.
            </p>
          </div>
        </div>
      </div>

      {/* ── Saved Address Cards (logged-in only) ── */}
      {currentUser && savedAddresses.length > 0 && (
        <div className="mb-6">
          <p className="text-xs font-bold text-stone-600 uppercase tracking-wider mb-3">
            Your Saved Addresses
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {savedAddresses.map((addr) => {
              const isSelected = addressMode === "saved" && selectedAddressId === addr.id;
              return (
                <div
                  key={addr.id}
                  onClick={() => handleSelectSaved(addr)}
                  className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? "border-[#700b10] bg-amber-50/40 ring-1 ring-[#700b10]"
                      : "border-stone-200 hover:border-stone-400 bg-white hover:bg-stone-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <Home className="w-3.5 h-3.5 text-[#700b10] shrink-0" />
                      <span className="font-bold text-stone-900">
                        {addr.first_name} {addr.last_name}
                        {addr.is_default && (
                          <span className="ml-1.5 text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-semibold">
                            Default
                          </span>
                        )}
                      </span>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-[#700b10] shrink-0 mt-0.5" />}
                  </div>
                  <p className="text-stone-600 mt-1 leading-snug">
                    {addr.address_line1 || addr.address1}
                    {(addr.address_line2 || addr.address2) && `, ${addr.address_line2 || addr.address2}`}
                  </p>
                  <p className="text-stone-500 text-[11px] mt-0.5">
                    {addr.city}, {addr.state} — {addr.pincode}
                  </p>
                  {addr.phone && (
                    <p className="text-stone-400 text-[11px] mt-0.5">{addr.phone}</p>
                  )}
                </div>
              );
            })}

            {/* Add New Address card */}
            <div
              onClick={handleUseNewAddress}
              className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all flex flex-col items-center justify-center gap-2 min-h-[90px] ${
                addressMode === "new"
                  ? "border-[#700b10] bg-amber-50/40 ring-1 ring-[#700b10]"
                  : "border-dashed border-stone-300 hover:border-[#700b10] hover:bg-amber-50/30 bg-white"
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                addressMode === "new" ? "bg-[#700b10]" : "bg-stone-100"
              }`}>
                <Plus className={`w-4 h-4 ${addressMode === "new" ? "text-white" : "text-stone-500"}`} />
              </div>
              <span className={`font-bold ${addressMode === "new" ? "text-[#700b10]" : "text-stone-600"}`}>
                Use New Address
              </span>
              {addressMode === "new" && (
                <span className="text-[10px] text-emerald-700 font-semibold">Will be saved to your account</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Address Form ── */}
      {/* Show always for guests, or when in new mode for logged-in users */}
      {(addressMode === "new" || !currentUser || savedAddresses.length === 0) && (
        <div className="space-y-4 mb-2">
          {/* Pincode with Auto-Lookup Indicator */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              PIN Code (Postal Code) <span className="text-red-500">*</span>
            </label>
            <div className="relative max-w-xs">
              <MapPin className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isPincodeInvalid ? "text-rose-400" : "text-stone-400"}`} />
              <input
                type="text"
                id="checkout-pincode"
                name="pincode"
                maxLength={6}
                value={shippingAddress.pincode || ""}
                onChange={handleChange}
                onBlur={() => handleBlur("pincode")}
                placeholder="e.g. 380001"
                required
                className={`w-full pl-9 pr-10 py-2.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wider text-stone-900 transition-all ${
                  isPincodeInvalid
                    ? "bg-rose-50/30 border border-rose-400 focus:bg-white focus:outline-hidden focus:border-rose-600 focus:ring-1 focus:ring-rose-600"
                    : "bg-stone-50/50 border border-stone-300 focus:bg-white focus:outline-hidden focus:border-[#700b10] focus:ring-1 focus:ring-[#700b10]"
                }`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {pincodeLoading && <Loader2 className="w-4 h-4 text-[#700b10] animate-spin" />}
                {pincodeSuccess && !isPincodeInvalid && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                {pincodeError && !isPincodeInvalid && <AlertCircle className="w-4 h-4 text-amber-500" />}
              </div>
            </div>
            {isPincodeInvalid ? (
              <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1 animate-fadeIn">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.pincode}</span>
              </p>
            ) : pincodeSuccess ? (
              <p className="text-[11px] text-emerald-700 mt-1 font-medium flex items-center gap-1">
                ✓ Verified delivery area: {shippingAddress.city}, {shippingAddress.state}
              </p>
            ) : pincodeError ? (
              <p className="text-[11px] text-amber-600 mt-1 font-medium">{pincodeError}</p>
            ) : null}
          </div>

          {/* Address Line 1 */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Flat, House No., Building, Apartment <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="checkout-address1"
              name="address1"
              value={shippingAddress.address1 || ""}
              onChange={handleChange}
              onBlur={() => handleBlur("address1")}
              placeholder="e.g. Flat 402, Sunshine Heights"
              required
              className={`w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm text-stone-900 transition-all ${
                isAddress1Invalid
                  ? "bg-rose-50/30 border border-rose-400 focus:bg-white focus:outline-hidden focus:border-rose-600 focus:ring-1 focus:ring-rose-600"
                  : "bg-stone-50/50 border border-stone-300 focus:bg-white focus:outline-hidden focus:border-[#700b10] focus:ring-1 focus:ring-[#700b10]"
              }`}
            />
            {isAddress1Invalid && (
              <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1 animate-fadeIn">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.address1}</span>
              </p>
            )}
          </div>

          {/* Address Line 2 */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Street, Area, Landmark (Optional)
            </label>
            <input
              type="text"
              name="address2"
              value={shippingAddress.address2 || ""}
              onChange={handleChange}
              placeholder="e.g. Near Swaminarayan Temple, MG Road"
              className="w-full px-3 py-2.5 bg-stone-50/50 border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:outline-hidden focus:border-[#700b10] focus:ring-1 focus:ring-[#700b10] transition-all"
            />
          </div>

          {/* City, State, Country */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                City / Town <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="checkout-city"
                name="city"
                value={shippingAddress.city || ""}
                onChange={handleChange}
                onBlur={() => handleBlur("city")}
                placeholder="e.g. Ahmedabad"
                required
                className={`w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm text-stone-900 transition-all ${
                  isCityInvalid
                    ? "bg-rose-50/30 border border-rose-400 focus:bg-white focus:outline-hidden focus:border-rose-600 focus:ring-1 focus:ring-rose-600"
                    : "bg-stone-50/50 border border-stone-300 focus:bg-white focus:outline-hidden focus:border-[#700b10] focus:ring-1 focus:ring-[#700b10]"
                }`}
              />
              {isCityInvalid && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1 animate-fadeIn">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.city}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="checkout-state"
                name="state"
                value={shippingAddress.state || ""}
                onChange={handleChange}
                onBlur={() => handleBlur("state")}
                placeholder="e.g. Gujarat"
                required
                className={`w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm text-stone-900 transition-all ${
                  isStateInvalid
                    ? "bg-rose-50/30 border border-rose-400 focus:bg-white focus:outline-hidden focus:border-rose-600 focus:ring-1 focus:ring-rose-600"
                    : "bg-stone-50/50 border border-stone-300 focus:bg-white focus:outline-hidden focus:border-[#700b10] focus:ring-1 focus:ring-[#700b10]"
                }`}
              />
              {isStateInvalid && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1 animate-fadeIn">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.state}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Country</label>
              <input
                type="text"
                name="country"
                value={shippingAddress.country || "India"}
                disabled
                className="w-full px-3 py-2.5 bg-stone-100 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-600 cursor-not-allowed"
              />
            </div>
          </div>

          {saveNewError && (
            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              ⚠ {saveNewError}
            </p>
          )}
        </div>
      )}

      {/* Show selected saved address summary (when using saved, form is hidden) */}
      {addressMode === "saved" && currentUser && savedAddresses.length > 0 && (
        <div className="mb-4 p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs">
          <p className="font-bold text-stone-700 mb-1 text-[11px] uppercase tracking-wide">Delivering To</p>
          <p className="font-semibold text-stone-900">{shippingAddress.address1}{shippingAddress.address2 ? `, ${shippingAddress.address2}` : ""}</p>
          <p className="text-stone-600">{shippingAddress.city}, {shippingAddress.state} — {shippingAddress.pincode}</p>
          <p className="text-stone-500">{shippingAddress.country}</p>
        </div>
      )}

      {/* Shipping Method Selection */}
      <div className="pt-4 border-t border-stone-100 mt-4">
        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2.5">
          Select Delivery Speed &amp; Method
        </label>
        <div className="space-y-2.5">
          {shippingRates.length > 0 ? (
            shippingRates.map((rate, rIdx) => {
              const rateId = rate.id || rate.method_id || `rate_${rIdx}`;
              const isSelected =
                (selectedShippingRate?.id && selectedShippingRate.id === rateId) ||
                (selectedShippingRate?.method_id && selectedShippingRate.method_id === rateId);
              const cost = Number(rate.cost !== undefined ? rate.cost : (rate.rate !== undefined ? rate.rate : 0));
              const transitTime = rate.transit_time || rate.estimated_days || "3-5 Business Days";

              return (
                <label
                  key={rateId}
                  onClick={() => onSelectShippingRate && onSelectShippingRate(rate)}
                  className={`flex items-center justify-between p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? "border-[#700b10] bg-amber-50/50 ring-1 ring-[#700b10]"
                      : "border-stone-200 hover:border-stone-300 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-700">
                      <Truck className="w-4 h-4 text-[#700b10]" />
                    </div>
                    <div>
                      <p className="font-bold text-stone-900">{rate.name}</p>
                      <p className="text-stone-500 text-[11px]">
                        Estimated delivery: {transitTime}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-sm text-stone-900">
                    {cost === 0 ? (
                      <span className="text-emerald-700 font-bold uppercase text-xs">FREE</span>
                    ) : (
                      `₹${cost.toFixed(2)}`
                    )}
                  </span>
                </label>
              );
            })
          ) : (
            <div className="p-3.5 rounded-xl border border-stone-200 bg-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-[#700b10]" />
                <div>
                  <p className="text-xs font-bold text-stone-900">Standard Express Delivery</p>
                  <p className="text-[11px] text-stone-500">Delivered within 3-5 business days across India</p>
                </div>
              </div>
              <span className="text-emerald-700 font-bold text-xs uppercase">FREE</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons (only shown in multi-step mode) */}
      {!isOneStep && (
        <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onBackStep}
            className="text-stone-600 hover:text-stone-900 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Contact</span>
          </button>

          <button
            type="button"
            onClick={handleProceed}
            disabled={!isFormValid || loading || savingNew}
            className="bg-[#700b10] hover:bg-[#54060b] disabled:opacity-50 text-white py-3 px-6 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
          >
            {savingNew ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Address…</span>
              </>
            ) : (
              <>
                <span>Proceed to Payment</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
