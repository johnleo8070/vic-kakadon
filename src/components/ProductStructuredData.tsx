"use client";

import { useEffect } from "react";

interface ProductStructuredDataProps {
  product: {
    id: number;
    name: string;
    description: string;
    price: string;
    images: string[] | null;
    slug: string;
    stock_quantity: number | null;
    category_name?: string;
    is_available: boolean;
  };
}

export default function ProductStructuredData({ product }: ProductStructuredDataProps) {
  useEffect(() => {
    if (!product) return;

    const baseUrl = "https://vic-kakadon.com.ng";
    const imageUrl = product.images?.[0] || "/images/logo.png";
    const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`;

    const structuredData = {
      "@context": "https://schema.org/",
      "@type": "Product",
      name: product.name,
      description: product.description || `Shop ${product.name} at K D K Collections Wear`,
      image: [fullImageUrl],
      brand: {
        "@type": "Brand",
        name: "K D K Collections Wear",
      },
      offers: {
        "@type": "Offer",
        url: `${baseUrl}/products/${product.slug}`,
        priceCurrency: "NGN",
        price: parseFloat(product.price),
        priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        availability: product.is_available && (product.stock_quantity || 0) > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        seller: {
          "@type": "Organization",
          name: "K D K Collections Wear",
          url: baseUrl,
        },
      },
      category: product.category_name || "Fashion & Accessories",
    };

    // Create or update the script tag
    let script = document.getElementById('product-structured-data') as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script') as HTMLScriptElement;
      script.id = 'product-structured-data';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);

    // Cleanup on unmount
    return () => {
      const existingScript = document.getElementById('product-structured-data');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [product]);

  return null;
}
