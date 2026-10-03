import React, { useState, useEffect } from "react";
import {
  User,
  Package,
  MapPin,
  LogOut,
  Edit2,
  Check,
  X,
  Plus,
  Trash2,
  Phone,
  Mail,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Heart,
  ShoppingBag,
  Loader2,
  CreditCard,
  Truck,
} from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import {
  fetchCustomerProfile,
  updateCustomerProfile,
  fetchCustomerAddresses,
  addCustomerAddress,
  updateCustomerAddress,
  deleteCustomerAddress,
  setDefaultCustomerAddress,
  fetchCustomerOrders,
  fetchOrderDetails,
  logoutCustomer,
} from "../services/api";

export default function ProfilePage({
  currentUser,
  onLogout,
  onNavigate,
  onOpenAuth,
}) {
  const { wishlistItems, removeFromWishlist, loading: wishlistLoading } = useWishlist();
  const [activeTab, setActiveTab] = useState("profile"); // "profile" | "orders" | "addresses" | "wishlist"
  const [profile, setProfile] = useState(currentUser || null);
  const [loading, setLoading] = useState(true);

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");

  // Addresses State
  const [addresses, setAddresses] = useState([]);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    is_default: false,
  });
  const [addressError, setAddressError] = useState("");
  const [savingAddress, setSavingAddress] = useState(false);

  // Orders State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingOrderDetails, setLoadingOrderDetails] = useState(false);

  // Load customer details & orders
  const loadOrders = async () => {
    setLoadingOrders(true);
    try {
      const orderList = await fetchCustomerOrders();
      if (Array.isArray(orderList)) {
        setOrders(orderList);
      }
    } catch (err) {
      console.error("Error loading orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  // View full live order details from GET /shop/orders/:id
  const handleViewOrderDetails = async (order) => {
    setSelectedOrder(order);
    const orderId = order.id || order.order_id || order.order_number;
    if (!orderId) return;

    setLoadingOrderDetails(true);
    try {
      const cleanId = String(orderId).replace(/^#+/, "").replace(/^ORD-/, "");
      const res = await fetchOrderDetails(cleanId || orderId);
      if (res && res.success && res.data) {
        setSelectedOrder((prev) => ({
          ...prev,
          ...res.data,
        }));
      }
    } catch (err) {
      console.error("Error fetching order details:", err);
    } finally {
      setLoadingOrderDetails(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const token = localStorage.getItem("customer_token");

    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchCustomerProfile()
      .then((data) => {
        if (isMounted) {
          const cust = data || currentUser || {};
          setProfile(cust);
          setFirstName(cust.first_name || "");
          setLastName(cust.last_name || "");
          setEmail(cust.email || "");
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    // Also load addresses and orders in parallel
    fetchCustomerAddresses().then((res) => {
      if (isMounted && res.success && Array.isArray(res.data)) setAddresses(res.data);
    });

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  // Lock background scroll when order details modal or address modal is open
  useEffect(() => {
    if (selectedOrder || showAddAddress || editingAddress) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [selectedOrder, showAddAddress, editingAddress]);

  // Handle ESC key to close open modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (selectedOrder) setSelectedOrder(null);
        if (showAddAddress) setShowAddAddress(false);
        if (editingAddress) setEditingAddress(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedOrder, showAddAddress, editingAddress]);

  // Handle Save Profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMessage("");

    const res = await updateCustomerProfile({
      first_name: firstName,
      last_name: lastName,
      email: email,
    });

    setSavingProfile(false);
    if (res.success) {
      setProfile((prev) => ({
        ...prev,
        first_name: firstName,
        last_name: lastName,
        email: email,
      }));
      setIsEditing(false);
      setProfileMessage("Personal details updated successfully!");
      setTimeout(() => setProfileMessage(""), 4000);
    } else {
      setProfileMessage(res.message || "Failed to update profile");
    }
  };

  // Open Add Address Form
  const handleOpenAddAddress = () => {
    setEditingAddress(null);
    setAddressError("");
    setAddressForm({
      first_name: profile?.first_name || "",
      last_name: profile?.last_name || "",
      phone: profile?.phone || "",
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
      is_default: addresses.length === 0,
    });
    setShowAddAddress(true);
  };

  // Open Edit Address Form
  const handleStartEditAddress = (addr) => {
    setEditingAddress(addr);
    setAddressError("");
    setAddressForm({
      first_name: addr.first_name || "",
      last_name: addr.last_name || "",
      phone: addr.phone || "",
      address_line1: addr.address_line1 || addr.address1 || "",
      address_line2: addr.address_line2 || addr.address2 || "",
      city: addr.city || "",
      state: addr.state || "",
      pincode: addr.pincode || "",
      country: addr.country || "India",
      is_default: !!addr.is_default,
    });
    setShowAddAddress(true);
  };

  // Cancel Address Form
  const handleCancelAddressForm = () => {
    setShowAddAddress(false);
    setEditingAddress(null);
    setAddressError("");
  };

  // Handle Save Address (Create or Update)
  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setSavingAddress(true);
    setAddressError("");

    const payload = {
      first_name: addressForm.first_name,
      last_name: addressForm.last_name,
      phone: addressForm.phone,
      address_line1: addressForm.address_line1,
      address_line2: addressForm.address_line2,
      city: addressForm.city,
      state: addressForm.state,
      pincode: addressForm.pincode,
      country: addressForm.country || "India",
      is_default: addressForm.is_default,
    };

    let res;
    if (editingAddress) {
      // Call PUT /customer/addresses/:id from api.md
      res = await updateCustomerAddress(editingAddress.id, payload);
    } else {
      // Call POST /customer/addresses from api.md
      res = await addCustomerAddress(payload);
    }

    setSavingAddress(false);

    if (res.success) {
      handleCancelAddressForm();
      const updatedRes = await fetchCustomerAddresses();
      if (updatedRes.success && Array.isArray(updatedRes.data)) {
        setAddresses(updatedRes.data);
      }
    } else {
      setAddressError(res.message || "Failed to save address. Please check all fields.");
    }
  };

  // Handle Delete Address
  const handleDeleteAddress = async (id) => {
    if (window.confirm("Are you sure you want to remove this address?")) {
      const res = await deleteCustomerAddress(id);
      if (res.success) {
        setAddresses((prev) => prev.filter((a) => a.id !== id));
      }
    }
  };

  // Handle Set Default Address
  const handleSetDefaultAddress = async (id) => {
    const res = await setDefaultCustomerAddress(id);
    if (res.success) {
      setAddresses((prev) =>
        prev.map((a) => ({
          ...a,
          is_default: a.id === id,
        }))
      );
    }
  };

  // Handle Logout
  const handleLogout = () => {
    logoutCustomer();
    if (onLogout) {
      onLogout();
    }
    onNavigate?.("home");
  };

  // Initials for Avatar
  const getInitials = () => {
    const f = profile?.first_name ? profile.first_name[0] : "";
    const l = profile?.last_name ? profile.last_name[0] : "";
    if (f || l) return `${f}${l}`.toUpperCase();
    if (profile?.phone) return String(profile.phone).slice(0, 2);
    return "MM";
  };

  const displayName =
    profile?.first_name || profile?.last_name
      ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim()
      : "Manish megascale";

  // If user is not logged in, prompt to Sign In
  if (!localStorage.getItem("customer_token") && !currentUser) {
    return (
      <div className="w-full min-h-[70vh] bg-[#ffffff] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-amber-100 shadow-xl text-center">
          <div className="w-16 h-16 rounded-full bg-[#700b10]/10 text-[#700b10] mx-auto flex items-center justify-center mb-4">
            <User className="w-8 h-8" />
          </div>
          <h2 className="font-tenor text-2xl font-bold text-stone-900 mb-2">
            My Account
          </h2>
          <p className="text-stone-500 text-sm mb-6 font-nunito">
            Sign in with your mobile number to view personal details, order history, and saved addresses.
          </p>
          <button
            type="button"
            onClick={() => onOpenAuth?.()}
            className="w-full py-3.5 bg-[#700b10] hover:bg-[#851016] text-white rounded-xl text-sm font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
          >
            Sign In with WhatsApp
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white py-10 px-4 sm:px-6 lg:px-12 font-nunito">
      <div className="max-w-6xl mx-auto">
        {/* Title: My Account */}
        <h1 className="font-tenor text-3xl sm:text-4xl text-[#700b10] tracking-wide mb-8">
          My Account
        </h1>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">

          {/* LEFT COLUMN: User Card & Navigation Tabs */}
          <div className="md:col-span-4 lg:col-span-3.5 space-y-4">

            {/* Top Avatar User Card */}
            <div className="bg-white rounded-3xl p-5 border border-stone-200/70 shadow-xs flex items-center gap-4">
              {/* Circular Crimson Avatar */}
              <div className="w-14 h-14 rounded-full bg-[#700b10] text-[#faeed1] flex items-center justify-center font-bold text-lg font-nunito tracking-wider shrink-0 shadow-sm">
                {getInitials()}
              </div>

              {/* Name & Bhagvat Member Badge */}
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-base text-stone-900 truncate leading-snug">
                  {displayName}
                </h3>
                <span className="text-[10px] font-extrabold tracking-wider text-[#b5944d] uppercase block mt-0.5">
                  BHAGVAT MEMBER
                </span>
              </div>
            </div>

            {/* Navigation Menu Card */}
            <div className="bg-white rounded-3xl overflow-hidden border border-stone-200/70 shadow-xs">
              <nav className="flex flex-col">
                {/* 1. MY PROFILE */}
                <button
                  type="button"
                  onClick={() => setActiveTab("profile")}
                  className={`flex items-center gap-3.5 px-6 py-4 text-xs font-bold uppercase tracking-wider transition-all text-left relative cursor-pointer ${activeTab === "profile"
                    ? "text-[#700b10] bg-rose-50/50"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                    }`}
                >
                  {/* Left maroon active accent pill */}
                  {activeTab === "profile" && (
                    <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#700b10] rounded-r-md" />
                  )}
                  <User className="w-4 h-4 text-[#700b10]" />
                  <span>MY PROFILE</span>
                </button>

                {/* 2. ORDER HISTORY */}
                <button
                  type="button"
                  onClick={() => setActiveTab("orders")}
                  className={`flex items-center gap-3.5 px-6 py-4 text-xs font-bold uppercase tracking-wider transition-all text-left relative cursor-pointer ${activeTab === "orders"
                    ? "text-[#700b10] bg-rose-50/50"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                    }`}
                >
                  {activeTab === "orders" && (
                    <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#700b10] rounded-r-md" />
                  )}
                  <Package className="w-4 h-4 text-stone-400 group-hover:text-[#700b10]" />
                  <span>ORDER HISTORY</span>
                </button>

                {/* 3. DELIVERY ADDRESSES */}
                <button
                  type="button"
                  onClick={() => setActiveTab("addresses")}
                  className={`flex items-center gap-3.5 px-6 py-4 text-xs font-bold uppercase tracking-wider transition-all text-left relative cursor-pointer ${activeTab === "addresses"
                    ? "text-[#700b10] bg-rose-50/50"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                    }`}
                >
                  {activeTab === "addresses" && (
                    <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#700b10] rounded-r-md" />
                  )}
                  <MapPin className="w-4 h-4 text-stone-400" />
                  <span>DELIVERY ADDRESSES</span>
                </button>

                {/* 4. MY WISHLIST */}
                <button
                  type="button"
                  onClick={() => setActiveTab("wishlist")}
                  className={`flex items-center justify-between px-6 py-4 text-xs font-bold uppercase tracking-wider transition-all text-left relative cursor-pointer ${activeTab === "wishlist"
                    ? "text-[#700b10] bg-rose-50/50"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                    }`}
                >
                  <div className="flex items-center gap-3.5">
                    {activeTab === "wishlist" && (
                      <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#700b10] rounded-r-md" />
                    )}
                    <Heart className="w-4 h-4 text-stone-400" />
                    <span>MY WISHLIST</span>
                  </div>
                  {wishlistItems.length > 0 && (
                    <span className="text-[10px] bg-[#700b10] text-white px-2 py-0.5 rounded-full font-bold">
                      {wishlistItems.length}
                    </span>
                  )}
                </button>

                {/* Divider */}
                <div className="h-px bg-stone-100 my-1 mx-4" />

                {/* 5. SIGN OUT */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-3.5 px-6 py-4 text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-red-50/80 transition-all text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>SIGN OUT</span>
                </button>
              </nav>
            </div>
          </div>

          {/* RIGHT COLUMN: Content Card */}
          <div className="md:col-span-8 lg:col-span-8.5">

            {/* TAB 1: PERSONAL DETAILS (Matches User Screenshot) */}
            {activeTab === "profile" && (
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/70 shadow-xs relative">

                {/* Header with Title & Edit button */}
                <div className="flex items-center justify-between border-b border-stone-100 pb-5 mb-8">
                  <h2 className="font-tenor text-2xl text-[#700b10] font-normal tracking-wide">
                    Personal Details
                  </h2>

                  {!isEditing ? (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#b5944d] hover:text-[#700b10] transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="inline-flex items-center gap-1 text-xs text-stone-400 hover:text-stone-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  )}
                </div>

                {/* Notification Banner */}
                {profileMessage && (
                  <div className="mb-6 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>{profileMessage}</span>
                  </div>
                )}

                {/* Read-Only Grid (Matching Screenshot) */}
                {!isEditing ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-6">
                    {/* First Name */}
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                        FIRST NAME
                      </span>
                      <p className="text-base sm:text-lg font-bold text-stone-900">
                        {profile?.first_name || "Manish"}
                      </p>
                    </div>

                    {/* Last Name */}
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                        LAST NAME
                      </span>
                      <p className="text-base sm:text-lg font-bold text-stone-900">
                        {profile?.last_name || "megascale"}
                      </p>
                    </div>

                    {/* Email */}
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                        EMAIL
                      </span>
                      <p className="text-base sm:text-lg font-medium text-stone-900">
                        {profile?.email || "—"}
                      </p>
                    </div>

                    {/* Phone */}
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                        PHONE
                      </span>
                      <p className="text-base sm:text-lg font-bold text-stone-900 tracking-wider">
                        {profile?.phone || "9409874134"}
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Edit Form */
                  <form onSubmit={handleSaveProfile} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Your first name"
                          className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-[#700b10] outline-none text-stone-900 font-semibold"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Your last name"
                          className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-[#700b10] outline-none text-stone-900 font-semibold"
                          required
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your.email@example.com"
                          className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-[#700b10] outline-none text-stone-900 font-semibold"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4">
                      <button
                        type="submit"
                        disabled={savingProfile}
                        className="px-6 py-3 bg-[#700b10] hover:bg-[#851016] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer disabled:opacity-50"
                      >
                        {savingProfile ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-5 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* TAB 2: ORDER HISTORY */}
            {activeTab === "orders" && (
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/70 shadow-xs">
                <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-6">
                  <div>
                    <h2 className="font-tenor text-2xl text-[#700b10] font-normal tracking-wide">
                      Order History
                    </h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Review all your past pooja samagri and sacred orders
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={loadOrders}
                    disabled={loadingOrders}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#b5944d] hover:text-[#700b10] transition-colors cursor-pointer"
                  >
                    <span>{loadingOrders ? "Refreshing..." : "Refresh"}</span>
                  </button>
                </div>

                {loadingOrders ? (
                  <div className="py-16 flex flex-col items-center justify-center text-stone-500 gap-3">
                    <div className="w-8 h-8 border-3 border-amber-200 border-t-[#700b10] rounded-full animate-spin" />
                    <p className="text-xs font-semibold">Fetching your orders from server...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-50 flex items-center justify-center text-[#700b10]">
                      <Package className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-stone-800 text-base mb-1">
                      No Orders Placed Yet
                    </h3>
                    <p className="text-stone-500 text-xs sm:text-sm max-w-sm mx-auto mb-6">
                      Explore our handcrafted pooja samagri, natural attars, and premium incense to place your first sacred order.
                    </p>
                    <button
                      type="button"
                      onClick={() => onNavigate?.("shop")}
                      className="px-6 py-3 bg-[#700b10] hover:bg-[#851016] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => {
                      const orderId = order.id || order.order_id || order.order_number;
                      const rawNumber = String(order.order_number || order.id || "");
                      const displayOrderNumber = rawNumber.startsWith("#") ? rawNumber : `#${rawNumber}`;
                      const orderDate = order.created_at || order.createdAt || order.date;
                      const formattedDate = orderDate
                        ? new Date(orderDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                        : "Recent";

                      const items = Array.isArray(order.items)
                        ? order.items
                        : Array.isArray(order.line_items)
                          ? order.line_items
                          : Array.isArray(order.order_items)
                            ? order.order_items
                            : [];

                      const calculatedItemsSubtotal = items.reduce(
                        (sum, it) =>
                          sum +
                          Number(it.price ?? it.unit_price ?? it.line_total ?? 0) *
                          (Number(it.quantity ?? it.qty) || 1),
                        0
                      );

                      const totalAmount =
                        Number(
                          order.total ||
                          order.total_amount ||
                          order.total_price ||
                          order.grand_total ||
                          0
                        ) || calculatedItemsSubtotal;

                      const status = (
                        order.financial_status ||
                        order.payment_status ||
                        order.status ||
                        "Placed"
                      ).toLowerCase();

                      const isPaid = status === "paid" || status === "completed";

                      return (
                        <div
                          key={orderId}
                          className="p-5 rounded-2xl border border-stone-200/90 hover:border-amber-300 transition-all bg-stone-50/40 hover:bg-white flex flex-col gap-3.5 shadow-2xs"
                        >
                          {/* Order Header: Order #, Date, Status */}
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-stone-900 text-sm sm:text-base">
                                {displayOrderNumber}
                              </span>
                              <span className="text-xs text-stone-400">•</span>
                              <span className="text-xs text-stone-500 font-medium">
                                {formattedDate}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap justify-end">
                              {order.latest_shipment?.status && (
                                <span className="text-[10px] sm:text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200 flex items-center gap-1">
                                  <Truck className="w-3 h-3 text-sky-700" />
                                  <span>{String(order.latest_shipment.status).replace(/_/g, " ")}</span>
                                </span>
                              )}
                              <span
                                className={`text-[10px] sm:text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${isPaid
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-amber-100 text-amber-900"
                                  }`}
                              >
                                {order.financial_status || order.status || "Placed"}
                              </span>
                              <span className="text-sm sm:text-base font-extrabold text-[#700b10]">
                                ₹{Number(totalAmount).toLocaleString("en-IN", { minimumFractionDigits: 0 })}
                              </span>
                            </div>
                          </div>

                          {/* Order Items Preview */}
                          {items.length > 0 && (
                            <div className="space-y-2">
                              {items.slice(0, 3).map((item, idx) => {
                                const itemImg =
                                  item.image_url ||
                                  item.image ||
                                  item.featured_image ||
                                  (item.images && item.images[0]?.url) ||
                                  (item.images && item.images[0]);
                                const itemPrice = Number(item.price ?? item.unit_price ?? item.line_total ?? 0);
                                const itemQty = Number(item.quantity ?? item.qty) || 1;

                                return (
                                  <div
                                    key={item.id || idx}
                                    className="flex items-center justify-between text-xs text-stone-700"
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <div className="w-9 h-9 rounded-lg bg-amber-50/80 border border-stone-200/80 flex items-center justify-center shrink-0 overflow-hidden text-[10px] font-bold text-[#700b10]">
                                        {itemImg ? (
                                          <img
                                            src={itemImg}
                                            alt={item.title || item.product_title}
                                            className="w-full h-full object-cover"
                                          />
                                        ) : (
                                          "NS"
                                        )}
                                      </div>
                                      <div className="min-w-0">
                                        <p className="font-medium text-stone-900 truncate">
                                          {item.title || item.product_title || "Sacred Item"}
                                        </p>
                                        <span className="text-[11px] text-stone-500">
                                          Qty: {itemQty}
                                        </span>
                                      </div>
                                    </div>
                                    <span className="font-bold text-stone-800 shrink-0 ml-2">
                                      ₹{(itemPrice * itemQty).toLocaleString("en-IN")}
                                    </span>
                                  </div>
                                );
                              })}
                              {items.length > 3 && (
                                <p className="text-[11px] text-stone-400">
                                  + {items.length - 3} more items
                                </p>
                              )}
                            </div>
                          )}

                          {/* Bottom Card Actions */}
                          <div className="flex items-center justify-between pt-2 border-t border-stone-100/70 text-xs">
                            <span className="text-stone-500 text-[11px]">
                              {items.length} {items.length === 1 ? "item" : "items"}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleViewOrderDetails(order)}
                              className="text-[#700b10] hover:text-[#54060b] font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <span>View Order Details</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: DELIVERY ADDRESSES */}
            {activeTab === "addresses" && (
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/70 shadow-xs">
                <div className="flex items-center justify-between border-b border-stone-100 pb-5 mb-6">
                  <h2 className="font-tenor text-2xl text-[#700b10] font-normal tracking-wide">
                    Delivery Addresses
                  </h2>
                  <button
                    type="button"
                    onClick={handleOpenAddAddress}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#b5944d] hover:text-[#700b10] transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New</span>
                  </button>
                </div>

                {/* Add / Edit Address Form */}
                {showAddAddress && (
                  <form onSubmit={handleSaveAddress} className="mb-8 p-6 bg-stone-50/90 rounded-2xl border border-stone-200/90 space-y-4 animate-fadeIn shadow-xs">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-stone-800 text-sm flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#700b10]" />
                        {editingAddress ? "Edit Delivery Address" : "New Delivery Address"}
                      </h3>
                      <button
                        type="button"
                        onClick={handleCancelAddressForm}
                        className="text-stone-400 hover:text-stone-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {addressError && (
                      <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                        {addressError}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-600 mb-1">First Name *</label>
                        <input
                          type="text"
                          placeholder="e.g. Manish"
                          value={addressForm.first_name}
                          onChange={(e) => setAddressForm({ ...addressForm, first_name: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-stone-300 focus:border-[#700b10] outline-none transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-600 mb-1">Last Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Prajapati"
                          value={addressForm.last_name}
                          onChange={(e) => setAddressForm({ ...addressForm, last_name: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-stone-300 focus:border-[#700b10] outline-none transition-colors"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-stone-600 mb-1">Phone Number *</label>
                        <input
                          type="tel"
                          placeholder="10-digit mobile number"
                          value={addressForm.phone}
                          onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-stone-300 focus:border-[#700b10] outline-none transition-colors"
                          required
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-stone-600 mb-1">Address Line 1 (Flat, House no., Building, Street) *</label>
                        <input
                          type="text"
                          placeholder="Street address, apartment, suite, etc."
                          value={addressForm.address_line1}
                          onChange={(e) => setAddressForm({ ...addressForm, address_line1: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-stone-300 focus:border-[#700b10] outline-none transition-colors"
                          required
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-stone-600 mb-1">Address Line 2 (Area, Landmark)</label>
                        <input
                          type="text"
                          placeholder="Landmark, nearby area (optional)"
                          value={addressForm.address_line2}
                          onChange={(e) => setAddressForm({ ...addressForm, address_line2: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-stone-300 focus:border-[#700b10] outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-600 mb-1">City *</label>
                        <input
                          type="text"
                          placeholder="City"
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-stone-300 focus:border-[#700b10] outline-none transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-600 mb-1">State *</label>
                        <input
                          type="text"
                          placeholder="State"
                          value={addressForm.state}
                          onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-stone-300 focus:border-[#700b10] outline-none transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-600 mb-1">Pincode *</label>
                        <input
                          type="text"
                          placeholder="6-digit pincode"
                          value={addressForm.pincode}
                          onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-stone-300 focus:border-[#700b10] outline-none transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-600 mb-1">Country</label>
                        <input
                          type="text"
                          value={addressForm.country || "India"}
                          onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-stone-300 focus:border-[#700b10] outline-none transition-colors"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="is_default_addr"
                        checked={addressForm.is_default}
                        onChange={(e) => setAddressForm({ ...addressForm, is_default: e.target.checked })}
                        className="rounded accent-[#700b10] w-4 h-4 cursor-pointer"
                      />
                      <label htmlFor="is_default_addr" className="text-xs text-stone-700 cursor-pointer select-none">
                        Make this my default delivery address
                      </label>
                    </div>

                    <div className="flex gap-2.5 pt-2">
                      <button
                        type="submit"
                        disabled={savingAddress}
                        className="px-6 py-2.5 bg-[#700b10] hover:bg-[#851016] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
                      >
                        {savingAddress && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                        {editingAddress ? (savingAddress ? "Updating..." : "Update Address") : (savingAddress ? "Saving..." : "Save Address")}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelAddressForm}
                        className="px-5 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* Addresses List */}
                {addresses.length === 0 ? (
                  <p className="text-stone-500 text-xs sm:text-sm py-4">
                    No saved delivery addresses. Click &ldquo;Add New&rdquo; above to save an address for faster checkout.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className="p-5 rounded-2xl border border-stone-200 hover:border-amber-200 transition-all bg-white relative flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-stone-900 text-sm">
                              {addr.first_name} {addr.last_name}
                            </span>
                            {addr.is_default ? (
                              <span className="text-[10px] bg-amber-100 text-[#700b10] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                Default
                              </span>
                            ) : null}
                          </div>
                          <p className="text-xs text-stone-600 leading-relaxed">
                            {addr.address1 || addr.address_line1}
                            {(addr.address2 || addr.address_line2) ? `, ${addr.address2 || addr.address_line2}` : ""}
                            <br />
                            {addr.city}, {addr.state} - {addr.pincode}
                          </p>
                          <p className="text-xs text-stone-500 mt-2 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-[#b5944d]" /> {addr.phone}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-4 mt-4 border-t border-stone-100 text-xs">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleStartEditAddress(addr)}
                              className="inline-flex items-center gap-1 text-[#b5944d] hover:text-[#700b10] font-bold transition-colors cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            {!addr.is_default && (
                              <button
                                type="button"
                                onClick={() => handleSetDefaultAddress(addr.id)}
                                className="text-[#700b10] font-bold hover:underline cursor-pointer"
                              >
                                Set as Default
                              </button>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="text-stone-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                            aria-label="Delete address"
                            title="Delete address"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: MY WISHLIST */}
            {activeTab === "wishlist" && (
              <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 md:p-10 border border-stone-200/70 shadow-xs">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3.5 sm:pb-5 mb-4 sm:mb-6">
                  <div>
                    <h2 className="font-tenor text-lg sm:text-2xl text-[#700b10] font-normal tracking-wide flex items-center gap-1.5 sm:gap-2">
                      <span>My Wishlist</span>
                      <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-[#700b10] text-[#700b10]" />
                    </h2>
                    <p className="text-[11px] sm:text-xs text-stone-500 font-nunito mt-0.5">
                      Your saved divine items stored securely on megaecomm
                    </p>
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold text-stone-700 bg-stone-100 px-2.5 sm:px-3 py-1 rounded-full shrink-0">
                    {wishlistItems.length} {wishlistItems.length === 1 ? "Item" : "Items"}
                  </span>
                </div>

                {wishlistLoading ? (
                  <div className="py-16 text-center">
                    <div className="w-8 h-8 border-2 border-[#700b10]/20 border-t-[#700b10] rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-xs text-stone-500 font-bold">Loading saved items...</p>
                  </div>
                ) : wishlistItems.length === 0 ? (
                  <div className="py-12 text-center max-w-sm mx-auto">
                    <div className="w-14 h-14 bg-rose-50 rounded-full flex items-center justify-center text-[#700b10] mx-auto mb-4">
                      <Heart className="w-7 h-7" />
                    </div>
                    <h3 className="font-bold text-stone-900 text-base mb-1">Your Wishlist is Empty</h3>
                    <p className="text-xs text-stone-500 mb-5 leading-relaxed">
                      You haven't saved any items yet. Explore our sacred pooja products and add them to your wishlist!
                    </p>
                    <button
                      type="button"
                      onClick={() => onNavigate?.("shop")}
                      className="px-6 py-2.5 bg-[#700b10] hover:bg-[#851016] text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer"
                    >
                      Shop Now
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
                    {wishlistItems.map((item) => {
                      const product = item.product || item;
                      const title = product.title || "Spiritual Product";
                      const image =
                        product.image_url ||
                        product.images?.[0]?.url ||
                        "https://megaecomm.megascale.co.in/backend/media/16/general/66066c8ca3ab4a8cc35413b3a26e3314.jpeg";
                      const price = Number(
                        product.priceRange?.minVariantPrice?.amount ??
                        product.price ??
                        product.variants?.[0]?.price?.amount ??
                        product.variants?.[0]?.price ??
                        0
                      );
                      const compareAtPrice = Number(
                        product.compareAtPrice?.amount ??
                        product.compare_at_price ??
                        product.compareAtPrice ??
                        product.variants?.[0]?.compareAtPrice?.amount ??
                        product.variants?.[0]?.compare_at_price ??
                        product.variants?.[0]?.compareAtPrice ??
                        0
                      );
                      const itemId = item.id || item.product_id || product.id;

                      return (
                        <div
                          key={itemId}
                          className="p-2 sm:p-3.5 rounded-xl sm:rounded-2xl border border-stone-200 hover:border-amber-200 transition-all bg-white relative flex flex-col justify-between group"
                        >
                          <div className="relative aspect-square w-full rounded-lg sm:rounded-xl overflow-hidden bg-stone-100/70 mb-2 sm:mb-3">
                            <img
                              src={image}
                              alt={title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <button
                              type="button"
                              onClick={() => removeFromWishlist(item.id || itemId)}
                              className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/95 text-stone-600 hover:text-red-600 flex items-center justify-center shadow-md transition-all hover:scale-110 cursor-pointer"
                              title="Remove from wishlist"
                              aria-label="Remove from wishlist"
                            >
                              <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            </button>
                          </div>

                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <h4 className="font-nunito text-[11.5px] sm:text-sm font-semibold text-stone-800 line-clamp-2 leading-tight sm:leading-snug mb-1 sm:mb-1.5">
                                {title}
                              </h4>
                              <div className="flex items-baseline gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                                <span className="text-xs sm:text-sm font-extrabold text-[#700b10]">
                                  ₹{Number(price).toLocaleString("en-IN")}
                                </span>
                                {compareAtPrice > price && (
                                  <span className="text-[10px] sm:text-[11px] text-stone-400 line-through">
                                    ₹{Number(compareAtPrice).toLocaleString("en-IN")}
                                  </span>
                                )}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                const handle = product.handle || product.id;
                                onNavigate?.("product", { productHandle: handle, product });
                              }}
                              className="w-full bg-[#700b10] hover:bg-[#54060b] text-white py-1.5 sm:py-2 px-1.5 sm:px-3 rounded-lg sm:rounded-xl font-nunito font-bold text-[10.5px] sm:text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer shadow-2xs"
                            >
                              <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#ebd99c]" />
                              <span>View Details</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (() => {
        const rawNumber = String(selectedOrder.order_number || selectedOrder.id || "");
        const displayOrderNumber = rawNumber.startsWith("#") ? rawNumber : `#${rawNumber}`;

        const items = Array.isArray(selectedOrder.items)
          ? selectedOrder.items
          : Array.isArray(selectedOrder.line_items)
            ? selectedOrder.line_items
            : Array.isArray(selectedOrder.order_items)
              ? selectedOrder.order_items
              : [];

        const calculatedItemsSubtotal = items.reduce(
          (sum, it) =>
            sum +
            Number(it.price ?? it.unit_price ?? it.line_total ?? 0) *
            (Number(it.quantity ?? it.qty) || 1),
          0
        );

        const subtotalVal =
          Number(
            selectedOrder.subtotal ??
            selectedOrder.subtotal_amount ??
            selectedOrder.subtotal_price ??
            0
          ) || calculatedItemsSubtotal;

        const discountVal = Number(
          selectedOrder.discount ??
          selectedOrder.discount_amount ??
          selectedOrder.discountAmount ??
          0
        );

        const shippingVal = Number(
          selectedOrder.shipping ??
          selectedOrder.shipping_amount ??
          selectedOrder.shippingAmount ??
          selectedOrder.shipping_fee ??
          0
        );

        const taxVal = Number(
          selectedOrder.tax ??
          selectedOrder.tax_amount ??
          selectedOrder.taxAmount ??
          0
        );

        const totalVal =
          Number(
            selectedOrder.total ??
            selectedOrder.total_amount ??
            selectedOrder.total_price ??
            selectedOrder.grand_total ??
            0
          ) || Math.max(0, subtotalVal - discountVal + shippingVal + taxVal);

        const shippingAddress =
          selectedOrder.shippingAddress ||
          selectedOrder.shipping_address ||
          selectedOrder.address;

        const shipment =
          selectedOrder.latest_shipment ||
          selectedOrder.latestShipment ||
          selectedOrder.shipment ||
          (Array.isArray(selectedOrder.shipments) && selectedOrder.shipments[0]) ||
          null;

        const customerName =
          selectedOrder.customerName ||
          selectedOrder.customer_name ||
          (selectedOrder.customer &&
            (selectedOrder.customer.name ||
              `${selectedOrder.customer.first_name || ""} ${selectedOrder.customer.last_name || ""}`.trim())) ||
          (shippingAddress &&
            (shippingAddress.name ||
              `${shippingAddress.first_name || ""} ${shippingAddress.last_name || ""}`.trim()));

        const customerPhone =
          selectedOrder.customerPhone ||
          selectedOrder.customer_phone ||
          (selectedOrder.customer && selectedOrder.customer.phone) ||
          (shippingAddress && shippingAddress.phone);

        const paymentMethod =
          selectedOrder.payment_method ||
          selectedOrder.paymentMethod ||
          selectedOrder.provider ||
          selectedOrder.payment_provider ||
          (selectedOrder.financial_status === "paid" ? "Online Payment" : "Cash on Delivery");

        const statusText = (selectedOrder.financial_status || selectedOrder.status || "Placed").toUpperCase();
        const isPaid = statusText === "PAID" || statusText === "COMPLETED";

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fadeIn"
              onClick={() => setSelectedOrder(null)}
            />
            <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-100 z-10 animate-scaleUp max-h-[88dvh] sm:max-h-[90vh] flex flex-col">
              {/* Modal Header */}
              <div className="p-5 sm:p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
                <div>
                  <h3 className="font-tenor text-xl font-bold text-stone-900">
                    Order Details
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5 font-medium flex items-center gap-1.5">
                    <span className="font-bold text-stone-800">{displayOrderNumber}</span>
                    <span>•</span>
                    <span>
                      {selectedOrder.created_at || selectedOrder.createdAt || selectedOrder.date
                        ? new Date(
                          selectedOrder.created_at || selectedOrder.createdAt || selectedOrder.date
                        ).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                        : "Recent Order"}
                    </span>
                    {loadingOrderDetails && (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#700b10] ml-1" />
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 rounded-full bg-white hover:bg-stone-200 text-stone-500 transition-colors shadow-2xs cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
                {/* Status Badges */}
                <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-stone-700">
                    <CreditCard className="w-4 h-4 text-[#700b10]" />
                    <span className="font-bold">Payment:</span>
                    <span className="capitalize text-stone-600 font-medium">
                      {paymentMethod}
                    </span>
                  </div>
                  <span
                    className={`font-extrabold uppercase px-3 py-1 rounded-full text-[11px] ${isPaid
                      ? "bg-[#700b10] text-white"
                      : "bg-amber-100 text-amber-900 border border-amber-300"
                      }`}
                  >
                    {statusText}
                  </span>
                </div>

                {/* Items List */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-stone-500" />
                    <span>Purchased Items</span>
                  </h4>
                  <div className="space-y-2.5">
                    {items.map((item, idx) => {
                      const itemImg =
                        item.image_url ||
                        item.image ||
                        item.featured_image ||
                        (item.images && item.images[0]?.url) ||
                        (item.images && item.images[0]);
                      const unitPrice = Number(item.price ?? item.unit_price ?? item.line_total ?? 0);
                      const qty = Number(item.quantity ?? item.qty) || 1;
                      const lineTotal = unitPrice * qty;

                      return (
                        <div
                          key={item.id || idx}
                          className="p-3.5 rounded-2xl border border-stone-200/80 bg-white flex items-center justify-between gap-3 text-xs shadow-2xs hover:border-amber-200 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-12 h-12 rounded-xl bg-amber-50/80 border border-stone-200/80 flex items-center justify-center shrink-0 overflow-hidden text-xs font-bold text-[#700b10]">
                              {itemImg ? (
                                <img
                                  src={itemImg}
                                  alt={item.title || item.product_title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                "NS"
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-stone-900 truncate">
                                {item.title || item.product_title || "Sacred Item"}
                              </p>
                              <div className="flex items-center gap-2 text-stone-500 text-[11px] mt-0.5">
                                <span>Qty: {qty}</span>
                                {item.variant_title && (
                                  <>
                                    <span>•</span>
                                    <span className="text-stone-600">{item.variant_title}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <span className="font-extrabold text-stone-900 shrink-0 text-sm">
                            ₹{lineTotal.toLocaleString("en-IN", { minimumFractionDigits: 0 })}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Shipping / Delivery Address */}
                {shippingAddress && (
                  <div className="border-t border-stone-100 pt-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#700b10]" />
                      <span>Delivery Address</span>
                    </h4>
                    <div className="p-3.5 rounded-2xl bg-stone-50/80 border border-stone-200/70 text-xs text-stone-700 space-y-1">
                      {customerName && <p className="font-bold text-stone-900">{customerName}</p>}
                      <p className="leading-snug">
                        {shippingAddress.line1 || shippingAddress.address1 || shippingAddress.address_line1 || ""}
                        {(shippingAddress.line2 || shippingAddress.address2 || shippingAddress.address_line2)
                          ? `, ${shippingAddress.line2 || shippingAddress.address2 || shippingAddress.address_line2}`
                          : ""}
                      </p>
                      <p className="text-stone-600">
                        {shippingAddress.city && `${shippingAddress.city}, `}
                        {shippingAddress.state && `${shippingAddress.state} `}
                        {shippingAddress.pincode ? `- ${shippingAddress.pincode}` : ""}
                      </p>
                      {customerPhone && (
                        <p className="text-stone-500 font-mono text-[11px] pt-1">
                          Phone: {customerPhone}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Shipment & Live Tracking Details (from latest_shipment response) */}
                {shipment && (
                  <div className="border-t border-stone-100 pt-4">
                    <div className="flex items-center justify-between mb-2.5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-[#700b10]" />
                        <span>Shipment &amp; Tracking</span>
                      </h4>
                      {shipment.status && (
                        <span
                          className={`font-extrabold uppercase px-2.5 py-0.5 rounded-full text-[10px] tracking-wider ${shipment.status === "delivered"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : shipment.status === "shipped" || shipment.status === "in_transit"
                              ? "bg-sky-100 text-sky-800 border border-sky-300"
                              : "bg-amber-100 text-amber-900 border border-amber-300"
                            }`}
                        >
                          {String(shipment.status).replace(/_/g, " ")}
                        </span>
                      )}
                    </div>

                    <div className="p-3.5 rounded-2xl bg-amber-50/40 border border-amber-200/70 text-xs text-stone-700 space-y-2.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {shipment.shipment_number && (
                          <div>
                            <span className="text-[10.5px] text-stone-400 block font-medium uppercase tracking-wider">
                              Shipment Number
                            </span>
                            <span className="font-bold text-stone-900 font-mono text-xs">
                              {shipment.shipment_number}
                            </span>
                          </div>
                        )}
                        {shipment.carrier && (
                          <div>
                            <span className="text-[10.5px] text-stone-400 block font-medium uppercase tracking-wider">
                              Carrier / Courier
                            </span>
                            <span className="font-bold text-stone-900">
                              {shipment.carrier}
                            </span>
                          </div>
                        )}
                        {shipment.tracking_number && (
                          <div>
                            <span className="text-[10.5px] text-stone-400 block font-medium uppercase tracking-wider">
                              AWB / Tracking Number
                            </span>
                            <span className="font-bold text-stone-900 font-mono text-xs">
                              {shipment.tracking_number}
                            </span>
                          </div>
                        )}
                        {(shipment.shipped_at || shipment.created_at) && (
                          <div>
                            <span className="text-[10.5px] text-stone-400 block font-medium uppercase tracking-wider">
                              {shipment.shipped_at ? "Shipped Date" : "Shipment Created"}
                            </span>
                            <span className="font-semibold text-stone-800">
                              {new Date(shipment.shipped_at || shipment.created_at).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        )}
                        {shipment.delivered_at && (
                          <div>
                            <span className="text-[10.5px] text-stone-400 block font-medium uppercase tracking-wider">
                              Delivered On
                            </span>
                            <span className="font-semibold text-emerald-700">
                              {new Date(shipment.delivered_at).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Live Tracking Link Button */}
                      {shipment.tracking_url && (
                        <div className="pt-2 border-t border-amber-200/50 flex items-center justify-between gap-2">
                          <span className="text-[11px] text-stone-500 font-medium">
                            Package Tracking
                          </span>
                          <a
                            href={
                              shipment.tracking_url.startsWith("http")
                                ? shipment.tracking_url
                                : `https://${shipment.tracking_url}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#700b10] hover:bg-[#54060b] text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer shadow-2xs"
                          >
                            <span>Track Package</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Price Breakdown */}
                <div className="border-t border-stone-100 pt-4 space-y-2 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal</span>
                    <span className="font-bold text-stone-800">
                      ₹{subtotalVal.toLocaleString("en-IN", { minimumFractionDigits: 0 })}
                    </span>
                  </div>

                  {discountVal > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Discount</span>
                      <span>- ₹{discountVal.toLocaleString("en-IN", { minimumFractionDigits: 0 })}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-stone-600">
                    <span>Shipping Charges</span>
                    <span className="font-bold text-stone-800">
                      {shippingVal > 0
                        ? `₹${shippingVal.toLocaleString("en-IN", { minimumFractionDigits: 0 })}`
                        : "FREE"}
                    </span>
                  </div>

                  {taxVal > 0 && (
                    <div className="flex justify-between text-stone-600">
                      <span>Estimated GST / Tax</span>
                      <span className="font-bold text-stone-800">
                        ₹{taxVal.toLocaleString("en-IN", { minimumFractionDigits: 0 })}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-base font-extrabold text-[#700b10] border-t border-stone-200 pt-2.5">
                    <span>Total Amount</span>
                    <span>₹{totalVal.toLocaleString("en-IN", { minimumFractionDigits: 0 })}</span>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-stone-50/80 border-t border-stone-100 flex items-center justify-between">
                <a
                  href={`https://wa.me/918999123868?text=Hello%20Nilkanth%20Store%2C%20I%20have%20an%20inquiry%20regarding%20my%20Order%20${encodeURIComponent(
                    displayOrderNumber
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 hover:text-emerald-800 text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>Need Help? Contact Support</span>
                </a>

                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-6 py-2.5 bg-[#700b10] hover:bg-[#54060b] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
