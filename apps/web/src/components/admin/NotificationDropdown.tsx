"use client";

import * as React from "react";
import { Bell, Check, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const notifications = [
  {
    id: 1,
    title: "New Order received",
    description: "Order #ORD-123 has been placed by Jon Doe",
    time: "5 min ago",
    type: "success",
    icon: <Check className="size-4" />,
  },
  {
    id: 2,
    title: "Stock Alert: Catan",
    description: "Only 2 units left in stock",
    time: "1 hour ago",
    type: "warning",
    icon: <AlertTriangle className="size-4" />,
  },
  {
    id: 3,
    title: "System Update",
    description: "Database maintenance completed successfully",
    time: "3 hours ago",
    type: "info",
    icon: <Info className="size-4" />,
  },
];

export default function NotificationDropdown() {
  const [open, setOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative flex items-center justify-center size-9 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 transition-all group"
      >
        <Bell className="size-4.5 group-hover:scale-110 transition-transform" />
        <span className="absolute top-2 right-2 size-2 rounded-full bg-red-600 ring-2 ring-white dark:ring-[#191B1F]"></span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 p-1 bg-white dark:bg-[#191B1F] border border-slate-200 dark:border-[#2e333d] rounded-xl shadow-xl shadow-black/10 animate-in fade-in zoom-in duration-200 origin-top-right z-[60]">
          <div className="p-3 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Notifications</h3>
            <button className="text-[11px] font-medium text-blue-600 hover:underline">Mark all as read</button>
          </div>
          
          <div className="max-h-[300px] overflow-y-auto py-1 scrollbar-thin">
            {notifications.map((item) => (
              <button
                key={item.id}
                className="flex gap-3 w-full p-3 text-left hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group border-b border-slate-50 last:border-0 dark:border-white/5"
              >
                <div className={cn(
                  "size-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
                  item.type === "success" && "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
                  item.type === "warning" && "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
                  item.type === "info" && "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                )}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 leading-none truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {item.description}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 font-medium uppercase tracking-wider">
                    {item.time}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <div className="p-2 border-t border-slate-100 dark:border-white/5">
            <button className="w-full py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              View All Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
