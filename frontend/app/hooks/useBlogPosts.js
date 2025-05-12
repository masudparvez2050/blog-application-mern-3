"use client";

import { useState, useEffect } from "react";
import { blogApi } from "../services/blogApi";

/**
 * Custom hook to fetch blog posts with filtering, pagination, and category options
 * @param {Object} options - Fetch configuration options
 * @param {number} options.page - Current page number
 * @param {string} options.category - Category filter
 * @param {string} options.search - Search query
 * @param {number} options.limit - Number of posts per page
 * @returns {Object} Posts data, loading state, and error
 */
export function useBlogPosts({
  page = 1,
  category = "",
  search = "",
  limit = 9,
}) {
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch blog posts
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await blogApi.getPosts({
          page,
          category,
          search,
          limit,
        });
        setPosts(response.posts);
        setTotalPages(response.totalPages);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page, category, search, limit]);

  // Fetch categories (only once)
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);

      try {
        const categoriesList = await blogApi.getCategories();
        setCategories(categoriesList);
      } catch (err) {
        console.error("Error fetching categories:", err);
        // Don't set main error state for categories to avoid breaking the main flow
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  return {
    posts,
    totalPages,
    loading,
    error,
    categories,
    loadingCategories,
  };
}
