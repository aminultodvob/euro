"use client";

import type { CategoryRecord } from "@/lib/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

type Props = {
  categories: CategoryRecord[];
  defaultValues: {
    q?: string;
    category?: string;
  };
};

export function SearchFilters({ categories, defaultValues }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Local states for live fields
  const [q, setQ] = useState(defaultValues.q || "");
  const [category, setCategory] = useState(defaultValues.category || "all");

  // Update local state if URL changes externally
  useEffect(() => {
    setQ(searchParams.get("q") || "");
    setCategory(searchParams.get("category") || "all");
  }, [searchParams]);

  const updateFilters = (newValues: { q?: string; category?: string }) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);

      const setOrDelete = (key: string, val: string | undefined) => {
        if (val && val !== "all") params.set(key, val);
        else params.delete(key);
      };

      if (newValues.q !== undefined) setOrDelete("q", newValues.q);
      if (newValues.category !== undefined) setOrDelete("category", newValues.category);

      params.set("page", "1");
      router.push(`/?${params.toString()}`, { scroll: false });
    });
  };

  // Debounced search for the text input
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (q !== (searchParams.get("q") || "")) {
        updateFilters({ q });
      }
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [q]);

  return (
    <div
      className="grid gap-3 border border-border bg-white p-4 shadow-sm md:grid-cols-4 relative overflow-hidden items-center"
      style={{ borderRadius: "0.5rem" }}
    >
      {/* Loading bar overlay */}
      {isPending && (
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#00a651] animate-pulse" />
      )}

      <div className="md:col-span-2">
        <div className="relative">
          <input
            id="q"
            name="q"
            placeholder="Search products..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="h-12 w-full border border-border bg-white px-4 text-base transition-all focus:border-[#00a651] focus:ring-2 focus:ring-[#00a651]/10 outline-none"
            style={{ borderRadius: "0.375rem" }}
          />
          {q && (
            <button
              onClick={() => setQ("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="md:col-span-1">
        <select
          id="category"
          name="category"
          value={category}
          onChange={(e) => {
            const val = e.target.value;
            setCategory(val);
            updateFilters({ category: val });
          }}
          className="h-12 w-full border border-border bg-white px-4 text-base outline-none focus:border-[#00a651]"
          style={{ borderRadius: "0.375rem" }}
        >
          <option value="all">All categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex md:col-span-1">
        <button
          onClick={() => updateFilters({ q, category })}
          disabled={isPending}
          className="flex h-12 w-full shrink-0 items-center justify-center gap-2 px-6 text-base font-bold text-white transition-all active:scale-95 disabled:opacity-50"
          style={{ background: "#00a651", borderRadius: "0.375rem", border: "none" }}
        >
          {isPending ? (
            <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          )}
          Search
        </button>
      </div>
    </div>
  );
}
