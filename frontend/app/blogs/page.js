"use client";

import { useState, useEffect } from "react";
import { mockPosts } from "../data/mockPosts";
import PostCard from "../components/shared/PostCard";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaRegSadTear,
} from "react-icons/fa";

// Custom debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function BlogsList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Apply the debounce hook to searchTerm with 500ms delay
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const fetchPosts = async () => {
      // existing fetchPosts code
      setLoading(true);
      try {
        // Build query parameters for filtering
        let queryParams = new URLSearchParams();

        // Add category filter if selected
        if (selectedCategory && selectedCategory !== "all") {
          queryParams.append("category", selectedCategory);
        }

        // Add search term if provided
        if (debouncedSearchTerm && debouncedSearchTerm.trim() !== "") {
          queryParams.append("search", debouncedSearchTerm);
        }

        // Add pagination
        queryParams.append("page", currentPage);
        queryParams.append("limit", 6); // 6 posts per page

        // Fetch posts from API
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL
          }/api/posts?${queryParams.toString()}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await response.json();

        // If API returns data successfully
        setPosts(data.posts || []);
        setTotalPages(data.totalPages || Math.ceil(data.total / 6) || 1);
        setError(null);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError(error.message);

        // Fallback to mock data if API call fails
        let filteredPosts = mockPosts;

        // Apply the same filters to mock data
        if (selectedCategory && selectedCategory !== "all") {
          filteredPosts = mockPosts.filter((post) =>
            post.categories.some((cat) =>
              typeof cat === "object"
                ? cat._id === selectedCategory || cat.slug === selectedCategory
                : cat === selectedCategory
            )
          );
        }

        if (searchTerm && searchTerm.trim() !== "") {
          const searchLower = searchTerm.toLowerCase();
          filteredPosts = filteredPosts.filter(
            (post) =>
              post.title.toLowerCase().includes(searchLower) ||
              post.excerpt.toLowerCase().includes(searchLower)
          );
        }

        // Update state with filtered mock data
        setPosts(filteredPosts);
        setTotalPages(Math.ceil(filteredPosts.length / 6));
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [debouncedSearchTerm, selectedCategory, currentPage, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // No need to immediately trigger search
  };

  useEffect(() => {
    // Fetch categories from API
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/categories`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Fallback categories in case API fails
        setCategories([
          { _id: "all", name: "All" },
          { _id: "web", name: "Web Development" },
          { _id: "js", name: "JavaScript" },
          { _id: "react", name: "React" },
          { _id: "node", name: "Node.js" },
          { _id: "css", name: "CSS" },
          { _id: "db", name: "Database" },
          { _id: "ai", name: "AI" },
          { _id: "tech", name: "Technology" },
        ]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when search is submitted
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category === "all" ? "" : category);
    setCurrentPage(1); // Reset to first page when category changes
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-16">
      {/* Hero section with search */}
      <motion.div
        className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-500 py-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400 rounded-full opacity-20 mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-indigo-400 rounded-full opacity-20 mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.h1
            className="text-5xl font-extrabold text-white mb-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Explore Our Blog
          </motion.h1>
          <motion.p
            className="text-xl text-indigo-100 text-center mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Discover articles, stories, and insights from our community of
            writers.
          </motion.p>

          {/* Search and filter */}
          <motion.div
            className="max-w-4xl mx-auto mb-2 relative z-10 bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <form
              onSubmit={handleSearchSubmit}
              className="flex flex-col md:flex-row gap-4"
            >
              <div className="flex-grow">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search posts..."
                    className="w-full py-3 pl-12 pr-4 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/80 backdrop-blur-sm shadow-inner text-gray-700"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaSearch className="h-5 w-5 text-blue-500" />
                  </div>
                </div>
              </div>

              <div className="md:hidden">
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-white/80 rounded-xl text-indigo-600 font-medium shadow-sm hover:bg-white transition-all"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <FaFilter /> {showFilters ? "Hide Filters" : "Show Filters"}
                </button>
              </div>

              <div
                className={`md:flex-shrink-0 md:block ${
                  showFilters ? "block" : "hidden"
                }`}
              >
                <select
                  className="w-full md:w-auto px-6 py-3 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/80 backdrop-blur-sm shadow-inner text-gray-700 font-medium appearance-none"
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  disabled={loadingCategories}
                  style={{ paddingRight: "2.5rem" }}
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none hidden md:block">
                  <FaFilter className="h-4 w-4 text-indigo-500" />
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-12">
        {/* Show error message if using fallback data */}
        {error && (
          <motion.div
            className="mb-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg shadow-sm"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center">
              <svg
                className="h-6 w-6 text-yellow-400 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="text-sm text-yellow-700 font-medium">
                {error} - Showing fallback content instead.
              </p>
            </div>
          </motion.div>
        )}

        {loading ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
              >
                <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded-lg w-3/4 mb-4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded-lg mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-5/6 mb-6 animate-pulse"></div>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 mr-4 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded-lg w-1/4 animate-pulse"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : posts.length > 0 ? (
          <>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  variants={itemVariants}
                  custom={index}
                >
                  <PostCard post={post} />
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            <motion.div
              className="mt-16 flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <nav className="inline-flex items-center rounded-xl bg-white shadow-md p-1">
                <button
                  className={`px-4 py-2 rounded-xl flex items-center justify-center gap-1 ${
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-indigo-600 hover:bg-indigo-50"
                  } transition-colors duration-200`}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  <FaChevronLeft className="h-3 w-3" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center space-x-1 px-2">
                  {totalPages <= 7 ? (
                    // Show all page numbers if there are 7 or fewer
                    Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        className={`w-9 h-9 flex items-center justify-center rounded-lg ${
                          currentPage === i + 1
                            ? "bg-indigo-600 text-white shadow-sm"
                            : "text-gray-700 hover:bg-gray-100"
                        } transition-colors duration-200 font-medium`}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))
                  ) : (
                    // Show pagination with ellipsis for more than 7 pages
                    <>
                      <button
                        className={`w-9 h-9 flex items-center justify-center rounded-lg ${
                          currentPage === 1
                            ? "bg-indigo-600 text-white shadow-sm"
                            : "text-gray-700 hover:bg-gray-100"
                        } transition-colors duration-200 font-medium`}
                        onClick={() => setCurrentPage(1)}
                      >
                        1
                      </button>

                      {currentPage > 3 && (
                        <span className="text-gray-400 px-1">...</span>
                      )}

                      {/* Pages around current page */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(
                          (page) =>
                            page !== 1 &&
                            page !== totalPages &&
                            Math.abs(page - currentPage) <= 1
                        )
                        .map((page) => (
                          <button
                            key={page}
                            className={`w-9 h-9 flex items-center justify-center rounded-lg ${
                              currentPage === page
                                ? "bg-indigo-600 text-white shadow-sm"
                                : "text-gray-700 hover:bg-gray-100"
                            } transition-colors duration-200 font-medium`}
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </button>
                        ))}

                      {currentPage < totalPages - 2 && (
                        <span className="text-gray-400 px-1">...</span>
                      )}

                      <button
                        className={`w-9 h-9 flex items-center justify-center rounded-lg ${
                          currentPage === totalPages
                            ? "bg-indigo-600 text-white shadow-sm"
                            : "text-gray-700 hover:bg-gray-100"
                        } transition-colors duration-200 font-medium`}
                        onClick={() => setCurrentPage(totalPages)}
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>

                <button
                  className={`px-4 py-2 rounded-xl flex items-center justify-center gap-1 ${
                    currentPage === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-indigo-600 hover:bg-indigo-50"
                  } transition-colors duration-200`}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  <span>Next</span>
                  <FaChevronRight className="h-3 w-3" />
                </button>
              </nav>
            </motion.div>
          </>
        ) : (
          <motion.div
            className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FaRegSadTear className="h-16 w-16 mx-auto text-gray-300 mb-6" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              No posts found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Try adjusting your search or filter to find what you&apos;re
              looking for.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("");
                setCurrentPage(1);
              }}
              className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors duration-300 font-medium shadow-sm"
            >
              Clear all filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
