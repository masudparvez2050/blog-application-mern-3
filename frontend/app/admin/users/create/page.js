"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import { motion } from "framer-motion";
<<<<<<< HEAD
=======
import { getContainerVariants, getItemVariants } from "@/app/utils/animation";
>>>>>>> 315e87c (:message)
import {
  FaUserPlus,
  FaArrowLeft,
  FaSave,
  FaTimes,
  FaEnvelope,
  FaLock,
  FaUser,
  FaUserShield,
  FaCheckCircle,
  FaTimesCircle,
  FaIdCard,
} from "react-icons/fa";

<<<<<<< HEAD
=======


const containerVariants = getContainerVariants(0.5); // custom stagger
const itemVariants = getItemVariants({ y: 20, duration: 0.8 }); // custom values

>>>>>>> 315e87c (:message)
export default function CreateUser() {
  const { isAuthenticated, loading, isAdmin } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
    isActive: true,
    isVerified: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Redirect if not authenticated or not an admin
    if (!loading && (!isAuthenticated || !isAdmin)) {
      router.push("/login?redirect=/admin/users/create");
    }
  }, [isAuthenticated, isAdmin, loading, router]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setErrorMessage("Name is required");
      return false;
    }

    if (!formData.email.trim()) {
      setErrorMessage("Email is required");
      return false;
    }

    if (!formData.password) {
      setErrorMessage("Password is required");
      return false;
    }

    if (formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      // Create a new object without confirmPassword
      const { confirmPassword, ...userData } = formData;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(userData),
        }
      );

      if (response.ok) {
        setSuccessMessage("User created successfully!");
        // Reset form data
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "user",
          isActive: true,
          isVerified: false,
        });
        // Redirect to users list after a short delay
        setTimeout(() => {
          router.push("/admin/users");
        }, 2000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create user");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      setErrorMessage(error.message || "Failed to create user");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clear messages after 5 seconds
  useEffect(() => {
    if (errorMessage || successMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
        setSuccessMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage, successMessage]);

<<<<<<< HEAD
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };
=======
>>>>>>> 315e87c (:message)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-10">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/admin/users" className="mr-4">
              <FaArrowLeft className="h-5 w-5 text-gray-600 hover:text-gray-900" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <FaUserPlus className="mr-2 h-6 w-6 text-blue-600" />
              Create New User
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Messages */}
        {errorMessage && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaTimesCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaCheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white shadow rounded-lg overflow-hidden"
        >
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-6">
              {/* User Details */}
              <div className="border-b pb-4">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  User Information
                </h2>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  {/* Name */}
                  <motion.div variants={itemVariants} className="sm:col-span-3">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Full Name
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                        <FaUser className="h-4 w-4" />
                      </span>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Enter user's full name"
                      />
                    </div>
                  </motion.div>

                  {/* Email */}
                  <motion.div variants={itemVariants} className="sm:col-span-3">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email Address
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                        <FaEnvelope className="h-4 w-4" />
                      </span>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="user@example.com"
                      />
                    </div>
                  </motion.div>

                  {/* Password */}
                  <motion.div variants={itemVariants} className="sm:col-span-3">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                        <FaLock className="h-4 w-4" />
                      </span>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="At least 6 characters"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Must be at least 6 characters long
                    </p>
                  </motion.div>

                  {/* Confirm Password */}
                  <motion.div variants={itemVariants} className="sm:col-span-3">
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Confirm Password
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                        <FaLock className="h-4 w-4" />
                      </span>
                      <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Confirm password"
                      />
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* User Settings */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  User Settings
                </h2>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  {/* Role */}
                  <motion.div variants={itemVariants} className="sm:col-span-3">
                    <label
                      htmlFor="role"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Role
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                        <FaIdCard className="h-4 w-4" />
                      </span>
                      <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      {formData.role === "admin"
                        ? "Admin users have full access to the admin dashboard."
                        : "Regular users can only manage their own content."}
                    </p>
                  </motion.div>

                  {/* Toggle Switches */}
                  <motion.div variants={itemVariants} className="sm:col-span-3">
                    <div className="flex flex-col space-y-4">
                      {/* Active Status */}
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="isActive"
                            name="isActive"
                            type="checkbox"
                            checked={formData.isActive}
                            onChange={handleChange}
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor="isActive"
                            className="font-medium text-gray-700"
                          >
                            Active Account
                          </label>
                          <p className="text-gray-500">
                            Users with inactive accounts cannot log in.
                          </p>
                        </div>
                      </div>

                      {/* Verification Status */}
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="isVerified"
                            name="isVerified"
                            type="checkbox"
                            checked={formData.isVerified}
                            onChange={handleChange}
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor="isVerified"
                            className="font-medium text-gray-700"
                          >
                            Verified Email
                          </label>
                          <p className="text-gray-500">
                            Mark the email as already verified.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating User...
                  </span>
                ) : (
                  <>
                    <FaSave className="mr-2 h-4 w-4" />
                    Create User
                  </>
                )}
              </button>
              <Link
                href="/admin/users"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                <FaTimes className="mr-2 h-4 w-4" />
                Cancel
              </Link>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
