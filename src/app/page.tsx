import Link from "next/link";
import Image from "next/image";
import { Crown, ArrowRight, Truck, Shield, RotateCcw, Star } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const categories = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/categories`).then(
    (res) => res.json()
  ).catch(() => ({ success: false, data: [] }));

  const featuredProducts = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/products?featured=true&limit=8`).then(
    (res) => res.json()
  ).catch(() => ({ success: false, data: [] }));

  const newProducts = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/products?new=true&limit=8`).then(
    (res) => res.json()
  ).catch(() => ({ success: false, data: [] }));

  const catList = categories.success ? categories.data.slice(0, 6) : [];
  const featList = featuredProducts.success ? featuredProducts.data : [];
  const newList = newProducts.success ? newProducts.data : [];

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden bg-[#0c0c0c]">
        {/* Brand-tinted ambient background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0c0c0c] via-[#140a0a] to-[#0c0c0c]" />
          <div className="absolute top-0 left-0 w-[55%] h-full bg-gradient-to-r from-primary-light/12 via-primary-light/4 to-transparent" />
          <div className="absolute bottom-0 right-0 w-[45%] h-[70%] bg-gradient-to-tl from-green-accent/8 via-transparent to-transparent" />
          <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-gold/4 rounded-full blur-[160px]" />
        </div>

        {/* Subtle texture */}
        <div className="absolute inset-0 opacity-[0.015] bg-[linear-gradient(90deg,#fff_1px,transparent_1px),linear-gradient(#fff_1px,transparent_1px)] bg-[size:72px_72px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Content */}
            <div className="text-white space-y-8 lg:space-y-10 order-2 lg:order-1 animate-slide-up">
              {/* Brand accent line + badge */}
              <div className="flex items-center gap-4">
                <div className="h-px w-14 bg-gradient-to-r from-primary-light via-gold to-green-accent shrink-0" />
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-gold/25 bg-white/[0.03] backdrop-blur-sm">
                  <Crown className="w-4 h-4 text-gold" />
                  <span className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-light">Collections Wear</span>
                </div>
              </div>

              {/* Heading */}
              <div className="space-y-5">
                <h1 className="font-serif leading-[1.08] tracking-tight">
                  <span className="block text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white">
                    K D K
                  </span>
                  <span className="block mt-2 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-light via-gold to-green-accent">
                    Collections
                  </span>
                  <span className="block mt-3 text-lg sm:text-xl text-white/50 font-normal tracking-[0.15em] uppercase">
                    Premium Fashion for Every Occasion
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-white/55 max-w-lg leading-relaxed">
                  Curated timepieces, apparel, and accessories — crafted with the distinction of gold, the passion of crimson, and the elegance of evergreen.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/products"
                  className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-primary hover:bg-primary-dark text-white rounded-lg font-semibold text-base shadow-lg shadow-primary/25 transition-all duration-200"
                >
                  Shop Collection
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="/categories"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg font-semibold text-base text-gold border border-gold/40 hover:bg-gold/10 hover:border-gold/60 transition-all duration-200"
                >
                  Browse Categories
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/[0.08]">
                {[
                  { value: "500+", label: "Products", color: "text-gold" },
                  { value: "10K+", label: "Customers", color: "text-primary-light" },
                  { value: "50+", label: "Brands", color: "text-green-accent" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className={`text-2xl sm:text-3xl font-bold font-serif ${stat.color}`}>{stat.value}</p>
                    <p className="text-xs sm:text-sm text-white/40 mt-1 tracking-wide">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero visual */}
            <div className="relative order-1 lg:order-2">
              <div className="relative aspect-[4/3] sm:aspect-[5/4] lg:aspect-square max-w-lg mx-auto lg:max-w-none">
                {/* Frame accents — logo colors */}
                <div className="absolute -top-2 -left-2 w-20 h-20 border-t-2 border-l-2 border-gold/50 rounded-tl-2xl pointer-events-none" />
                <div className="absolute -bottom-2 -right-2 w-20 h-20 border-b-2 border-r-2 border-primary-light/60 rounded-br-2xl pointer-events-none" />
                <div className="absolute -bottom-2 -left-2 w-12 h-12 border-b-2 border-l-2 border-green-accent/40 rounded-bl-xl pointer-events-none hidden sm:block" />

                <div className="relative h-full w-full rounded-2xl overflow-hidden shadow-2xl shadow-black/60 ring-1 ring-white/10">
                  <Image
                    src="/images/hero_fashion_showcase.png"
                    alt="K D K Collections premium fashion showcase"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 90vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c]/70 via-[#0c0c0c]/10 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-light/15 via-transparent to-green-accent/10 mix-blend-overlay" />
                </div>

                {/* Logo seal */}
                <div className="absolute -bottom-5 -left-4 sm:-bottom-6 sm:-left-6 bg-white rounded-2xl p-2.5 shadow-xl shadow-black/30 ring-1 ring-gold/20">
                  <Image
                    src="/images/logo.png"
                    alt="K D K Collections logo"
                    width={72}
                    height={72}
                    className="object-contain"
                  />
                </div>

                {/* Trust pill */}
                <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
                  <Shield className="w-3.5 h-3.5 text-gold" />
                  <span className="text-xs font-medium text-white/80 tracking-wide">Authentic Quality</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade into features */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </section>

      {/* Features Bar */}
      <section className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Truck className="w-8 h-8" />, title: "Free Shipping", desc: "On orders over ₦100,000" },
              { icon: <Shield className="w-8 h-8" />, title: "Secure Payment", desc: "100% secure checkout" },
              { icon: <RotateCcw className="w-8 h-8" />, title: "Easy Returns", desc: "30-day return policy" },
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-4 justify-center">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-dark">{feature.title}</h3>
                  <p className="text-sm text-gray-500">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="gold-divider" />
            <h2 className="section-title">Shop by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Explore our curated collections across various categories</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {catList.map((cat: { id: number; name: string; slug: string; image: string | null }) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group relative overflow-hidden rounded-2xl aspect-square"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary-dark" />
                {cat.image && (
                  <Image src={cat.image} alt={cat.name} fill className="object-cover mix-blend-overlay opacity-30 group-hover:scale-110 transition-transform duration-700" />
                )}
                <div className="relative h-full flex flex-col items-center justify-center text-white p-4">
                  <span className="text-3xl font-bold font-serif mb-2">{cat.name[0]}</span>
                  <h3 className="font-semibold text-center">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/categories" className="btn-outline inline-flex items-center gap-2">
              View All Categories <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featList.length > 0 && (
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="gold-divider" />
              <h2 className="section-title">Featured Collection</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Handpicked premium products just for you</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featList.map((product: { id: number; name: string; slug: string; price: string; images: string[] | null; stockQuantity: number | null; isFeatured: boolean; isNew: boolean }) => (
                <Link key={product.id} href={`/products/${product.slug}`} className="group card">
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <Image src={product.images?.[0] || "/images/placeholder.jpg"} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {product.isNew && <span className="badge bg-green-500 text-white">NEW</span>}
                      {product.isFeatured && <span className="badge bg-gold text-dark"><Star className="w-3 h-3 inline mr-1" />FEATURED</span>}
                    </div>
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
            <div className="text-center mt-12">
              <Link href="/products" className="btn-primary inline-flex items-center gap-2">
                View All Products <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {newList.length > 0 && (
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="gold-divider" />
              <h2 className="section-title">New Arrivals</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Fresh styles added to our collection</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {newList.map((product: { id: number; name: string; slug: string; price: string; images: string[] | null; stockQuantity: number | null; isNew: boolean }) => (
                <Link key={product.id} href={`/products/${product.slug}`} className="group card">
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <Image src={product.images?.[0] || "/images/placeholder.jpg"} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                    {product.isNew && <span className="absolute top-3 left-3 badge bg-green-500 text-white">NEW</span>}
                    {product.stockQuantity !== null && product.stockQuantity !== undefined && product.stockQuantity <= 5 && product.stockQuantity > 0 && (
                      <div className="absolute bottom-3 left-3"><span className="badge bg-red-500 text-white">Only {product.stockQuantity} left!</span></div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-dark group-hover:text-primary transition-colors truncate">{product.name}</h3>
                    <p className="text-primary font-bold text-lg mt-2">{formatPrice(product.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
          <Crown className="w-12 h-12 text-gold mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-bold font-serif mb-6">Join the Kakadon Family</h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Subscribe to get exclusive deals, early access to new collections, and style tips delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-dark outline-none focus:ring-2 focus:ring-gold"
            />
            <button className="btn-secondary whitespace-nowrap">Subscribe</button>
          </div>
        </div>
      </section>
    </>
  );
}
