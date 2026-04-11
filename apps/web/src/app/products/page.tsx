"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { productAPI, cartAPI } from "@/lib/services";
import { Product } from "@/types";
import { useRouter } from "next/navigation";
import { getProductImageUrl } from "@/lib/utils";
import { useCartSheetStore } from "@/store/cartSheetStore";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/admin/LoadingSpinner";

export default function ProductsPage() {
  const router = useRouter();
  const { user, restoreFromStorage } = useAuthStore();
  const { addItem, updateQuantity } = useCartStore();
  const { onOpen } = useCartSheetStore();

  const {
    data: products = [],
    error,
    isLoading: loading,
  } = useSWR<Product[]>("storefrontProducts", productAPI.getAll);

  useEffect(() => {
    restoreFromStorage();
  }, []);

  const handleAddToCart = async (product: Product) => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    try {
      const { items } = useCartStore.getState();
      const existingItem = items.find((item) => item.productId === product.id);

      if (existingItem) {
        const newQuantity = existingItem.quantity + 1;
        await cartAPI.updateItem(existingItem.id, { quantity: newQuantity });
        updateQuantity(existingItem.id, newQuantity);
      } else {
        const response = await cartAPI.addItem({
          productId: product.id,
          quantity: 1,
        });
        addItem(response);
      }

      onOpen(); // Open the cart sheet after adding
      toast.success("Added to cart!");
    } catch (err) {
      toast.error("Failed to add to cart");
    }
  };

  if (loading) return <LoadingSpinner />;

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
                href="/cart"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Cart
              </Link>
              <Link
                href="/orders"
                className="text-gray-600 hover:text-gray-900"
              >
                Orders
              </Link>
              {user?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Admin
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Our Games</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              {product.image && (
                <div className="bg-gray-200 h-48 flex items-center justify-center">
                  <img
                    src={getProductImageUrl(product.image)!}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                {product.description && (
                  <p className="text-sm text-gray-600 mb-3">
                    {product.description}
                  </p>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">
                    ${product.price}
                  </span>
                  <span className="text-sm text-gray-500">
                    Stock: {product.stock}
                  </span>
                </div>
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                  className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
