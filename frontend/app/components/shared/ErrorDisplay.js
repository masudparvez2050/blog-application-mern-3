"use client";

import { memo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertCircle, ChevronLeft } from "lucide-react";

/**
 * A reusable error display component that shows error messages
 * with optional details and a back link.
 */
const ErrorDisplay = memo(function ErrorDisplay({
  error,
  title = "An error occurred",
  message,
  backLink,
  backText = "Go back",
}) {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  // Format error message
  const errorMessage = message || error?.message || "Something went wrong";

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
      <motion.div
        className="max-w-md w-full text-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">{title}</h2>

        <p className="text-gray-600 mb-6">{errorMessage}</p>

        {error?.status && (
          <div className="text-sm text-gray-500 mb-6">
            Error code: {error.status}
          </div>
        )}

        {backLink && (
          <Link
            href={backLink}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            {backText}
          </Link>
        )}
      </motion.div>
    </div>
  );
});

export default ErrorDisplay;
