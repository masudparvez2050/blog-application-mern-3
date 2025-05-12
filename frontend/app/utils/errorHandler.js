"use client";

/**
 * Handles API errors and provides standardized error objects
 * @param {Error} error - The error caught during API call
 * @param {string} fallbackMessage - Fallback message if error doesn't have one
 * @returns {Error} Standardized error object
 */
export function handleApiError(
  error,
  fallbackMessage = "An unexpected error occurred"
) {
  // Log error details
  console.log("API Error:", {
    error,
    status: error.status,
    message: error.message,
    data: error.data,
    stack: error.stack
  });

  // Handle network errors
  if (!error.status) {
    console.error("Network Error:", {
      error,
      navigator: typeof window !== 'undefined' ? window.navigator.onLine : 'SSR'
    });
    return new Error("Network error. Please check your connection.");
  }
  // Handle authentication errors
  if (error.status === 401) {
    console.error("Auth Error:", {
      token: typeof window !== 'undefined' ? localStorage.getItem("token") : 'SSR',
      user: typeof window !== 'undefined' ? localStorage.getItem("user") : 'SSR',
      message: error.message,
      data: error.data,
      url: error.url || 'unknown'
    });

    // Only clear auth data for specific auth-related errors and not for content access
    if (typeof window !== "undefined") {
      // Check if this is an actual auth issue vs. a content access issue
      const url = error.url || '';
      const isAuthEndpoint = url.includes('/api/auth/') || 
                            url.includes('/api/users/me') || 
                            url.includes('/api/auth/validate');
                            
      // Check specific auth error messages
      const isAuthError = error.message?.includes("Invalid token") || 
                         error.message?.includes("Token expired") ||
                         error.data?.message?.includes("Invalid token") ||
                         error.data?.message?.includes("Token expired") ||
                         error.data?.message?.includes("User not found");
      
      // Only clear auth data if it's both an auth endpoint and has an auth error message
      if (isAuthEndpoint && isAuthError) {
        // Use the storeAuthData helper if available
        if (typeof window.storeAuthData === 'function') {
          window.storeAuthData(null, null);
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
        return new Error("Your session has expired. Please log in again.");
      }
    }

    // For other 401 errors, just return the error message without clearing auth
    return new Error(error.message || "Authentication required for this action.");
  }

  // Handle validation errors (e.g., 400 Bad Request)
  if (error.status === 400 && error.data?.validation) {
    return new Error(
      error.data.validation.map((err) => err.message).join(", ")
    );
  }

  // Handle forbidden errors
  if (error.status === 403) {
    return new Error("You do not have permission to perform this action.");
  }

  // Handle not found errors
  if (error.status === 404) {
    return new Error(error.message || "The requested resource was not found.");
  }

  // Handle server errors
  if (error.status >= 500) {
    console.error("Server error:", error);
    return new Error("Server error. Please try again later.");
  }

  // For all other errors, use the provided message or fallback
  return new Error(error.message || fallbackMessage);
}
