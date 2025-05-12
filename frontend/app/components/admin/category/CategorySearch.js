"use client";

import PropTypes from 'prop-types';
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";

import ErrorAlert from '../../shared/ErrorAlert';

/**
 * Search component for filtering categories
 * @component
 * @param {Object} props - Component props
 * @param {string} props.searchTerm - Current search term value
 * @param {Function} props.onSearch - Callback function when search term changes
 * @returns {React.ReactElement} CategorySearch component
 */
const CategorySearch = ({ searchTerm, onSearch }) => {
  return (
    
      <div className="bg-white rounded-xl shadow-sm p-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            aria-label="Search categories"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400 h-4 w-4" aria-hidden="true" />
        </motion.div>
      </div>
    
  );
};

CategorySearch.propTypes = {
  /** Current search term value */
  searchTerm: PropTypes.string.isRequired,
  /** Callback function when search term changes */
  onSearch: PropTypes.func.isRequired,
};

CategorySearch.defaultProps = {
  searchTerm: '',
};

export default CategorySearch;
