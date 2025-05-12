"use client";

import { memo, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Reusable pagination component with accessibility features
 */
const Pagination = memo(function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  maxPageButtons = 5,
}) {
  // Generate array of page numbers to display
  const pageNumbers = useMemo(() => {
    // Helper function to create a range of numbers
    const range = (start, end) =>
      Array.from({ length: end - start + 1 }, (_, i) => start + i);

    // If we have fewer pages than maxPageButtons, show all pages
    if (totalPages <= maxPageButtons) {
      return range(1, totalPages);
    }

    // Calculate how many page buttons to show on each side of current page
    const sideButtons = Math.floor((maxPageButtons - 1) / 2);

    // Calculate start and end page numbers
    let startPage = Math.max(1, currentPage - sideButtons);
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    // Adjust if we're near the end
    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    return range(startPage, endPage);
  }, [currentPage, totalPages, maxPageButtons]);

  return (
    <nav
      className="flex justify-center mt-12"
      aria-label="Blog posts pagination"
    >
      <ul className="flex items-center -space-x-px">
        {/* Previous page button */}
        <li>
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`flex items-center justify-center px-4 h-10 ml-0 leading-tight
              rounded-l-lg border border-gray-300
              ${
                currentPage === 1
                  ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                  : "text-gray-700 bg-white hover:bg-gray-100 hover:text-blue-600"
              }`}
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </li>

        {/* Page number buttons */}
        {pageNumbers.map((number) => (
          <li key={number}>
            <button
              onClick={() => onPageChange(number)}
              className={`flex items-center justify-center px-4 h-10 leading-tight border border-gray-300
                ${
                  currentPage === number
                    ? "text-white bg-blue-600 hover:bg-blue-700 z-10"
                    : "text-gray-700 bg-white hover:bg-gray-100 hover:text-blue-600"
                }`}
              aria-label={`Go to page ${number}`}
              aria-current={currentPage === number ? "page" : undefined}
            >
              {number}
            </button>
          </li>
        ))}

        {/* Next page button */}
        <li>
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`flex items-center justify-center px-4 h-10 leading-tight
              rounded-r-lg border border-gray-300
              ${
                currentPage === totalPages
                  ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                  : "text-gray-700 bg-white hover:bg-gray-100 hover:text-blue-600"
              }`}
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </li>
      </ul>
    </nav>
  );
});

export default Pagination;
