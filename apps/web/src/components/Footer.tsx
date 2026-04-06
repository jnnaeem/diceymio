"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import Logo from "../../public/images/logo.svg";
import Image from "next/image";

const socialLinks = [
  {
    name: "Facebook",
    href: "https://facebook.com/diceymio",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
        <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 1.09.042 1.587.084V7.93h-.828c-1.504 0-1.98.574-1.98 2.016v2.078h3.044l-.522 3.667h-2.522v7.98" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://instagram.com/diceymio",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    name: "Discord",
    href: "https://discord.gg/diceymio",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@diceymio",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Don't show footer on dashboard and auth pages
  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    // Simulate subscription
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.success("Thanks for subscribing!");
    setEmail("");
    setIsSubmitting(false);
  };

  return (
    <footer className="bg-linear-to-br from-[#0B1C13] to-[#0B1C13] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 py-16 lg:py-20">
          {/* Brand Column */}
          <div className="lg:col-span-3">
            <Link href="/" className="inline-block">
              <Image src={Logo} alt="Logo" />
            </Link>
            <p className="text-[#FEF5DECC] text-sm leading-relaxed my-6 max-w-[280px]">
              Enter a world of strategic board games, epic adventures, and
              unforgettable gaming experiences with friends and family.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="size-9.5 rounded-full bg-[#FFFFFF26] hover:bg-[#3a4f34] flex items-center justify-center text-white hover:text-[#EAEA4C] transition-all hover:scale-110 active:scale-95"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Useful Links */}
          <div className="lg:col-span-2 lg:col-start-5">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#FEF5DECC] mb-6">
              Useful Links
            </h3>
            <ul className="space-y-3.5">
              {[
                { label: "About Diceymio", href: "/about" },
                { label: "Characters", href: "/characters" },
                { label: "Games", href: "/products" },
                { label: "How to Play", href: "/how-to-play" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#6b7b60] hover:text-[#d4d4a0] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#FEF5DECC] mb-6">
              Support
            </h3>
            <ul className="space-y-3.5">
              {[
                { label: "Game Rules", href: "/game-rules" },
                { label: "Shipping Info", href: "/shipping" },
                { label: "Returns", href: "/returns" },
                { label: "FAQ", href: "/faq" },
                { label: "Contact us", href: "/contact" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#6b7b60] hover:text-[#d4d4a0] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Stay Updated */}
          <div className="lg:col-span-3 lg:col-start-10">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#FEF5DECC] mb-6">
              Stay Updated
            </h3>

            {/* Contact Info */}
            <div className="space-y-3.5 mb-6">
              <a
                href="mailto:games@diceymio.com"
                className="flex items-center gap-3 text-sm text-[#6b7b60] hover:text-[#d4d4a0] transition-colors group"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="size-4 shrink-0 text-[#FEF5DECC] group-hover:text-[#d4d4a0] transition-colors"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
                games@diceymio.com
              </a>
              <a
                href="tel:+8801740711194"
                className="flex items-center gap-3 text-sm text-[#6b7b60] hover:text-[#d4d4a0] transition-colors group"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="size-4 shrink-0 text-[#FEF5DECC] group-hover:text-[#d4d4a0] transition-colors"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                  />
                </svg>
                +8801740711194
              </a>
            </div>

            {/* Newsletter */}
            <p className="text-xs text-[#6b7b60] mb-3">
              Get updates on new game releases
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ENTER YOUR EMAIL"
                className="flex-1 min-w-0 px-4 py-2.5 bg-transparent border border-[#3a4a34] rounded-md text-xs text-[#FEF5DECC] placeholder:text-[#4a5a44] focus:outline-none focus:border-[#6b7b60] transition-colors uppercase tracking-wider"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-[#d4d44a] hover:bg-[#e0e050] text-[#1a2418] text-xs font-bold uppercase tracking-wider rounded-md transition-all duration-200 hover:shadow-lg hover:shadow-[#d4d44a]/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "..." : "JOIN"}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#2a3a26] py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#4a5a44]">
            © {new Date().getFullYear()} Diceymio. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy-policy"
              className="text-xs text-[#4a5a44] hover:text-[#FEF5DECC] transition-colors underline underline-offset-2"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-use"
              className="text-xs text-[#4a5a44] hover:text-[#FEF5DECC] transition-colors underline underline-offset-2"
            >
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
