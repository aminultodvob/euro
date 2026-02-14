import { z } from "zod";

const urlOrEmpty = z.string().trim().optional().transform((value) => value || undefined);

export const categorySchema = z.object({
  name: z.string().trim().min(2).max(80),
  slug: z.string().trim().min(2).max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().trim().max(400).optional().or(z.literal("")),
  isActive: z.boolean().default(true),
});

export const productSchema = z
  .object({
    title: z.string().trim().min(3).max(140),
    slug: z.string().trim().min(3).max(160).regex(/^[a-z0-9-]+$/),
    descriptionHtml: z.string().trim().min(1),
    descriptionJson: z.record(z.string(), z.unknown()).optional(),
    imageUrl: z.string().url(),
    categoryId: z.string().min(1),
    categorySlug: z.string().trim().min(2).max(100).regex(/^[a-z0-9-]+$/),
    sourceUrl: urlOrEmpty.refine((value) => value === undefined || z.url().safeParse(value).success, {
      message: "Source URL must be a valid URL.",
    }),
    price: z.coerce.number().nonnegative().optional(),
    currency: z.literal("$").default("$"),
    isPublished: z.boolean().default(true),
  });
