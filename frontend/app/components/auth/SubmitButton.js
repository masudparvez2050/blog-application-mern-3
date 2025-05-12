"use client";

import { FaSpinner } from "react-icons/fa";
import { motion } from "framer-motion";

/**
 * SubmitButton Component - A styled submit button with loading state
 *
 * @param {Object} props
 * @param {boolean} props.isLoading - Whether the button is in loading state
 * @param {string} props.text - Text to display when not loading
 * @param {string} props.loadingText - Text to display when loading
 * @param {React.ReactNode} props.icon - Icon to display beside text when not loading
 * @param {string} props.type - Button type (submit, button, etc.)
 * @param {Function} props.onClick - Click handler
 */
const SubmitButton = ({
  isLoading = false,
  text = "Submit",
  loadingText = "Submitting...",
  icon = null,
  type = "submit",
  onClick = null,
}) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isLoading}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
    >
      {isLoading ? (
        <>
          <FaSpinner className="animate-spin mr-2" />
          {loadingText}
        </>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {text}
        </>
      )}
    </motion.button>
  );
};

export default SubmitButton;
