"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaPlus, FaTimes } from "react-icons/fa";
import { formAnimationVariants } from "@/app/utils/postFormUtils";

/**
 * Category Selector component for selecting and creating post categories
 */
const CategorySelector = ({
  categories,
  selectedCategories,
  onCategorySelect,
  onCategoryRemove,
  onCategoryCreate,
}) => {
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const handleAddNewCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      await onCategoryCreate(newCategory);
      setNewCategory("");
      setShowCategoryInput(false);
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const handleSelectChange = (e) => {
    const selectedCategoryId = e.target.value;

    if (selectedCategoryId === "add-new") {
      setShowCategoryInput(true);
      return;
    }

    const selectedCategory = categories.find(
      (cat) => cat._id === selectedCategoryId
    );

    if (
      selectedCategory &&
      !selectedCategories.some((cat) => cat._id === selectedCategoryId)
    ) {
      onCategorySelect(selectedCategory);
    }
  };

  return (
    <motion.div
      variants={formAnimationVariants.containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white shadow rounded-lg overflow-hidden"
    >
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Categories</h2>

        <motion.div variants={formAnimationVariants.itemVariants}>
          {/* Selected Categories */}
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedCategories.map((category) => (
              <div
                key={category._id}
                className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm flex items-center"
              >
                {category.name}
                <button
                  type="button"
                  onClick={() => onCategoryRemove(category._id)}
                  className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                >
                  <FaTimes className="h-3 w-3" />
                </button>
              </div>
            ))}
            {selectedCategories.length === 0 && (
              <span className="text-gray-400 text-sm italic">
                No categories selected
              </span>
            )}
          </div>

          {showCategoryInput ? (
            <div className="mt-2 mb-4">
              <div className="flex">
                <input
                  type="text"
                  className="flex-1 border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="New category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleAddNewCategory}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FaPlus className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCategoryInput(false);
                    setNewCategory("");
                  }}
                  className="ml-2 inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FaTimes className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <select
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm mb-2"
                onChange={handleSelectChange}
                value=""
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
                <option value="add-new">+ Add New Category</option>
              </select>
            </>
          )}
          {!showCategoryInput && (
            <button
              type="button"
              onClick={() => setShowCategoryInput(true)}
              className="text-blue-600 text-sm hover:text-blue-800 flex items-center"
            >
              <FaPlus className="h-3 w-3 mr-1" /> Add New Category
            </button>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CategorySelector;
