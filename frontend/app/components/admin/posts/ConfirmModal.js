import { motion, AnimatePresence } from "framer-motion";
import { FaExclamationTriangle, FaTrash, FaCheck, FaBan } from "react-icons/fa";

export function ConfirmModal({
  show,
  onClose,
  onConfirm,
  title,
  message,
  action = "default",
  isProcessing = false,
}) {
  if (!show) return null;

  const getActionConfig = () => {
    switch (action) {
      case "delete":
        return {
          icon: <FaTrash className="h-6 w-6 text-red-500" />,
          confirmText: "Delete",
          confirmClass:
            "bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white",
          iconBg: "bg-red-100",
        };
      case "approve":
        return {
          icon: <FaCheck className="h-6 w-6 text-emerald-500" />,
          confirmText: "Approve",
          confirmClass:
            "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 text-white",
          iconBg: "bg-emerald-100",
        };
      case "reject":
        return {
          icon: <FaBan className="h-6 w-6 text-red-500" />,
          confirmText: "Reject",
          confirmClass:
            "bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white",
          iconBg: "bg-red-100",
        };
      default:
        return {
          icon: <FaExclamationTriangle className="h-6 w-6 text-yellow-500" />,
          confirmText: "Confirm",
          confirmClass:
            "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white",
          iconBg: "bg-yellow-100",
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
            className="absolute inset-0 bg-gray-500 bg-opacity-75"
            onClick={onClose}
            style={{ zIndex: 10 }}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", bounce: 0.25, duration: 0.3 }}
            className="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl sm:my-8 sm:max-w-lg sm:w-full sm:p-6"
            style={{ zIndex: 20 }}
          >
            <div>
              <div
                className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${config.iconBg}`}
              >
                {config.icon}
              </div>
              <div className="mt-3 text-center sm:mt-5">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900"
                  id="modal-headline"
                >
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{message}</p>
                </div>
              </div>
            </div>

            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
              <button
                type="button"
                className={`w-full inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 sm:col-start-2 sm:text-sm ${
                  config.confirmClass
                } ${isProcessing ? "opacity-70 cursor-not-allowed" : ""}`}
                onClick={onConfirm}
                disabled={isProcessing}
              >
                {isProcessing && (
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                )}
                {config.confirmText}
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={onClose}
                disabled={isProcessing}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ConfirmModal;
