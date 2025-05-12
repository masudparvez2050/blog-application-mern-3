"use client";

import PropTypes from 'prop-types';
import { motion, AnimatePresence } from "framer-motion";
import { FaTag, FaEdit, FaTrash, FaEye, FaEyeSlash } from "react-icons/fa";

import ErrorAlert from '../../shared/ErrorAlert';
import EmptyState from "./EmptyState";

/**
 * Table component for displaying and managing categories
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.categories - Array of category objects to display
 * @param {string} props.searchTerm - Current search term for filtering
 * @param {Function} props.onEdit - Callback when edit button is clicked
 * @param {Function} props.onDelete - Callback when delete button is clicked
 * @param {Function} props.onToggleStatus - Callback when status toggle is clicked
 * @param {boolean} props.showForm - Whether the category form is visible
 * @returns {React.ReactElement} CategoryTable component
 */
const CategoryTable = ({
  categories,
  searchTerm,
  onEdit,
  onDelete,
  onToggleStatus,
  showForm,
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  if (categories.length === 0) {
    return <EmptyState searchTerm={searchTerm} showForm={showForm} />;
  }

  return (
    
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Slug
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Updated
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {categories.map((category) => (
                  <motion.tr
                    key={category._id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <FaTag className="h-5 w-5 text-indigo-600" aria-hidden="true" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {category.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 font-mono">
                        {category.slug}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {category.description || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          category.isActive
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-gray-100 text-gray-800 border border-gray-200"
                        }`}
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(category.updatedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => onToggleStatus(category)}
                          className={`p-1.5 rounded-md ${
                            category.isActive
                              ? "bg-amber-100 text-amber-600 hover:bg-amber-200"
                              : "bg-green-100 text-green-600 hover:bg-green-200"
                          }`}
                          title={category.isActive ? "Deactivate" : "Activate"}
                          aria-label={category.isActive ? "Deactivate category" : "Activate category"}
                        >
                          {category.isActive ? (
                            <FaEyeSlash className="h-4 w-4" aria-hidden="true" />
                          ) : (
                            <FaEye className="h-4 w-4" aria-hidden="true" />
                          )}
                        </button>
                        <button
                          onClick={() => onEdit(category)}
                          className="p-1.5 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200"
                          title="Edit"
                          aria-label="Edit category"
                        >
                          <FaEdit className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button
                          onClick={() => onDelete(category._id)}
                          className="p-1.5 rounded-md bg-red-100 text-red-600 hover:bg-red-200"
                          title="Delete"
                          aria-label="Delete category"
                        >
                          <FaTrash className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>
    
  );
};

CategoryTable.propTypes = {
  /** Array of category objects to display */
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      description: PropTypes.string,
      isActive: PropTypes.bool.isRequired,
      updatedAt: PropTypes.string.isRequired,
    })
  ).isRequired,
  /** Current search term for filtering */
  searchTerm: PropTypes.string,
  /** Callback when edit button is clicked */
  onEdit: PropTypes.func.isRequired,
  /** Callback when delete button is clicked */
  onDelete: PropTypes.func.isRequired,
  /** Callback when status toggle is clicked */
  onToggleStatus: PropTypes.func.isRequired,
  /** Whether the category form is visible */
  showForm: PropTypes.bool.isRequired,
};

CategoryTable.defaultProps = {
  categories: [],
  searchTerm: '',
  showForm: false,
};

export default CategoryTable;
