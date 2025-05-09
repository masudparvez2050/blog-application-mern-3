"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
<<<<<<< HEAD
=======
import { getContainerVariants, getItemVariants } from "@/app/utils/animation";
>>>>>>> 315e87c (:message)
import {
  FaPlus,
  FaEdit,
  FaTrash,
<<<<<<< HEAD
  FaCheck,
  FaTimes,
  FaTag,
  FaChevronLeft,
=======
  FaTimes,
  FaTag,
>>>>>>> 315e87c (:message)
  FaSearch,
  FaSave,
  FaTachometerAlt,
  FaArrowLeft,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

<<<<<<< HEAD
=======

const containerVariants = getContainerVariants(0.5); // custom stagger
const itemVariants = getItemVariants({ y: 10, duration: 0.8 }); // custom values

>>>>>>> 315e87c (:message)
export default function CategoryManagement() {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({
    id: "",
    name: "",
    slug: "",
    description: "",
    isActive: true,
  });
  const [formErrors, setFormErrors] = useState({});
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [token, setToken] = useState("");

  useEffect(() => {
    // Access localStorage safely only on the client side
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  useEffect(() => {
    // Redirect if not authenticated or not an admin
    if (!loading && (!isAuthenticated || !isAdmin)) {
      router.push("/login?redirect=/admin/category");
      return;
    }

    if (!token) return; // Don't fetch if token isn't available yet

    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/categories`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          throw new Error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        showNotification(
          "Error fetching categories. Please try again.",
          "error"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [isAuthenticated, isAdmin, loading, router, token]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;

    if (name === "name" && !editMode) {
      // Auto-generate slug from name when creating new category
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");

      setCurrentCategory({
        ...currentCategory,
        [name]: inputValue,
        slug: generatedSlug,
      });
    } else {
      setCurrentCategory({
        ...currentCategory,
        [name]: inputValue,
      });
    }

    // Clear errors for this field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!currentCategory.name.trim()) {
      errors.name = "Category name is required";
    }

    if (!currentCategory.slug.trim()) {
      errors.slug = "Slug is required";
    } else if (!/^[a-z0-9-]+$/.test(currentCategory.slug)) {
      errors.slug =
        "Slug can only contain lowercase letters, numbers, and hyphens";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const url = editMode
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${currentCategory.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/categories`;

      const method = editMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: currentCategory.name,
          slug: currentCategory.slug,
          description: currentCategory.description,
          isActive: currentCategory.isActive,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (editMode) {
          setCategories(
            categories.map((cat) =>
              cat._id === currentCategory.id ? data : cat
            )
          );
          showNotification("Category updated successfully!", "success");
        } else {
          setCategories([...categories, data]);
          showNotification("New category created successfully!", "success");
        }
        resetForm();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Operation failed");
      }
    } catch (error) {
      console.error("Error saving category:", error);
      showNotification(
        error.message || "Error saving category. Please try again.",
        "error"
      );
    }
  };

  const handleEdit = (category) => {
    setCurrentCategory({
      id: category._id,
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      isActive: category.isActive,
    });
    setEditMode(true);
    setShowForm(true);
    setFormErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this category? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setCategories(categories.filter((category) => category._id !== id));
        showNotification("Category deleted successfully!", "success");
      } else {
        throw new Error("Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      showNotification("Error deleting category. Please try again.", "error");
    }
  };

  const toggleCategoryStatus = async (category) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${category._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...category,
            isActive: !category.isActive,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCategories(
          categories.map((cat) => (cat._id === category._id ? data : cat))
        );
        showNotification(
          `Category ${
            data.isActive ? "activated" : "deactivated"
          } successfully!`,
          "success"
        );
      } else {
        throw new Error("Failed to update category status");
      }
    } catch (error) {
      console.error("Error updating category status:", error);
      showNotification(
        "Error updating category status. Please try again.",
        "error"
      );
    }
  };

  const resetForm = () => {
    setCurrentCategory({
      id: "",
      name: "",
      slug: "",
      description: "",
      isActive: true,
    });
    setEditMode(false);
    setShowForm(false);
    setFormErrors({});
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });

    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

=======
 
>>>>>>> 315e87c (:message)
  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="flex flex-col items-center justify-center">
          <div className="h-14 w-14 rounded-full border-t-4 border-b-4 border-indigo-600 animate-spin"></div>
          <div className="absolute top-0 left-0 h-14 w-14 rounded-full border-r-4 border-l-4 border-indigo-300 animate-pulse"></div>
          <p className="mt-4 text-center text-indigo-600 font-medium">
            Loading categories...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/20 to-white pt-14">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Link
                href="/admin"
                className="mr-2 text-indigo-600 hover:text-indigo-800"
              >
                <FaTachometerAlt className="h-5 w-5" />
              </Link>
              <span className="mx-2">/</span>
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 flex items-center">
                <FaTag className="mr-2 h-5 w-5 text-indigo-600" />
                Category Management
              </span>
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Create, edit, and manage categories for your blog posts
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                resetForm();
                setShowForm(!showForm);
              }}
              className={`px-4 py-2 rounded-lg shadow-sm text-white font-medium ${
                showForm
                  ? "bg-gray-600 hover:bg-gray-700"
                  : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center transition-all`}
            >
              {showForm ? (
                <>
                  <FaArrowLeft className="mr-2 h-4 w-4" /> Back to List
                </>
              ) : (
                <>
                  <FaPlus className="mr-2 h-4 w-4" /> New Category
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Notification */}
        <AnimatePresence>
          {notification.show && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-6 p-4 rounded-lg shadow-md ${
                notification.type === "success"
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-red-100 text-red-800 border border-red-200"
              }`}
            >
              {notification.message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Section */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-white shadow-md rounded-xl p-6 border border-indigo-100">
                <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  {editMode ? (
                    <>
                      <FaEdit className="mr-2 h-5 w-5 text-blue-600" />
                      Edit Category
                    </>
                  ) : (
                    <>
                      <FaPlus className="mr-2 h-5 w-5 text-indigo-600" />
                      Create New Category
                    </>
                  )}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-1">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Category Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={currentCategory.name}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border ${
                          formErrors.name ? "border-red-300" : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                        placeholder="e.g., Technology"
                      />
                      {formErrors.name && (
                        <p className="mt-1 text-sm text-red-600">
                          {formErrors.name}
                        </p>
                      )}
                    </div>

                    <div className="col-span-1">
                      <label
                        htmlFor="slug"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Slug <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="slug"
                        name="slug"
                        value={currentCategory.slug}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border ${
                          formErrors.slug ? "border-red-300" : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                        placeholder="e.g., technology"
                      />
                      {formErrors.slug && (
                        <p className="mt-1 text-sm text-red-600">
                          {formErrors.slug}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        URL-friendly version of the name. Use lowercase letters,
                        numbers, and hyphens only.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={currentCategory.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Brief description of the category (optional)"
                    ></textarea>
                  </div>

                  <div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isActive"
                        name="isActive"
                        checked={currentCategory.isActive}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="isActive"
                        className="ml-2 block text-sm font-medium text-gray-700"
                      >
                        Active
                      </label>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Inactive categories will not appear on the public site
                    </p>
                  </div>

                  <div className="flex space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center transition-all"
                    >
                      <FaSave className="mr-2 h-4 w-4" />
                      {editMode ? "Update Category" : "Save Category"}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 flex items-center transition-all"
                    >
                      <FaTimes className="mr-2 h-4 w-4" />
                      Cancel
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
          </div>
        </div>

        {/* Categories Table */}
        <div className="bg-white shadow-md rounded-xl overflow-hidden border border-indigo-100">
          <div className="overflow-x-auto">
            {filteredCategories.length === 0 ? (
              <div className="p-8 text-center">
                <FaTag className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  No categories found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm
                    ? `No categories matching "${searchTerm}"`
                    : "Get started by creating your first category"}
                </p>
                {!showForm && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <FaPlus className="mr-2 h-4 w-4" />
                    Create Category
                  </button>
                )}
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Slug
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Description
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Updated
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <AnimatePresence>
                    {filteredCategories.map((category) => (
                      <motion.tr
                        key={category._id}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <FaTag className="h-5 w-5 text-indigo-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {category.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600 font-mono">
                            {category.slug}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500 max-w-xs truncate">
                            {category.description || "-"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              category.isActive
                                ? "bg-green-100 text-green-800 border border-green-200"
                                : "bg-gray-100 text-gray-800 border border-gray-200"
                            }`}
                          >
                            {category.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(category.updatedAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => toggleCategoryStatus(category)}
                              className={`p-1.5 rounded-md ${
                                category.isActive
                                  ? "bg-amber-100 text-amber-600 hover:bg-amber-200"
                                  : "bg-green-100 text-green-600 hover:bg-green-200"
                              }`}
                              title={
                                category.isActive ? "Deactivate" : "Activate"
                              }
                            >
                              {category.isActive ? (
                                <FaEyeSlash className="h-4 w-4" />
                              ) : (
                                <FaEye className="h-4 w-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handleEdit(category)}
                              className="p-1.5 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200"
                              title="Edit"
                            >
                              <FaEdit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(category._id)}
                              className="p-1.5 rounded-md bg-red-100 text-red-600 hover:bg-red-200"
                              title="Delete"
                            >
                              <FaTrash className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
