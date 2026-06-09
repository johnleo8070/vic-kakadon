"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Plus, Edit, Trash2, Eye, ChevronLeft, ChevronRight, Upload, X } from "lucide-react";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import AdminShell from "@/components/admin/AdminShell";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  createdAt: string;
}

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: "", slug: "", description: "", image: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAdminAuthenticated()) { router.push("/admin/login"); return; }
    fetchCategories();
  }, [router]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success) setCategories(data.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingCategory ? `/api/categories/${editingCategory.id}` : "/api/categories";
      const method = editingCategory ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        fetchCategories();
        setShowForm(false);
        setEditingCategory(null);
        setFormData({ name: "", slug: "", description: "", image: "" });
      }
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(`/api/categories/${slug}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchCategories();
    } catch (e) { console.error(e); }
  };

  const startEdit = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({ name: cat.name, slug: cat.slug, description: cat.description || "", image: cat.image || "" });
    setShowForm(true);
  };

  const filteredCategories = categories.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <AdminShell>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold font-serif text-dark">Categories Management</h1>
              <p className="text-gray-500">{categories.length} categories</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setShowForm(true); setEditingCategory(null); setFormData({ name: "", slug: "", description: "", image: "" }); }} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium shadow-sm hover:bg-primary-dark">
                <Plus className="w-4 h-4" /> Add Category
              </button>
              <Link href="/admin" className="px-4 py-2 bg-white rounded-lg text-sm font-medium shadow-sm hover:shadow-md">← Back</Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input-field pl-10" placeholder="Search categories..." />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Name</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Slug</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Description</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Created</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="text-center py-12"><div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto" /></td></tr>
                ) : filteredCategories.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-12 text-gray-500">No categories found</td></tr>
                ) : (
                  filteredCategories.map((cat) => (
                    <tr key={cat.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium">{cat.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{cat.slug}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{cat.description}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{new Date(cat.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => startEdit(cat)} className="p-1 hover:bg-gray-100 rounded"><Edit className="w-4 h-4 text-blue-500" /></button>
                          <button onClick={() => handleDelete(cat.slug)} className="p-1 hover:bg-gray-100 rounded"><Trash2 className="w-4 h-4 text-red-500" /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

      {/* Category Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold font-serif">{editingCategory ? "Edit Category" : "Add Category"}</h2>
              <button onClick={() => { setShowForm(false); setEditingCategory(null); }} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
                <input value={formData.name} onChange={(e) => setFormData((d) => ({ ...d, name: e.target.value }))} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug <span className="text-red-500">*</span></label>
                <input value={formData.slug} onChange={(e) => setFormData((d) => ({ ...d, slug: e.target.value }))} className="input-field" required placeholder="e.g., watches" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData((d) => ({ ...d, description: e.target.value }))} className="input-field" rows={3} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input value={formData.image} onChange={(e) => setFormData((d) => ({ ...d, image: e.target.value }))} className="input-field" placeholder="/images/categories/watches.jpg" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-50">
                  {saving ? "Saving..." : editingCategory ? "Update" : "Create"}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditingCategory(null); }} className="px-6 py-3 border rounded-lg hover:bg-gray-50">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
