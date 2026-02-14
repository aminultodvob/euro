import Link from "next/link";

import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { getAdminProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminProductsPage({ searchParams }: Props) {
  const params = (await searchParams) || {};
  const query = typeof params.query === "string" ? params.query : "";
  const page = Number(typeof params.page === "string" ? params.page : "1") || 1;
  const data = await getAdminProducts({ query, page, limit: 20 });

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">Products</h1>
          <p className="text-muted-foreground mt-1 text-base">
            {data.total} total items in catalog
          </p>
        </div>
        <Link href="/admin/products/new" className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
          Add product
        </Link>
      </div>

      <form className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4 sm:flex-row" action="/admin/products" method="get">
        <input
          name="query"
          defaultValue={query}
          placeholder="Search by title"
          className="h-11 w-full rounded-xl border border-border bg-input px-3 text-sm"
        />
        <button className="h-11 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground sm:w-auto" type="submit">
          Search
        </button>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <div className="min-w-[760px]">
          <div className="grid grid-cols-12 border-b border-border bg-muted/50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            <p className="col-span-5">Title</p>
            <p className="col-span-3">Category</p>
            <p className="col-span-2">Status</p>
            <p className="col-span-2 text-right">Actions</p>
          </div>
          {data.items.map((item) => (
            <article key={item.id} className="grid grid-cols-12 items-center gap-2 border-b border-border px-4 py-3 last:border-b-0">
              <div className="col-span-5">
                <p className="line-clamp-1 font-semibold">{item.title}</p>
                <p className="text-muted-foreground text-xs">{item.slug}</p>
              </div>
              <p className="text-muted-foreground col-span-3 text-sm">{item.categorySlug}</p>
              <p className="col-span-2 text-sm font-medium">
                {item.isPublished ? "Published" : "Draft"}
              </p>
              <div className="col-span-2 flex justify-end gap-2">
                <Link href={`/admin/products/${item.id}/edit`} className="rounded-md border px-3 py-1.5 text-xs font-semibold">
                  Edit
                </Link>
                <DeleteProductButton productId={item.id} />
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm text-muted-foreground">
          Page {data.page} of {data.totalPages}
        </span>
        <PaginationControls
          page={data.page}
          totalPages={data.totalPages}
          makeHref={(nextPage) => `/admin/products?page=${nextPage}&query=${encodeURIComponent(query)}`}
        />
      </div>
    </section>
  );
}
