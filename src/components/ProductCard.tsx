"use client";

import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Star, ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    slug: string;
    price: string;
    images: string[] | null;
    isFeatured?: boolean;
    isNew?: boolean;
    stockQuantity?: number | null;
    availablePieces?: number | null;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.images?.[0] || "/images/placeholder.jpg";

  return (
    <Link href={`/products/${product.slug}`} className="group card">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="badge bg-green-500 text-white">NEW</span>
          )}
          {product.isFeatured && (
            <span className="badge bg-gold text-dark">
              <Star className="w-3 h-3 inline mr-1" />
              FEATURED
            </span>
          )}
        </div>
        {/* Quick add to cart */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.preventDefault();
              // Quick add to cart logic would go here
            }}
            className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-dark transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
        {/* Stock indicator */}
        {product.stockQuantity !== null && product.stockQuantity !== undefined && product.stockQuantity <= 5 && (
          <div className="absolute bottom-3 left-3">
            <span className="badge bg-red-500 text-white">Only {product.stockQuantity} left!</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-dark group-hover:text-primary transition-colors truncate">{product.name}</h3>
        <div className="flex items-center gap-1 mt-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="w-3 h-3 text-gold fill-gold" />
          ))}
        </div>
        <p className="text-primary font-bold text-lg mt-2">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
