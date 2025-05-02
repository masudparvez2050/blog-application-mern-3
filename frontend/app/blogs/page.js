"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { mockPosts } from "../data/mockPosts";

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

  // Apply the debounce hook to searchTerm with 500ms delay
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Rest of the code remains the same, but change the useEffect dependency from searchTerm to debouncedSearchTerm
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
        // ...
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [debouncedSearchTerm, selectedCategory, currentPage]);

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

  return (
    <div className="pt-20">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">
            Blog Posts
          </h1>
          <p className="text-lg text-gray-600 text-center mb-8 max-w-2xl mx-auto">
            Discover articles, stories, and insights from our community of
            writers.
          </p>

          {/* Search and filter */}
          <div className="max-w-4xl mx-auto mb-8">
            <form
              onSubmit={handleSearchSubmit}
              className="flex flex-col md:flex-row gap-4"
            >
              <div className="flex-grow">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search posts..."
                    className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 flex gap-2">
                <select
                  className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-500"
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  disabled={loadingCategories}
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Show error message if using fallback data */}
        {error && (
          <div className="mb-8 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  {error} - Showing fallback content instead.
                </p>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="animate-pulse bg-white rounded-lg overflow-hidden shadow-md"
              >
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6 mb-6"></div>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-300 mr-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post._id}
                  href={`/blogs/${post._id}`}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-2">
                      {post.categories.slice(0, 2).map((category, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                        >
                          {category.name}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="relative h-10 w-10 rounded-full overflow-hidden mr-4">
                          <Image
                            src={post.author.profilePicture}
                            alt={post.author.name}
                            fill
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {post.author.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(post.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-500 text-sm">
                        <svg
                          className="h-4 w-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          ></path>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          ></path>
                        </svg>
                        {post.views}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center space-x-2">
                <button
                  className={`px-3 py-1 rounded-md ${
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  className={`px-3 py-1 rounded-md ${
                    currentPage === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </nav>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-2xl font-medium text-gray-900 mb-2">
              No posts found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter to find what you&apos;re
              looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
