/**
 * Post Service - Handles all post-related API operations
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Get all posts for a user
 * @param {string} userId - User ID
 * @param {string} token - Auth token
 * @returns {Promise<Array>} - Array of posts
 */
export const getUserPosts = async (userId, token) => {
  try {
    const response = await fetch(`${API_URL}/api/posts/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch posts");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user posts:", error);
    throw error;
  }
};

/**
 * Get a single post by ID
 * @param {string} postId - Post ID
 * @param {string} token - Auth token
 * @returns {Promise<Object>} - Post object
 */
export const getPostById = async (postId, token) => {
  try {
    const response = await fetch(`${API_URL}/api/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch post");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching post details:", error);
    throw error;
  }
};

/**
 * Create a new post
 * @param {Object} postData - Post data
 * @param {string} token - Auth token
 * @returns {Promise<Object>} - Created post
 */
export const createPost = async (postData, token) => {
  try {
    const response = await fetch(`${API_URL}/api/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      throw new Error("Failed to create post");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

/**
 * Update an existing post
 * @param {string} postId - Post ID
 * @param {Object} postData - Updated post data
 * @param {string} token - Auth token
 * @returns {Promise<Object>} - Updated post
 */
export const updatePost = async (postId, postData, token) => {
  try {
    const response = await fetch(`${API_URL}/api/posts/${postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      throw new Error("Failed to update post");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};

/**
 * Delete a post
 * @param {string} postId - Post ID
 * @param {string} token - Auth token
 * @returns {Promise<Object>} - Deletion response
 */
export const deletePost = async (postId, token) => {
  try {
    const response = await fetch(`${API_URL}/api/posts/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete post");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};
