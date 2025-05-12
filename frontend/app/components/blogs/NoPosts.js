"use client";

import { memo } from "react";
import Link from "next/link";
import { Search, RefreshCw } from "lucide-react";

/**
 * Component displayed when no posts match the current filters
 */
const NoPosts = memo(function NoPosts({ hasFilters = false }) {
  return (
    <div className="text-center py-16">
      <div className="bg-gray-50 rounded-2xl py-10 px-6 max-w-md mx-auto">
        <div className="flex justify-center mb-4">
          {hasFilters ? (
            <Search className="h-12 w-12 text-gray-400" />
          ) : (
            <RefreshCw className="h-12 w-12 text-gray-400" />
          )}
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {hasFilters ? "No posts match your filters" : "No posts available"}
        </h3>

        <p className="text-gray-600 mb-6">
          {hasFilters
            ? "Try changing your search terms or selecting a different category"
            : "We're working on adding new content. Please check back soon!"}
        </p>

        {hasFilters && (
          <Link
            href="/blogs"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Clear filters
          </Link>
        )}
      </div>
    </div>
  );
});

export default NoPosts;
