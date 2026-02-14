export type CategoryRecord = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type ProductRecord = {
  id: string;
  title: string;
  slug: string;
  descriptionHtml: string;
  descriptionJson?: Record<string, unknown>;
  imageUrl: string;
  categoryId: string;
  categorySlug: string;
  sourceUrl?: string;
  price?: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type ProductSearchInput = {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
};
