"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useCartSheetStore } from "@/store/cartSheetStore";
import { useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { cartAPI } from "@/lib/services";
import { toast } from "sonner";
import useSWR from "swr";
import { HeroSlider } from "@/components/home/HeroSlider";

export default function Home() {
  const { user, restoreFromStorage } = useAuthStore();
  const { items, setItems } = useCartStore();
  const { onOpen } = useCartSheetStore();

  useEffect(() => {
    restoreFromStorage();
  }, [restoreFromStorage]);

  const { data: cartData, error } = useSWR(
    user ? "storefrontCart" : null,
    cartAPI.getCart
  );

  useEffect(() => {
    if (cartData) {
      setItems(cartData.items);
    }
  }, [cartData, setItems]);

  useEffect(() => {
    if (error) {
      toast.error("Failed to sync cart data");
    }
  }, [error]);

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-3xl filter transition-transform group-hover:rotate-12 duration-300">
                🎲
              </span>
              <span className="text-2xl font-black bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-indigo-600">
                Diceymio
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {user ? (
                <>
                  <Link
                    href="/products"
                    className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Store
                  </Link>
                  <Link
                    href="/orders"
                    className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Orders
                  </Link>
                  <button
                    onClick={onOpen}
                    className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer group"
                    title="Cart"
                  >
                    <ShoppingCart className="size-5" />
                    {items?.length > 0 && (
                      <span className="absolute top-0 right-0 size-4 bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                        {items.length}
                      </span>
                    )}
                  </button>
                  {user.role === "ADMIN" && (
                    <Link
                      href="/dashboard"
                      className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
                    >
                      Dashboard
                    </Link>
                  )}
                  <div className="w-10 h-10 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200">
                    {user.firstName?.[0] || user.email[0].toUpperCase()}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-4">
                  <Link
                    href="/auth/login"
                    className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-full hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200 transition-all active:scale-95"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main>
        <HeroSlider />

        {/* Features Section */}
        <section className="py-24 bg-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <h2 className="text-blue-600 font-bold tracking-tight uppercase text-sm mb-4">
                Premium Service
              </h2>
              <p className="text-4xl font-bold text-slate-900 mb-6">
                Built for the Tabletop Community
              </p>
              <div className="h-1.5 w-20 bg-blue-600 mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="group hover-lift p-8 rounded-3xl bg-slate-50 border border-slate-100 transition-colors hover:bg-white hover:border-blue-100">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-slate-100 mb-8 transition-transform group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white">
                  🎯
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Curated Choice
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  We don't stock everything. We only stock the best. Every game
                  is personally vetted by our team of enthusiasts.
                </p>
              </div>

              <div className="group hover-lift p-8 rounded-3xl bg-slate-50 border border-slate-100 transition-colors hover:bg-white hover:border-blue-100">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-slate-100 mb-8 transition-transform group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white">
                  ⚡
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Sprint Delivery
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Order by 2 PM for same-day dispatch. Our custom packaging
                  ensures your game reaches you in mint condition.
                </p>
              </div>

              <div className="group hover-lift p-8 rounded-3xl bg-slate-50 border border-slate-100 transition-colors hover:bg-white hover:border-blue-100">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-slate-100 mb-8 transition-transform group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white">
                  🔐
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Elite Support
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Have questions about mechanics? Our staff includes competitive
                  players who can guide you to your perfect match.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
