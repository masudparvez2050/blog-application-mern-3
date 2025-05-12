"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaPlus, FaTimes, FaTag, FaInfoCircle } from "react-icons/fa";
import { formAnimationVariants } from "@/app/utils/postFormUtils";

/**
 * Tag Editor component for managing post tags
 */
const TagEditor = ({ tags, onAddTag, onRemoveTag }) => {
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag)) {
      onAddTag(tag);
      setTagInput("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      handleAddTag();
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
        <h2 className="text-lg font-medium text-gray-900 mb-4">Tags</h2>

        <motion.div variants={formAnimationVariants.itemVariants}>
          {/* Selected Tags */}
          <div className="flex flex-wrap gap-2 mb-4 min-h-[40px]">
            {tags.map((tag) => (
              <div
                key={tag}
                className="bg-gray-100 text-gray-800 rounded-full px-3 py-1 text-sm flex items-center"
              >
                <FaTag className="h-3 w-3 mr-1 text-gray-500" />
                {tag}
                <button
                  type="button"
                  onClick={() => onRemoveTag(tag)}
                  className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <FaTimes className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex mt-2">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Add a tag and press Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaPlus className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500 flex items-center">
            <FaInfoCircle className="mr-1 h-3 w-3" /> Press Enter after each tag
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TagEditor;
