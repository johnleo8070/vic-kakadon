"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Phone, MapPin } from "lucide-react";
import Image from "next/image";

const SocialIcons = {
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.964 9.964 0 001.333 4.982L2 22l5.233-1.371a9.936 9.936 0 004.779 1.218h.004c5.502 0 9.987-4.478 9.988-9.984 0-2.669-1.038-5.176-2.925-7.064C17.192 3.008 14.685 2.003 12.012 2zm5.727 14.156c-.244.688-1.22 1.25-1.688 1.332-.468.082-.937.164-3.048-.656-2.111-.82-3.415-3.033-3.52-3.172-.105-.139-.843-1.12-1.042-2.146-.199-1.025.263-1.574.496-1.802.233-.228.468-.291.632-.291h.451c.14 0 .328.021.492.41.164.389.574 1.394.623 1.492.049.098.082.213.016.34-.066.127-.148.246-.246.361-.098.115-.213.23-.312.328-.115.115-.23.23-.098.459a7.354 7.354 0 001.402 1.742c.623.553 1.148.918 1.742 1.213.213.115.34.098.459-.049.115-.148.492-.574.623-.77.131-.197.262-.164.443-.098.18.066 1.148.541 1.344.64.197.098.328.148.377.23.049.082.049.492-.195 1.18z"/></svg>
  )
};

export default function Footer() {
  const pathname = usePathname();
  const [contactInfo, setContactInfo] = useState({
    storeName: "K D K collections wears",
    address: "19/21, Breadfruit By Sulubolaji, Mandilas Lagos Island, Shop Number 2F 09, Lagos, Nigeria, 101223",
    phone: "0810 661 7255",
    email: "kakadonkakadon@yahoo.com",
    whatsapp: "https://wa.me/2348106617255",
    facebook: "https://www.facebook.com/share/1GpGTWFoKy/?mibextid=wwXIfr",
    instagram: "https://www.instagram.com/kdk_collections.wears?igsh=MXdldGtuYWxvbmc3",
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setContactInfo((prev) => {
            const storeName = data.data.store_name || prev.storeName;
            const address = data.data.store_address || prev.address;
            const phone = data.data.store_phone || prev.phone;
            const email = data.data.store_email || prev.email;
            
            const digits = phone.replace(/\D/g, "");
            const whatsapp = `https://wa.me/${digits.startsWith("0") ? "234" + digits.slice(1) : digits}`;
            
            return { storeName, address, phone, email, whatsapp, facebook: prev.facebook, instagram: prev.instagram };
          });
        }
      })
      .catch(() => {});
  }, []);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="bg-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Image 
                src="/images/logo.png" 
                alt="Logo" 
                width={150} 
                height={50} 
                className="object-contain bg-white/90 p-2 rounded-lg"
              />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Premium fashion destination offering curated collections of watches, caps, shirts, trousers, shoes, and accessories.
            </p>
            <div className="flex gap-3 mt-6">
              {Object.entries(SocialIcons).map(([key, icon]) => {
                const isWhatsapp = key === "whatsapp";
                const isFacebook = key === "facebook";
                const isInstagram = key === "instagram";
                const href = isWhatsapp 
                  ? contactInfo.whatsapp 
                  : isFacebook 
                  ? contactInfo.facebook 
                  : isInstagram 
                  ? contactInfo.instagram 
                  : "#";
                return (
                  <a 
                    key={key} 
                    href={href}
                    target={isWhatsapp || isFacebook || isInstagram ? "_blank" : undefined}
                    rel={isWhatsapp || isFacebook || isInstagram ? "noopener noreferrer" : undefined}
                    className="w-10 h-10 bg-white/10 hover:bg-primary rounded-full flex items-center justify-center transition-colors"
                  >
                    {icon}
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold font-serif mb-4 text-gold">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: "Home", href: "/" },
                { label: "Products", href: "/products" },
                { label: "Categories", href: "/categories" },
                { label: "Track Order", href: "/track" },
                { label: "Contact", href: "/contact" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-gray-400 hover:text-white transition-colors text-sm">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold font-serif mb-4 text-gold">Categories</h4>
            <ul className="space-y-3">
              {["Watches", "Caps", "Shirts", "Trousers", "Shoes", "Accessories"].map((item) => (
                <li key={item}>
                  <Link href={`/products?category=${item.toLowerCase()}`} className="text-gray-400 hover:text-white transition-colors text-sm">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold font-serif mb-4 text-gold">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <span>{contactInfo.address}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Phone className="w-5 h-5 text-gold flex-shrink-0" />
                <span>{contactInfo.phone}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Mail className="w-5 h-5 text-gold flex-shrink-0" />
                <a href={`mailto:${contactInfo.email}`} className="hover:text-white">{contactInfo.email}</a>
              </li>
            </ul>
            <div className="mt-6 p-4 bg-white/5 rounded-lg">
              <p className="text-xs text-gray-400">
                <strong className="text-gold">Business Hours:</strong><br />
                Mon - Fri: 9AM - 6PM<br />
                Sat: 10AM - 4PM<br />
                Sun: Closed
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} {contactInfo.storeName}. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/terms" className="text-gray-500 hover:text-white transition-colors">Terms & Conditions</Link>
            <Link href="/privacy" className="text-gray-500 hover:text-white transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
