import Link from "next/link";

import { Button } from "@/components/ui/button";

type Props = {
  page: number;
  totalPages: number;
  makeHref: (nextPage: number) => string;
};

function getPageItems(page: number, totalPages: number): Array<number | "..."> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const items: Array<number | "..."> = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);

  if (start > 2) items.push("...");
  for (let i = start; i <= end; i += 1) items.push(i);
  if (end < totalPages - 1) items.push("...");

  items.push(totalPages);
  return items;
}

export function PaginationControls({ page, totalPages, makeHref }: Props) {
  if (totalPages <= 1) return null;

  const items = getPageItems(page, totalPages);

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {page > 1 ? (
        <Button asChild variant="outline" size="sm" className="rounded-full px-4">
          <Link href={makeHref(page - 1)}>Previous</Link>
        </Button>
      ) : (
        <Button type="button" variant="outline" size="sm" className="rounded-full px-4" disabled>
          Previous
        </Button>
      )}

      {items.map((item, index) =>
        item === "..." ? (
          <span key={`ellipsis-${index}`} className="px-1 text-sm text-muted-foreground">
            ...
          </span>
        ) : (
          <Button
            key={item}
            asChild
            size="sm"
            variant={item === page ? "default" : "outline"}
            className="min-w-10 rounded-full"
          >
            <Link href={makeHref(item)}>{item}</Link>
          </Button>
        ),
      )}

      {page < totalPages ? (
        <Button asChild variant="outline" size="sm" className="rounded-full px-4">
          <Link href={makeHref(page + 1)}>Next</Link>
        </Button>
      ) : (
        <Button type="button" variant="outline" size="sm" className="rounded-full px-4" disabled>
          Next
        </Button>
      )}
    </div>
  );
}
