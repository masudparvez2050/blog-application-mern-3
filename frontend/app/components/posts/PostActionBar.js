"use client";

import Link from "next/link";
import {
  FaArrowLeft,
  FaNewspaper,
  FaSave,
  FaUpload,
  FaTrash,
  FaPencilAlt,
} from "react-icons/fa";

/**
 * Post Action Bar component for create/edit post pages
 */
const PostActionBar = ({
  isEditing = false,
  isSubmitting,
  onSaveDraft,
  onSubmitForReview,
  onDelete,
}) => {
  return (
    <div className="bg-white z-10 shadow-md border-b mt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard"
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            title="Back to dashboard"
          >
            <FaArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900 flex items-center">
            {isEditing ? (
              <>
                <FaPencilAlt className="mr-2 h-5 w-5 text-blue-600" />
                Edit Post
              </>
            ) : (
              <>
                <FaNewspaper className="mr-2 h-5 w-5 text-blue-600" />
                Create New Post
              </>
            )}
          </h1>
        </div>
        <div className="flex space-x-2">
          {isEditing && onDelete && (
            <button
              type="button"
              onClick={onDelete}
              disabled={isSubmitting}
              className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <FaTrash className="mr-2 h-4 w-4" />
              Delete
            </button>
          )}

          <button
            type="button"
            onClick={onSaveDraft}
            disabled={isSubmitting}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FaSave className="mr-2 h-4 w-4" />
            Save Draft
          </button>

          <button
            type="button"
            onClick={onSubmitForReview}
            disabled={isSubmitting}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            <FaUpload className="mr-2 h-4 w-4" />
            {isSubmitting ? "Submitting..." : "Submit for Review"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostActionBar;
