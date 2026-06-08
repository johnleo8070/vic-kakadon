"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (data.success) setCategories(data.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <span className="text-dark font-medium">Categories</span>
      </nav>

      <div className="text-center mb-12">
        <div className="gold-divider" />
        <h1 className="text-3xl md:text-4xl font-bold font-serif text-dark mb-4">Shop by Category</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">Browse our premium collections organized by category</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group relative overflow-hidden rounded-2xl h-72"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary-dark" />
              {cat.image && (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover mix-blend-overlay opacity-30 group-hover:scale-110 transition-transform duration-700"
                />
              )}
              <div className="relative h-full flex flex-col items-center justify-center text-white p-6">
                <span className="text-5xl font-bold font-serif mb-4">{cat.name[0]}</span>
                <h3 className="text-2xl font-bold font-serif mb-2">{cat.name}</h3>
                <p className="text-white/70 text-center text-sm mb-4">{cat.description}</p>
                <span className="inline-flex items-center gap-2 px-6 py-2 bg-white/20 rounded-full text-sm font-medium group-hover:bg-white/30 transition-colors">
                  Shop Now <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {categories.length === 0 && !loading && (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No categories found</p>
        </div>
      )}
    </div>
  );
}
