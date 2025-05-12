"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaEnvelope,
} from "react-icons/fa";

/**
 * Component for managing email verification
 */
const EmailVerificationSection = ({ user, requestEmailVerification }) => {
  const [isSendingVerification, setIsSendingVerification] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState({
    text: "",
    type: "",
  });

  const handleRequestVerification = async () => {
    setIsSendingVerification(true);
    setVerificationMessage({ text: "", type: "" });

    try {
      const result = await requestEmailVerification();

      if (result.success) {
        setVerificationMessage({
          text: "Verification email sent! Please check your inbox.",
          type: "success",
        });
      } else {
        throw new Error(result.message || "Failed to send verification email");
      }
    } catch (error) {
      setVerificationMessage({
        text:
          error.message ||
          "Failed to send verification email. Please try again later.",
        type: "error",
      });
    } finally {
      setIsSendingVerification(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-indigo-100/50">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
        <div className="p-2 mr-2 rounded-lg bg-indigo-100 text-indigo-600">
          <FaEnvelope className="h-5 w-5" />
        </div>
        Email Verification
      </h3>

      <div className="p-4 rounded-lg border">
        {user?.isEmailVerified ? (
          <div className="flex items-center text-green-600">
            <FaCheckCircle className="h-5 w-5 mr-2" />
            <span>Your email is verified</span>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start">
              <FaExclamationTriangle className="h-5 w-5 mr-2 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-gray-700">
                  Your email is not verified. Verifying your email helps secure
                  your account and ensures you receive important notifications.
                </p>
              </div>
            </div>

            {verificationMessage.text && (
              <div
                className={`p-3 rounded-md ${
                  verificationMessage.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {verificationMessage.type === "success" ? (
                  <div className="flex">
                    <FaCheckCircle className="h-5 w-5 mr-2" />
                    <span>{verificationMessage.text}</span>
                  </div>
                ) : (
                  <div className="flex">
                    <FaExclamationTriangle className="h-5 w-5 mr-2" />
                    <span>{verificationMessage.text}</span>
                  </div>
                )}
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRequestVerification}
              disabled={isSendingVerification}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-70"
            >
              {isSendingVerification ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  <FaEnvelope className="mr-2 h-4 w-4" />
                  Send Verification Email
                </>
              )}
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerificationSection;
