"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { orderAPI } from "@/lib/services";
import { toast } from "sonner";
import { Order } from "@/types";
import { getProductImageUrl } from "@/lib/utils";
import { LoadingSpinner } from "@/components/admin/LoadingSpinner";
import useSWR from "swr";

export default function OrdersPage() {
  const router = useRouter();
  const { user, restoreFromStorage } = useAuthStore();
  const {
    data: orders = [],
    error,
    isLoading: loading,
  } = useSWR<Order[]>(user ? "storefrontOrders" : null, orderAPI.getOrders);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    restoreFromStorage();
    setAuthLoading(false);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) return <LoadingSpinner />;

  return (
    <div className="min-h-svh bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              🎲 Diceymio
            </Link>
            <div className="flex gap-4">
              <Link
                href="/products"
                className="text-gray-600 hover:text-gray-900"
              >
                Shop
              </Link>
              <Link href="/cart" className="text-gray-600 hover:text-gray-900">
                Cart
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Orders */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Your Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              You haven't placed any orders yet
            </p>
            <Link
              href="/products"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border border-gray-200 rounded-lg p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Order {order.orderNumber}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">
                      ${Number(order.totalAmount).toFixed(2)}
                    </p>
                    <p className="text-sm">
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
                        {order.status}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-semibold mb-2">Items:</h4>
                  <ul className="space-y-2">
                    {order.items.map((item) => (
                      <li
                        key={item.id}
                        className="flex gap-4 items-center border-b border-gray-100 last:border-0 pb-4 last:pb-0"
                      >
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded border border-gray-200">
                          <img
                            src={getProductImageUrl(item.product.image)!}
                            alt={item.product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {item.product.name} x {item.quantity}
                          </p>
                          <p className="text-sm text-gray-500">
                            Price: ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
