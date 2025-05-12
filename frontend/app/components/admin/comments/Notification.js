"use client";

import { motion } from "framer-motion";
import { FaCheck, FaExclamationTriangle } from "react-icons/fa";

/**
 * Notification component - Shows success or error messages
 */
const Notification = ({ message, type }) => {
  if (!message) return null;

  const variants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      className={`p-4 rounded-lg shadow-sm ${
        type === "success"
          ? "bg-green-50 border-l-4 border-green-500 text-green-700"
          : "bg-red-50 border-l-4 border-red-500 text-red-700"
      }`}
    >
      <div className="flex items-center">
        {type === "success" ? (
          <FaCheck className="h-5 w-5 mr-3" />
        ) : (
          <FaExclamationTriangle className="h-5 w-5 mr-3" />
        )}
        <p>{message}</p>
      </div>
    </motion.div>
  );
};

export default Notification;
