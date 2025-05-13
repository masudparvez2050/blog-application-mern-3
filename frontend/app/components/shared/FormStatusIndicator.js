"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FaSpinner, FaCheckCircle, FaTimes } from "react-icons/fa";

const FormStatusIndicator = ({ 
  isSaving, 
  lastSaved, 
  error, 
  hasUnsavedChanges,
  onDismissError
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="absolute top-0 right-0 flex items-center gap-2 p-2 text-sm"
      >
        {isSaving && (
          <div className="flex items-center gap-2 text-indigo-600">
            <FaSpinner className="animate-spin h-4 w-4" />
            <span>Saving...</span>
          </div>
        )}

        {!isSaving && lastSaved && !error && (
          <div className="flex items-center gap-2 text-green-600">
            <FaCheckCircle className="h-4 w-4" />
            <span>
              Saved {new Date(lastSaved).toLocaleTimeString()}
            </span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-red-600">
            <FaTimes className="h-4 w-4" />
            <span>{error}</span>
            {onDismissError && (
              <button
                onClick={onDismissError}
                className="ml-2 text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="h-3 w-3" />
              </button>
            )}
          </div>
        )}

        {hasUnsavedChanges && !isSaving && !error && (
          <div className="flex items-center gap-2 text-yellow-600">
            <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
            <span>Unsaved changes</span>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default FormStatusIndicator;
