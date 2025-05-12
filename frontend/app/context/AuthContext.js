"use client";

import { createContext, useState, useEffect, useContext, useCallback } from "react";
import { useRouter } from "next/navigation";
import { setCookie, removeCookie } from "../utils/cookieUtils";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  // Helper function to consistently store authentication data
  const storeAuthData = useCallback((token, userData) => {
    // Set localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    // Set cookies with consistent expiration (30 days to match JWT expiration)
    setCookie("token", token, 30);
    setCookie("user", userData, 30);
  }, []);

  // Load user from local storage and validate token
  useEffect(() => {
    const validateStoredAuth = async () => {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (storedUser && token) {
        try {
          // Verify token with the backend
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/validate-token`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
          } else {
            // Clear invalid auth data
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            removeCookie("token");
            removeCookie("user");
          }
        } catch (err) {
          console.error("Token validation error:", err);
        }
      }
      setLoading(false);
    };

    validateStoredAuth();
  }, []);

  // Periodically refresh token to prevent expiration
  useEffect(() => {
    if (isAuthenticated) {
      // Token refresh mechanism (moved inside useEffect to fix the dependency warning)
      const refreshToken = async () => {
        try {
          const currentToken = localStorage.getItem("token");
          if (!currentToken) return;

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh-token`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${currentToken}`,
              },
            }
          );

          const data = await response.json();
          if (response.ok) {
            storeAuthData(data.token, data.user || user);
          }
        } catch (err) {
          console.error("Token refresh failed:", err);
        }
      };

      const refreshInterval = setInterval(refreshToken, 1000 * 60 * 60 * 24); // daily refresh
      return () => clearInterval(refreshInterval);
    }
  }, [isAuthenticated, user, storeAuthData]);

  // Synchronize authentication state across tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "token") {
        // Token was changed or removed in another tab
        if (!e.newValue) {
          // Token was removed, log out in this tab too
          setUser(null);
          setIsAuthenticated(false);
          if (
            window.location.pathname.startsWith("/admin") ||
            window.location.pathname.startsWith("/dashboard")
          ) {
            router.push("/login");
          }
        } else if (e.newValue !== localStorage.getItem("token")) {
          // Token changed in another tab
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
          }
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [router]);

  // Login function for normal email/password login
  const login = async (userData) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to login");
      }

      // Store authentication data consistently
      storeAuthData(data.token, data.user);

      setUser(data.user);
      setIsAuthenticated(true);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Function for OAuth login (Google, Facebook)
  const oauthLogin = async (provider, tokenOrCredential) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/oauth/${provider}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accessToken: tokenOrCredential,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "OAuth login failed");
      }

      // Use consistent storage method
      storeAuthData(data.token, data.user);

      setUser(data.user);
      setIsAuthenticated(true);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Register new user
  const register = async (userData) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Use consistent storage method
      storeAuthData(data.token, data.user);

      setUser(data.user);
      setIsAuthenticated(true);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Logout function
  const logout = () => {
    // Clear localStorage data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Clear cookies
    removeCookie("token");
    removeCookie("user");

    // Reset state
    setUser(null);
    setIsAuthenticated(false);
    router.push("/");
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(userData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      // Use consistent storage method if there's a new token
      if (data.token) {
        storeAuthData(data.token, data);
      } else {
        // Just update the user data
        localStorage.setItem("user", JSON.stringify(data));
        setCookie("user", data, 30);
      }

      setUser(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Update user state partially (for example after email verification)
  const updateUser = (partialUserData) => {
    if (user) {
      const updatedUser = { ...user, ...partialUserData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setCookie("user", updatedUser, 30);
      setUser(updatedUser);
    }
  };

  // Request email verification
  const requestEmailVerification = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Not authenticated");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/resend-verification`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend verification email");
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Check if user is admin
  const isAdmin = user && user.role === "admin";

  // Auth state and functions to provide
  const value = {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    error,
    login,
    oauthLogin,
    register,
    logout,
    updateProfile,
    updateUser,
    requestEmailVerification,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
