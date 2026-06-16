"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, Plus, Edit, Trash2, Eye, X, Upload, ChevronLeft, ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { showToast } from "@/components/Toast";
import AdminShell from "@/components/admin/AdminShell";

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  categoryId: number | null;
  images: string[];
  sizes: string[];
  colors: string[];
  stockQuantity: number;
  availablePieces: number;
  isAvailable: boolean;
  isFeatured: boolean;
  isNew: boolean;
}

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    name: "", slug: "", description: "", price: "", categoryId: "", sizes: "", colors: "", stockQuantity: "", availablePieces: "", isAvailable: true, isFeatured: false, isNew: false
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        if (file.size > 5 * 1024 * 1024) {
          showToast("error", `${file.name} is larger than 5MB`);
          continue;
        }
        const fd = new FormData();
        fd.append("file", file);
        fd.append("type", "product");
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (data.success) {
          uploaded.push(data.data.url);
        } else {
          showToast("error", data.error || "Upload failed");
        }
      }
      if (uploaded.length > 0) {
        setImages((prev) => [...prev, ...uploaded]);
        showToast("success", `${uploaded.length} image(s) uploaded`);
      }
    } catch {
      showToast("error", "Image upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (url: string) => {
    setImages((prev) => prev.filter((img) => img !== url));
  };

  useEffect(() => {
    if (!isAdminAuthenticated()) { router.push("/admin/login"); return; }
    fetchProducts();
    fetchCategories();
  }, [router]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products?limit=10000");
      const data = await res.json();
      if (data.success) setProducts(data.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success) setCategories(data.data);
    } catch (e) { console.error(e); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingProduct ? `/api/products/${editingProduct.slug}` : "/api/products";
      const method = editingProduct ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          images,
          categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
          sizes: formData.sizes.split(",").map(s => s.trim()).filter(Boolean),
          colors: formData.colors.split(",").map(c => c.trim()).filter(Boolean),
          stockQuantity: parseInt(formData.stockQuantity) || 0,
          availablePieces: parseInt(formData.availablePieces) || 0,
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchProducts();
        setShowForm(false);
        setEditingProduct(null);
        resetForm();
      }
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const resetForm = () => {
    setFormData({ name: "", slug: "", description: "", price: "", categoryId: "", sizes: "", colors: "", stockQuantity: "", availablePieces: "", isAvailable: true, isFeatured: false, isNew: false });
    setImages([]);
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/products/${slug}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchProducts();
    } catch (e) { console.error(e); }
  };

  const startEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name, slug: p.slug, description: p.description || "", price: p.price,
      categoryId: p.categoryId?.toString() || "", sizes: (p.sizes || []).join(", "),
      colors: (p.colors || []).join(", "), stockQuantity: p.stockQuantity?.toString() || "0",
      availablePieces: p.availablePieces?.toString() || "0", isAvailable: p.isAvailable || true,
      isFeatured: p.isFeatured || false, isNew: p.isNew || false
    });
    setImages(p.images || []);
    setShowForm(true);
  };

  const filteredProducts = products.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const currentProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <AdminShell>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold font-serif text-dark">Products Management</h1>
              <p className="text-gray-500">{products.length} products</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setShowForm(true); setEditingProduct(null); resetForm(); }} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium shadow-sm hover:bg-primary-dark">
                <Plus className="w-4 h-4" /> Add Product
              </button>
              <Link href="/admin" className="px-4 py-2 bg-white rounded-lg text-sm font-medium shadow-sm hover:shadow-md">← Back</Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={searchQuery} onChange={handleSearchChange} className="input-field pl-10" placeholder="Search products..." />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Product</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Price</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Stock</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Status</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={5} className="text-center py-12"><div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto" /></td></tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-12 text-gray-500">No products found</td></tr>
                  ) : (
                    currentProducts.map((p) => (
                      <tr key={p.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              <img src={p.images?.[0] || "/images/placeholder.jpg"} alt={p.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{p.name}</p>
                              <p className="text-xs text-gray-500">{p.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">{formatPrice(p.price)}</td>
                        <td className="px-6 py-4 text-sm">{p.stockQuantity} / {p.availablePieces}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            {p.isAvailable ? <span className="badge bg-green-100 text-green-700 text-xs">Active</span> : <span className="badge bg-red-100 text-red-700 text-xs">Inactive</span>}
                            {p.isFeatured && <span className="badge bg-gold text-dark text-xs">Featured</span>}
                            {p.isNew && <span className="badge bg-blue-100 text-blue-700 text-xs">New</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Link href={`/products/${p.slug}`} target="_blank" className="p-1 hover:bg-gray-100 rounded"><Eye className="w-4 h-4 text-gray-500" /></Link>
                            <button onClick={() => startEdit(p)} className="p-1 hover:bg-gray-100 rounded"><Edit className="w-4 h-4 text-blue-500" /></button>
                            <button onClick={() => handleDelete(p.slug)} className="p-1 hover:bg-gray-100 rounded"><Trash2 className="w-4 h-4 text-red-500" /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            {!loading && filteredProducts.length > 0 && (
              <div className="p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Rows per page:</span>
                  <select 
                    value={itemsPerPage} 
                    onChange={handleItemsPerPageChange}
                    className="border border-gray-300 rounded-md text-sm py-1.5 pl-2 pr-8 focus:ring-primary focus:border-primary"
                  >
                    {[10, 20, 50, 100, 200, 500].map(n => (
                      <option key={n} value={n}>{n} / page</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">
                    Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredProducts.length)} to {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} entries
                  </span>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-xl font-bold font-serif">{editingProduct ? "Edit Product" : "Add Product"}</h2>
              <button onClick={() => { setShowForm(false); setEditingProduct(null); }} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
                  <input value={formData.name} onChange={(e) => setFormData((d) => ({ ...d, name: e.target.value }))} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug <span className="text-red-500">*</span></label>
                  <input value={formData.slug} onChange={(e) => setFormData((d) => ({ ...d, slug: e.target.value }))} className="input-field" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData((d) => ({ ...d, description: e.target.value }))} className="input-field" rows={3} />
              </div>

              {/* Product Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Images</label>
                <div className="flex flex-wrap gap-3 mb-3">
                  {images.map((img, i) => (
                    <div key={img} className="relative group w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                      <img src={img} alt={`Product ${i + 1}`} className="w-full h-full object-cover" />
                      {i === 0 && (
                        <span className="absolute top-1 left-1 bg-primary text-white text-[10px] px-1.5 py-0.5 rounded">Main</span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(img)}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <label className={`w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                    {uploading ? (
                      <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full" />
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-gray-400" />
                        <span className="text-[10px] text-gray-400 mt-1 text-center">Upload</span>
                      </>
                    )}
                  </label>
                </div>
                <p className="text-xs text-gray-400">First image is the main image shown to customers. PNG/JPG up to 5MB each. You can select multiple files.</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price <span className="text-red-500">*</span></label>
                  <input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData((d) => ({ ...d, price: e.target.value }))} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={formData.categoryId} onChange={(e) => setFormData((d) => ({ ...d, categoryId: e.target.value }))} className="input-field">
                    <option value="">No Category</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sizes (comma-separated)</label>
                  <input value={formData.sizes} onChange={(e) => setFormData((d) => ({ ...d, sizes: e.target.value }))} className="input-field" placeholder="S, M, L, XL" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Colors (comma-separated)</label>
                  <input value={formData.colors} onChange={(e) => setFormData((d) => ({ ...d, colors: e.target.value }))} className="input-field" placeholder="Black, White, Blue" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                  <input type="number" value={formData.stockQuantity} onChange={(e) => setFormData((d) => ({ ...d, stockQuantity: e.target.value }))} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Available Pieces</label>
                  <input type="number" value={formData.availablePieces} onChange={(e) => setFormData((d) => ({ ...d, availablePieces: e.target.value }))} className="input-field" />
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={formData.isAvailable} onChange={(e) => setFormData((d) => ({ ...d, isAvailable: e.target.checked }))} />
                  Available
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData((d) => ({ ...d, isFeatured: e.target.checked }))} />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={formData.isNew} onChange={(e) => setFormData((d) => ({ ...d, isNew: e.target.checked }))} />
                  New Arrival
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-50">{saving ? "Saving..." : editingProduct ? "Update" : "Create"}</button>
                <button type="button" onClick={() => { setShowForm(false); setEditingProduct(null); }} className="px-6 py-3 border rounded-lg hover:bg-gray-50">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}