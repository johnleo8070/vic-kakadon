"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingCart, Heart, Share2, Check, Minus, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { showToast } from "@/components/Toast";
import { formatPrice } from "@/lib/utils";
import { useEffect, useState } from "react";

function ProductDetailContent() {
  const params = useParams();
  const slug = params.slug as string;
  const { dispatch } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${slug}`);
        const data = await res.json();
        if (data.success) {
          setProduct(data.data);
          const sizes = data.data.sizes || [];
          const colors = data.data.colors || [];
          if (sizes.length > 0) setSelectedSize(sizes[0]);
          if (colors.length > 0) setSelectedColor(colors[0]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize && product.sizes?.length > 0) {
      showToast("error", "Please select a size");
      return;
    }
    if (!selectedColor && product.colors?.length > 0) {
      showToast("error", "Please select a color");
      return;
    }
    if (product.stockQuantity === 0 || product.availablePieces === 0) {
      showToast("error", "This product is out of stock");
      return;
    }

    dispatch({
      type: "ADD_ITEM",
      payload: {
        productId: product.id,
        productName: product.name,
        productSlug: product.slug,
        productImage: product.images?.[0] || "",
        price: product.price,
        quantity,
        size: selectedSize,
        color: selectedColor,
      },
    });
    showToast("success", `${product.name} added to cart!`);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-square bg-gray-200 rounded-xl" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-10 bg-gray-200 rounded w-1/3" />
            <div className="h-32 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-dark">Product Not Found</h1>
        <Link href="/products" className="btn-primary mt-4 inline-block">Back to Products</Link>
      </div>
    );
  }

  const images = product.images?.filter(Boolean) || [];
  const isOutOfStock = product.stockQuantity === 0 || product.availablePieces === 0;
  const isLowStock = product.stockQuantity !== null && product.stockQuantity > 0 && product.stockQuantity <= 5;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-primary">Products</Link>
        <span>/</span>
        <span className="text-dark font-medium">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden relative">
            <Image src={images[selectedImage] || "/images/placeholder.jpg"} alt={product.name} fill className="object-cover" unoptimized />
            {product.isNew && <span className="absolute top-4 left-4 badge bg-green-500 text-white text-sm">NEW</span>}
            {product.isFeatured && <span className="absolute top-4 right-4 badge bg-gold text-dark text-sm">FEATURED</span>}
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img: string, i: number) => (
                <button key={i} onClick={() => setSelectedImage(i)} className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === i ? "border-primary" : "border-transparent"}`}>
                  <Image src={img} alt={`${product.name} ${i + 1}`} width={80} height={80} className="object-cover w-full h-full" unoptimized />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-serif text-dark">{product.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex">{[1, 2, 3, 4, 5].map((star) => <Star key={star} className="w-5 h-5 text-gold fill-gold" />)}</div>
              <span className="text-sm text-gray-500">(4.8 · 120 reviews)</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
            {isOutOfStock ? (
              <span className="badge bg-red-100 text-red-700">Out of Stock</span>
            ) : isLowStock ? (
              <span className="badge bg-orange-100 text-orange-700">Only {product.stockQuantity} left!</span>
            ) : (
              <span className="badge bg-green-100 text-green-700">In Stock</span>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          {product.sizes && product.sizes.length > 0 && (
            <div>
              <label className="block font-semibold text-dark mb-2">Size <span className="text-red-500">*</span></label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size: string) => (
                  <button key={size} onClick={() => setSelectedSize(size)} className={`px-4 py-2 border-2 rounded-lg font-medium transition-all ${selectedSize === size ? "border-primary bg-primary text-white" : "border-gray-300 hover:border-primary"}`}>{size}</button>
                ))}
              </div>
            </div>
          )}

          {product.colors && product.colors.length > 0 && (
            <div>
              <label className="block font-semibold text-dark mb-2">Color <span className="text-red-500">*</span>{selectedColor && <span className="text-gray-500 font-normal ml-2">Selected: {selectedColor}</span>}</label>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color: string) => (
                  <button key={color} onClick={() => setSelectedColor(color)} className={`px-4 py-2 border-2 rounded-lg font-medium transition-all ${selectedColor === color ? "border-primary bg-primary/10" : "border-gray-300 hover:border-primary"}`}>{color}</button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block font-semibold text-dark mb-2">Quantity</label>
            <div className="flex items-center gap-3">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 border rounded-lg flex items-center justify-center hover:bg-gray-50"><Minus className="w-4 h-4" /></button>
              <span className="w-12 text-center text-lg font-semibold">{quantity}</span>
              <button onClick={() => setQuantity(Math.min(product.availablePieces || 99, quantity + 1))} className="w-10 h-10 border rounded-lg flex items-center justify-center hover:bg-gray-50"><Plus className="w-4 h-4" /></button>
              <span className="text-sm text-gray-500 ml-2">{product.availablePieces} available</span>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button onClick={handleAddToCart} disabled={isOutOfStock} className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              <ShoppingCart className="w-5 h-5" /> Add to Cart
            </button>
            <button className="w-14 h-14 border-2 border-primary text-primary rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors"><Heart className="w-5 h-5" /></button>
            <button className="w-14 h-14 border-2 border-gray-300 text-gray-500 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"><Share2 className="w-5 h-5" /></button>
          </div>

          <div className="bg-cream border border-gold/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-dark text-sm">Delivery Information</p>
                <p className="text-gray-600 text-sm mt-1">Delivery fee is not included in the product price. Our team will contact you via email/WhatsApp/phone to communicate delivery cost based on your location.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            {[{ label: "Free Shipping", desc: "Over ₦100k" }, { label: "Secure Payment", desc: "100% secure" }, { label: "Easy Returns", desc: "30 days" }].map((f) => (
              <div key={f.label} className="text-center">
                <p className="font-semibold text-dark text-sm">{f.label}</p>
                <p className="text-xs text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-square bg-gray-200 rounded-xl" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    }>
      <ProductDetailContent />
    </Suspense>
  );
}
