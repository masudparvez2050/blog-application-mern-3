"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  FaEnvelope,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

const EmailVerificationSection = ({
  user,
  isSendingVerification,
  handleSendVerificationEmail,
}) => {
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
      },
    },
  };

  if (user?.isVerified) return null;

  return (
    <AnimatePresence>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="mb-8 relative overflow-hidden"
      >
        <div className="bg-yellow-50/80 backdrop-blur-md border border-yellow-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FaExclamationTriangle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Email Verification Required</p>
                <p className="text-yellow-700">
                  Please verify your email address to access all features.
                  We&apos;ve sent a verification link to {user?.email}.
                </p>
              </div>

              <div className="mt-4 flex items-center space-x-4">
                <button
                  onClick={handleSendVerificationEmail}
                  disabled={isSendingVerification}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSendingVerification ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="mr-2"
                      >
                        <FaEnvelope className="h-4 w-4" />
                      </motion.div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaEnvelope className="mr-2 h-4 w-4" />
                      Resend Verification Email
                    </>
                  )}
                </button>
                <a
                  href="/support/email-verification"
                  className="text-sm text-yellow-700 hover:text-yellow-800 hover:underline"
                >
                  Need help?
                </a>
              </div>
            </div>
          </div>

          {/* Background decoration */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute -right-4 -bottom-4 h-32 w-32 text-yellow-200/20">
              <FaEnvelope className="h-full w-full" />
            </div>
          </div>
        </div>

        {/* Success animation overlay */}
        <AnimatePresence>
          {isSendingVerification && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="text-yellow-600"
              >
                <FaEnvelope className="h-8 w-8 animate-bounce" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default EmailVerificationSection;
