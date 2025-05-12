/**
 * Base API service for making HTTP requests
 */
export const apiService = {
  /**
   * Base API URL from environment variable
   */
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/",

  /**
   * Get auth token from localStorage (client-side only)
   */
  getAuthToken() {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      
      return token;
    }
    return null;
  },

  /**
   * Create headers for requests
   * @param {boolean} includeAuth - Whether to include auth token
   * @returns {Headers} - Headers object
   */
  createHeaders(includeAuth = false) {
    const headers = {};
    headers["Content-Type"] = "application/json";

    if (includeAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return headers;
  },

  /**
   * Make a GET request
   * @param {string} endpoint - API endpoint
   * @param {boolean} authenticated - Whether request needs auth
   * @returns {Promise<any>} - Response data
   */
  async get(endpoint, authenticated = false) {
    const headers = this.createHeaders(authenticated);
    console.log("Request headers:", headers); // Debug log
   

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      throw await this.handleErrorResponse(response);
    }

    return response.json();
  },

  /**
   * Make a POST request
   * @param {string} endpoint - API endpoint
   * @param {any} data - Request body data
   * @param {boolean} authenticated - Whether request needs auth
   * @returns {Promise<any>} - Response data
   */
  async post(endpoint, data, authenticated = true) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: this.createHeaders(authenticated),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw await this.handleErrorResponse(response);
    }

    return response.json();
  },

  /**
   * Make a PUT request
   * @param {string} endpoint - API endpoint
   * @param {any} data - Request body data
   * @param {boolean} authenticated - Whether request needs auth
   * @returns {Promise<any>} - Response data
   */
  async put(endpoint, data = {}, authenticated = true) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "PUT",
      headers: this.createHeaders(authenticated),
      body: Object.keys(data).length ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw await this.handleErrorResponse(response);
    }

    return response.json();
  },

  /**
   * Make a DELETE request
   * @param {string} endpoint - API endpoint
   * @param {boolean} authenticated - Whether request needs auth
   * @returns {Promise<any>} - Response data
   */
  async delete(endpoint, authenticated = true) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "DELETE",
      headers: this.createHeaders(authenticated),
    });

    if (!response.ok) {
      throw await this.handleErrorResponse(response);
    }

    return response.json();
  },

  /**
   * Handle error responses from the API
   * @param {Response} response - Fetch response object
   * @returns {Error} - Error with details
   */  async handleErrorResponse(response) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      console.error("Error parsing response:", e);
      errorData = {
        message: "An unexpected error occurred",
        parseError: e.message,
      };
    }

    console.error("API Response Error:", {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      errorData,
      headers: Object.fromEntries(response.headers.entries()),
    });

    const error = new Error(
      errorData.message || "An unexpected error occurred"
    );
    error.status = response.status;
    error.data = errorData;
    error.url = response.url; // Include the URL in the error object
    return error;
  },
};
