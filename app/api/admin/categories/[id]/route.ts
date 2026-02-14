import { NextResponse, type NextRequest } from "next/server";

import { deleteCategory, updateCategory } from "@/lib/catalog";
import { requireAdminRequest } from "@/lib/admin-api";
import { slugify } from "@/lib/slug";
import { categorySchema } from "@/lib/validation";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const unauthorized = await requireAdminRequest(request);
  if (unauthorized) return unauthorized;

  const { id } = await params;
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
    const item = await updateCategory(id, parsed.data);
    if (!item) {
      return NextResponse.json({ error: "Category not found." }, { status: 404 });
    }
    return NextResponse.json({ item });
  } catch {
    return NextResponse.json({ error: "Category slug/name must be unique." }, { status: 409 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const unauthorized = await requireAdminRequest(request);
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const result = await deleteCategory(id);
  if (!result.deleted) {
    return NextResponse.json({ error: result.reason || "Delete failed." }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
