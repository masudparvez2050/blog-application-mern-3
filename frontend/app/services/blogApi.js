

import { apiService } from "./apiService";
import { handleApiError } from "../utils/errorHandler";

// Server-side API calls
export async function getBlogPostById(id) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}`,
      {
        next: { revalidate: 60 }, // Revalidate every 60 seconds
      }
    );

    if (!res.ok) throw new Error("Failed to fetch post");
    return res.json();
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
}

/**
 * API service for blog-related functionality
 */
export const blogApi = {
  /**
   * Fetches blog posts with optional filtering and pagination
   * @param {Object} options - Query options
   * @param {number} options.page - Page number
   * @param {string} options.category - Category ID or slug
   * @param {string} options.search - Search query
   * @param {number} options.limit - Posts per page
   * @returns {Promise<Object>} - Posts and pagination data
   */
  async getPosts({ page = 1, category = "", search = "", limit = 9 }) {
    try {
      // Build query params
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);
      if (category) params.append("category", category);
      if (search) params.append("search", search);

      const response = await apiService.get(`/api/posts?${params.toString()}`);
      return response;
    } catch (error) {
      throw handleApiError(error, "Failed to fetch blog posts");
    }
  },

  /**
   * Fetches a single blog post by ID
   * @param {string} id - Post ID
   * @returns {Promise<Object>} - Post data
   */
  async getPostById(id) {
    try {
      const response = await apiService.get(`/api/posts/${id}`);
      return response;
    } catch (error) {
      throw handleApiError(error, "Failed to fetch blog post");
    }
  },

  /**
   * Fetches all categories
   * @returns {Promise<Array>} - List of categories
   */
  async getCategories() {
    try {
      const response = await apiService.get("/api/categories");
      return response;
    } catch (error) {
      throw handleApiError(error, "Failed to fetch categories");
    }
  },

  /**
   * Likes or unlikes a post
   * @param {string} postId - Post ID
   * @returns {Promise<Object>} - Updated like status
   */
  async likePost(postId) {
    try {
      const response = await apiService.put(`/api/posts/${postId}/like`);
      return response;
    } catch (error) {
      throw handleApiError(error, "Failed to like post");
    }
  },

  /**
   * Dislikes or undislikes a post
   * @param {string} postId - Post ID
   * @returns {Promise<Object>} - Updated dislike status
   */
  async dislikePost(postId) {
    try {
      const response = await apiService.put(`/api/posts/${postId}/dislike`);
      return response;
    } catch (error) {
      throw handleApiError(error, "Failed to dislike post");
    }
  },

  /**
   * Gets current user's like status for a post
   * @param {string} postId - Post ID
   * @returns {Promise<Object>} - Like status
   */
  async getLikeStatus(postId) {
    try {
      const response = await apiService.get(`/api/posts/${postId}/like-status`);
      return response;
    } catch (error) {
      throw handleApiError(error, "Failed to get like status");
    }
  },

  /**
   * Fetches comments for a post
   * @param {string} postId - Post ID
   * @param {number} page - Page number for pagination
   * @param {number} limit - Number of comments per page
   * @returns {Promise<Object>} - Comments and pagination data
   */
  async getPostComments(postId, page = 1, limit = 10) {
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);

      const response = await apiService.get(
        `/api/comments/post/${postId}?${params.toString()}`
      );
      return response;
    } catch (error) {
      throw handleApiError(error, "Failed to fetch comments");
    }
  },

  /**
   * Creates a new comment
   * @param {Object} commentData - Comment data
   * @returns {Promise<Object>} - Created comment
   */
  async createComment(commentData) {
    try {
      const response = await apiService.post(
        "/api/comments",
        commentData,
        true
      );
      return response;
    } catch (error) {
      throw handleApiError(error, "Failed to create comment");
    }
  },

  /**
   * Fetches similar posts
   * @param {string} postId - Current post ID
   * @param {number} limit - Number of posts to fetch
   * @returns {Promise<Array>} - Similar posts
   */
  async getSimilarPosts(postId, limit = 3) {
    try {
      const response = await apiService.get(
        `/api/posts/${postId}/similar?limit=${limit}`
      );
      return response;
    } catch (error) {
      throw handleApiError(error, "Failed to fetch similar posts");
    }
  },

  /**
   * Increment view count for a post
   * @param {string} postId - Post ID
   * @returns {Promise<Object>} - Updated view count
   */
  async incrementViewCount(postId) {
    try {
      const response = await apiService.put(`/api/posts/${postId}/view`);
      return response;
    } catch (error) {
      throw handleApiError(error, "Failed to increment view count");
    }
  },
};
