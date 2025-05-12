"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaCheck, FaTimes } from "react-icons/fa";

/**
 * Confirmation Modal for comment actions
 */
const ConfirmationModal = ({
  show,
  comment,
  actionType,
  onConfirm,
  onCancel,
}) => {
  if (!show || !comment || !actionType) return null;

  const getActionConfig = () => {
    switch (actionType) {
      case "delete":
        return {
          title: "Delete Comment",
          message:
            "Are you sure you want to delete this comment? This action cannot be undone.",
          icon: <FaTrash className="h-6 w-6 text-red-600" aria-hidden="true" />,
          iconBg: "bg-red-100",
          buttonColor: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
        };
      case "approve":
        return {
          title: "Approve Comment",
          message:
            "Are you sure you want to approve this comment? It will be visible to all users.",
          icon: (
            <FaCheck className="h-6 w-6 text-green-600" aria-hidden="true" />
          ),
          iconBg: "bg-green-100",
          buttonColor: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
        };
      case "reject":
        return {
          title: "Reject Comment",
          message:
            "Are you sure you want to reject this comment? It will be hidden from users.",
          icon: (
            <FaTimes className="h-6 w-6 text-yellow-600" aria-hidden="true" />
          ),
          iconBg: "bg-yellow-100",
          buttonColor:
            "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
        };
      default:
        return {
          title: "Confirm Action",
          message: "Are you sure you want to continue?",
          icon: (
            <FaCheck className="h-6 w-6 text-blue-600" aria-hidden="true" />
          ),
          iconBg: "bg-blue-100",
          buttonColor: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
        };
    }
  };

  const config = getActionConfig();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.75 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-gray-500 bg-opacity-75"
            onClick={onCancel}
            style={{ zIndex: 10 }}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              duration: 0.3,
            }}
            className="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl sm:max-w-lg sm:w-full sm:p-6"
            style={{ zIndex: 20 }}
          >
            <div className="sm:flex sm:items-start">
              <div
                className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 ${config.iconBg}`}
              >
                {config.icon}
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900"
                  id="modal-headline"
                >
                  {config.title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{config.message}</p>
                  <div className="mt-3 p-4 bg-gray-50 rounded-lg text-sm">
                    <p className="font-medium text-gray-700 mb-1">
                      Comment content:
                    </p>
                    <p className="text-gray-600 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className={`w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm transition-colors ${config.buttonColor}`}
                onClick={onConfirm}
              >
                Confirm
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                onClick={onCancel}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;
