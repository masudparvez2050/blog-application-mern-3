"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  FaPlus,
  FaLayerGroup,
  FaCheckCircle,
  FaHourglassHalf,
  FaPencilAlt,
  FaSearch,
  FaSlidersH,
} from "react-icons/fa";

/**
 * Post Filter Controls component for filtering and searching posts
 */
const PostFilterControls = ({
  activeTab,
  setActiveTab,
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  showFilters,
  setShowFilters,
}) => {
  return (
    <motion.div
      className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-80 pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
          />
          <FaSearch className="absolute left-3.5 top-3.5 text-gray-400" />
        </div>

        {/* Mobile filters toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-gray-200 rounded-xl shadow-sm text-gray-700"
        >
          <FaSlidersH /> {showFilters ? "Hide Filters" : "Show Filters"}
        </button>

        <div
          className={`flex flex-wrap gap-2 ${
            showFilters ? "flex" : "hidden md:flex"
          }`}
        >
          {/* Status Filters */}
          <button
            className={`px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors ${
              activeTab === "all"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("all")}
          >
            <FaLayerGroup
              className={`${
                activeTab === "all" ? "text-white" : "text-gray-500"
              }`}
            />{" "}
            All
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors ${
              activeTab === "published"
                ? "bg-green-600 text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("published")}
          >
            <FaCheckCircle
              className={`${
                activeTab === "published" ? "text-white" : "text-green-500"
              }`}
            />{" "}
            Published
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors ${
              activeTab === "pending"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("pending")}
          >
            <FaHourglassHalf
              className={`${
                activeTab === "pending" ? "text-white" : "text-blue-500"
              }`}
            />{" "}
            Pending
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors ${
              activeTab === "draft"
                ? "bg-amber-500 text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("draft")}
          >
            <FaPencilAlt
              className={`${
                activeTab === "draft" ? "text-white" : "text-amber-500"
              }`}
            />{" "}
            Drafts
          </button>
        </div>
      </div>

      {/* Sort & Create Post */}
      <div className="flex gap-3 w-full lg:w-auto">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="py-2.5 px-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-gray-700"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="most-viewed">Most Viewed</option>
          <option value="most-liked">Most Liked</option>
        </select>

        <Link
          href="/dashboard/create-post"
          className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all flex items-center gap-2 shadow-md whitespace-nowrap ml-auto"
        >
          <FaPlus className="h-4 w-4" />
          <span>Create Post</span>
        </Link>
      </div>
    </motion.div>
  );
};

export default PostFilterControls;
