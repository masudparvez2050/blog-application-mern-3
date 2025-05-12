"use client";

import { motion } from "framer-motion";
import { FaCommentAlt } from "react-icons/fa";

/**
 * EmptyState - Component for when no comments are found
 */
export const EmptyState = ({ itemVariants }) => {
  return (
    <motion.div
      variants={itemVariants}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <FaCommentAlt className="h-12 w-12 text-gray-300 mb-4" />
      <h3 className="text-xl font-medium text-gray-900 mb-1">
        No comments found
      </h3>
      <p className="text-gray-500 max-w-sm">
        Try adjusting your search or filters to find what you&apos;re looking for.
      </p>
    </motion.div>
  );
};

/**
 * Pagination - Component for comment pagination
 */
export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  
  return (
    <div className="flex justify-center mt-6">
      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        
        {[...Array(totalPages)].map((_, idx) => {
          // Only show pagination with logical breaks
          if (
            totalPages <= 7 ||
            idx === 0 ||
            idx === totalPages - 1 ||
            (currentPage - 3 <= idx && idx <= currentPage + 1)
          ) {
            return (
              <button
                key={idx}
                onClick={() => onPageChange(idx + 1)}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium transition-colors ${
                  currentPage === idx + 1
                    ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {idx + 1}
              </button>
            );
          } else if (idx === 1 || idx === totalPages - 2) {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
              >
                ...
              </span>
            );
          }
          return null;
        })}
        
        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </nav>
    </div>
  );
};
