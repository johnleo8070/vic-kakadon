"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2, KeyRound, X, ShieldCheck, UserPlus } from "lucide-react";
import { isAdminAuthenticated, getAdminAuth, adminFetch, clearAdminAuth } from "@/lib/adminAuth";
import { showToast } from "@/components/Toast";
import AdminShell from "@/components/admin/AdminShell";

interface AdminUser {
  id: number;
  username: string;
  role: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ username: "", password: "", role: "admin" });
  const [pwModal, setPwModal] = useState<AdminUser | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [currentUser, setCurrentUser] = useState<{ username: string } | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdminAuthenticated()) { router.push("/admin/login"); return; }
    setCurrentUser(getAdminAuth());
    fetchAdmins();
  }, [router]);

  const fetchAdmins = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await adminFetch("/api/admin/users");
      const data = await res.json();
      if (res.status === 401) {
        clearAdminAuth();
        router.push("/admin/login");
        return;
      }
      if (data.success) {
        setAdmins(Array.isArray(data.data) ? data.data : []);
      } else {
        setLoadError(data.error || "Failed to load admins");
        showToast("error", data.error || "Failed to load admins");
      }
    } catch {
      setLoadError("Failed to load admins");
      showToast("error", "Failed to load admins");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await adminFetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", "Admin account created");
        setShowForm(false);
        setForm({ username: "", password: "", role: "admin" });
        fetchAdmins();
      } else {
        showToast("error", data.error || "Failed to create admin");
      }
    } catch { showToast("error", "Failed to create admin"); }
    finally { setSaving(false); }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pwModal) return;
    setSaving(true);
    try {
      const res = await adminFetch(`/api/admin/users/${pwModal.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", "Password updated");
        setPwModal(null);
        setNewPassword("");
      } else {
        showToast("error", data.error || "Failed to update password");
      }
    } catch { showToast("error", "Failed to update password"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (admin: AdminUser) => {
    if (!confirm(`Delete admin "${admin.username}"? This cannot be undone.`)) return;
    try {
      const res = await adminFetch(`/api/admin/users/${admin.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("success", "Admin deleted");
        fetchAdmins();
      } else {
        showToast("error", data.error || "Failed to delete admin");
      }
    } catch { showToast("error", "Failed to delete admin"); }
  };

  return (
    <AdminShell>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold font-serif text-dark flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-primary" /> Admin Accounts
              </h1>
              <p className="text-gray-500">{admins.length} admin{admins.length !== 1 ? "s" : ""}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setShowForm(true); setForm({ username: "", password: "", role: "admin" }); }} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium shadow-sm hover:bg-primary-dark">
                <UserPlus className="w-4 h-4" /> Add Admin
              </button>
              <Link href="/admin" className="px-4 py-2 bg-white rounded-lg text-sm font-medium shadow-sm hover:shadow-md">← Back</Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Username / Email</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Role</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Created</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} className="text-center py-12"><div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto" /></td></tr>
                ) : loadError ? (
                  <tr><td colSpan={4} className="text-center py-12 text-red-500">{loadError}</td></tr>
                ) : admins.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-12 text-gray-500">No admins found</td></tr>
                ) : (
                  admins.map((a) => (
                    <tr key={a.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{a.username}</span>
                          {currentUser?.username === a.username && (
                            <span className="badge bg-green-100 text-green-700 text-xs">You</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="badge bg-primary/10 text-primary text-xs capitalize">{a.role}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => { setPwModal(a); setNewPassword(""); }} className="p-1.5 hover:bg-gray-100 rounded" title="Change password">
                            <KeyRound className="w-4 h-4 text-blue-500" />
                          </button>
                          <button onClick={() => handleDelete(a)} className="p-1.5 hover:bg-gray-100 rounded" title="Delete admin">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            </div>
          </div>

          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
            <strong>Tip:</strong> New admins sign in at <span className="font-mono">/admin/login</span> using the username/email and password you set here. The last remaining admin cannot be deleted.
          </div>

      {/* Add Admin Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold font-serif">Add New Admin</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username / Email <span className="text-red-500">*</span></label>
                <input value={form.username} onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))} className="input-field" required placeholder="newadmin@kakadon.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password <span className="text-red-500">*</span></label>
                <input type="text" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} className="input-field" required placeholder="At least 6 characters" minLength={6} />
                <p className="text-xs text-gray-400 mt-1">Share this password securely with the new admin.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} className="input-field">
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-50">{saving ? "Creating..." : "Create Admin"}</button>
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 border rounded-lg hover:bg-gray-50">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {pwModal && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold font-serif">Change Password</h2>
              <button onClick={() => setPwModal(null)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleChangePassword} className="p-6 space-y-4">
              <p className="text-sm text-gray-600">Set a new password for <strong>{pwModal.username}</strong>.</p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password <span className="text-red-500">*</span></label>
                <input type="text" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input-field" required placeholder="At least 6 characters" minLength={6} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-50">{saving ? "Updating..." : "Update Password"}</button>
                <button type="button" onClick={() => setPwModal(null)} className="px-6 py-3 border rounded-lg hover:bg-gray-50">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
