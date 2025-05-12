"use client";

import { motion } from "framer-motion";
import { FaExclamationCircle } from "react-icons/fa";

/**
 * DevModeInfo Component - Displays development-only information
 * Useful for showing debug information that should not appear in production
 *
 * @param {Object} props
 * @param {Object} props.data - Development data to display
 * @param {string} props.title - Title for the development info panel
 */
const DevModeInfo = ({ data, title = "Development Mode" }) => {
  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-6 p-4 rounded-lg bg-amber-50 text-amber-800 border-l-4 border-amber-500"
    >
      <h3 className="font-bold flex items-center">
        <FaExclamationCircle className="h-4 w-4 mr-2" />
        {title}
      </h3>

      {data.message && <p className="mb-2 mt-1 text-sm">{data.message}</p>}

      {data.resetUrl && (
        <div className="bg-white p-3 rounded border border-amber-200 mb-2 text-sm">
          <p className="font-mono break-all">
            <strong>Reset URL:</strong>{" "}
            <a href={data.resetUrl} className="text-blue-600 hover:underline">
              {data.resetUrl}
            </a>
          </p>
        </div>
      )}

      {data.resetToken && (
        <div className="bg-white p-3 rounded border border-amber-200 text-sm">
          <p className="font-mono break-all">
            <strong>Reset Token:</strong> {data.resetToken}
          </p>
        </div>
      )}

      {data.error && <p className="mt-2 text-red-600 text-sm">{data.error}</p>}

      {/* Display any other properties as JSON */}
      {Object.entries(data).map(([key, value]) => {
        // Skip already handled properties
        if (["message", "resetUrl", "resetToken", "error"].includes(key)) {
          return null;
        }

        return (
          <div
            key={key}
            className="bg-white p-3 rounded border border-amber-200 mt-2 text-sm"
          >
            <p className="font-mono break-all">
              <strong>{key}:</strong>{" "}
              {typeof value === "object" ? JSON.stringify(value) : value}
            </p>
          </div>
        );
      })}
    </motion.div>
  );
};

export default DevModeInfo;
