"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { showToast } from "@/components/Toast";
import { formatPrice } from "@/lib/utils";
import { CreditCard, Upload, Info } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { state, dispatch, totalPrice } = useCart();
  const [loading, setLoading] = useState(false);
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    notes: "",
  });

  const [bankDetails, setBankDetails] = useState({
    bankName: "Guaranty Trust Bank (GTBank)",
    accountName: "K D K collections wears",
    accountNumber: "0123456789",
    routingNumber: "058152036",
    swiftCode: "GTBINGLA",
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data.success && data.data) {
          setBankDetails((prev) => ({
            bankName: data.data.bank_name || prev.bankName,
            accountName: data.data.account_name || prev.accountName,
            accountNumber: data.data.account_number || prev.accountNumber,
            routingNumber: data.data.routing_number || prev.routingNumber,
            swiftCode: data.data.swift_code || prev.swiftCode,
          }));
        }
      } catch {
        // keep defaults
      }
    };
    loadSettings();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast("error", "File size must be less than 5MB");
        return;
      }
      setPaymentScreenshot(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append("type", "payment");

    const res = await fetch("/api/upload", { method: "POST", body: formDataUpload });
    const data = await res.json();
    if (data.success) return data.data.url;
    throw new Error("Upload failed");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customerName || !formData.email || !formData.phone || !formData.address || !formData.city) {
      showToast("error", "Please fill in all required fields");
      return;
    }

    if (state.items.length === 0) {
      showToast("error", "Your cart is empty");
      return;
    }

    setLoading(true);

    try {
      let screenshotUrl = "";
      if (paymentScreenshot) {
        screenshotUrl = await uploadFile(paymentScreenshot);
      }

      const orderData = {
        customerName: formData.customerName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        products: state.items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          productSlug: item.productSlug,
          productImage: item.productImage,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          price: item.price,
        })),
        totalAmount: totalPrice.toString(),
        paymentScreenshot: screenshotUrl,
        notes: formData.notes,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (data.success) {
        dispatch({ type: "CLEAR_CART" });
        router.push(`/confirmation?orderNumber=${encodeURIComponent(data.data.orderNumber)}`);
      } else {
        showToast("error", data.error || "Order failed");
      }
    } catch (error) {
      showToast("error", "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-dark mb-4">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-8">Add some products to your cart before checking out.</p>
        <Link href="/products" className="btn-primary inline-block">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-primary">Products</Link>
        <span>/</span>
        <span className="text-dark font-medium">Checkout</span>
      </nav>

      <h1 className="text-3xl font-bold font-serif text-dark mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold font-serif mb-4">Customer Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                <input name="customerName" value={formData.customerName} onChange={handleInputChange} className="input-field" required placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                <input name="email" type="email" value={formData.email} onChange={handleInputChange} className="input-field" required placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone <span className="text-red-500">*</span></label>
                <input name="phone" value={formData.phone} onChange={handleInputChange} className="input-field" required placeholder="+1 (555) 123-4567" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                <input name="state" value={formData.state} onChange={handleInputChange} className="input-field" placeholder="California" />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address <span className="text-red-500">*</span></label>
              <textarea name="address" value={formData.address} onChange={handleInputChange} className="input-field" rows={3} required placeholder="Full street address" />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">City <span className="text-red-500">*</span></label>
              <input name="city" value={formData.city} onChange={handleInputChange} className="input-field" required placeholder="Los Angeles" />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
              <textarea name="notes" value={formData.notes} onChange={handleInputChange} className="input-field" rows={2} placeholder="Any special instructions..." />
            </div>
          </div>

          <div className="bg-gradient-to-r from-cream to-white border border-gold/30 rounded-xl p-6">
            <h2 className="text-xl font-bold font-serif mb-4 flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-gold" /> Payment Instructions
            </h2>
            <p className="text-gray-600 mb-4">Please transfer the total amount to our bank account and upload a screenshot below.</p>
            <div className="bg-white rounded-lg p-4 space-y-3 border">
              <div className="flex justify-between text-sm"><span className="text-gray-500">Bank Name:</span><span className="font-semibold text-dark">{bankDetails.bankName}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Account Name:</span><span className="font-semibold text-dark">{bankDetails.accountName}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Account Number:</span><span className="font-semibold text-dark">{bankDetails.accountNumber}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Sort Code:</span><span className="font-semibold text-dark">{bankDetails.routingNumber}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">SWIFT Code:</span><span className="font-semibold text-dark">{bankDetails.swiftCode}</span></div>
            </div>
            <div className="mt-4 flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-700">Delivery fee is not included in the product price. Our team will contact you via email/WhatsApp/phone to communicate delivery cost based on your location.</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold font-serif mb-4 flex items-center gap-2">
              <Upload className="w-6 h-6 text-primary" /> Upload Payment Screenshot
            </h2>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary transition-colors">
              <input type="file" id="payment-screenshot" accept="image/*" onChange={handleFileChange} className="hidden" />
              {previewUrl ? (
                <div className="relative inline-block">
                  <Image src={previewUrl} alt="Payment screenshot" width={300} height={200} className="rounded-lg max-h-48 object-contain" />
                  <button type="button" onClick={() => { setPreviewUrl(""); setPaymentScreenshot(null); }} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs">×</button>
                </div>
              ) : (
                <label htmlFor="payment-screenshot" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Click to upload payment screenshot</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                </label>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-32">
            <h2 className="text-xl font-bold font-serif mb-4">Order Summary</h2>
            <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
              {state.items.map((item, index) => (
                <div key={index} className="flex gap-3">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                    <Image src={item.productImage || "/images/placeholder.jpg"} alt={item.productName} fill className="object-cover" unoptimized />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium truncate">{item.productName}</h3>
                    <p className="text-xs text-gray-500">Qty: {item.quantity} | {item.size} / {item.color}</p>
                    <p className="text-primary font-semibold text-sm">{formatPrice(parseFloat(item.price) * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span>{formatPrice(totalPrice)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Delivery</span><span className="text-orange-600">Calculated later</span></div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t"><span>Total</span><span className="text-primary">{formatPrice(totalPrice)}</span></div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-6 flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? "Processing..." : "Place Order"}
            </button>
            <p className="text-xs text-gray-500 text-center mt-3">By placing this order, you agree to our Terms & Conditions</p>
          </div>
        </div>
      </form>
    </div>
  );
}
