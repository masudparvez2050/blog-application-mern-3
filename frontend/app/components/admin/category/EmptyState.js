"use client";

import PropTypes from 'prop-types';
import { motion } from "framer-motion";
import { FaTag, FaPlus } from "react-icons/fa";

import ErrorAlert from '../../shared/ErrorAlert';

/**
 * Empty state component displayed when no categories are found
 * @component
 * @param {Object} props - Component props
 * @param {string} props.searchTerm - Current search term value
 * @param {boolean} props.showForm - Whether the category form is currently visible
 * @param {Function} props.onCreateClick - Callback function when create button is clicked
 * @returns {React.ReactElement} EmptyState component
 */
const EmptyState = ({ searchTerm, showForm, onCreateClick }) => {
  return (
   
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-all duration-300"
      >
        <div className="p-8 text-center">
          <FaTag 
            className="mx-auto h-12 w-12 text-gray-300" 
            aria-hidden="true" 
          />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No categories found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? `No categories matching "${searchTerm}"`
              : "Get started by creating your first category"}
          </p>
          {!showForm && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={onCreateClick}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              aria-label="Create new category"
            >
              <FaPlus className="mr-2 h-4 w-4" aria-hidden="true" />
              Create Category
            </motion.button>
          )}
        </div>
      </motion.div>
    
  );
};

EmptyState.propTypes = {
  /** Current search term value */
  searchTerm: PropTypes.string,
  /** Whether the category form is currently visible */
  showForm: PropTypes.bool.isRequired,
  /** Callback function when create button is clicked */
  onCreateClick: PropTypes.func.isRequired,
};

EmptyState.defaultProps = {
  searchTerm: '',
  showForm: false,
};

export default EmptyState;
