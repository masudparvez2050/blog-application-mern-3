import { motion, AnimatePresence } from 'framer-motion';
import {
  FaFilter,
  FaChevronDown,
  FaChevronRight,
  FaCheck,
  FaTimes,
  FaExclamationTriangle,
  FaFlag,
  FaSort,
} from 'react-icons/fa';

const CommentFilters = ({
  showFilters,
  setShowFilters,
  filterStatus,
  handleFilterChange,
  sortOrder,
  handleSortChange,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
        >
          <FaFilter className="mr-2 h-4 w-4" />
          Filters
          {showFilters ? (
            <FaChevronDown className="ml-2 h-3 w-3" />
          ) : (
            <FaChevronRight className="ml-2 h-3 w-3" />
          )}
        </button>

        {/* Sort Options */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Sort:</span>
          <select
            value={sortOrder}
            onChange={(e) => handleSortChange(e.target.value)}
            className="text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="flagged">Flagged First</option>
          </select>
        </div>
      </div>

      {/* Status Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by status:</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleFilterChange("all")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filterStatus === "all"
                      ? "bg-gray-800 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All Comments
                </button>
                <button
                  onClick={() => handleFilterChange("approved")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center ${
                    filterStatus === "approved"
                      ? "bg-green-600 text-white shadow-md"
                      : "bg-green-50 text-green-700 hover:bg-green-100"
                  }`}
                >
                  <FaCheck className="mr-1 h-3 w-3" />
                  Approved
                </button>
                <button
                  onClick={() => handleFilterChange("pending")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center ${
                    filterStatus === "pending"
                      ? "bg-yellow-500 text-white shadow-md"
                      : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                  }`}
                >
                  <FaExclamationTriangle className="mr-1 h-3 w-3" />
                  Pending
                </button>
                <button
                  onClick={() => handleFilterChange("rejected")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center ${
                    filterStatus === "rejected"
                      ? "bg-red-600 text-white shadow-md"
                      : "bg-red-50 text-red-700 hover:bg-red-100"
                  }`}
                >
                  <FaTimes className="mr-1 h-3 w-3" />
                  Rejected
                </button>
                <button
                  onClick={() => handleFilterChange("flagged")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center ${
                    filterStatus === "flagged"
                      ? "bg-orange-500 text-white shadow-md"
                      : "bg-orange-50 text-orange-700 hover:bg-orange-100"
                  }`}
                >
                  <FaFlag className="mr-1 h-3 w-3" />
                  Flagged
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommentFilters;
