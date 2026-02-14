import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ProductCard } from "@/components/storefront/product-card";
import { getProductBySlug, getRelatedProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.title,
    description: `Explore ${product.title} details and source information.`,
  };
}

export default async function ProductDetailsPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.categorySlug, product.id, 4);

  return (
    <main className="bg-white pb-20 pt-8 selection:bg-[#00a651] selection:text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ─── Breadcrumbs ─── */}
        {/* ─── Breadcrumbs ─── */}
        <nav className="mb-8 flex items-center text-base font-medium text-muted-foreground">
          <Link href="/" className="hover:text-[#00a651] transition-colors">
            Home
          </Link>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-3 text-gray-300"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
          <Link
            href={`/?category=${encodeURIComponent(product.categorySlug)}`}
            className="hover:text-[#00a651] transition-colors capitalize"
          >
            {product.categorySlug}
          </Link>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-3 text-gray-300"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
          <span className="text-foreground truncate max-w-[300px]">{product.title}</span>
        </nav>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start">
          {/* ─── Image Gallery (Sticky) ─── */}
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-100 lg:sticky lg:top-24 border border-gray-100 shadow-sm">
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              priority
              className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-105"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
            {/* Category Tag Overlay */}
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center rounded-full bg-white/90 px-4 py-1.5 text-sm font-bold uppercase tracking-wider text-[#00a651] shadow-sm backdrop-blur-sm">
                {product.categorySlug}
              </span>
            </div>
          </div>

          {/* ─── Product Info ─── */}
          <div className="mt-10 px-0 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl text-balance leading-tight">
              {product.title}
            </h1>

            <div className="mt-8">
              <h2 className="sr-only">Product information</h2>
              <div className="flex items-baseline">
                <p className="text-4xl font-bold text-gray-900">
                  {typeof product.price === "number"
                    ? `$ ${product.price.toLocaleString()}`
                    : "Price on request"}
                </p>
                {typeof product.price === "number" && (
                  <span className="ml-3 text-base text-muted-foreground">approx.</span>
                )}
              </div>
            </div>

            <div className="mt-10 border-t border-gray-100 pt-10">
              <h3 className="text-2xl font-bold text-gray-900">Description</h3>
              <div
                className="mt-6 prose prose-lg text-gray-600 max-w-none prose-p:leading-relaxed prose-headings:font-bold prose-headings:text-gray-900 prose-a:text-[#00a651] hover:prose-a:text-[#008a43]"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            </div>

            {/* CTA */}
            {product.sourceUrl ? (
              <div className="mt-12 flex border-t border-gray-100 pt-10">
                <a
                  href={product.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-center rounded-xl bg-[#00a651] px-10 py-5 text-lg font-bold text-white shadow-lg shadow-[#00a651]/20 transition-all hover:bg-[#008a43] hover:shadow-xl hover:shadow-[#00a651]/30 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#00a651] focus:ring-offset-2 sm:w-auto min-w-[240px]"
                >
                  Open Original Source
                  <svg className="ml-3 -mr-1 h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              </div>
            ) : (
              <div className="mt-12 rounded-lg bg-gray-50 p-6 text-center">
                <p className="text-base text-gray-500">Source link currently unavailable.</p>
              </div>
            )}
          </div>
        </div>

        {/* ─── Related Products ─── */}
        {related.length > 0 && (
          <section className="mt-16 border-t border-gray-100 pt-16 sm:mt-24">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Similar Products</h2>
                <p className="mt-2 text-sm text-gray-500">More findings from the {product.categorySlug} collection.</p>
              </div>
              <Link
                href={`/?category=${encodeURIComponent(product.categorySlug)}`}
                className="hidden sm:flex text-sm font-semibold text-[#00a651] hover:text-[#008a43] items-center gap-1 transition-colors"
              >
                View all
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:gap-x-8">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>

            <div className="mt-8 sm:hidden">
              <Link
                href={`/?category=${encodeURIComponent(product.categorySlug)}`}
                className="block w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                View all related products
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
