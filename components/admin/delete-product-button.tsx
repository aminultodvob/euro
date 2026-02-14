"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export function DeleteProductButton({ productId }: { productId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onDelete() {
    const confirmed = window.confirm("Delete this product?");
    if (!confirmed) return;
    setLoading(true);
    const response = await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
    setLoading(false);
    if (!response.ok) return;
    router.refresh();
  }

  return (
    <Button type="button" variant="destructive" onClick={onDelete} disabled={loading} className="h-8 px-3 text-xs">
      {loading ? "Deleting..." : "Delete"}
    </Button>
  );
}
