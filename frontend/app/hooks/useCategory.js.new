"use client";

import { useState, useEffect, useCallback } from "react";
import * as categoryService from "../services/categoryService";

const useCategory = () => {
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

  // Define showNotification before it's used in loadCategories
  const showNotification = useCallback((message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await categoryService.fetchCategories(token);
      setCategories(data);
    } catch (error) {
      showNotification("Error fetching categories. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [token, showNotification]); // Include token and showNotification in dependencies

  useEffect(() => {
    if (!token) return;
    loadCategories();
  }, [token, loadCategories]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;

    if (name === "name" && !editMode) {
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

    if (!validateForm()) return;

    try {
      const categoryData = {
        name: currentCategory.name,
        slug: currentCategory.slug,
        description: currentCategory.description,
        isActive: currentCategory.isActive,
      };

      let data;
      if (editMode) {
        data = await categoryService.updateCategory(
          currentCategory.id,
          categoryData,
          token
        );
        setCategories(
          categories.map((cat) => (cat._id === currentCategory.id ? data : cat))
        );
        showNotification("Category updated successfully!", "success");
      } else {
        data = await categoryService.createCategory(categoryData, token);
        setCategories([...categories, data]);
        showNotification("New category created successfully!", "success");
      }
      resetForm();
    } catch (error) {
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
      await categoryService.deleteCategory(id, token);
      setCategories(categories.filter((category) => category._id !== id));
      showNotification("Category deleted successfully!", "success");
    } catch (error) {
      showNotification("Error deleting category. Please try again.", "error");
    }
  };

  const toggleCategoryStatus = async (category) => {
    try {
      const data = await categoryService.toggleCategoryStatus(category, token);
      setCategories(
        categories.map((cat) => (cat._id === category._id ? data : cat))
      );
      showNotification(
        `Category ${data.isActive ? "activated" : "deactivated"} successfully!`,
        "success"
      );
    } catch (error) {
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

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description &&
        category.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      category.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    categories: filteredCategories,
    isLoading,
    searchTerm,
    setSearchTerm,
    showForm,
    setShowForm,
    editMode,
    currentCategory,
    formErrors,
    notification,
    handleInputChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    toggleCategoryStatus,
    resetForm,
  };
};

export default useCategory;
