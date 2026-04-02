"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export default function AdminHeader({
  onMenuClick,
  collapsed,
  onToggle,
}: {
  onMenuClick: () => void;
  collapsed: boolean;
  onToggle: () => void;
}) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
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
    <header className="admin-header">
      <div className="admin-header-inner">
        <div className="admin-header-left">
          {/* Desktop collapse toggle */}
          <button onClick={onToggle} className="admin-header-toggle desktop-only" title="Toggle Sidebar">
            <div className="hamburger-lines">
              <span className={`hamburger-line ${collapsed ? "collapsed-top" : ""}`}></span>
              <span className={`hamburger-line hamburger-line-mid ${collapsed ? "collapsed-mid" : ""}`}></span>
              <span className={`hamburger-line ${collapsed ? "collapsed-bottom" : ""}`}></span>
            </div>
          </button>

          {/* Mobile menu button */}
          <button onClick={onMenuClick} className="admin-header-toggle mobile-only" title="Open Menu">
            <div className="hamburger-lines">
              <span className="hamburger-line"></span>
              <span className="hamburger-line hamburger-line-mid"></span>
              <span className="hamburger-line"></span>
            </div>
          </button>
        </div>

        <div className="admin-header-right">
          {/* Store link */}
          <a href="/" className="admin-header-store-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10,17 15,12 10,7" />
              <line x1="15" x2="3" y1="12" y2="12" />
            </svg>
            <span className="desktop-only">Visit Store</span>
          </a>

          {/* Profile dropdown */}
          <div className="admin-profile-dropdown" ref={dropdownRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="admin-profile-trigger"
            >
              <div className="admin-avatar">{initials}</div>
              <div className="admin-profile-info desktop-only">
                <span className="admin-profile-name">
                  {user?.firstName || "Admin"}
                </span>
                <span className="admin-profile-role">Administrator</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`admin-chevron ${profileOpen ? "rotated" : ""} desktop-only`}>
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {profileOpen && (
              <div className="admin-profile-menu">
                <div className="admin-profile-menu-header">
                  <p className="admin-profile-menu-name">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="admin-profile-menu-email">{user?.email}</p>
                </div>
                <div className="admin-profile-menu-divider" />
                <button onClick={handleLogout} className="admin-profile-menu-item danger">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16,17 21,12 16,7" />
                    <line x1="21" x2="9" y1="12" y2="12" />
                  </svg>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
