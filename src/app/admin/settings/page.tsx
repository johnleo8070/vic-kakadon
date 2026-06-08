"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Save, LogOut, Crown } from "lucide-react";
import { showToast } from "@/components/Toast";
import { isAdminAuthenticated, clearAdminAuth } from "@/lib/adminAuth";

export default function AdminSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const bankFields = [
    { key: "bank_name", label: "Bank Name" },
    { key: "account_name", label: "Account Name" },
    { key: "account_number", label: "Account Number" },
    { key: "routing_number", label: "Sort Code" },
    { key: "swift_code", label: "SWIFT Code" },
    { key: "bank_address", label: "Bank Address" },
  ];

  useEffect(() => {
    if (!isAdminAuthenticated()) { router.push("/admin/login"); return; }
    fetchSettings();
  }, [router]);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.success) setSettings(data.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSave = async (key: string, value: string) => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", "Setting saved!");
        fetchSettings();
      }
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const handleLogout = () => {
    clearAdminAuth();
    window.location.href = "/admin/login";
  };

  const handleSeed = async () => {
    if (!confirm("This will seed the database with sample data. Continue?")) return;
    try {
      const res = await fetch("/api/admin/seed", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        showToast("success", "Database seeded successfully!");
      } else {
        showToast("error", data.error || "Seeding failed");
      }
    } catch (e) { console.error(e); }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <aside className="w-64 bg-dark text-white min-h-screen fixed left-0 top-0">
          <div className="p-6 border-b border-white/10">
            <div className="flex flex-col">
              <Image src="/images/logo.png" alt="Kakadon Logo" width={150} height={50} className="object-contain bg-white/90 p-2 rounded-lg" priority />
              <p className="text-xs text-gray-400 mt-2">Admin Panel</p>
            </div>
          </div>
          <nav className="p-4 space-y-1">
            {[
              { href: "/admin", label: "Dashboard", icon: "📊" },
              { href: "/admin/orders", label: "Orders", icon: "📦" },
              { href: "/admin/products", label: "Products", icon: "🏷️" },
              { href: "/admin/categories", label: "Categories", icon: "📂" },
              { href: "/admin/admins", label: "Admins", icon: "👤" },
              { href: "/admin/settings", label: "Settings", icon: "⚙️" },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
                <span>{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        <main className="ml-64 flex-1 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold font-serif text-dark">Settings</h1>
              <p className="text-gray-500">Manage your store settings</p>
            </div>
            <div className="flex gap-3">
              <button onClick={handleSeed} className="px-4 py-2 bg-gold text-dark rounded-lg text-sm font-medium shadow-sm hover:bg-gold-dark">
                <Crown className="w-4 h-4 inline mr-1" /> Seed Database
              </button>
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium shadow-sm hover:bg-red-600">
                <LogOut className="w-4 h-4" /> Logout
              </button>
              <Link href="/admin" className="px-4 py-2 bg-white rounded-lg text-sm font-medium shadow-sm hover:shadow-md">← Back</Link>
            </div>
          </div>

          <div className="grid gap-6">
            {/* Bank Details */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold font-serif mb-6">Bank Account Details</h2>
              {loading ? (
                <div className="space-y-4 animate-pulse">
                  {bankFields.map((_, i) => <div key={i} className="h-12 bg-gray-200 rounded-lg" />)}
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {bankFields.map((field) => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                      <input
                        value={settings[field.key] || ""}
                        onChange={(e) => setSettings((s) => ({ ...s, [field.key]: e.target.value }))}
                        onBlur={(e) => handleSave(field.key, e.target.value)}
                        className="input-field"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Delivery Message */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold font-serif mb-4">Delivery Message</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer-Facing Message</label>
                <textarea
                  value={settings["delivery_message"] || ""}
                  onChange={(e) => setSettings((s) => ({ ...s, delivery_message: e.target.value }))}
                  onBlur={(e) => handleSave("delivery_message", e.target.value)}
                  className="input-field"
                  rows={3}
                />
                <p className="text-xs text-gray-400 mt-2">This message is shown on the checkout page</p>
              </div>
            </div>

            {/* Store Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold font-serif mb-4">Store Information</h2>
              {loading ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-12 bg-gray-200 rounded-lg" />
                  <div className="h-12 bg-gray-200 rounded-lg" />
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                    <input
                      value={settings["store_name"] || ""}
                      onChange={(e) => setSettings((s) => ({ ...s, store_name: e.target.value }))}
                      onBlur={(e) => handleSave("store_name", e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      value={settings["store_email"] || ""}
                      onChange={(e) => setSettings((s) => ({ ...s, store_email: e.target.value }))}
                      onBlur={(e) => handleSave("store_email", e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      value={settings["store_phone"] || ""}
                      onChange={(e) => setSettings((s) => ({ ...s, store_phone: e.target.value }))}
                      onBlur={(e) => handleSave("store_phone", e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      value={settings["store_address"] || ""}
                      onChange={(e) => setSettings((s) => ({ ...s, store_address: e.target.value }))}
                      onBlur={(e) => handleSave("store_address", e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Specialties & Services</label>
                    <input
                      value={settings["store_services"] || ""}
                      onChange={(e) => setSettings((s) => ({ ...s, store_services: e.target.value }))}
                      onBlur={(e) => handleSave("store_services", e.target.value)}
                      placeholder="e.g. Online classes, Online booking, In-store pickup, In-person classes, Delivery, In-store shopping"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Areas Served</label>
                    <input
                      value={settings["store_areas_served"] || ""}
                      onChange={(e) => setSettings((s) => ({ ...s, store_areas_served: e.target.value }))}
                      onBlur={(e) => handleSave("store_areas_served", e.target.value)}
                      placeholder="e.g. Lagos State, Onicha, Nigeria, Aba, Nigeria"
                      className="input-field"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
