"use client";

import React from "react";

export default function FloationgButton() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 p-3 rounded-full bg-blue-600 text-white shadow-xl z-50 transition-all duration-300 hover:bg-blue-700 hover:scale-110 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
      aria-label="Scroll back to top"
      title="Scroll to top"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 15l7-7 7 7"
        />
      </svg>
    </button>
  );
}
