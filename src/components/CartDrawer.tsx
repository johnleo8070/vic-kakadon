"use client";

import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CartDrawer() {
  const { state, dispatch, totalItems, totalPrice } = useCart();

  if (!state.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={() => dispatch({ type: "TOGGLE_CART" })} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold font-serif">Shopping Cart ({totalItems})</h2>
          </div>
          <button onClick={() => dispatch({ type: "TOGGLE_CART" })} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {state.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">Your cart is empty</p>
              <Link
                href="/products"
                onClick={() => dispatch({ type: "TOGGLE_CART" })}
                className="mt-4 btn-primary"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {state.items.map((item, index) => (
                <div key={`${item.productId}-${item.size}-${item.color}-${index}`} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 relative">
                    <Image src={item.productImage || "/images/placeholder.jpg"} alt={item.productName} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">{item.productName}</h3>
                    <p className="text-xs text-gray-500">Size: {item.size || "N/A"} | Color: {item.color || "N/A"}</p>
                    <p className="text-primary font-bold mt-1">{formatPrice(item.price)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => {
                          if (item.quantity > 1) {
                            dispatch({
                              type: "UPDATE_QUANTITY",
                              payload: { ...item, quantity: item.quantity - 1 },
                            });
                          }
                        }}
                        className="w-6 h-6 flex items-center justify-center bg-white border rounded hover:bg-gray-100"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() =>
                          dispatch({
                            type: "UPDATE_QUANTITY",
                            payload: { ...item, quantity: item.quantity + 1 },
                          })
                        }
                        className="w-6 h-6 flex items-center justify-center bg-white border rounded hover:bg-gray-100"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() =>
                          dispatch({
                            type: "REMOVE_ITEM",
                            payload: { productId: item.productId, size: item.size, color: item.color },
                          })
                        }
                        className="ml-auto p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div className="border-t p-4 space-y-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span className="text-primary">{formatPrice(totalPrice)}</span>
            </div>
            <p className="text-xs text-gray-500 text-center">Delivery fee not included. Our team will contact you for delivery details.</p>
            <Link href="/checkout" onClick={() => dispatch({ type: "TOGGLE_CART" })} className="btn-primary w-full text-center block">
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
