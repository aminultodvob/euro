import Link from "next/link";

import { getAdminProducts, getCategories } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [categories, products] = await Promise.all([getCategories(true), getAdminProducts({ page: 1, limit: 1 })]);

  return (
    <section className="space-y-7">
      <div>
        <h1 className="text-4xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1 text-lg">Overview of your catalog health and quick actions.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-muted-foreground text-sm">Total Products</p>
          <p className="mt-2 text-4xl font-semibold">{products.total}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-muted-foreground text-sm">Total Categories</p>
          <p className="mt-2 text-4xl font-semibold">{categories.length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-muted-foreground text-sm">Published Ratio</p>
          <p className="mt-2 text-4xl font-semibold">
            {products.total > 0 ? "Active" : "Empty"}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-muted-foreground text-sm">System Status</p>
          <p className="mt-2 text-4xl font-semibold">Ready</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <p className="text-muted-foreground text-sm">Quick Actions</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/admin/products/new" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            Create Product
          </Link>
          <Link href="/admin/products" className="rounded-full border px-4 py-2 text-sm font-semibold">
            Open Products
          </Link>
          <Link href="/admin/categories" className="rounded-full border px-4 py-2 text-sm font-semibold">
            Open Categories
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <p className="text-muted-foreground text-sm">Management Notes</p>
        <ul className="mt-3 space-y-2 text-sm text-foreground/80">
          <li>Use clear product titles for better search ranking.</li>
          <li>Keep source URL valid before publishing.</li>
          <li>Prefer consistent category naming.</li>
        </ul>
      </div>
    </section>
  );
}
