"use client";

import { motion } from "framer-motion";
import { FaCheck, FaTimesCircle } from "react-icons/fa";

/**
 * Notification component for displaying messages to users
 * @param {Object} props
 * @param {string} props.type - "success" or "error"
 * @param {string} props.message - The message to display
 */
const Notification = ({ type, message }) => {
  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className={`mb-4 ${
        type === "success"
          ? "bg-green-50 border-green-500"
          : "bg-red-50 border-red-500"
      } border-l-4 p-4 rounded`}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          {type === "success" ? (
            <FaCheck className="h-5 w-5 text-green-500" />
          ) : (
            <FaTimesCircle className="h-5 w-5 text-red-500" />
          )}
        </div>
        <div className="ml-3">
          <p
            className={`text-sm ${
              type === "success" ? "text-green-700" : "text-red-700"
            }`}
          >
            {message}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Notification;
