"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { cartAPI, orderAPI } from "@/lib/services";
import { Cart } from "@/types";
import { getProductImageUrl } from "@/lib/utils";

export default function CartPage() {
  const router = useRouter();
  const { user, restoreFromStorage } = useAuthStore();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    restoreFromStorage();
  }, []);

  useEffect(() => {
    if (!user && !loading) {
      router.push("/auth/login");
    } else if (user) {
      loadCart();
    }
  }, [user]);

  const loadCart = async () => {
    try {
      const data = await cartAPI.getCart();
      setCart(data);
    } catch (err) {
      console.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await cartAPI.removeItem(itemId);
      loadCart();
    } catch (err) {
      alert("Failed to remove item");
    }
  };

  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) {
      alert("Cart is empty");
      return;
    }

    // For now, we'll need a shipping address
    // In a real app, we'd show address selection/entry
    alert(
      "Please add a shipping address first. This feature needs to be implemented."
    );
  };

  const total = cart?.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  ) || 0;

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              🎲 Dycemio
            </Link>
            <div className="flex gap-4">
              <Link
                href="/products"
                className="text-gray-600 hover:text-gray-900"
              >
                Shop
              </Link>
              <Link
                href="/orders"
                className="text-gray-600 hover:text-gray-900"
              >
                Orders
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Cart */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        {!cart || cart.items.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <Link
              href="/products"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 border-b border-gray-200 pb-4 mb-4 items-center"
                >
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img
                      src={getProductImageUrl(item.product.image)!}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">
                      {item.product.name}
                    </h3>
                    <p className="text-gray-600">
                      ${item.product.price} x {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-600 text-sm hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 p-6 rounded-lg h-fit">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4 mb-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                disabled={checkingOut}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {checkingOut ? "Processing..." : "Checkout"}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
