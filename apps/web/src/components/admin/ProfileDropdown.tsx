"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { LogOut, User } from "lucide-react";

export default function ProfileDropdown() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!user) return null;

  const initials = user?.firstName
    ? user.firstName[0].toUpperCase()
    : user?.email?.[0]?.toUpperCase() || "A";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="size-10 flex items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-semibold cursor-pointer">
          {initials}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 p-2" align="end">
        {/* User Info */}
        <DropdownMenuLabel className="flex gap-3 items-center p-3">
          <div className="size-10 flex items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-semibold">
            {initials}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {user?.firstName} {user?.lastName}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {user?.email}
            </span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Menu Items */}
        <DropdownMenuGroup>
          <Link href="/profile">
            <DropdownMenuItem className="cursor-pointer">
              <User className="size-4 mr-2" />
              Profile
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <LogOut className="size-4 mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}