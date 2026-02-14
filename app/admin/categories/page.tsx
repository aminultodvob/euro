import { CategoryManager } from "@/components/admin/category-manager";
import { getCategories } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await getCategories(true);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-4xl font-semibold tracking-tight">Categories</h1>
        <p className="text-muted-foreground mt-1 text-lg">Organize catalog structure and maintain clean taxonomy.</p>
      </div>
      <CategoryManager initialCategories={categories} />
    </section>
  );
}
