import { handleApiError } from "../utils/errorHandler";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Updates a user's profile information
 *
 * @param {Object} userData - Data to update (name, email, bio, password, etc.)
 * @returns {Promise<Object>} Updated user data
 */
export const updateUserProfile = async (userData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/users/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update profile");
    }

    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Uploads a profile picture
 *
 * @param {File} imageFile - Image file to upload
 * @returns {Promise<Object>} URL of the uploaded image
 */
export const uploadProfilePicture = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    const token = localStorage.getItem("token");
    const response = await fetch(
      `${API_URL}/api/users/upload-profile-picture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to upload profile picture");
    }

    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Requests email verification
 *
 * @returns {Promise<Object>} Response data
 */
export const requestVerificationEmail = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/users/request-verification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to send verification email");
    }

    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Changes the user's password
 *
 * @param {Object} passwordData - Contains currentPassword, newPassword
 * @returns {Promise<Object>} Response data
 */
export const changePassword = async (passwordData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/users/change-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(passwordData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to change password");
    }

    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Gets the user's recent activity
 *
 * @param {number} limit - Number of activities to fetch
 * @returns {Promise<Object>} Response data with user activities
 */
export const getUserActivity = async (limit = 5) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${API_URL}/api/users/activity?limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to get user activity");
    }

    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};
