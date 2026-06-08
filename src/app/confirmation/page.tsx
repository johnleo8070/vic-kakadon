"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, ArrowRight, Copy, Check } from "lucide-react";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");
  const [copied, setCopied] = useState(false);

  const copyOrderId = () => {
    if (!orderNumber) return;
    navigator.clipboard.writeText(orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold font-serif text-dark mb-4">Order Confirmed!</h1>
        <p className="text-gray-600 mb-6">Thank you for your purchase!</p>

        {/* Order ID box */}
        {orderNumber && (
          <div className="bg-gradient-to-r from-cream to-white border-2 border-gold/40 rounded-xl p-6 mb-8">
            <p className="text-sm text-gray-500 mb-1">Your Order ID</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl md:text-3xl font-bold font-mono text-primary tracking-wider">{orderNumber}</span>
              <button
                onClick={copyOrderId}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                title="Copy Order ID"
              >
                {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-gray-500" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              ⚠️ Save this Order ID. Use it on the <strong>Track Order</strong> page to check your payment confirmation and delivery status.
            </p>
          </div>
        )}

        <div className="bg-cream rounded-xl p-6 mb-8 text-left">
          <h3 className="font-semibold text-dark mb-4">What happens next?</h3>
          <ul className="space-y-3">
            {[
              "We will verify your payment screenshot within 24 hours",
              "Our team will contact you via email/phone about delivery costs",
              "You can track your order anytime using your Order ID",
              "Your order will be processed and shipped once payment is confirmed",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-gray-600 text-sm">{step}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
          <p className="text-sm text-blue-700">
            <strong>Note:</strong> Delivery fee is not included in the product price. Our team will contact you to discuss delivery costs based on your location.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {orderNumber && (
            <Link href={`/track?orderNumber=${encodeURIComponent(orderNumber)}`} className="btn-primary inline-flex items-center justify-center gap-2">
              <Package className="w-4 h-4" /> Track Order
            </Link>
          )}
          <Link href="/products" className="btn-outline inline-flex items-center justify-center gap-2">
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="animate-pulse">
          <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-6" />
          <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-4" />
          <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto" />
        </div>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}
