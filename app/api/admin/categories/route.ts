import { NextResponse, type NextRequest } from "next/server";

import { createCategory, ensureIndexes, getCategories } from "@/lib/catalog";
import { requireAdminRequest } from "@/lib/admin-api";
import { slugify } from "@/lib/slug";
import { categorySchema } from "@/lib/validation";

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdminRequest(request);
  if (unauthorized) return unauthorized;

  await ensureIndexes();
  const data = await getCategories(true);
  return NextResponse.json({ items: data });
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdminRequest(request);
  if (unauthorized) return unauthorized;

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const parsed = categorySchema.safeParse({
    ...body,
    slug: slugify(String(body.slug || body.name || "")),
  });
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Validation failed." }, { status: 400 });
  }

  try {
    await ensureIndexes();
    const created = await createCategory(parsed.data);
    return NextResponse.json({ item: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Category slug/name must be unique." }, { status: 409 });
  }
}
