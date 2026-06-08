import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: string | number): string {
  const num = typeof price === "string" ? parseFloat(price) : price;
  const safe = Number.isFinite(num) ? num : 0;
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safe);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function generateSlug(name: string, existingSlugs: string[] = []): string {
  let slug = slugify(name);
  let counter = 1;
  while (existingSlugs.includes(slug)) {
    slug = `${slugify(name)}-${counter}`;
    counter++;
  }
  return slug;
}

export const BANK_DETAILS = {
  bankName: "Guaranty Trust Bank (GTBank)",
  accountName: "K D K collections wears",
  accountNumber: "0123456789",
  routingNumber: "058152036",
  bankAddress: "Plot 635 Akin Adesola Street, Victoria Island, Lagos",
  swiftCode: "GTBINGLA",
};

export const DELIVERY_MESSAGE = `Delivery fee is not included in the product price. Our team will contact you via email/WhatsApp/phone to communicate delivery cost based on your location.`;

// Generate a human-friendly order number e.g. "KDK-7H3K9D2A"
export function generateOrderNumber(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `KDK-${code}`;
}

// Friendly labels & helpers for order status workflow
export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: "Pending Verification",
  confirmed: "Payment Confirmed",
};

export const ORDER_STATUS_LABELS: Record<string, string> = {
  processing: "Processing",
  shipped: "Shipped / In Transit",
  delivered: "Delivered",
};

export const ORDER_STATUS_STEPS = ["processing", "shipped", "delivered"] as const;
