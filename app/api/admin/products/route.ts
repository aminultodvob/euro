import { NextResponse, type NextRequest } from "next/server";

import { createProduct, ensureIndexes, getAdminProducts } from "@/lib/catalog";
import { requireAdminRequest } from "@/lib/admin-api";
import { slugify } from "@/lib/slug";
import { productSchema } from "@/lib/validation";

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdminRequest(request);
  if (unauthorized) return unauthorized;

  await ensureIndexes();

  const page = Number(request.nextUrl.searchParams.get("page") || "1");
  const query = request.nextUrl.searchParams.get("query") || undefined;
  const category = request.nextUrl.searchParams.get("category") || undefined;

  const data = await getAdminProducts({
    page: Number.isFinite(page) ? page : 1,
    query,
    category,
  });

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdminRequest(request);
  if (unauthorized) return unauthorized;

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
    await ensureIndexes();
    const item = await createProduct(parsed.data);
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create product. Check slug/category uniqueness and data." }, { status: 400 });
  }
}
