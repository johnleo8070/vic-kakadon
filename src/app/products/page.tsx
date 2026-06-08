"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Star, Filter, SlidersHorizontal, ArrowUpDown, X } from "lucide-react";
import { ProductCardSkeleton } from "@/components/LoadingSkeleton";
import { formatPrice } from "@/lib/utils";

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  categoryId: number | null;
  images: string[] | null;
  sizes: string[] | null;
  colors: string[] | null;
  stockQuantity: number | null;
  availablePieces: number | null;
  isAvailable: boolean | null;
  isFeatured: boolean | null;
  isNew: boolean | null;
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 });

  const fetchProducts = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory) params.set("category", selectedCategory);
    if (searchQuery) params.set("search", searchQuery);
    if (priceRange.min) params.set("minPrice", priceRange.min);
    if (priceRange.max) params.set("maxPrice", priceRange.max);
    params.set("sortBy", sortBy);
    params.set("page", pagination.page.toString());
    params.set("limit", pagination.limit.toString());

    try {
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
        setPagination(data.pagination);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success) setCategories(data.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery, priceRange, sortBy, pagination.page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((p) => ({ ...p, page: 1 }));
    fetchProducts();
  };

  const handlePriceChange = () => {
    setPagination((p) => ({ ...p, page: 1 }));
    fetchProducts();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <span className="text-dark font-medium">Products</span>
        {selectedCategory && (
          <>
            <span>/</span>
            <span className="text-primary">{categories.find((c) => c.slug === selectedCategory)?.name}</span>
          </>
        )}
      </nav>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-serif text-dark">
            {selectedCategory ? categories.find((c) => c.slug === selectedCategory)?.name : "All Products"}
          </h1>
          <p className="text-gray-500 mt-1">{pagination.total} products found</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowFilters(!showFilters)} className="md:hidden flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-gray-500" />
            <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPagination((p) => ({ ...p, page: 1 })); }} className="px-3 py-2 border rounded-lg text-sm bg-white">
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        <aside className={`w-64 flex-shrink-0 ${showFilters ? "block" : "hidden"} md:block`}>
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-32 space-y-6">
            <div>
              <h3 className="font-semibold text-dark mb-3 flex items-center gap-2"><Filter className="w-4 h-4" /> Search</h3>
              <form onSubmit={handleSearch}>
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search products..." className="input-field text-sm" />
              </form>
            </div>
            <div>
              <h3 className="font-semibold text-dark mb-3">Categories</h3>
              <div className="space-y-2">
                <button onClick={() => { setSelectedCategory(""); setPagination((p) => ({ ...p, page: 1 })); }} className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!selectedCategory ? "bg-primary text-white" : "hover:bg-gray-100 text-gray-700"}`}>All Categories</button>
                {categories.map((cat) => (
                  <button key={cat.id} onClick={() => { setSelectedCategory(cat.slug); setPagination((p) => ({ ...p, page: 1 })); }} className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === cat.slug ? "bg-primary text-white" : "hover:bg-gray-100 text-gray-700"}`}>{cat.name}</button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-dark mb-3">Price Range</h3>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" value={priceRange.min} onChange={(e) => setPriceRange((r) => ({ ...r, min: e.target.value }))} className="input-field text-sm" />
                <input type="number" placeholder="Max" value={priceRange.max} onChange={(e) => setPriceRange((r) => ({ ...r, max: e.target.value }))} className="input-field text-sm" />
              </div>
              <button onClick={handlePriceChange} className="btn-primary w-full mt-2 text-sm py-2">Apply</button>
            </div>
            {(selectedCategory || searchQuery || priceRange.min || priceRange.max) && (
              <button onClick={() => { setSelectedCategory(""); setSearchQuery(""); setPriceRange({ min: "", max: "" }); setPagination((p) => ({ ...p, page: 1 })); }} className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700">
                <X className="w-4 h-4" /> Clear all filters
              </button>
            )}
          </div>
        </aside>

        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No products found</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {products.map((product) => (
                  <Link key={product.id} href={`/products/${product.slug}`} className="group card">
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <Image src={product.images?.[0] || "/images/placeholder.jpg"} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" unoptimized />
                      {product.isNew && <span className="absolute top-3 left-3 badge bg-green-500 text-white">NEW</span>}
                      {product.isFeatured && <span className="absolute top-3 right-3 badge bg-gold text-dark"><Star className="w-3 h-3 inline mr-1" />FEATURED</span>}
                      {product.stockQuantity !== null && product.stockQuantity !== undefined && product.stockQuantity <= 5 && product.stockQuantity > 0 && (
                        <div className="absolute bottom-3 left-3"><span className="badge bg-red-500 text-white">Only {product.stockQuantity} left!</span></div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-dark group-hover:text-primary transition-colors truncate">{product.name}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => <Star key={star} className="w-3 h-3 text-gold fill-gold" />)}
                      </div>
                      <p className="text-primary font-bold text-lg mt-2">{formatPrice(product.price)}</p>
                    </div>
                  </Link>
                ))}
              </div>
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button onClick={() => setPagination((p) => ({ ...p, page: Math.max(1, p.page - 1) }))} disabled={pagination.page === 1} className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50">Previous</button>
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <button key={page} onClick={() => setPagination((p) => ({ ...p, page }))} className={`w-10 h-10 rounded-lg font-medium ${pagination.page === page ? "bg-primary text-white" : "border hover:bg-gray-50"}`}>{page}</button>
                  ))}
                  <button onClick={() => setPagination((p) => ({ ...p, page: Math.min(p.totalPages, p.page + 1) }))} disabled={pagination.page === pagination.totalPages} className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50">Next</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
