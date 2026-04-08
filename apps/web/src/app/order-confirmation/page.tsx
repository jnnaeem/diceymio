import Link from "next/link";
import { Check, CircleCheckBig } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrderConfirmationPage() {
  // Mock data for now
  const orderDetails = {
    fullName: "Zahidul Hossain",
    mobileNumber: "+8801335566441",
    fullAddress: "Avenue 12, Block C, Banani, Dhaka 1213",
    orderId: "#DI00311",
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden py-24">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center md:bg-bottom bg-no-repeat"
        style={{ backgroundImage: "url('/images/common-hero-bg.png')" }}
      />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-3xl mx-auto px-6 flex flex-col items-center">
        {/* Success Icon */}
        <div className="flex items-center justify-center mb-6">
          <CircleCheckBig className="size-8 text-[#EAEA4C]" strokeWidth={3} />
        </div>

        {/* Heading */}
        <h1 className="text-xl md:text-2xl font-medium text-[#FEF5DE] uppercase mb-2 text-center">
          Your Order is Confirmed
        </h1>
        <p className="text-[#FEF5DECC] text-sm text-center mb-10">
          Regular orders usually get handled in about 5 business days.
        </p>

        {/* Order Details Card */}
        <div className="w-full bg-[#FFFFFF0F] backdrop-blur-md border border-[#FFFFFF2B] rounded-xl overflow-hidden mb-12">
          <div className="p-4 md:p-6">
            <h2 className="text-[#FEF5DE] text-base sm:text-lg font-medium uppercase mb-6">
              Delivery To:
            </h2>

            <div className="space-y-0">
              {/* Row: Full Name */}
              <div className="flex flex-col sm:flex-row sm:items-center py-4 border-b border-[#FFFFFF1A]">
                <span className="text-[#FEF5DECC] text-sm w-full sm:w-1/3 mb-1 sm:mb-0">
                  Full Name
                </span>
                <span className="text-[#FEF5DECC] text-sm sm:w-2/3">
                  {orderDetails.fullName}
                </span>
              </div>

              {/* Row: Mobile Number */}
              <div className="flex flex-col sm:flex-row sm:items-center py-4 border-b border-[#FFFFFF1A]">
                <span className="text-[#FEF5DECC] text-sm w-full sm:w-1/3 mb-1 sm:mb-0">
                  Mobile Number
                </span>
                <span className="text-[#FEF5DECC] text-sm sm:w-2/3">
                  {orderDetails.mobileNumber}
                </span>
              </div>

              {/* Row: Full Address */}
              <div className="flex flex-col sm:flex-row sm:items-center py-4 border-b border-[#FFFFFF1A]">
                <span className="text-[#FEF5DECC] text-sm w-full sm:w-1/3 mb-1 sm:mb-0">
                  Full Address
                </span>
                <span className="text-[#FEF5DECC] text-sm sm:w-2/3 leading-relaxed">
                  {orderDetails.fullAddress}
                </span>
              </div>

              {/* Row: Order ID */}
              <div className="flex flex-col sm:flex-row sm:items-center py-4">
                <span className="text-[#FEF5DECC] text-sm w-full sm:w-1/3 mb-1 sm:mb-0">
                  Order ID
                </span>
                <span className="text-[#FEF5DECC] text-sm sm:w-2/3 font-medium">
                  {orderDetails.orderId}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Shopping Button */}
        <Link href="/products">
          <Button className="bg-[#69E5BB] hover:bg-[#50d0a6] text-[#12100A] text-base font-semibold uppercase rounded-lg px-6 py-3 h-auto border border-b-[3px] border-[#008C5C] transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}
