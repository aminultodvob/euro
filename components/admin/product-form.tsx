"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { slugify } from "@/lib/slug";
import type { CategoryRecord, ProductRecord } from "@/lib/types";
import { RichTextEditor } from "@/components/admin/rich-text-editor";

type Props = {
  mode: "create" | "edit";
  categories: CategoryRecord[];
  initialProduct?: ProductRecord;
};

export function ProductForm({ mode, categories, initialProduct }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initialProduct?.title || "");
  const [slug, setSlug] = useState(initialProduct?.slug || "");
  const [imageUrl, setImageUrl] = useState(initialProduct?.imageUrl || "");
  const [categoryId, setCategoryId] = useState(initialProduct?.categoryId || categories[0]?.id || "");
  const [sourceUrl, setSourceUrl] = useState(initialProduct?.sourceUrl || "");
  const [price, setPrice] = useState(initialProduct?.price ? String(initialProduct.price) : "");
  const [isPublished, setIsPublished] = useState(initialProduct?.isPublished ?? true);
  const [descriptionHtml, setDescriptionHtml] = useState(initialProduct?.descriptionHtml || "<p></p>");
  const [descriptionJson, setDescriptionJson] = useState<Record<string, unknown> | undefined>(
    initialProduct?.descriptionJson,
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const categorySlug = useMemo(() => categories.find((item) => item.id === categoryId)?.slug || "", [categories, categoryId]);
  const actionLabel = mode === "create" ? "Create product" : "Save changes";

  const onEditorChange = useCallback((payload: { html: string; json: Record<string, unknown> | undefined }) => {
    setDescriptionHtml(payload.html);
    setDescriptionJson(payload.json);
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSaving(true);
    const payload = {
      title,
      slug: slugify(slug || title),
      imageUrl,
      descriptionHtml,
      descriptionJson,
      categoryId,
      categorySlug,
      sourceUrl,
      price: price ? Number(price) : undefined,
      currency: "$",
      isPublished,
    };
    const url = mode === "create" ? "/api/admin/products" : `/api/admin/products/${initialProduct!.id}`;
    const method = mode === "create" ? "POST" : "PATCH";
    const response = await fetch(url, {
      method,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await response.json().catch(() => null)) as { error?: string } | null;
    if (!response.ok) {
      setError(data?.error || "Failed to save product.");
      setSaving(false);
      return;
    }
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <section className="space-y-4 rounded-2xl border border-border bg-card p-5">
        <div>
          <h2 className="text-lg font-semibold">Basic Information</h2>
          <p className="text-muted-foreground text-sm">Core identity fields used in listings and URLs.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="product-title">Product Title</Label>
            <Input
              id="product-title"
              value={title}
              onChange={(event) => {
                const value = event.target.value;
                setTitle(value);
                if (!slug) setSlug(slugify(value));
              }}
              placeholder="Product title"
              className="h-11 border-foreground/50 bg-white text-sm"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="product-slug">Slug</Label>
            <Input
              id="product-slug"
              value={slug}
              onChange={(event) => setSlug(slugify(event.target.value))}
              placeholder="product-slug"
              className="h-11 border-foreground/50 bg-white text-sm"
              required
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="product-image-url">Image URL</Label>
            <Input
              id="product-image-url"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder="https://..."
              className="h-11 border-foreground/50 bg-white text-sm"
              required
            />
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-border bg-card p-5">
        <div>
          <h2 className="text-lg font-semibold">Commercial Details</h2>
          <p className="text-muted-foreground text-sm">Assign category, source link, price, and status.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="product-category">Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger id="product-category" className="h-11 w-full border-foreground/50 bg-white text-sm">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="product-source-url">Source URL</Label>
            <Input
              id="product-source-url"
              value={sourceUrl}
              onChange={(event) => setSourceUrl(event.target.value)}
              placeholder="https://..."
              className="h-11 border-foreground/50 bg-white text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="product-price">Price</Label>
            <Input
              id="product-price"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              placeholder="Price"
              type="number"
              step="0.01"
              className="h-11 border-foreground/50 bg-white text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="product-status">Status</Label>
            <Select value={String(isPublished)} onValueChange={(value) => setIsPublished(value === "true")}>
              <SelectTrigger id="product-status" className="h-11 w-full border-foreground/50 bg-white text-sm">
                <SelectValue placeholder="Published status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Published</SelectItem>
                <SelectItem value="false">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-border bg-card p-5">
        <div>
          <Label>Detailed Description</Label>
          <p className="text-muted-foreground mt-1 text-sm">Use rich text for product description content.</p>
        </div>
        <RichTextEditor value={initialProduct?.descriptionHtml} onChange={onEditorChange} />
      </section>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="flex items-center justify-end">
        <Button type="submit" disabled={saving} className="h-11 px-6 text-sm">
          {saving ? "Saving..." : actionLabel}
        </Button>
      </div>
    </form>
  );
}
