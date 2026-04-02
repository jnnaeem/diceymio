"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, token } = useAuthStore();
  console.log(user);
  const isAuthenticated = !!token;
  const router = useRouter();
  
  // Sidebar states matching reference project
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [onHoverSidebarCollapsed, setOnHoverSidebarCollapsed] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "ADMIN") {
      router.push("/auth/login");
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== "ADMIN") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-[#0f1115]">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#0f1115] transition-colors duration-300">
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
        className={cn(
          "flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out",
          isSidebarCollapsed ? "xl:pl-[96px]" : "xl:pl-[296px]"
        )}
      >
        <AdminHeader
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
          isSheetOpen={isSheetOpen}
          setIsSheetOpen={setIsSheetOpen}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="max-w-7xl mx-auto w-full h-full">
            {children}
          </div>
        </main>

        <footer className="py-6 px-6 border-t border-[#e2e8f0] dark:border-[#2e333d] text-center text-sm text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} Dycemio Admin. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}


