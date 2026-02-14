"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LogoutButton } from "@/components/admin/logout-button";

const navItems = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-[260px] border-r border-border bg-background">
      <div className="flex h-full flex-col p-4">
        <div className="space-y-1 border-b border-border pb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Admin Console</p>
          <h2 className="text-xl font-semibold">Euro Furniture</h2>
          <p className="text-muted-foreground text-xs">Catalog management workspace</p>
        </div>

        <div className="mt-5 space-y-2">
          <p className="text-muted-foreground px-2 text-xs font-medium uppercase tracking-[0.12em]">Navigation</p>
        </div>
        <nav className="mt-1 space-y-2">
          {navItems.map((item) => {
            const active =
              pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/80 hover:bg-accent hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-2 border-t border-border pt-4">
          <Link href="/" className="block rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-accent hover:text-foreground">
            View Store
          </Link>
          <LogoutButton />
        </div>
      </div>
    </aside>
  );
}
