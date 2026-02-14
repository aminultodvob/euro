"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-border">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4">
        {/* Brand */}
        <Link
          href="/"
          className="no-underline flex items-center gap-2 shrink-0"
        >
          <span
            className="inline-flex items-center justify-center w-11 h-11 bg-[#00a651] rounded-lg text-white font-black text-xl tracking-tight shadow-sm"
          >
            EF
          </span>
          <span className="text-2xl font-extrabold text-[#111] tracking-tight">
            Euro Furniture
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1 shrink-0">
          <Link
            href="/"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-base font-bold transition-colors ${pathname === "/"
              ? "bg-[#e6f9ef] text-[#00a651]"
              : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
              }`}
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span className="hidden sm:inline">Home</span>
          </Link>

          <Link
            href="/admin"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-base font-bold text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span className="hidden sm:inline">Manage</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
