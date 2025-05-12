"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  FaExclamationCircle,
  FaCheckCircle,
  FaInfoCircle,
} from "react-icons/fa";

/**
 * AlertMessage Component - Displays errors, warnings, and success messages
 *
 * @param {Object} props
 * @param {string} props.type - Message type ('error', 'success', 'info', 'warning')
 * @param {string} props.message - Message content
 * @param {Function} props.onClose - Optional callback function when close button is clicked
 */
const AlertMessage = ({ type, message, onClose }) => {
  if (!message) return null;

  const alertStyles = {
    error: {
      bg: "bg-red-50",
      border: "border-red-500",
      text: "text-red-700",
      icon: <FaExclamationCircle className="h-5 w-5 text-red-500" />,
    },
    success: {
      bg: "bg-green-50",
      border: "border-green-500",
      text: "text-green-700",
      icon: <FaCheckCircle className="h-5 w-5 text-green-500" />,
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-500",
      text: "text-blue-700",
      icon: <FaInfoCircle className="h-5 w-5 text-blue-500" />,
    },
    warning: {
      bg: "bg-yellow-50",
      border: "border-yellow-500",
      text: "text-yellow-700",
      icon: <FaExclamationCircle className="h-5 w-5 text-yellow-500" />,
    },
  };

  const style = alertStyles[type] || alertStyles.info;

  return (
    <AnimatePresence>
      <motion.div
        className={`mb-6 ${style.bg} border-l-4 ${style.border} p-4 rounded-lg shadow-sm backdrop-blur-sm bg-opacity-80`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
      >
        <div className="flex">
          <div className="flex-shrink-0">{style.icon}</div>
          <div className="ml-3 flex-1">
            <p className={`text-sm ${style.text}`}>{message}</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="ml-auto pl-3 -mr-1.5 text-gray-400 hover:text-gray-600"
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AlertMessage;
