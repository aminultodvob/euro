import Image from "next/image";
import Link from "next/link";

import type { ProductRecord } from "@/lib/types";

export function ProductCard({ product }: { product: ProductRecord }) {
  return (
    <article
      className="group overflow-hidden border border-border bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <Link href={`/products/${product.slug}`} className="block no-underline">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-neutral-100">
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>

        {/* Body */}
        <div className="p-5">
          <span
            className="mb-2 inline-block px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white"
            style={{ background: "#00a651", borderRadius: "0.25rem" }}
          >
            {product.categorySlug}
          </span>
          <p className="mb-2 mt-1 line-clamp-2 text-lg font-bold leading-tight text-foreground transition-colors group-hover:text-[#00a651]">
            {product.title}
          </p>
          {typeof product.price === "number" && (
            <p className="text-base font-bold text-muted-foreground">
              $ {product.price.toLocaleString()}
            </p>
          )}
          <span
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold transition-all no-underline"
            style={{
              color: "#00a651",
              border: "2px solid #00a651",
              borderRadius: "0.375rem",
            }}
          >
            View Details
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </span>
        </div>
      </Link>
    </article>
  );
}
