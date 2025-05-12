"use client";

import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { FaPlus, FaEdit, FaTimes, FaSave } from "react-icons/fa";

import ErrorAlert from "../../shared/ErrorAlert";

/**
 * Form component for creating and editing categories
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.showForm - Whether to display the form
 * @param {boolean} props.editMode - Whether the form is in edit mode
 * @param {Object} props.currentCategory - Current category data
 * @param {Object} props.formErrors - Form validation errors
 * @param {Function} props.onSubmit - Form submission handler
 * @param {Function} props.onChange - Input change handler
 * @param {Function} props.onCancel - Form cancel handler
 * @returns {React.ReactElement|null} CategoryForm component
 */
const CategoryForm = ({
  showForm,
  editMode,
  currentCategory,
  formErrors,
  onSubmit,
  onChange,
  onCancel,
}) => {
  if (!showForm) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-sm p-6"
    >
      <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
        {editMode ? (
          <>
            <FaEdit className="mr-2 h-5 w-5 text-blue-600" />
            Edit Category
          </>
        ) : (
          <>
            <FaPlus className="mr-2 h-5 w-5 text-indigo-600" />
            Create New Category
          </>
        )}
      </h2>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={currentCategory.name}
              onChange={onChange}
              className={`w-full px-3 py-2 border ${
                formErrors.name ? "border-red-300" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
              placeholder="e.g., Technology"
              aria-invalid={formErrors.name ? "true" : "false"}
              aria-describedby={formErrors.name ? "name-error" : undefined}
            />
            {formErrors.name && (
              <p id="name-error" className="mt-1 text-sm text-red-600">
                {formErrors.name}
              </p>
            )}
          </div>

          <div className="col-span-1">
            <label
              htmlFor="slug"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={currentCategory.slug}
              onChange={onChange}
              className={`w-full px-3 py-2 border ${
                formErrors.slug ? "border-red-300" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
              placeholder="e.g., technology"
              aria-invalid={formErrors.slug ? "true" : "false"}
              aria-describedby={formErrors.slug ? "slug-error" : "slug-help"}
            />
            {formErrors.slug ? (
              <p id="slug-error" className="mt-1 text-sm text-red-600">
                {formErrors.slug}
              </p>
            ) : (
              <p id="slug-help" className="mt-1 text-xs text-gray-500">
                URL-friendly version of the name. Use lowercase letters,
                numbers, and hyphens only.
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={currentCategory.description}
            onChange={onChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Brief description of the category (optional)"
          />
        </div>

        <div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={currentCategory.isActive}
              onChange={onChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label
              htmlFor="isActive"
              className="ml-2 block text-sm font-medium text-gray-700"
            >
              Active
            </label>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Inactive categories will not appear on the public site
          </p>
        </div>

        <div className="flex space-x-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center transition-all"
          >
            <FaSave className="mr-2 h-4 w-4" />
            {editMode ? "Update Category" : "Save Category"}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 flex items-center transition-all"
          >
            <FaTimes className="mr-2 h-4 w-4" />
            Cancel
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

CategoryForm.propTypes = {
  /** Whether to display the form */
  showForm: PropTypes.bool.isRequired,
  /** Whether the form is in edit mode */
  editMode: PropTypes.bool.isRequired,
  /** Current category data */
  currentCategory: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    description: PropTypes.string,
    isActive: PropTypes.bool.isRequired,
  }).isRequired,
  /** Form validation errors */
  formErrors: PropTypes.shape({
    name: PropTypes.string,
    slug: PropTypes.string,
  }).isRequired,
  /** Form submission handler */
  onSubmit: PropTypes.func.isRequired,
  /** Input change handler */
  onChange: PropTypes.func.isRequired,
  /** Form cancel handler */
  onCancel: PropTypes.func.isRequired,
};

CategoryForm.defaultProps = {
  showForm: false,
  editMode: false,
  formErrors: {},
};

export default CategoryForm;
