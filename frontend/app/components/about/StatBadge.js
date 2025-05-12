"use client";

import { memo } from "react";

// Using memo to avoid unnecessary re-renders for stat badges
export const StatBadge = memo(function StatBadge({ label, value }) {
  return (
    <div className="bg-white rounded-full px-6 py-2 shadow-md border border-gray-100 flex flex-col items-center">
      <span className="font-bold text-2xl text-blue-600">{value}</span>
      <span className="text-gray-600 text-sm">{label}</span>
    </div>
  );
});
