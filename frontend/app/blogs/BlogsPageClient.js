"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useBlogPosts } from "../hooks/useBlogPosts";
import BlogsHeader from "../components/blogs/BlogsHeader";
import BlogsFilter from "../components/blogs/BlogsFilter";
import BlogGrid from "../components/blogs/BlogGrid";
import NoPosts from "../components/blogs/NoPosts";
import { pageTransition } from "../utils/animation";

export default function BlogsPageClient() {
  // Search params and router
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialRender = useRef(true);

  // Parse search parameters
  const initialCategory = searchParams.get("category") || "";
  const initialQuery = searchParams.get("query") || "";
  const initialPage = parseInt(searchParams.get("page") || "1", 10);

  // Filter state
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  // Fetch blog posts with custom hook
  const { posts, totalPages, loading, error, categories, loadingCategories } =
    useBlogPosts({
      page: currentPage,
      category: activeCategory,
      search: debouncedQuery,
      limit: 9,
    });

  // Debounced search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    // Reset page to 1 when searchQuery changes
    if (searchQuery && currentPage !== 1) {
      setCurrentPage(1);
    }

    return () => clearTimeout(timer);
  }, [searchQuery, currentPage]);

  // Update URL with search params
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    // Construct new query parameters
    const params = new URLSearchParams();
    if (activeCategory) params.set("category", activeCategory);
    if (debouncedQuery) params.set("query", debouncedQuery);
    if (currentPage > 1) params.set("page", currentPage.toString());

    // Update URL without reload
    const newUrl = params.toString() ? `?${params.toString()}` : "";
    router.push(`/blogs${newUrl}`, { scroll: false });
  }, [activeCategory, debouncedQuery, currentPage, router]);

  // Handlers with useCallback to prevent unnecessary re-renders
  const handleCategoryChange = useCallback((category) => {
    setActiveCategory(category);
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Detect if we have any active filters
  const hasFilters = useMemo(() => {
    return !!activeCategory || !!debouncedQuery;
  }, [activeCategory, debouncedQuery]);

  return (
    <motion.div
      className="min-h-screen pt-16 pb-24 bg-gradient-to-b from-white to-gray-50"
      {...pageTransition}
    >
      <BlogsHeader />

      <section className="container mx-auto px-4 mt-8 md:mt-12">
        <BlogsFilter
          categories={categories}
          loadingCategories={loadingCategories}
          activeCategory={activeCategory}
          searchQuery={searchQuery}
          onCategoryChange={handleCategoryChange}
          onSearchChange={handleSearchChange}
        />

        {/* Posts grid or no results */}
        {loading ? (
          <BlogGrid isLoading={true} />
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">Error loading posts: {error.message}</p>
          </div>
        ) : posts && posts.length > 0 ? (
          <BlogGrid
            posts={posts}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        ) : (
          <NoPosts hasFilters={hasFilters} />
        )}
      </section>
    </motion.div>
  );
}
