"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { ADMIN_NAV } from "./adminNav";

function isNavActive(pathname: string | null, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname?.startsWith(href) ?? false;
}

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile top bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between gap-3 bg-dark text-white px-4 h-14 shadow-md">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="p-2 -ml-2 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <Image
          src="/images/logo.png"
          alt="K D K Collections"
          width={100}
          height={36}
          className="object-contain bg-white/90 p-1 rounded-md h-9 w-auto"
          priority
        />
        <div className="w-10" aria-hidden />
      </header>

      {/* Backdrop */}
      {menuOpen && (
        <button
          type="button"
          className="lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 lg:z-10 w-64 bg-dark text-white min-h-screen flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 border-b border-white/10 flex items-start justify-between gap-2">
          <div className="flex flex-col min-w-0">
            <Image
              src="/images/logo.png"
              alt="K D K Collections"
              width={140}
              height={48}
              className="object-contain bg-white/90 p-2 rounded-lg w-full max-w-[140px] h-auto"
              priority
            />
            <p className="text-xs text-gray-400 mt-2">Admin Panel</p>
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors shrink-0"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-3 space-y-0.5 flex-1 overflow-y-auto">
          {ADMIN_NAV.map((item) => {
            const Icon = item.icon;
            const active = isNavActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary text-white"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="lg:ml-64 min-h-screen pt-14 lg:pt-0 p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
