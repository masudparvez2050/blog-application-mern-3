"use client";

import PropTypes from 'prop-types';
import { motion, AnimatePresence } from "framer-motion";
import { FaCheck, FaTimes } from "react-icons/fa";
import ErrorAlert from '../../shared/ErrorAlert';

/**
 * Notification component for displaying success and error messages
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.notification - Notification object containing message details
 * @param {boolean} props.notification.show - Whether to show the notification
 * @param {string} props.notification.message - The message to display
 * @param {('success'|'error')} props.notification.type - The type of notification
 * @returns {React.ReactElement|null} CategoryNotification component
 */
const CategoryNotification = ({ notification }) => {
  if (!notification.show) return null;

  return (
    
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`p-4 rounded-lg shadow-sm ${
            notification.type === "success"
              ? "bg-green-50 border-l-4 border-green-500 text-green-700"
              : "bg-red-50 border-l-4 border-red-500 text-red-700"
          }`}
        >
          <div className="flex">
            <div className="flex-shrink-0">
              {notification.type === "success" ? (
                <FaCheck className="h-5 w-5 text-green-400" />
              ) : (
                <FaTimes className="h-5 w-5 text-red-400" />
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm">{notification.message}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
   
  );
};

CategoryNotification.propTypes = {
  /** Notification object containing message details */
  notification: PropTypes.shape({
    /** Whether to show the notification */
    show: PropTypes.bool.isRequired,
    /** The message to display */
    message: PropTypes.string.isRequired,
    /** The type of notification */
    type: PropTypes.oneOf(['success', 'error']).isRequired,
  }).isRequired,
};

CategoryNotification.defaultProps = {
  notification: {
    show: false,
    message: '',
    type: 'success'
  }
};

export default CategoryNotification;
