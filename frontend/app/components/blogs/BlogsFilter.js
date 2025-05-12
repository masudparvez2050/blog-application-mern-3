"use client";

import { memo } from "react";
import { Search, X, Loader2 } from "lucide-react";

/**
 * Component for filtering blog posts by category and search query
 */
const BlogsFilter = memo(function BlogsFilter({
  categories = [],
  loadingCategories = false,
  activeCategory = "",
  searchQuery = "",
  onCategoryChange,
  onSearchChange,
}) {
  return (
    <div className="mb-10">
      {/* Search input */}
      <div className="relative max-w-md mx-auto mb-8">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <Search className="w-5 h-5 text-gray-500" />
        </div>
        <input
          type="search"
          className="block w-full p-3 ps-10 text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:outline-none focus:ring-blue-500"
          placeholder="Search blog posts..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search blog posts"
        />
        {searchQuery && (
          <button
            className="absolute inset-y-0 end-0 flex items-center pe-3"
            onClick={() => onSearchChange("")}
            aria-label="Clear search"
          >
            <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
          </button>
        )}
      </div>

      {/* Categories filter */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => onCategoryChange("")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeCategory === ""
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          aria-label="Show all categories"
          aria-pressed={activeCategory === ""}
        >
          All
        </button>

        {loadingCategories ? (
          <div className="flex items-center space-x-2 px-4 py-2">
            <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
            <span className="text-sm text-gray-500">Loading categories...</span>
          </div>
        ) : (
          categories.map((category) => (
            <button
              key={category._id}
              onClick={() => onCategoryChange(category._id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category._id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              aria-label={`Filter by ${category.name}`}
              aria-pressed={activeCategory === category._id}
            >
              {category.name}
            </button>
          ))
        )}
      </div>
    </div>
  );
});

export default BlogsFilter;
