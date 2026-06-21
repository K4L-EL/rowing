import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  page: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string>;
};

export function WelfarePagination({ page, totalPages, basePath, searchParams = {} }: Props) {
  if (totalPages <= 1) return null;

  function buildHref(p: number): string {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(p));
    return `${basePath}?${params.toString()}`;
  }

  return (
    <div className="flex items-center justify-center gap-4 pt-4">
      {page > 1 ? (
        <Link href={buildHref(page - 1)}>
          <Button variant="outline" className="clay-button rounded-xl gap-2">
            <ChevronLeft className="size-4" />
            Previous
          </Button>
        </Link>
      ) : (
        <Button variant="outline" className="clay-button rounded-xl gap-2" disabled>
          <ChevronLeft className="size-4" />
          Previous
        </Button>
      )}

      <span className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </span>

      {page < totalPages ? (
        <Link href={buildHref(page + 1)}>
          <Button variant="outline" className="clay-button rounded-xl gap-2">
            Next
            <ChevronRight className="size-4" />
          </Button>
        </Link>
      ) : (
        <Button variant="outline" className="clay-button rounded-xl gap-2" disabled>
          Next
          <ChevronRight className="size-4" />
        </Button>
      )}
    </div>
  );
}
