import { NextResponse, type NextRequest } from "next/server";

import { deleteProduct, getProductById, updateProduct } from "@/lib/catalog";
import { requireAdminRequest } from "@/lib/admin-api";
import { slugify } from "@/lib/slug";
import { productSchema } from "@/lib/validation";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const unauthorized = await requireAdminRequest(request);
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const item = await getProductById(id);
  if (!item) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }
  return NextResponse.json({ item });
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const unauthorized = await requireAdminRequest(request);
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const payload = {
    title: body.title,
    slug: slugify(String(body.slug || body.title || "")),
    descriptionHtml: body.descriptionHtml,
    descriptionJson: body.descriptionJson,
    imageUrl: body.imageUrl,
    categoryId: body.categoryId,
    categorySlug: body.categorySlug,
    sourceUrl: body.sourceUrl,
    price: body.price,
    currency: "$" as const,
    isPublished: body.isPublished,
  };

  const parsed = productSchema.safeParse({
    ...payload,
  });
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Validation failed." }, { status: 400 });
  }

  try {
    const item = await updateProduct(id, parsed.data);
    if (!item) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }
    return NextResponse.json({ item });
  } catch {
    return NextResponse.json({ error: "Failed to update product." }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const unauthorized = await requireAdminRequest(request);
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const deleted = await deleteProduct(id);
  if (!deleted) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
