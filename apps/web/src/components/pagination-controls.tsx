"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  pageSize?: number;
  className?: string;
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize = 12,
  className,
}: PaginationControlsProps) {
  if (totalPages <= 1) {
    return null;
  }

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers array with ellipsis handling
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
      // Smooth scroll back up to main content
      const element = document.getElementById("main-content");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div
      aria-label="Pagination Navigation"
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 border-t border-border/50",
        className
      )}
    >
      {/* Item Range Description */}
      <div className="text-xs text-muted-foreground font-medium">
        Showing <span className="font-semibold text-foreground">{startItem}</span> to{" "}
        <span className="font-semibold text-foreground">{endItem}</span> of{" "}
        <span className="font-semibold text-foreground">{totalItems}</span> results
      </div>

      {/* Page Navigation Buttons */}
      <div className="flex items-center space-x-1.5">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Go to previous page"
          className={cn(
            "inline-flex items-center justify-center h-8 px-3 rounded-md text-xs font-medium border border-input bg-background shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-ring",
            currentPage <= 1
              ? "opacity-40 cursor-not-allowed"
              : "hover:bg-accent hover:text-accent-foreground active:scale-95"
          )}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </button>

        {/* Page Number Buttons */}
        <div className="hidden sm:flex items-center space-x-1">
          {pages.map((p, idx) => {
            if (typeof p === "string") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 text-xs text-muted-foreground select-none"
                >
                  ...
                </span>
              );
            }

            const isCurrent = p === currentPage;
            return (
              <button
                key={p}
                type="button"
                onClick={() => handlePageClick(p)}
                aria-current={isCurrent ? "page" : undefined}
                aria-label={`Go to page ${p}`}
                className={cn(
                  "inline-flex items-center justify-center h-8 w-8 rounded-md text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring",
                  isCurrent
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "border border-input bg-background hover:bg-accent hover:text-accent-foreground active:scale-95"
                )}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Go to next page"
          className={cn(
            "inline-flex items-center justify-center h-8 px-3 rounded-md text-xs font-medium border border-input bg-background shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-ring",
            currentPage >= totalPages
              ? "opacity-40 cursor-not-allowed"
              : "hover:bg-accent hover:text-accent-foreground active:scale-95"
          )}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>
    </div>
  );
}
