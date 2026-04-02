"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { cn } from "@/lib/utils";
import { AdminFooter } from "@/components/admin/Footer";
import { LoadingSpinner } from "@/components/admin/LoadingSpinner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, token, restoreFromStorage } = useAuthStore();
  const isAuthenticated = !!token;
  const router = useRouter();

  // Sidebar states matching reference project
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [onHoverSidebarCollapsed, setOnHoverSidebarCollapsed] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    restoreFromStorage();
    setIsHydrated(true);
  }, [restoreFromStorage]);

  useEffect(() => {
    if (isHydrated && (!isAuthenticated || user?.role !== "ADMIN")) {
      router.push("/auth/login");
    }
  }, [isHydrated, isAuthenticated, user, router]);

  if (!isHydrated || !isAuthenticated || user?.role !== "ADMIN") {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex">
      {/* Sidebar Component */}
      <AdminSidebar
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        onHoverSidebarCollapsed={onHoverSidebarCollapsed}
        setOnHoverSidebarCollapsed={setOnHoverSidebarCollapsed}
        isSheetOpen={isSheetOpen}
        setIsSheetOpen={setIsSheetOpen}
      />

      {/* Main Content Area */}
      <div
        className={`${isSidebarCollapsed ? "xl:pl-24" : "xl:pl-[272px]"} w-full transition-all duration-300`}
      >
        <div className="flex flex-col justify-between w-full min-h-svh">
          <AdminHeader
            isSidebarCollapsed={isSidebarCollapsed}
            setIsSidebarCollapsed={setIsSidebarCollapsed}
            isSheetOpen={isSheetOpen}
            setIsSheetOpen={setIsSheetOpen}
          />

          <main className="flex-1 mt-6 overflow-y-auto sm:px-6 px-3">
            {children}
          </main>
          <AdminFooter />
        </div>
      </div>
    </div>
  );
}
