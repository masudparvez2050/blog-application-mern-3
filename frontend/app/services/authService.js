/**
 * Authentication Service - Handles all authentication related API operations
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Send forgot password request
 * @param {string} email - User's email address
 * @returns {Promise<Object>} - Response data
 */
export const requestPasswordReset = async (email) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to process password reset request"
      );
    }

    return data;
  } catch (error) {
    console.error("Password reset request error:", error);
    throw error;
  }
};

/**
 * Verify password reset token
 * @param {string} token - Password reset token
 * @returns {Promise<Object>} - Response data with token validity
 */
export const verifyResetToken = async (token) => {
  try {
    const response = await fetch(
      `${API_URL}/api/auth/verify-reset-token/${token}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to verify reset token");
    }

    return data;
  } catch (error) {
    console.error("Token verification error:", error);
    throw error;
  }
};

/**
 * Reset password with token
 * @param {string} token - Password reset token
 * @param {string} password - New password
 * @returns {Promise<Object>} - Response data
 */
export const resetPassword = async (token, password) => {
  try {
    const response = await fetch(
      `${API_URL}/api/auth/reset-password/${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to reset password");
    }

    return data;
  } catch (error) {
    console.error("Password reset error:", error);
    throw error;
  }
};

/**
 * Login with email and password
 * @param {Object} credentials - User credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @returns {Promise<Object>} - User data with token
 */
export const loginWithEmailPassword = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Invalid login credentials");
    }

    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

/**
 * Login with OAuth provider
 * @param {string} provider - OAuth provider (google, facebook)
 * @param {string} token - OAuth token or credential
 * @returns {Promise<Object>} - User data with token
 */
export const loginWithOAuth = async (provider, token) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/${provider}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Failed to login with ${provider}`);
    }

    return data;
  } catch (error) {
    console.error(`${provider} login error:`, error);
    throw error;
  }
};
