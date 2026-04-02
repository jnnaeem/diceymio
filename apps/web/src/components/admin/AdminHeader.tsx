"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Search, ExternalLink, Moon, Sun, Maximize } from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";
import NotificationDropdown from "./NotificationDropdown";

interface HeaderProps {
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  isSheetOpen: boolean;
  setIsSheetOpen: (open: boolean) => void;
}

export default function AdminHeader({
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  isSheetOpen,
  setIsSheetOpen,
}: HeaderProps) {
  return (
    <header className="sm:pt-6 pt-3 sm:px-6 px-3 w-full sticky top-0 z-40">
      <div className="bg-white/80 dark:bg-[#191B1F]/80 backdrop-blur-md w-full sm:px-6 px-4 rounded-xl border border-[#e2e8f0] dark:border-[#2e333d] shadow-sm transition-all duration-300">
        <div className="flex justify-between items-center gap-5 h-[70px]">
          {/* Left Side: Toggles */}
          <div className="flex items-center gap-4">
            {/* Desktop Toggle */}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="xl:flex hidden cursor-pointer items-center justify-center size-10 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all duration-200"
              aria-label="Toggle Sidebar"
            >
              <div className="flex flex-col justify-between w-5 h-4 transform transition-all duration-300 origin-center overflow-hidden rotate-180">
                <div className={cn("bg-slate-800 dark:bg-slate-200 h-0.5 transform transition-all duration-300 origin-left delay-75", isSidebarCollapsed && "rotate-[42deg] w-[11px]")}></div>
                <div className={cn("bg-slate-800 dark:bg-slate-200 h-0.5 w-5 rounded transform transition-all duration-300", isSidebarCollapsed && "opacity-0 translate-x-3")}></div>
                <div className={cn("bg-slate-800 dark:bg-slate-200 h-0.5 transform transition-all duration-300 origin-left delay-75", isSidebarCollapsed && "-rotate-[42deg] w-[11px]")}></div>
              </div>
            </button>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsSheetOpen(true)}
              className="xl:hidden flex items-center justify-center size-10 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all duration-200"
              aria-label="Open Menu"
            >
              <div className="flex flex-col justify-between w-5 h-3.5 transform transition-all duration-300 origin-center overflow-hidden rotate-180">
                <div className={cn("bg-slate-800 dark:bg-slate-200 h-0.5 transform transition-all duration-300 origin-left", isSheetOpen && "rotate-[42deg] w-[11px]")}></div>
                <div className={cn("bg-slate-800 dark:bg-slate-200 h-0.5 w-5 rounded transform transition-all duration-300", isSheetOpen && "opacity-0 translate-x-3")}></div>
                <div className={cn("bg-slate-800 dark:bg-slate-200 h-0.5 transform transition-all duration-300 origin-left", isSheetOpen && "-rotate-[42deg] w-[11px]")}></div>
              </div>
            </button>

            {/* Search (Optional, matching reference aesthetics) */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-[#2e333d] text-slate-400 focus-within:ring-2 focus-within:ring-blue-600/20 focus-within:border-blue-600/20 transition-all group">
              <Search className="size-4 group-focus-within:text-blue-600" />
              <input
                type="text"
                placeholder="Search anything..."
                className="bg-transparent border-none outline-none text-sm text-slate-800 dark:text-slate-200 w-48 placeholder:text-slate-400"
              />
              <span className="text-[10px] font-bold bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 px-1.5 py-0.5 rounded shadow-sm">
                ⌘K
              </span>
            </div>
          </div>

          {/* Right Side: Actions */}
          <div className="flex items-center gap-2 sm:gap-4 h-full">
            {/* View Store */}
            <Link
              href="/"
              className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <span>Store</span>
              <ExternalLink className="size-4" />
            </Link>

            <div className="h-6 w-px bg-slate-200 dark:bg-white/5 hidden sm:block mx-1" />

            <div className="flex items-center gap-1">
              <button className="hidden sm:flex items-center justify-center size-9 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 transition-all">
                <Maximize className="size-4.5" />
              </button>
              <button className="flex items-center justify-center size-9 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 transition-all">
                <Sun className="size-4.5" />
              </button>
              <NotificationDropdown />
            </div>

            <div className="h-6 w-px bg-slate-200 dark:bg-white/5 hidden sm:block mx-1" />

            {/* Profile Dropdown */}
            <ProfileDropdown />
          </div>
        </div>
      </div>
    </header>
  );
}
