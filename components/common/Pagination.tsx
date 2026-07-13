"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  total?: number;
  pageSize?: number;
}

export default function Pagination({
  total = 0,
  pageSize = 20,
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = parseInt(searchParams.get("page") || "1", 10) || 1;
  const pages = Math.max(1, Math.ceil((total || 0) / pageSize));

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page > 1) {
      params.set("page", String(page));
    } else {
      params.delete("page");
    }
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  const getPageNumbers = (): (number | "ellipsis")[] => {
    if (pages <= 7) {
      return Array.from({ length: pages }, (_, i) => i + 1);
    }
    
    const items: (number | "ellipsis")[] = [1];
    
    if (current > 3) {
      items.push("ellipsis");
    }
    
    const start = Math.max(2, current - 1);
    const end = Math.min(pages - 1, current + 1);
    
    for (let i = start; i <= end; i++) {
      items.push(i);
    }
    
    if (current < pages - 2) {
      items.push("ellipsis");
    }
    
    items.push(pages);
    return items;
  };

  if (pages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
      {/* Result count */}
      <p className="text-sm text-slate-500 order-2 sm:order-1">
        Page <span className="font-medium text-slate-700">{current}</span> of{" "}
        <span className="font-medium text-slate-700">{pages}</span>
        {total > 0 && (
          <>
            {" · "}
            <span className="font-medium text-slate-700">{total.toLocaleString()}</span> results
          </>
        )}
      </p>

      {/* Page controls */}
      <div className="flex items-center gap-1 order-1 sm:order-2">
        {/* Previous */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(Math.max(1, current - 1))}
          disabled={current <= 1}
          className="h-9 gap-1 px-3 text-sm font-medium border-slate-200 hover:bg-slate-50"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Prev</span>
        </Button>

        {/* Page numbers */}
        <div className="flex items-center gap-1 mx-1">
          {getPageNumbers().map((page, idx) =>
            page === "ellipsis" ? (
              <span
                key={`ellipsis-${idx}`}
                className="flex h-9 w-9 items-center justify-center text-sm text-slate-400 select-none"
              >
                &hellip;
              </span>
            ) : (
              <button
                key={page}
                onClick={() => goToPage(page)}
                aria-label={`Page ${page}`}
                aria-current={page === current ? "page" : undefined}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors",
                  page === current
                    ? "bg-primary text-white shadow-sm pointer-events-none"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                )}
              >
                {page}
              </button>
            )
          )}
        </div>

        {/* Next */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(Math.min(pages, current + 1))}
          disabled={current >= pages}
          className="h-9 gap-1 px-3 text-sm font-medium border-slate-200 hover:bg-slate-50"
          aria-label="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}