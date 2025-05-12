/**
 * Category Service - Handles all category-related API operations
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Get all categories
 * @param {string} token - Authentication token
 * @returns {Promise<Array>} - Array of categories
 */
export const getAllCategories = async (token) => {
  try {
    const response = await fetch(`${API_URL}/api/categories`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

/**
 * Create a new category
 * @param {string} name - Category name
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Created category
 */
export const createCategory = async (name, token) => {
  try {
    const response = await fetch(`${API_URL}/api/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      throw new Error("Failed to create category");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};
