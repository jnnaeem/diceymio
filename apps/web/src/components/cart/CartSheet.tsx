"use client";

import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCartStore } from "@/store/cartStore";
import { useCartSheetStore } from "@/store/cartSheetStore";
import { getProductImageUrl } from "@/lib/utils";
import { Minus, Plus, Trash2, X, Ticket, BadgePercent } from "lucide-react";
import { toast } from "sonner";
import { cartAPI, couponAPI } from "@/lib/services";
import { useAuthStore } from "@/store/authStore";

export default function CartSheet() {
  const { isOpen, onClose } = useCartSheetStore();
  const {
    items,
    setItems,
    removeItem,
    updateQuantity,
    getSubtotal,
    getDiscount,
    getTotal,
    appliedCoupon,
    setAppliedCoupon,
  } = useCartStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [validating, setValidating] = useState(false);

  // Sync with API when sheet opens
  useEffect(() => {
    if (isOpen && user) {
      loadCart();
    }
  }, [isOpen, user]);

  const loadCart = async () => {
    setLoading(true);
    try {
      const data = await cartAPI.getCart();
      setItems(data.items);
    } catch (err) {
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await cartAPI.updateItem(itemId, { quantity: newQuantity });
      updateQuantity(itemId, newQuantity);
    } catch (err) {
      toast.error("Failed to update quantity");
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await cartAPI.removeItem(itemId);
      removeItem(itemId);
      toast.success("Item removed from cart");
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setValidating(true);
    try {
      const simplifiedItems = items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
      }));
      const result = await couponAPI.validate(couponCode, simplifiedItems);
      setAppliedCoupon(result);
      toast.success(`Coupon "${result.code}" applied!`);
      setShowCouponInput(false);
      setCouponCode("");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Invalid coupon code");
    } finally {
      setValidating(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    toast.info("Coupon removed");
  };

  const handlePlaceOrder = () => {
    toast.info("Checkout feature is coming soon!");
  };

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const total = getTotal();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md bg-[#0B1710] border-l border-[#1A2E23] text-white p-0 flex flex-col h-full">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-[#1A2E23] flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold tracking-tight">CART</h2>
            <span className="bg-[#1D4D32] text-[#55FF82] text-[10px] font-bold px-2 py-0.5 rounded-full">
              {items.length} {items.length === 1 ? "item" : "items"}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
              <div className="size-16 rounded-full bg-[#1A2E23] flex items-center justify-center mb-4">
                <Trash2 className="size-8 text-gray-400" />
              </div>
              <p className="text-lg font-medium">Your cart is empty</p>
              <p className="text-sm">Add some games to get started!</p>
            </div>
          ) : (
            <div className="space-y-8">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 group">
                  {/* Product Image */}
                  <div className="relative size-20 shrink-0 bg-[#1A2E23] rounded-xl overflow-hidden border border-[#2B4738]">
                    <img
                      src={getProductImageUrl(item.product.image)!}
                      alt={item.product.name}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#0B1710]/40 to-transparent" />
                  </div>

                  {/* Product Info */}
                  <div className="grow flex flex-col justify-between py-0.5">
                    <div className="flex justify-between gap-2">
                      <h3 className="text-sm font-bold text-gray-100 line-clamp-1">
                        {item.product.name}
                      </h3>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-gray-500 hover:text-red-400 shrink-0 p-2 bg-[#1A2E23] rounded-md border border-[#2B4738] cursor-pointer active:scale-95 transition-all"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#FFD700]">
                        TK. {item.product.price.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-gray-500 line-through">
                        TK.{" "}
                        {(item.product.price * 1.2).toFixed(0).toLocaleString()}
                      </span>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center w-fit bg-[#1A2E23] rounded-lg border border-[#2B4738] overflow-hidden mt-2">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity - 1)
                        }
                        className="px-2 py-1 hover:bg-[#2B4738] transition-colors text-gray-400"
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="px-3 text-xs font-bold text-gray-100 min-w-[24px] text-center border-x border-[#2B4738]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity + 1)
                        }
                        className="px-2 py-1 hover:bg-[#2B4738] transition-colors text-gray-300"
                      >
                        <Plus className="size-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 pt-4 border-t border-[#1A2E23] bg-[#0B1710]/80 backdrop-blur-md">
            {/* Coupon Section */}
            {!appliedCoupon ? (
              <div className="mb-6">
                {!showCouponInput ? (
                  <button
                    onClick={() => setShowCouponInput(true)}
                    className="text-[10px] font-bold text-gray-300 hover:text-white transition-colors underline underline-offset-4 tracking-widest uppercase flex items-center gap-2"
                  >
                    <Ticket className="size-3" /> Apply Coupon
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="COUPON CODE"
                      value={couponCode}
                      onChange={(e) =>
                        setCouponCode(e.target.value.toUpperCase())
                      }
                      className="flex-1 bg-[#1A2E23] border border-[#2B4738] rounded-lg px-3 py-2 text-xs font-bold tracking-widest placeholder:text-gray-600 focus:outline-none focus:border-[#55FF82] transition-colors uppercase"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={validating || !couponCode}
                      className="bg-[#55FF82] text-[#0A140F] px-4 py-2 rounded-lg text-[10px] font-black uppercase hover:bg-[#45EE72] transition-all disabled:opacity-50 disabled:grayscale"
                    >
                      {validating ? "..." : "APPLY"}
                    </button>
                    <button
                      onClick={() => setShowCouponInput(false)}
                      className="text-gray-500 hover:text-white"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between bg-[#1D4D32]/30 border border-[#1D4D32] rounded-lg p-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-[#1D4D32] flex items-center justify-center">
                    <BadgePercent className="size-4 text-[#55FF82]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#55FF82] tracking-widest uppercase">
                      Coupon Applied
                    </p>
                    <p className="text-xs font-black text-white">
                      {appliedCoupon.code}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRemoveCoupon}
                  className="text-gray-500 hover:text-red-400 transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>
            )}

            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-500">
                  SUBTOTAL
                </span>
                <span className="text-sm font-bold text-gray-200">
                  TK. {subtotal.toLocaleString()}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between items-center text-[#55FF82]">
                  <span className="text-xs font-medium">DISCOUNT</span>
                  <span className="text-sm font-bold">
                    - TK. {discount.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center pt-2 border-t border-[#1A2E23]">
                <span className="text-sm font-bold text-gray-100">TOTAL</span>
                <span className="text-lg font-black text-white">
                  TK. {total.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="w-full bg-[#E5E961] hover:bg-[#D4D84F] text-[#0A140F] font-black py-4 rounded-xl transition-all active:scale-95 shadow-[0_0_20px_rgba(229,233,97,0.15)] uppercase tracking-wider text-xs cursor-pointer"
            >
              Place Order (COD)
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
