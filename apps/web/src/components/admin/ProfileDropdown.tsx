"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { LogOut, User, Settings, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProfileDropdown() {
  const [open, setOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const { user, logout } = useAuthStore();
  const router = useRouter();

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const initials = user?.firstName
    ? user.firstName[0].toUpperCase()
    : user?.email?.[0]?.toUpperCase() || "A";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="group flex items-center gap-3 p-1 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all duration-200"
      >
        <div className="size-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-600/10 transition-transform group-hover:scale-105">
          {initials}
        </div>
        <div className="hidden sm:flex flex-col items-start pr-1">
          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-tight">
            {user?.firstName || "Admin"}
          </span>
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Administrator
          </span>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(
            "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-transform duration-200",
            open && "rotate-180"
          )}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 p-1 bg-white dark:bg-[#191B1F] border border-slate-200 dark:border-[#2e333d] rounded-xl shadow-xl shadow-black/10 animate-in fade-in zoom-in duration-200 origin-top-right z-[60]">
          <div className="p-3 border-b border-slate-100 dark:border-white/5">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
              {user?.email}
            </p>
          </div>
          
          <div className="mt-1 space-y-0.5">
            <button className="flex items-center gap-3 w-full p-2 text-sm font-medium text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
              <User className="size-4" />
              Account Settings
            </button>
            <button className="flex items-center gap-3 w-full p-2 text-sm font-medium text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
              <Settings className="size-4" />
              Preferences
            </button>
            <button className="flex items-center gap-3 w-full p-2 text-sm font-medium text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
              <CreditCard className="size-4" />
              Billing
            </button>
          </div>

          <div className="my-1 border-t border-slate-100 dark:border-white/5" />
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
          >
            <LogOut className="size-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
