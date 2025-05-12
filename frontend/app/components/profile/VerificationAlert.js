"use client";

import { useState } from "react";
import {
  FaEnvelope,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { requestVerificationEmail } from "../../services/userService";

/**
 * Verification alert component for users who haven't verified their email
 */
const VerificationAlert = ({ isVerified }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Handle requesting verification email
  const handleRequestVerification = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await requestVerificationEmail();

      if (!response.error) {
        setShowSuccess(true);

        // Hide success message after 5 seconds
        setTimeout(() => {
          setShowSuccess(false);
        }, 5000);
      } else {
        setError(
          response.message ||
            "Failed to send verification email. Please try again later."
        );
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isVerified) return null;

  return (
    <AnimatePresence mode="wait">
      {showSuccess ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg mb-6"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <FaCheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-800">
                Verification email sent! Please check your inbox and click the
                verification link.
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="alert"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg mb-6"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <FaExclamationTriangle className="h-5 w-5 text-amber-500" />
            </div>
            <div className="ml-3 flex-grow">
              <p className="text-sm text-amber-800">
                Your email isn&apos;t verified yet. Please verify your email to
                access all features.
              </p>
              {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
            </div>
            <div className="ml-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRequestVerification}
                disabled={isSubmitting}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-amber-700 bg-amber-100 hover:bg-amber-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-3 w-3 text-amber-700"
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
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <FaEnvelope className="mr-1.5 h-3 w-3" />
                    Send Verification
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VerificationAlert;
