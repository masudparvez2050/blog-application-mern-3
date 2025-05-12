"use client";

import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { FaPlus, FaTimes } from "react-icons/fa";

import ErrorAlert from "../../shared/ErrorAlert";

/**
 * PageHeader component for the category management page
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.showForm - Controls whether the form is visible
 * @param {Function} props.onToggleForm - Callback to toggle form visibility
 * @param {Function} props.onResetForm - Callback to reset form state
 * @returns {React.ReactElement} PageHeader component
 */
const PageHeader = ({ showForm, onToggleForm, onResetForm }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-sm p-6"
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl font-bold text-gray-900">
            Category Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Create, edit, and manage categories for your blog posts
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            onResetForm();
            onToggleForm(!showForm);
          }}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm ${
            showForm
              ? "text-gray-700 bg-gray-200 hover:bg-gray-300"
              : "text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all`}
        >
          {showForm ? (
            <>
              <FaTimes className="mr-2 h-4 w-4" /> Cancel
            </>
          ) : (
            <motion.button>
              <FaPlus className="mr-2 h-4 w-4" /> New Category
            </motion.button>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

PageHeader.propTypes = {
  /** Controls whether the form is visible */
  showForm: PropTypes.bool.isRequired,
  /** Callback to toggle form visibility */
  onToggleForm: PropTypes.func.isRequired,
  /** Callback to reset form state */
  onResetForm: PropTypes.func.isRequired,
};

PageHeader.defaultProps = {
  showForm: false,
};

export default PageHeader;
