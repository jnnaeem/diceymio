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

export default function Home() {
  const { user, restoreFromStorage } = useAuthStore();
  const { items, setItems } = useCartStore();
  const { onOpen } = useCartSheetStore();

  useEffect(() => {
    restoreFromStorage();
  }, [restoreFromStorage]);

  const { data: cartData, error } = useSWR(user ? 'storefrontCart' : null, cartAPI.getCart);

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
    <div className="min-h-screen bg-[#f8fafc] selection:bg-blue-100">
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
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-16 lg:pt-32 lg:pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
              <div className="text-center lg:text-left mb-12 lg:mb-0">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-6 animate-fade-in">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  New Arrivals Available
                </div>
                <h1 className="text-5xl sm:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-8">
                  Elevate Your <br />
                  <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600">
                    Game Night
                  </span>
                </h1>
                <p className="text-lg text-slate-600 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Discover an expertly curated collection of top-tier board
                  games. From strategy masterpieces to hilarious party games, we
                  bring world-class entertainment to your tabletop.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    href="/products"
                    className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 hover:shadow-2xl transition-all hover:-translate-y-1 active:scale-95 text-center"
                  >
                    Explore Collection
                  </Link>
                  <Link
                    href="/how-it-works"
                    className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all text-center"
                  >
                    Learn More
                  </Link>
                </div>

                <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                  <div className="font-bold text-slate-900 italic">
                    Trusted by 10k+ Gamers
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-4 bg-linear-to-r from-blue-100 to-purple-100 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                <div className="relative aspect-4/3 rounded-[2.5rem] overflow-hidden shadow-2xl glass p-2 border border-white/40">
                  <div className="absolute inset-x-0 bottom-0 p-8 z-20 bg-linear-to-t from-slate-900/40 to-transparent">
                    <p className="text-white font-medium text-lg leading-snug">
                      "Diceymio has the best selection of Eurogames I've seen.
                      Fast shipping and great support!"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[400px] h-[400px] bg-indigo-100/30 rounded-full blur-3xl"></div>
        </section>

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

      {/* Footer */}
      <footer className="bg-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-8">
                <span className="text-4xl">🎲</span>
                <span className="text-2xl font-black text-white">Diceymio</span>
              </div>
              <p className="text-slate-400 max-w-sm leading-relaxed">
                The ultimate destination for board game lovers. Quality service,
                curated selection, and a community focus.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">
                Shop
              </h4>
              <ul className="space-y-4 text-slate-400">
                <li>
                  <Link
                    href="/products"
                    className="hover:text-blue-400 transition-colors"
                  >
                    All Games
                  </Link>
                </li>
                <li>
                  <Link
                    href="/bundles"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Bundles
                  </Link>
                </li>
                <li>
                  <Link
                    href="/new"
                    className="hover:text-blue-400 transition-colors"
                  >
                    New Arrivals
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">
                Support
              </h4>
              <ul className="space-y-4 text-slate-400">
                <li>
                  <Link
                    href="/shipping"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link
                    href="/returns"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Returns
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
            <p>
              &copy; {new Date().getFullYear()} Diceymio. Designed for the
              tabletop elite.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
