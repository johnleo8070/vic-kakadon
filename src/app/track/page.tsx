"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, Package, CheckCircle, Clock, Truck, Home, XCircle, CreditCard, MapPin } from "lucide-react";
import { formatPrice, formatDate, PAYMENT_STATUS_LABELS, ORDER_STATUS_LABELS, ORDER_STATUS_STEPS } from "@/lib/utils";

interface TrackedOrder {
  orderNumber: string;
  customerName: string;
  city: string;
  state: string;
  products: {
    productName: string;
    productImage: string;
    quantity: number;
    size: string;
    color: string;
    price: string;
  }[];
  totalAmount: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
}

function TrackContent() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get("orderNumber") || "");
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const trackOrder = async (num: string) => {
    if (!num.trim()) {
      setError("Please enter your order ID");
      return;
    }
    setLoading(true);
    setError("");
    setOrder(null);
    try {
      const res = await fetch(`/api/track/${encodeURIComponent(num.trim())}`);
      const data = await res.json();
      if (data.success) {
        setOrder(data.data);
      } else {
        setError(data.error || "Order not found");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  useEffect(() => {
    const initial = searchParams.get("orderNumber");
    if (initial) {
      trackOrder(initial);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackOrder(orderNumber);
  };

  const isPaymentConfirmed = order?.paymentStatus === "confirmed";
  const currentStepIndex = order ? ORDER_STATUS_STEPS.indexOf(order.orderStatus as (typeof ORDER_STATUS_STEPS)[number]) : -1;

  const stepIcons = [
    <Package key="p" className="w-5 h-5" />,
    <Truck key="t" className="w-5 h-5" />,
    <Home key="h" className="w-5 h-5" />,
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <span className="text-dark font-medium">Track Order</span>
      </nav>

      <div className="text-center mb-10">
        <div className="gold-divider" />
        <h1 className="text-3xl md:text-4xl font-bold font-serif text-dark mb-3">Track Your Order</h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Enter the Order ID you received at checkout to see your payment confirmation and delivery status.
        </p>
      </div>

      {/* Search form */}
      <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 mb-8">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
              placeholder="e.g. KDK-7H3K9D2A"
              className="input-field pl-10 uppercase tracking-wider"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50 whitespace-nowrap">
            {loading ? "Searching..." : "Track Order"}
          </button>
        </form>
        <p className="text-xs text-gray-400 mt-3">Your Order ID looks like <span className="font-mono font-semibold">KDK-XXXXXXXX</span> and was shown on your confirmation page.</p>
      </div>

      {/* Error / not found */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center mb-8">
          <XCircle className="w-10 h-10 text-red-400 mx-auto mb-2" />
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="bg-white rounded-2xl shadow-sm p-8 animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="h-20 bg-gray-200 rounded" />
          <div className="h-32 bg-gray-200 rounded" />
        </div>
      )}

      {/* Order result */}
      {order && !loading && (
        <div className="space-y-6 animate-fade-in">
          {/* Header card */}
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="text-2xl font-bold font-mono text-primary">{order.orderNumber}</p>
                <p className="text-sm text-gray-500 mt-1">Placed on {formatDate(order.createdAt)}</p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-sm text-gray-500">Customer</p>
                <p className="font-semibold text-dark">{order.customerName}</p>
                <p className="text-sm text-gray-500 flex items-center gap-1 md:justify-end">
                  <MapPin className="w-3 h-3" /> {order.city}{order.state ? `, ${order.state}` : ""}
                </p>
              </div>
            </div>
          </div>

          {/* Payment status */}
          <div className={`rounded-2xl shadow-sm p-6 border-2 ${isPaymentConfirmed ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"}`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isPaymentConfirmed ? "bg-green-500" : "bg-yellow-500"} text-white`}>
                {isPaymentConfirmed ? <CheckCircle className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-gray-500" />
                  <h3 className="font-semibold text-dark">Payment Status</h3>
                </div>
                <p className={`text-lg font-bold ${isPaymentConfirmed ? "text-green-700" : "text-yellow-700"}`}>
                  {PAYMENT_STATUS_LABELS[order.paymentStatus] || order.paymentStatus}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {isPaymentConfirmed
                    ? "Your payment has been verified. Your order is being prepared."
                    : "We are verifying your payment. This usually takes up to 24 hours."}
                </p>
              </div>
            </div>
          </div>

          {/* Delivery progress */}
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
            <h3 className="font-semibold text-dark mb-6 flex items-center gap-2">
              <Truck className="w-5 h-5 text-primary" /> Delivery Progress
            </h3>
            <div className="relative">
              {/* progress line */}
              <div className="absolute top-5 left-5 right-5 h-1 bg-gray-200 rounded-full hidden sm:block">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${currentStepIndex <= 0 ? 0 : (currentStepIndex / (ORDER_STATUS_STEPS.length - 1)) * 100}%` }}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-0 relative">
                {ORDER_STATUS_STEPS.map((step, i) => {
                  const reached = i <= currentStepIndex;
                  return (
                    <div key={step} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-colors ${reached ? "bg-primary text-white" : "bg-gray-200 text-gray-400"}`}>
                        {stepIcons[i]}
                      </div>
                      <div>
                        <p className={`font-medium text-sm ${reached ? "text-dark" : "text-gray-400"}`}>
                          {ORDER_STATUS_LABELS[step]}
                        </p>
                        {i === currentStepIndex && (
                          <span className="text-xs text-primary font-semibold">Current status</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {!isPaymentConfirmed && (
              <p className="text-xs text-gray-500 mt-6 bg-gray-50 rounded-lg p-3">
                Note: Your delivery progress will advance once your payment is confirmed by our team.
              </p>
            )}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-700">
                Delivery fee is not included in the product price. Our team will contact you via email/WhatsApp/phone to communicate delivery cost based on your location.
              </p>
            </div>
          </div>

          {/* Order items */}
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
            <h3 className="font-semibold text-dark mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.products?.map((item, i) => (
                <div key={i} className="flex gap-4 items-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                    <Image src={item.productImage || "/images/placeholder.jpg"} alt={item.productName} fill className="object-cover" unoptimized />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-dark truncate">{item.productName}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}{item.size ? ` | Size: ${item.size}` : ""}{item.color ? ` | ${item.color}` : ""}</p>
                  </div>
                  <p className="font-semibold text-primary whitespace-nowrap">{formatPrice(parseFloat(item.price) * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center text-lg font-bold pt-4 mt-4 border-t">
              <span>Total</span>
              <span className="text-primary">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>

          <div className="text-center">
            <Link href="/products" className="btn-outline inline-block">Continue Shopping</Link>
          </div>
        </div>
      )}

      {/* Empty state before search */}
      {!order && !loading && !searched && !error && (
        <div className="text-center py-12 text-gray-400">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-200" />
          <p>Enter your Order ID above to view its status.</p>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto" />
          <div className="h-12 bg-gray-200 rounded" />
        </div>
      </div>
    }>
      <TrackContent />
    </Suspense>
  );
}
