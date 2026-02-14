import { redirect } from "next/navigation";

import { ProductForm } from "@/components/admin/product-form";
import { getCategories } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await getCategories(true);
  if (categories.length === 0) {
    redirect("/admin/categories");
  }

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-5">
        <h1 className="text-3xl font-semibold tracking-tight">Create Product</h1>
        <p className="text-muted-foreground mt-1 text-base">Add a new furniture listing with structured product data.</p>
      </div>
      <ProductForm mode="create" categories={categories} />
    </section>
  );
}
