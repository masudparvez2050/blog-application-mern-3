"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaExclamationCircle,
  FaTimes,
} from "react-icons/fa";

/**
 * MessageAlert Component
 *
 * A reusable alert component for displaying different types of messages
 *
 * @param {Object} props
 * @param {string} props.message - The message to display
 * @param {string} props.type - The type of message: 'success', 'error', 'warning', 'info'
 * @param {boolean} props.autoClose - Whether to automatically close the alert (default: true)
 * @param {number} props.duration - Duration in ms before auto-closing (default: 5000)
 * @param {Function} props.onClose - Optional callback when alert is closed
 */
export function MessageAlert({
  message,
  type = "info",
  autoClose = true,
  duration = 5000,
  onClose,
}) {
  const [visible, setVisible] = useState(!!message);

  // Auto-hide the alert after duration
  useEffect(() => {
    setVisible(!!message);

    let timer;
    if (message && autoClose) {
      timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [message, autoClose, duration, onClose]);

  // Handle manual close
  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  // Don't render anything if there's no message
  if (!message) return null;

  // Configure alert styles based on type
  const alertConfig = {
    success: {
      icon: <FaCheckCircle className="h-5 w-5" />,
      bgColor: "bg-green-50",
      borderColor: "border-green-500",
      textColor: "text-green-800",
      iconColor: "text-green-500",
    },
    error: {
      icon: <FaExclamationCircle className="h-5 w-5" />,
      bgColor: "bg-red-50",
      borderColor: "border-red-500",
      textColor: "text-red-800",
      iconColor: "text-red-500",
    },
    warning: {
      icon: <FaExclamationTriangle className="h-5 w-5" />,
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-500",
      textColor: "text-yellow-800",
      iconColor: "text-yellow-500",
    },
    info: {
      icon: <FaInfoCircle className="h-5 w-5" />,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-500",
      textColor: "text-blue-800",
      iconColor: "text-blue-500",
    },
  };

  const { icon, bgColor, borderColor, textColor, iconColor } =
    alertConfig[type] || alertConfig.info;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className={`rounded-md p-4 mb-4 ${bgColor} border-l-4 ${borderColor} shadow-sm`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`flex-shrink-0 ${iconColor}`}>{icon}</div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${textColor}`}>{message}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className={`inline-flex ${iconColor} hover:opacity-75 focus:outline-none`}
            >
              <FaTimes className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
