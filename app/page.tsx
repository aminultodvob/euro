import Link from "next/link";

import { ProductCard } from "@/components/storefront/product-card";
import { SearchFilters } from "@/components/storefront/search-filters";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { getCategories, getPublishedProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HomePage({ searchParams }: Props) {
  const params = (await searchParams) || {};
  const q = typeof params.q === "string" ? params.q : "";
  const category = typeof params.category === "string" && params.category !== "all" ? params.category : undefined;
  const minPrice = parseOptionalNumber(typeof params.minPrice === "string" ? params.minPrice : undefined);
  const maxPrice = parseOptionalNumber(typeof params.maxPrice === "string" ? params.maxPrice : undefined);
  const page = typeof params.page === "string" ? Number(params.page) : 1;

  const [categories, result] = await Promise.all([
    getCategories(),
    getPublishedProducts({
      query: q || undefined,
      category,
      minPrice,
      maxPrice,
      page: Number.isFinite(page) ? page : 1,
      limit: 12,
    }),
  ]);

  return (
    <main>
      {/* ─── Main Content ─── */}
      <div className="mx-auto max-w-7xl px-4">
        {/* Search Filters */}
        <div className="py-6">
          <SearchFilters
            categories={categories}
            defaultValues={{
              q,
              category,
            }}
          />
        </div>

        {/* Section Heading */}
        <div className="pb-6 pt-4 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-[#111]">Product Directory</h1>
          <p className="mt-2 text-base text-muted-foreground">
            Browse our curated collection of furniture products
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-3 pb-8">
          <Link
            href="/"
            className="inline-flex items-center px-5 py-2.5 text-base font-bold no-underline transition-all"
            style={{
              borderRadius: "9999px",
              border: "2px solid",
              borderColor: !category ? "#00a651" : "#e5e5e5",
              background: !category ? "#00a651" : "white",
              color: !category ? "white" : "#444",
            }}
          >
            All
          </Link>
          {categories.map((item) => (
            <Link
              key={item.id}
              href={`/?category=${encodeURIComponent(item.slug)}`}
              className="inline-flex items-center px-5 py-2.5 text-base font-bold no-underline transition-all"
              style={{
                borderRadius: "9999px",
                border: "2px solid",
                borderColor: category === item.slug ? "#00a651" : "#e5e5e5",
                background: category === item.slug ? "#00a651" : "white",
                color: category === item.slug ? "white" : "#444",
              }}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Product Grid */}
        {result.items.length === 0 ? (
          <div className="border-2 border-dashed border-border p-10 text-center text-base text-muted-foreground" style={{ borderRadius: "0.75rem" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 opacity-40">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
            No products match your search. Try adjusting your filters.
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
            {result.items.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex flex-col items-center gap-3 py-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-1.5 text-sm font-semibold text-muted-foreground">
            Page {result.page} of {result.totalPages}
          </span>
          <PaginationControls
            page={result.page}
            totalPages={result.totalPages}
            makeHref={(nextPage) =>
              `/?${new URLSearchParams({ ...toStringParams(params), page: String(nextPage) }).toString()}`
            }
          />
        </div>
      </div>


    </main>
  );
}

function toStringParams(input: Record<string, string | string[] | undefined>) {
  const output: Record<string, string> = {};
  for (const [key, value] of Object.entries(input)) {
    if (typeof value === "string" && value.length > 0) {
      output[key] = value;
    }
  }
  return output;
}

function parseOptionalNumber(value: string | undefined) {
  if (!value || value.trim() === "") return undefined;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : undefined;
}
