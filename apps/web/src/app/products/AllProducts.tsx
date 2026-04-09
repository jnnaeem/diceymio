"use client";

import { useEffect } from "react";
import useSWR from "swr";
import { FaStar, FaUsers } from "react-icons/fa";
import { LuClock4 } from "react-icons/lu";
import { RiDashboardFill } from "react-icons/ri";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { productAPI, cartAPI } from "@/lib/services";
import { Product } from "@/types";
import { useRouter } from "next/navigation";
import { getProductImageUrl } from "@/lib/utils";
import { useCartSheetStore } from "@/store/cartSheetStore";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/admin/LoadingSpinner";

const cardThemes = [
  {
    wrapper: "border-[#FDE5A7] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),rgba(255,255,255,0))]",
    card: "bg-gradient-to-b from-[#1D2108] via-[#1F280A] to-[#152518]",
    accent: "text-[#F7D461]",
    badge: "bg-[#F7D461]/10 text-[#F7D461] border-[#F7D461]",
  },
  {
    wrapper: "border-[#8ED6A4] bg-[radial-gradient(circle_at_top,rgba(110,220,160,0.12),rgba(255,255,255,0))]",
    card: "bg-gradient-to-b from-[#0C291D] via-[#0E3628] to-[#051B12]",
    accent: "text-[#8ED6A4]",
    badge: "bg-[#8ED6A4]/10 text-[#8ED6A4] border-[#8ED6A4]",
  },
  {
    wrapper: "border-[#D07F0F] bg-[radial-gradient(circle_at_top,rgba(208,127,15,0.12),rgba(255,255,255,0))]",
    card: "bg-gradient-to-b from-[#2B1D07] via-[#362C0E] to-[#191103]",
    accent: "text-[#F7C66C]",
    badge: "bg-[#F7C66C]/10 text-[#F7C66C] border-[#F7C66C]",
  },
];

function ProductCard({ product, themeIndex, onAdd }: { product: Product; themeIndex: number; onAdd: (product: Product) => Promise<void> }) {
  const theme = cardThemes[themeIndex % cardThemes.length];
  const imageUrl = product.image ? getProductImageUrl(product.image) : "/images/goyendagiri.png";
  const discount = 20;
  const rating = 5.0;

  return (
    <article className={`relative overflow-hidden rounded-4xl border ${theme.wrapper} shadow-[0_20px_80px_rgba(0,0,0,0.15)] transition-transform hover:-translate-y-1`}>
      <div className={`relative flex h-full flex-col ${theme.card} border border-white/10 p-5 sm:p-6 rounded-[28px]`}>
        <div className="flex items-center justify-between gap-3">
          <span className={`inline-flex items-center justify-center rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${theme.badge}`}>
            {discount}% OFF
          </span>
          <div className="inline-flex items-center gap-2 rounded-full bg-black/20 px-3 py-1 text-sm text-[#F5F0D5]">
            <FaStar className="h-3.5 w-3.5 text-[#F7D461]" />
            <span>{rating.toFixed(2)}</span>
          </div>
        </div>

        <div className="relative mt-5 flex-1 overflow-hidden rounded-[28px] border border-white/10 bg-[#090D08] p-4">
          <div className="relative mx-auto h-56 w-full max-w-55">
            <img
              src={imageUrl || "/images/goyendagiri.png"}
              alt={product.name}
              className="absolute inset-0 h-full w-full object-contain"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white">{product.name}</h3>
            <p className="text-sm text-[#C7D7BC] line-clamp-2">
              {product.description || "A premium board game experience for families and friends."}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-[11px] text-[#D9E8C9]">
            <div className="flex flex-col items-center gap-2">
              <FaUsers className="h-4 w-4 text-[#F7D461]" />
              <span>3-6 Players</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <LuClock4 className="h-4 w-4 text-[#F7D461]" />
              <span>30-45 min</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <RiDashboardFill className="h-4 w-4 text-[#F7D461]" />
              <span>Board game</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-sm uppercase tracking-[0.2em] text-[#B8C99C]">Price</div>
              <div className="text-2xl font-bold text-white">TK. {product.price}</div>
            </div>
            <button
              type="button"
              onClick={() => onAdd(product)}
              disabled={product.stock === 0}
              className="inline-flex items-center justify-center rounded-full bg-[#F7D461] px-6 py-3 text-sm font-semibold uppercase text-[#12100A] shadow-[0_15px_30px_rgba(247,212,97,0.25)] transition hover:bg-[#E6CB4D] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export function AllProducts() {
  const router = useRouter();
  const { user, restoreFromStorage } = useAuthStore();
  const { addItem, updateQuantity } = useCartStore();
  const { onOpen } = useCartSheetStore();
  const { data: products = [], error, isLoading: loading } = useSWR<Product[]>("storefrontProducts", productAPI.getAll);

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

      onOpen();
      toast.success("Added to cart!");
    } catch (err) {
      toast.error("Failed to add to cart");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <section className="relative overflow-hidden py-16 lg:py-24">
      <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/common-section-bg.png')" }} />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-[#C7D7BC]">Diceymio Games</p>
            <h1 className="text-4xl font-bold text-white sm:text-5xl">Discover your next favorite board game</h1>
          </div>
          <button className="flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm uppercase tracking-[0.3em] text-white transition hover:bg-white/10">
            Best Selling
          </button>
        </div>

        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} themeIndex={index} onAdd={handleAddToCart} />
          ))}
        </div>
      </div>
    </section>
  );
}
