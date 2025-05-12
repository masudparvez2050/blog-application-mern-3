"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  FaSave, 
  FaInfoCircle, 
  FaTimes, 
  FaUpload, 
  FaTrash
} from "react-icons/fa";
import { formAnimationVariants } from "@/app/utils/postFormUtils";

/**
 * Publication Settings component for handling post status and submission
 */
const PublicationSettings = ({
  status,
  isFeatured,
  isSubmitting,
  onStatusChange,
  onFeaturedChange,
  onSubmit,
  onDelete,
  isEditing = false
}) => {
  return (
    <motion.div
      variants={formAnimationVariants.containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white shadow rounded-lg overflow-hidden"
    >
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Publication Settings
        </h2>

        {/* Status Option */}
        <motion.div
          variants={formAnimationVariants.itemVariants}
          className="mb-4"
        >
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <div className="flex flex-col space-y-2">
            <label
              className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
                status === "draft"
                  ? "bg-blue-50 border-blue-300 text-blue-800"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name="status"
                value="draft"
                checked={status === "draft"}
                onChange={onStatusChange}
                className="sr-only"
              />
              <div className="flex items-center">
                <FaSave
                  className={`mr-2 h-4 w-4 ${
                    status === "draft" ? "text-blue-600" : "text-gray-400"
                  }`}
                />
                <span>Draft</span>
              </div>
            </label>

            <label
              className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
                status === "pending"
                  ? "bg-yellow-50 border-yellow-300 text-yellow-800"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name="status"
                value="pending"
                checked={status === "pending"}
                onChange={onStatusChange}
                className="sr-only"
              />
              <div className="flex items-center">
                <FaInfoCircle
                  className={`mr-2 h-4 w-4 ${
                    status === "pending" ? "text-yellow-600" : "text-gray-400"
                  }`}
                />
                <span>Submit for Review</span>
              </div>
            </label>
          </div>

          <div className="mt-2 text-xs text-gray-500 flex items-center">
            <FaInfoCircle className="mr-1 h-3 w-3" />
            Your post will be reviewed by an administrator before being
            published.
          </div>
        </motion.div>

        {/* Featured Post Option */}
        <motion.div
          variants={formAnimationVariants.itemVariants}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <label
                htmlFor="isFeatured"
                className="font-medium text-gray-700 cursor-pointer"
              >
                Featured Post Request
              </label>
              <div
                className="ml-2 text-gray-400 hover:text-gray-500"
                title="Request to have your post featured on the homepage"
              >
                <FaInfoCircle className="h-4 w-4" />
              </div>
            </div>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                id="isFeatured"
                name="isFeatured"
                checked={isFeatured}
                onChange={onFeaturedChange}
                className="absolute block w-6 h-6 bg-white border-4 rounded-full appearance-none cursor-pointer checked:right-0 checked:border-blue-600 focus:outline-none"
              />
              <label
                htmlFor="isFeatured"
                className={`block h-6 overflow-hidden rounded-full cursor-pointer ${
                  isFeatured ? "bg-blue-600" : "bg-gray-300"
                }`}
              ></label>
            </div>
          </div>
          <div className="mt-1 text-xs text-gray-500">
            Featured status is subject to admin approval.
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={formAnimationVariants.itemVariants}
          className="flex flex-col space-y-2"
        >
          <button
            type="button"
            onClick={(e) => onSubmit(e, status)}
            disabled={isSubmitting}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isSubmitting ? (
              <>
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
                {status === "pending" ? "Submitting..." : "Saving..."}
              </>
            ) : (
              <>
                {status === "pending" ? (
                  <>
                    <FaUpload className="mr-2 h-4 w-4" />
                    Submit for Review
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2 h-4 w-4" />
                    Save {isEditing ? "Changes" : "Draft"}
                  </>
                )}
              </>
            )}
          </button>
          
          <Link
            href="/dashboard"
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md text-sm text-center font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FaTimes className="mr-2 h-4 w-4" />
            Cancel
          </Link>
          
          {isEditing && onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <FaTrash className="mr-2 h-4 w-4" />
              Delete Post
            </button>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PublicationSettings;
