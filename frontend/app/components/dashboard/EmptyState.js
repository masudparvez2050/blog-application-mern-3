"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";

/**
 * EmptyState component shown when there are no posts
 */
const EmptyState = ({ activeTab, searchTerm, onClearFilters }) => {
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-md p-12 text-center border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <svg
        className="h-20 w-20 text-gray-300 mx-auto mb-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        ></path>
      </svg>
      <h3 className="text-2xl font-semibold text-gray-800 mb-3">
        No posts found
      </h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        {activeTab === "all" && !searchTerm
          ? "You haven't created any posts yet. Start writing your first post!"
          : `No posts found matching your ${
              searchTerm ? "search" : "filters"
            }. Try adjusting your criteria.`}
      </p>
      {activeTab === "all" && !searchTerm ? (
        <Link
          href="/dashboard/create-post"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-blue-700 shadow-md transition-all"
        >
          <FaPlus className="mr-2" />
          Create your first post
        </Link>
      ) : (
        <button
          onClick={onClearFilters}
          className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 shadow-sm transition-all"
        >
          Clear filters
        </button>
      )}
    </motion.div>
  );
};

export default EmptyState;
