import { ObjectId, type Filter, type WithId } from "mongodb";

import { getDb } from "@/lib/mongodb";
import type { CategoryRecord, ProductRecord, ProductSearchInput } from "@/lib/types";

type CategoryDoc = {
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type ProductDoc = {
  title: string;
  slug: string;
  descriptionHtml: string;
  descriptionJson?: Record<string, unknown>;
  imageUrl: string;
  categoryId: ObjectId;
  categorySlug: string;
  sourceUrl?: string;
  // Legacy fields kept for backward compatibility with existing records.
  marketplace?: "amazon" | "alibaba" | "both";
  amazonUrl?: string;
  alibabaUrl?: string;
  price?: number;
  currency?: string;
  tags?: string[];
  shortDescription?: string;
  sourceName?: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
};

function toCategoryRecord(doc: WithId<CategoryDoc>): CategoryRecord {
  return {
    id: doc._id.toString(),
    name: doc.name,
    slug: doc.slug,
    description: doc.description,
    isActive: doc.isActive,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

function toProductRecord(doc: WithId<ProductDoc>): ProductRecord {
  return {
    id: doc._id.toString(),
    title: doc.title,
    slug: doc.slug,
    descriptionHtml: doc.descriptionHtml,
    descriptionJson: doc.descriptionJson,
    imageUrl: doc.imageUrl,
    categoryId: doc.categoryId.toString(),
    categorySlug: doc.categorySlug,
    sourceUrl: doc.sourceUrl || doc.amazonUrl || doc.alibabaUrl,
    price: doc.price,
    isPublished: doc.isPublished,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export async function ensureIndexes() {
  const db = await getDb();
  await Promise.all([
    db.collection<CategoryDoc>("categories").createIndex({ slug: 1 }, { unique: true }),
    db.collection<CategoryDoc>("categories").createIndex({ name: 1 }, { unique: true }),
    db.collection<ProductDoc>("products").createIndex({ slug: 1 }, { unique: true }),
    db.collection<ProductDoc>("products").createIndex({ title: "text" }),
    db.collection<ProductDoc>("products").createIndex({ categorySlug: 1 }),
    db.collection<ProductDoc>("products").createIndex({ price: 1 }),
    db.collection<ProductDoc>("products").createIndex({ isPublished: 1 }),
  ]);
}

export async function getCategories(includeInactive = false) {
  const db = await getDb();
  const query = includeInactive ? {} : { isActive: true };
  const items = await db
    .collection<CategoryDoc>("categories")
    .find(query)
    .sort({ name: 1 })
    .toArray();
  return items.map(toCategoryRecord);
}

export async function getCategoryById(id: string) {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const item = await db.collection<CategoryDoc>("categories").findOne({ _id: new ObjectId(id) });
  return item ? toCategoryRecord(item) : null;
}

export async function createCategory(data: Omit<CategoryRecord, "id" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  const now = new Date();
  const insert = await db.collection<CategoryDoc>("categories").insertOne({
    name: data.name,
    slug: data.slug,
    description: data.description,
    isActive: data.isActive,
    createdAt: now,
    updatedAt: now,
  });
  const item = await db.collection<CategoryDoc>("categories").findOne({ _id: insert.insertedId });
  return item ? toCategoryRecord(item) : null;
}

export async function updateCategory(
  id: string,
  data: Partial<Pick<CategoryRecord, "name" | "slug" | "description" | "isActive">>,
) {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  await db.collection<CategoryDoc>("categories").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...data,
        updatedAt: new Date(),
      },
    },
  );
  const item = await db.collection<CategoryDoc>("categories").findOne({ _id: new ObjectId(id) });
  return item ? toCategoryRecord(item) : null;
}

export async function deleteCategory(id: string) {
  if (!ObjectId.isValid(id)) return { deleted: false, reason: "invalid id" };
  const db = await getDb();

  // Unlink products from this category first (set category info to empty/null)
  await db.collection<ProductDoc>("products").updateMany(
    { categoryId: new ObjectId(id) },
    {
      $set: {
        categoryId: null as any,
        categorySlug: "uncategorized",
        updatedAt: new Date()
      }
    }
  );

  const result = await db.collection<CategoryDoc>("categories").deleteOne({ _id: new ObjectId(id) });
  return { deleted: result.deletedCount === 1 };
}

export async function getPublishedProducts(input: ProductSearchInput = {}) {
  await ensureIndexes();
  const db = await getDb();
  const page = Math.max(1, input.page || 1);
  const limit = Math.min(24, Math.max(1, input.limit || 12));
  const skip = (page - 1) * limit;

  const query: Filter<ProductDoc> = { isPublished: true };
  if (input.query?.trim()) {
    const q = input.query.trim();
    // Escape regex special characters
    const escapedQ = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Create a "fuzzy" pattern: allow any characters between search terms for better typo tolerance
    // and partial matching (e.g. "fur set" matches "Furniture Set")
    const fuzzyPattern = escapedQ.split(/\s+/).join(".*");
    const regex = new RegExp(fuzzyPattern, "i");

    query.$or = [
      { title: { $regex: regex } },
      { categorySlug: { $regex: regex } },
      { slug: { $regex: regex } }
    ];
  }
  if (input.category?.trim()) {
    query.categorySlug = input.category.trim();
  }
  if (typeof input.minPrice === "number" || typeof input.maxPrice === "number") {
    query.price = {};
    if (typeof input.minPrice === "number") query.price.$gte = input.minPrice;
    if (typeof input.maxPrice === "number") query.price.$lte = input.maxPrice;
  }

  const [total, items] = await Promise.all([
    db.collection<ProductDoc>("products").countDocuments(query),
    db
      .collection<ProductDoc>("products")
      .find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
  ]);

  return {
    items: items.map(toProductRecord),
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export async function getProductBySlug(slug: string, includeUnpublished = false) {
  const db = await getDb();
  const query: Filter<ProductDoc> = { slug };
  if (!includeUnpublished) query.isPublished = true;
  const item = await db.collection<ProductDoc>("products").findOne(query);
  return item ? toProductRecord(item) : null;
}

export async function getProductById(id: string) {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const item = await db.collection<ProductDoc>("products").findOne({ _id: new ObjectId(id) });
  return item ? toProductRecord(item) : null;
}

type ProductMutation = Omit<ProductRecord, "id" | "createdAt" | "updatedAt">;

export async function createProduct(input: ProductMutation) {
  const db = await getDb();
  const now = new Date();
  const insert = await db.collection<ProductDoc>("products").insertOne({
    ...input,
    categoryId: new ObjectId(input.categoryId),
    currency: "$",
    tags: [],
    createdAt: now,
    updatedAt: now,
  });
  const item = await db.collection<ProductDoc>("products").findOne({ _id: insert.insertedId });
  return item ? toProductRecord(item) : null;
}

export async function updateProduct(id: string, input: Partial<ProductMutation>) {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const patch: Partial<ProductDoc> & { updatedAt: Date } = { updatedAt: new Date() };
  if (input.title !== undefined) patch.title = input.title;
  if (input.slug !== undefined) patch.slug = input.slug;
  if (input.descriptionHtml !== undefined) patch.descriptionHtml = input.descriptionHtml;
  if (input.descriptionJson !== undefined) patch.descriptionJson = input.descriptionJson;
  if (input.imageUrl !== undefined) patch.imageUrl = input.imageUrl;
  if (input.categorySlug !== undefined) patch.categorySlug = input.categorySlug;
  if (input.sourceUrl !== undefined) patch.sourceUrl = input.sourceUrl;
  if (input.price !== undefined) patch.price = input.price;
  patch.currency = "$";
  patch.tags = [];
  if (input.isPublished !== undefined) patch.isPublished = input.isPublished;
  if (input.categoryId !== undefined) patch.categoryId = new ObjectId(input.categoryId);

  await db.collection<ProductDoc>("products").updateOne({ _id: new ObjectId(id) }, { $set: patch });
  const item = await db.collection<ProductDoc>("products").findOne({ _id: new ObjectId(id) });
  return item ? toProductRecord(item) : null;
}

export async function deleteProduct(id: string) {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db.collection<ProductDoc>("products").deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}

export async function getAdminProducts(input: ProductSearchInput = {}) {
  await ensureIndexes();
  const db = await getDb();
  const page = Math.max(1, input.page || 1);
  const limit = Math.min(40, Math.max(1, input.limit || 20));
  const skip = (page - 1) * limit;
  const query: Filter<ProductDoc> = {};

  if (input.query?.trim()) {
    query.$text = { $search: input.query.trim() };
  }
  if (input.category?.trim()) {
    query.categorySlug = input.category.trim();
  }

  const [total, items] = await Promise.all([
    db.collection<ProductDoc>("products").countDocuments(query),
    db.collection<ProductDoc>("products").find(query).sort({ updatedAt: -1 }).skip(skip).limit(limit).toArray(),
  ]);

  return {
    items: items.map(toProductRecord),
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export async function getRelatedProducts(categorySlug: string, excludeId: string, limit = 4) {
  const db = await getDb();
  const query: Filter<ProductDoc> = { isPublished: true, categorySlug };
  if (ObjectId.isValid(excludeId)) {
    query._id = { $ne: new ObjectId(excludeId) };
  }
  const items = await db.collection<ProductDoc>("products").find(query).sort({ updatedAt: -1 }).limit(limit).toArray();
  return items.map(toProductRecord);
}
