import { apiService } from "./apiService";

/**
 * Service for admin-specific API operations
 */
const adminService = {
  /**
   * Fetches dashboard statistics
   * @returns {Promise<Object>} Dashboard stats
   */
  getDashboardStats: async () => {
    try {
      const response = await apiService.get(`/api/admin/dashboard`, true);
      return response;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch dashboard statistics");
    }
  },

  /**
   * Get pending posts
   * @returns {Promise<Array>} List of pending posts
   */
  getPendingPosts: async () => {
    try {
      const response = await apiService.get(
        `/api/admin/posts?status=pending`,
        true
      );
      return response;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch pending posts");
    }
  },

  /**
   * Get pending comments
   * @returns {Promise<Array>} List of pending comments
   */
  getPendingComments: async () => {
    try {
      const response = await apiService.get(
        `/api/admin/comments?status=pending`,
        true
      );
      return response;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch pending comments");
    }
  },

  /**
   * Get recent activity for admin dashboard
   * @returns {Promise<Array>} Recent activity items
   */
  getRecentActivity: async () => {
    try {
      const response = await apiService.get(`/api/admin/activity`, true);
      return response;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch recent activity");
    }
  },

  /**
   * Get list of users with pagination, sorting, and search
   * @param {number} page - Current page number
   * @param {number} limit - Number of items per page
   * @param {string} sortField - Field to sort by
   * @param {string} sortDirection - Sort direction ('asc' or 'desc')
   * @param {string} search - Search term for filtering users
   * @returns {Promise<Object>} Users list with pagination info
   */
  getUsers: async (
    page = 1,
    limit = 10,
    sortField = "createdAt",
    sortDirection = "desc",
    search = ""
  ) => {
    try {
      const response = await apiService.get(
        `/api/admin/users?page=${page}&limit=${limit}&sortField=${sortField}&sortDirection=${sortDirection}&search=${search}`,
        true
      );
      return response;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch users");
    }
  },

  /**
   * Get a single user by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User object
   */
  getUserById: async (userId) => {
    try {
      const response = await apiService.get(`/api/admin/users/${userId}`, true);
      return response;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch user");
    }
  },

  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user object
   */
  createUser: async (userData) => {
    try {
      const response = await apiService.post(
        `/api/admin/users`,
        userData,
        true
      );
      return response;
    } catch (error) {
      throw new Error(error.message || "Failed to create user");
    }
  },

  /**
   * Update a user
   * @param {string} userId - User ID
   * @param {Object} userData - User data to update
   * @returns {Promise<Object>} Updated user object
   */
  updateUser: async (userId, userData) => {
    try {
      const response = await apiService.put(
        `/api/admin/users/${userId}`,
        userData,
        true
      );
      return response;
    } catch (error) {
      throw new Error(error.message || "Failed to update user");
    }
  },

  /**
   * Delete a user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Deletion result
   */
  deleteUser: async (userId) => {
    try {
      const response = await apiService.delete(
        `/api/admin/users/${userId}`,
        true
      );
      return response;
    } catch (error) {
      throw new Error(error.message || "Failed to delete user");
    }
  },

  /**
   * Activate a user account
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Updated user object
   */
  activateUser: async (userId) => {
    try {
      const response = await apiService.put(
        `/api/admin/users/${userId}/activate`,
        {},
        true
      );
      return response;
    } catch (error) {
      throw new Error(error.message || "Failed to activate user");
    }
  },

  /**
   * Deactivate a user account
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Updated user object
   */
  deactivateUser: async (userId) => {
    try {
      const response = await apiService.put(
        `/api/admin/users/${userId}/deactivate`,
        {},
        true
      );
      return response;
    } catch (error) {
      throw new Error(error.message || "Failed to deactivate user");
    }
  },

  /**
   * Change a user's role
   * @param {string} userId - User ID
   * @param {string} role - New role ('admin' or 'user')
   * @returns {Promise<Object>} Updated user object
   */
  changeUserRole: async (userId, role) => {
    try {
      const response = await apiService.put(
        `/api/admin/users/${userId}/role`,
        { role },
        true
      );
      return response;
    } catch (error) {
      throw new Error(error.message || "Failed to change user role");
    }
  },
};

export default adminService;
