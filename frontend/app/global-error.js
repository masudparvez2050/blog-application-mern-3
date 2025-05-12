"use client";

import { useEffect } from "react";
import { FaBug, FaRedo } from "react-icons/fa";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-white py-16 px-4">
          <div className="text-center max-w-2xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="bg-red-100 text-red-600 rounded-full p-6">
                <FaBug size={50} />
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Critical Error
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              We&apos;re sorry, but a critical error has occurred in the
              application. This is likely a temporary issue that will be
              resolved soon.
            </p>

            <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-lg text-left max-w-lg mx-auto">
              <div className="text-red-700 text-sm overflow-auto">
                {error?.message || "Unknown error occurred"}
              </div>
            </div>

            <button
              onClick={() => reset()}
              className="inline-flex items-center justify-center gap-2 py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaRedo className="text-white" />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
