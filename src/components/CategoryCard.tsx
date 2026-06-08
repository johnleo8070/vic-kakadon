"use client";

import Link from "next/link";
import Image from "next/image";

interface CategoryCardProps {
  category: {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
  };
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/products?category=${category.slug}`} className="group relative overflow-hidden rounded-2xl aspect-square">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary-dark/90" />
      {category.image && (
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover mix-blend-overlay opacity-50 group-hover:scale-110 transition-transform duration-700"
        />
      )}
      <div className="relative h-full flex flex-col items-center justify-center p-6 text-center text-white">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <span className="text-2xl font-bold font-serif">{category.name[0]}</span>
        </div>
        <h3 className="text-xl font-bold font-serif">{category.name}</h3>
        <p className="text-sm text-white/70 mt-2 max-w-[200px]">{category.description}</p>
        <span className="mt-4 px-4 py-2 bg-white/20 rounded-full text-sm font-medium group-hover:bg-white/30 transition-colors">
          Shop Now →
        </span>
      </div>
    </Link>
  );
}
