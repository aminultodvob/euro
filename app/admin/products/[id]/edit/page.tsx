import { notFound } from "next/navigation";

import { ProductForm } from "@/components/admin/product-form";
import { getCategories, getProductById } from "@/lib/catalog";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const [product, categories] = await Promise.all([getProductById(id), getCategories(true)]);
  if (!product) {
    notFound();
  }

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-5">
        <h1 className="text-3xl font-semibold tracking-tight">Edit Product</h1>
        <p className="text-muted-foreground mt-1 text-base">Update listing details, source URL, pricing, and publish status.</p>
      </div>
      <ProductForm mode="edit" categories={categories} initialProduct={product} />
    </section>
  );
}
