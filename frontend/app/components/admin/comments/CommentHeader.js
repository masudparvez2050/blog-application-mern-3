import { motion } from "framer-motion";
import { FaSearch, FaSpinner } from "react-icons/fa";

const CommentHeader = ({
  isSearching,
  searchTerm,
  setSearchTerm,
  handleSearch,
  title = "Comment Management",
  subtitle = "Manage and moderate user comments",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-sm p-6 mb-6"
    >
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
        <div className="relative rounded-lg shadow-sm flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search comments by content, author or post..."
            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 py-2 sm:text-sm border-gray-300 rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {isSearching && (
                <FaSpinner className="animate-spin h-4 w-4 text-gray-400" />
              )}
            </div>
          )}
        </div>
        <button
          type="submit"
          className="flex-shrink-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
          disabled={isSearching}
        >
          {isSearching ? (
            <>
              <FaSpinner className="animate-spin mr-2 h-4 w-4" />
              Searching...
            </>
          ) : (
            <>
              <FaSearch className="mr-2 h-4 w-4" />
              Search
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default CommentHeader;
