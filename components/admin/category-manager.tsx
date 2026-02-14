"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CategoryRecord } from "@/lib/types";
import { slugify } from "@/lib/slug";

type Props = {
  initialCategories: CategoryRecord[];
};

export function CategoryManager({ initialCategories }: Props) {
  const [categories, setCategories] = useState(initialCategories);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function createCategory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const response = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name,
        slug: slugify(slug || name),
        isActive: true,
      }),
    });
    const data = (await response.json().catch(() => null)) as { error?: string; item?: CategoryRecord } | null;
    if (!response.ok || !data?.item) {
      setError(data?.error || "Failed to create category.");
      return;
    }
    setCategories((prev) => [data.item!, ...prev]);
    setName("");
    setSlug("");
  }

  async function removeCategory(id: string) {
    setLoadingId(id);
    setError(null);
    const response = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    const data = (await response.json().catch(() => null)) as { error?: string } | null;
    if (!response.ok) {
      setError(data?.error || "Failed to delete category.");
      setLoadingId(null);
      return;
    }
    setCategories((prev) => prev.filter((item) => item.id !== id));
    setLoadingId(null);
  }

  return (
    <div className="space-y-6">
      <form onSubmit={createCategory} className="grid gap-3 rounded-2xl border border-border bg-card p-5 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="category-name">Category Name</Label>
          <Input
            id="category-name"
            value={name}
            onChange={(event) => {
              const value = event.target.value;
              setName(value);
              if (!slug) setSlug(slugify(value));
            }}
            placeholder="Category name"
            className="h-11 text-sm"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category-slug">Slug</Label>
          <Input
            id="category-slug"
            value={slug}
            onChange={(event) => setSlug(slugify(event.target.value))}
            placeholder="category-slug"
            className="h-11 text-sm"
            required
          />
        </div>
        <div className="flex items-end">
          <Button type="submit" className="h-11 w-full text-sm">
            Add category
          </Button>
        </div>
      </form>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <div className="min-w-[640px]">
          <div className="grid grid-cols-12 border-b border-border bg-muted/50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            <p className="col-span-7">Category</p>
            <p className="col-span-3">Slug</p>
            <p className="col-span-2 text-right">Actions</p>
          </div>
          {categories.map((category) => (
            <div key={category.id} className="grid grid-cols-12 items-center border-b border-border px-4 py-3 last:border-b-0">
              <p className="col-span-7 text-sm font-semibold">{category.name}</p>
              <p className="col-span-3 text-sm text-muted-foreground">{category.slug}</p>
              <div className="col-span-2 flex justify-end">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => removeCategory(category.id)}
                  disabled={loadingId === category.id}
                  className="h-8 w-8 text-neutral-400 hover:text-red-600 hover:bg-red-50"
                  title="Delete category"
                >
                  {loadingId === category.id ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
