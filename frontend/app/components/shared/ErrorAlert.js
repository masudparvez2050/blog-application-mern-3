"use client";

import { useState } from "react";
import { X } from "lucide-react";



/**
 * Error alert component that displays an error message with retry option
 * @param {Object} props
 * @param {string} props.message - The error message to display
 * @param {Function} props.onRetry - Function to call when retry button is clicked
 */
export default function ErrorAlert({ message, onRetry }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 my-6 rounded shadow-sm">
      <div className="flex items-start">
        <div className="flex-grow">
          <p className="text-red-700 font-medium">Error</p>
          <p className="text-red-600 mt-1">{message}</p>
          <div className="mt-3 flex gap-3">
            {onRetry && (
              <button
                onClick={() => {
                  setDismissed(false);
                  onRetry();
                }}
                className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm transition-colors"
              >
                Retry
              </button>
            )}
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="flex-shrink-0 ml-4 text-red-400 hover:text-red-500 focus:outline-none"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
