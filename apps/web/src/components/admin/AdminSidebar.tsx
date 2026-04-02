"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./Sheet";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "/dashboard/products",
    icon: Package,
  },
  {
    title: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    title: "Customers",
    href: "/dashboard/customers",
    icon: Users,
  },
];

interface SidebarProps {
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  onHoverSidebarCollapsed: boolean;
  setOnHoverSidebarCollapsed: (hovered: boolean) => void;
  isSheetOpen: boolean;
  setIsSheetOpen: (open: boolean) => void;
}

export default function AdminSidebar({
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  onHoverSidebarCollapsed,
  setOnHoverSidebarCollapsed,
  isSheetOpen,
  setIsSheetOpen,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();

  useEffect(() => {
    setIsSheetOpen(false);
  }, [pathname, setIsSheetOpen]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const SidebarContent = ({ collapsed }: { collapsed: boolean }) => (
    <div
      className={cn(
        "h-full border border-[#e2e8f0] dark:border-[#2e333d] rounded-xl overflow-hidden flex flex-col bg-white dark:bg-[#191B1F] transition-all duration-300 shadow-sm",
        collapsed ? "w-[72px]" : "w-[248px]"
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b border-[#f1f5f9] dark:border-[#2e333d] h-[70px] flex items-center">
        <Link href="/" className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xl">
            🎲
          </div>
          {!collapsed && (
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent whitespace-nowrap">
              Dycemio
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className={cn("flex-1 overflow-y-auto my-3", collapsed ? "px-3" : "px-4")}>
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 text-sm font-medium px-2.5 py-3 rounded-[10px] transition-all duration-200 group",
                  isActive
                    ? "bg-blue-600/10 text-blue-600 dark:bg-blue-600/20 dark:text-blue-400 shadow-sm shadow-blue-600/5"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
                )}
              >
                <span className={cn(collapsed && "w-full flex justify-center")}>
                  <Icon className={cn("size-5 transition-transform duration-200", isActive && "scale-110")} />
                </span>
                {!collapsed && (
                  <div className="grow whitespace-nowrap font-medium">{item.title}</div>
                )}
                {!collapsed && isActive && <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer / Logout */}
      <div className="border-t border-[#f1f5f9] dark:border-[#2e333d] p-4">
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 w-full text-sm font-medium px-2.5 py-3 rounded-[10px] text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 transition-all duration-200",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="size-5" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="xl:block hidden fixed top-0 bottom-0 py-6 pl-6 z-40 transition-all duration-300"
        onMouseEnter={() => {
          if (isSidebarCollapsed && !onHoverSidebarCollapsed) {
            setIsSidebarCollapsed(false);
            setOnHoverSidebarCollapsed(true);
          }
        }}
        onMouseLeave={() => {
          if (!isSidebarCollapsed && onHoverSidebarCollapsed) {
            setIsSidebarCollapsed(true);
            setOnHoverSidebarCollapsed(false);
          }
        }}
      >
        <SidebarContent collapsed={isSidebarCollapsed} />
      </aside>

      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="left" className="p-0 border-none bg-transparent shadow-none">
          <SheetHeader className="hidden">
            <SheetTitle>Admin Menu</SheetTitle>
            <SheetDescription>Navigate through the admin platform</SheetDescription>
          </SheetHeader>
          <div className="h-full py-3 pl-3 pr-0">
            <SidebarContent collapsed={false} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
