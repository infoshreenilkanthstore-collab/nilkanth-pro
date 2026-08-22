"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { User, MapPin, Package, LogOut, Plus, Pencil, Trash2, ChevronRight } from "lucide-react";

// Colors from screenshot
const GOLD = "#cda25e";
const SIDEBAR_ACTIVE = "#1a1a1a";

const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
    "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
    "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
    "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh"
];

const emptyAddress = {
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
};

// ─── Profile Tab ─────────────────────────────────────────────────────────────

function ProfileTab({ customerId, phone, setProfileName }) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchProfile = useCallback(() => {
        if (!customerId && !phone) {
            console.log("fetchProfile: No customerId or phone found in localStorage");
            setLoading(false);
            return;
        }
        const accessToken = localStorage.getItem("ns_accessToken");
        console.log("fetchProfile: Fetching for customerId:", customerId, "phone:", phone);
        const url = `/api/customer/profile?customerId=${customerId || ""}&phone=${phone || ""}&accessToken=${accessToken || ""}`;
        fetch(url)
            .then(r => r.json())




            .then(d => {
                if (d.success) {
                    setFirstName(d.firstName || "");
                    setLastName(d.lastName || "");
                    setEmail(d.email || "");
                    if (d.customerId) {
                        localStorage.setItem("ns_customerId", d.customerId);
                    }
                    if (setProfileName) {
                        setProfileName(`${d.firstName || ""} ${d.lastName || ""}`.trim());
                    }
                }
            })
            .finally(() => setLoading(false));
    }, [customerId, setProfileName]);


    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    async function handleSave(e) {
        e.preventDefault();
        setSaving(true);
        const accessToken = localStorage.getItem("ns_accessToken");
        try {
            const res = await fetch("/api/customer/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ customerId, firstName, lastName, accessToken })
            });

            const data = await res.json();
            if (data.success) {
                setIsEditing(false);
                if (setProfileName) {
                    setProfileName(`${firstName} ${lastName}`.trim());
                }
            } else {
                alert(data.error || "Failed to update profile");
            }

        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading profile...</div>;
    }

    return (
        <div className="bg-white border border-yellow-100/50 rounded-3xl shadow-sm p-6 md:p-10">
            <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                <h3 className="text-xl md:text-2xl font-nunito text-[#700b10] font-bold">Personal Details</h3>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-1.5 text-sm font-bold tracking-wider text-[#cda25e] hover:text-[#b88b48]"
                    >
                        <Pencil size={14} /> Edit
                    </button>
                )}
            </div>

            {isEditing ? (
                <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide">First Name</label>
                            <input
                                value={firstName}
                                onChange={e => setFirstName(e.target.value)}
                                className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#700b10]/20 focus:border-[#700b10] outline-none transition-all placeholder:text-gray-400 text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide">Last Name</label>
                            <input
                                value={lastName}
                                onChange={e => setLastName(e.target.value)}
                                className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#700b10]/20 focus:border-[#700b10] outline-none transition-all placeholder:text-gray-400 text-gray-900"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide">Email</label>
                            <input
                                value={email}
                                readOnly
                                className="w-full px-5 py-4 border border-gray-100 rounded-xl bg-gray-50 text-gray-500 text-sm cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide">Phone</label>
                            <input
                                value={phone}
                                readOnly
                                className="w-full px-5 py-4 border border-gray-100 rounded-xl bg-gray-50 text-gray-500 text-sm cursor-not-allowed"
                            />
                        </div>
                    </div>
                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-[#700b10] text-white px-8 py-3 rounded-xl font-bold tracking-wider shadow-lg shadow-[#700b10]/20 hover:bg-[#5a090d] transition-all transform active:scale-[0.98] disabled:opacity-50"
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                            type="button"
                            onClick={() => { setIsEditing(false); fetchProfile(); }}
                            className="border border-gray-200 rounded-xl text-gray-600 px-8 py-3 font-bold tracking-wider hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-6">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">First Name</p>
                        <p className="text-gray-900 font-medium text-[15px]">{firstName || "—"}</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Last Name</p>
                        <p className="text-gray-900 font-medium text-[15px]">{lastName || "—"}</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Email</p>
                        <p className="text-gray-900 font-medium text-[15px]">{email || "—"}</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Phone</p>
                        <p className="text-gray-900 font-medium text-[15px]">{phone || "—"}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Address Form ─────────────────────────────────────────────────────────────

function AddressForm({ initial = emptyAddress, onSave, onCancel, saving }) {
    const [form, setForm] = useState({ ...emptyAddress, ...initial });

    const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

    function handleSubmit(e) {
        e.preventDefault();
        onSave(form);
    }

    const inputCls = "w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#700b10]/20 focus:border-[#700b10] outline-none transition-all placeholder:text-gray-400 text-gray-900";
    const labelCls = "block text-xs font-bold text-gray-500 mb-1.5 pl-1";

    return (
        <form onSubmit={handleSubmit} className="bg-white border border-yellow-100/50 rounded-3xl shadow-sm p-6 md:p-10">
            <h3 className="text-xl md:text-2xl font-nunito text-[#700b10] font-bold mb-6 border-b border-gray-100 pb-4">
                {initial.address ? "Edit Address" : "New Address"}
            </h3>

            <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className={labelCls}>First Name</label>
                        <input required value={form.firstName} onChange={set("firstName")} className={inputCls} placeholder="First Name" />
                    </div>
                    <div>
                        <label className={labelCls}>Last Name</label>
                        <input required value={form.lastName} onChange={set("lastName")} className={inputCls} placeholder="Last Name" />
                    </div>
                </div>
                <div>
                    <label className={labelCls}>Phone Number</label>
                    <input required value={form.phone} onChange={set("phone")} maxLength={10} className={inputCls} placeholder="10-digit Phone Number" />
                </div>
                <div>
                    <label className={labelCls}>Address</label>
                    <input required value={form.address} onChange={set("address")} className={inputCls} placeholder="Complete Address (House No, Street, Area)" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                        <label className={labelCls}>City</label>
                        <input required value={form.city} onChange={set("city")} className={inputCls} placeholder="City" />
                    </div>
                    <div>
                        <label className={labelCls}>State</label>
                        <select required value={form.state} onChange={set("state")} className={`${inputCls} bg-white appearance-none`}>
                            <option value="">Select State</option>
                            {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={labelCls}>Pincode</label>
                        <input required value={form.pincode} onChange={set("pincode")} maxLength={6} className={inputCls} placeholder="Pincode" />
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-6">
                <button
                    type="submit"
                    disabled={saving}
                    className="bg-[#700b10] text-white px-8 py-3 rounded-xl font-bold tracking-wider shadow-lg shadow-[#700b10]/20 hover:bg-[#5a090d] transition-all transform active:scale-[0.98] disabled:opacity-50 text-center"
                >
                    {saving ? "Saving..." : "Save Address"}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="border border-gray-200 rounded-xl text-gray-600 px-8 py-3 font-bold tracking-wider hover:bg-gray-50 transition-colors text-center"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}

// ─── Addresses Tab ────────────────────────────────────────────────────────────

function AddressesTab({ customerId }) {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null); // This is still index for the UI loop
    const [saving, setSaving] = useState(false);

    const fetchAddresses = useCallback(async () => {
        if (!customerId || customerId === "null" || customerId === "undefined") return;

        setLoading(true);
        try {
            const token = localStorage.getItem("ns_accessToken");
            const res = await fetch(`/api/customer/addresses?customerId=${customerId}&accessToken=${token || ""}`);
            const data = await res.json();
            if (data.success) {
                setAddresses(data.addresses || []);
            }
        } finally {
            setLoading(false);
        }
    }, [customerId]);

    useEffect(() => { fetchAddresses(); }, [fetchAddresses]);

    async function handleAdd(address) {
        setSaving(true);
        try {
            const token = localStorage.getItem("ns_accessToken");
            const res = await fetch("/api/customer/addresses", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ customerId, address }),
            });
            const data = await res.json();
            if (data.success) {
                fetchAddresses(); // Refresh list to get IDs
                setShowForm(false);
            }
        } finally {
            setSaving(false);
        }
    }

    async function handleEdit(index, address) {
        setSaving(true);
        const addressId = addresses[index]?.id;
        try {
            const token = localStorage.getItem("ns_accessToken");
            const res = await fetch("/api/customer/addresses", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ customerId, addressId, address }),
            });
            const data = await res.json();
            if (data.success) {
                fetchAddresses();
                setEditingIndex(null);
            }
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(e, index) {
        e.stopPropagation();
        const addressId = addresses[index]?.id;
        if (!confirm("Delete this address?")) return;
        const token = localStorage.getItem("ns_accessToken");
        const res = await fetch("/api/customer/addresses", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ customerId, addressId }),
        });
        const data = await res.json();
        if (data.success) {
            fetchAddresses();
        }
    }

    async function handleSetDefault(e, index) {
        e.stopPropagation();
        const addressId = addresses[index]?.id;
        const token = localStorage.getItem("ns_accessToken");
        const res = await fetch("/api/customer/addresses", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ customerId, addressId, defaultIndex: index }),
        });
        const data = await res.json();
        if (data.success) fetchAddresses();
    }

    if (loading) return <div className="p-8 text-center text-gray-500">Loading addresses...</div>;

    if (showForm) {
        return <AddressForm onSave={handleAdd} onCancel={() => setShowForm(false)} saving={saving} />;
    }

    if (editingIndex !== null) {
        return (
            <AddressForm
                initial={addresses[editingIndex]}
                onSave={(updated) => handleEdit(editingIndex, updated)}
                onCancel={() => setEditingIndex(null)}
                saving={saving}
            />
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Add New Address Card */}
            <button
                onClick={() => setShowForm(true)}
                className="flex flex-col items-center justify-center min-h-[260px] border-[2px] border-dashed border-gray-300 hover:border-[#700b10] rounded-3xl bg-transparent hover:bg-red-50/50 transition-colors group"
            >
                <div className="w-12 h-12 rounded-full border border-gray-300 group-hover:border-[#700b10] flex items-center justify-center mb-3 text-gray-400 group-hover:text-[#700b10] transition-colors">
                    <Plus size={24} strokeWidth={1.5} />
                </div>
                <span className="text-sm font-bold text-gray-500 group-hover:text-[#700b10] transition-colors">
                    Add New Address
                </span>
            </button>

            {/* Address Cards */}
            {addresses.map((addr, i) => {
                const isDefault = addr.isDefault;
                return (
                    <div
                        key={addr.id || i}
                        className={`relative bg-white p-6 rounded-3xl flex flex-col items-start text-left shadow-sm ${isDefault ? 'border-2 border-[#700b10]' : 'border border-yellow-100/50 hover:border-gray-200'}`}
                    >
                        {isDefault && (
                            <div className="absolute top-0 right-0 bg-[#700b10] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-xl rounded-tr-3xl">
                                Default
                            </div>
                        )}


                        <p className="text-gray-900 font-bold text-[16px] mb-2">{[addr.firstName, addr.lastName].filter(Boolean).join(" ")}</p>

                        <div className="text-gray-500 text-[14px] leading-relaxed mb-4 flex-1">
                            <p>{addr.address}</p>
                            <p>{addr.city}, {addr.state}</p>
                            <p>Pincode: {addr.pincode}</p>
                            <p className="mt-2 text-gray-700 font-medium">{addr.phone}</p>
                        </div>

                        {/* Action links */}
                        <div className="flex items-center gap-4 mt-auto pt-4 border-t border-gray-100 w-full font-bold text-sm">
                            {!isDefault && (
                                <button
                                    onClick={(e) => handleSetDefault(e, i)}
                                    className="text-gray-400 hover:text-[#700b10] transition-colors"
                                    title="Set as Default"
                                >
                                    Set Default
                                </button>
                            )}
                            <div className="flex-1"></div>
                            <button
                                onClick={() => setEditingIndex(i)}
                                className="text-[#cda25e] hover:text-[#b88b48] transition-colors"
                                title="Edit"
                            >
                                Edit
                            </button>
                            <button
                                onClick={(e) => handleDelete(e, i)}
                                className="text-red-400 hover:text-red-600 transition-colors"
                                title="Delete"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// ─── Orders Tab ───────────────────────────────────────────────────────────────

function OrdersTab({ customerId, accessToken }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = accessToken || (typeof window !== "undefined" ? localStorage.getItem("ns_accessToken") : null);
        const cid = customerId || (typeof window !== "undefined" ? localStorage.getItem("ns_customerId") : null);

        if (!token && !cid) {
            setLoading(false);
            return;
        }

        setLoading(true);
        fetch(`/api/customer/orders?customerId=${cid || ""}&accessToken=${token || ""}`)
            .then(r => r.json())
            .then(d => {
                if (d.success) setOrders(d.orders || []);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [customerId, accessToken]);


    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading orders...</div>;

    if (orders.length === 0) {
        return (
            <div className="bg-white border border-yellow-100/50 shadow-sm rounded-3xl p-12 text-center text-gray-500">
                <Package size={48} className="mx-auto mb-4 text-[#cda25e]/30" strokeWidth={1} />
                <p className="text-lg font-nunito">You haven't placed any orders yet.</p>
                <p className="text-sm mt-2">When you do, they will appear here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h3 className="text-xl md:text-2xl font-nunito text-[#700b10] font-bold mb-6 border-b border-gray-100 pb-4">Order History</h3>
            {orders.map((order) => (
                <div 
                    key={order.id} 
                    className="bg-white border border-yellow-100/50 hover:border-[#cda25e]/60 shadow-sm hover:shadow-md transition-all rounded-3xl p-6 md:p-8 relative group"
                >
                    <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-gray-100 pb-4 mb-4 gap-4 md:gap-0">
                        <div>
                            <Link href={`/profile/orders/${order.id}`} className="hover:underline">
                                <p className="font-bold text-gray-900 text-lg mb-1 hidden md:block group-hover:text-[#700b10] transition-colors">
                                    Order {order.orderNumber}
                                </p>
                                <p className="font-bold text-gray-900 text-lg mb-1 md:hidden group-hover:text-[#700b10] transition-colors">
                                    Order <br />{order.orderNumber}
                                </p>
                            </Link>
                            <p className="text-xs font-medium text-gray-500">
                                Placed on {formatDate(order.createdAt)}
                            </p>
                        </div>
                        <div className="text-left md:text-right">
                            <p className="font-bold text-[#700b10] text-xl md:text-2xl mb-2 font-nunito">
                                {order.currency === 'INR' ? '₹' : order.currency}{order.totalPrice}
                            </p>
                            <div className="flex items-center gap-2 md:justify-end text-[10px] md:text-xs font-bold uppercase tracking-wider">
                                <span className={`px-2 py-1 rounded bg-gray-100 text-gray-600`}>
                                    {order.financialStatus === 'paid' ? 'Paid' : order.financialStatus}
                                </span>
                                <span className={`px-2 py-1 rounded ${order.fulfillmentStatus === 'fulfilled' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                                    {order.fulfillmentStatus}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-2 pb-3">
                        {order.items?.map((item, idx) => (
                            <div key={item.id || idx} className="flex justify-between items-center text-sm md:text-base gap-4">
                                <div className="flex items-center gap-3">
                                    {item.productImage || item.imageUrl ? (
                                        <img 
                                            src={item.productImage || item.imageUrl} 
                                            alt={item.title} 
                                            className="w-12 h-12 object-cover rounded-xl border border-gray-100 bg-gray-50 shrink-0" 
                                        />
                                    ) : (
                                        <span className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center text-gray-400 font-bold text-xs shrink-0">{item.quantity}x</span>
                                    )}
                                    <div>
                                        <p className="text-gray-800 font-medium">{item.title}</p>
                                        <p className="text-xs text-gray-400 font-normal">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                                <p className="text-gray-900 font-bold shrink-0">
                                    {order.currency === 'INR' ? '₹' : order.currency}{item.price}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="pt-3 mt-2 border-t border-gray-100 flex justify-end">
                        <Link
                            href={`/profile/orders/${order.id}`}
                            className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#700b10] hover:text-[#5a090d] group-hover:translate-x-0.5 transition-transform"
                        >
                            View Order Details <ChevronRight size={14} />
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─── Main Profile Component ───────────────────────────────────────────────────

export default function Profile() {
    const [phone, setPhone] = useState("");
    const [customerId, setCustomerId] = useState(null);
    const [activeTab, setActiveTab] = useState("MY PROFILE");
    const [profileName, setProfileName] = useState("");
    const [accessToken, setAccessToken] = useState(null);

    // For sidebar display
    const initials = useMemo(() => {
        if (!profileName) return "BP";
        const parts = profileName.split(" ").filter(Boolean);
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }, [profileName]);

    useEffect(() => {
        const storedId = localStorage.getItem("ns_customerId");
        const storedPhone = localStorage.getItem("ns_userPhone");
        const storedAccessToken = localStorage.getItem("ns_accessToken");

        setPhone(storedPhone || "");
        setCustomerId(storedId || null);
        setAccessToken(storedAccessToken || null);

        // Fetch name for the sidebar
        if (storedId || storedPhone || storedAccessToken) {
            const url = `/api/customer/profile?customerId=${storedId || ""}&phone=${storedPhone || ""}&accessToken=${storedAccessToken || ""}`;
            fetch(url)
                .then(r => r.json())
                .then(d => {
                    if (d.success) {
                        setProfileName([d.firstName, d.lastName].filter(Boolean).join(" "));
                    }
                });
        }

    }, []);


    function logout() {
        localStorage.removeItem("ns_userPhone");
        localStorage.removeItem("ns_customerId");
        localStorage.removeItem("ns_accessToken");
        window.location.href = "/";
    }

    const TABS = [
        { id: "MY PROFILE", icon: User },
        { id: "ORDER HISTORY", icon: Package },
        { id: "DELIVERY ADDRESSES", icon: MapPin }
    ];

    return (
        <div className="min-h-screen bg-[#FDFBF7] py-8 md:py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">

                <h1 className="text-3xl md:text-4xl font-nunito font-bold text-[#700b10] mb-8 text-center md:text-left">
                    My Account
                </h1>

                <div className="flex flex-col md:flex-row gap-8 items-start">

                    {/* ─── Sidebar ─── */}
                    <div className="w-full md:w-[280px] shrink-0 space-y-6">
                        {/* User Card */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-yellow-100/50 flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-[#700b10] text-[#FDFBF7] flex items-center justify-center text-xl font-nunito font-bold shadow-inner">
                                {initials}
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-lg leading-tight">{profileName || phone || "Member"}</p>
                                <p className="text-[10px] font-bold text-[#cda25e] uppercase tracking-widest mt-1">
                                    Bhagvat Member
                                </p>
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="bg-white py-4 rounded-3xl shadow-sm border border-yellow-100/50 flex flex-col overflow-hidden">
                            {TABS.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-3 sm:gap-4 px-4 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all relative ${isActive
                                            ? "text-[#700b10] bg-red-50/50"
                                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                                            }`}
                                    >
                                        {isActive && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#700b10] rounded-r-full" />}
                                        <Icon size={18} className={isActive ? "text-[#700b10]" : "text-gray-400"} />
                                        {tab.id}
                                    </button>
                                );
                            })}

                            <div className="my-2 border-t border-gray-100 mx-4 sm:mx-6"></div>

                            <button
                                onClick={logout}
                                className="flex items-center gap-3 sm:gap-4 px-4 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                            >
                                <LogOut size={18} />
                                Sign Out
                            </button>
                        </div>
                    </div>

                    {/* ─── Main Content Area ─── */}
                    <div className="flex-1 w-full relative">
                        {activeTab === "MY PROFILE" && (
                            <ProfileTab customerId={customerId} phone={phone} accessToken={accessToken} setProfileName={setProfileName} />
                        )}

                        {activeTab === "DELIVERY ADDRESSES" && (
                            <AddressesTab customerId={customerId} />
                        )}
                        {activeTab === "ORDER HISTORY" && (
                            <OrdersTab customerId={customerId} accessToken={accessToken} />
                        )}
                    </div>


                </div>
            </div>
        </div>
    );
}