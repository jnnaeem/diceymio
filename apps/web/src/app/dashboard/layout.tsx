"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, restoreFromStorage } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    restoreFromStorage();
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready && (!user || user.role !== "ADMIN")) {
      router.push("/auth/login");
    }
  }, [ready, user, router]);

  if (!ready || !user || user.role !== "ADMIN") {
    return (
      <div className="admin-loading">
        <div className="admin-loading-spinner" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className={`admin-main ${collapsed ? "sidebar-collapsed" : "sidebar-expanded"}`}>
        <AdminHeader
          onMenuClick={() => setMobileOpen(true)}
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />
        <main className="admin-content">
          {children}
        </main>
        <footer className="admin-footer">
          <p>© {new Date().getFullYear()} Dycemio. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
