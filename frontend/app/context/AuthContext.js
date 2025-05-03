"use client";

import { createContext, useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  // Load user from local storage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }

    setLoading(false);
  }, []);

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

      // Store token and user data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

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

      // Store token and user data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

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

      // Store token and user data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

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
    localStorage.removeItem("token");
    localStorage.removeItem("user");
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

      // Update local storage
      localStorage.setItem("user", JSON.stringify(data));
      if (data.token) {
        localStorage.setItem("token", data.token);
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
