"use client";

import { motion } from "framer-motion";
import { FaFilter } from "react-icons/fa";

const TimeRangeFilter = ({ timeRange, setTimeRange }) => {
  const timeRanges = [
    { value: "month", label: "Last Month" },
    { value: "quarter", label: "Last Quarter" },
    { value: "year", label: "Last Year" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-6 rounded-xl shadow-sm"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h2 className="text-lg font-medium text-gray-900 flex items-center mb-4 md:mb-0">
          <FaFilter className="mr-2 h-4 w-4 text-indigo-500" />
          Time Range
        </h2>
        <div className="inline-flex p-1 bg-gray-100 rounded-lg">
          {timeRanges.map(({ value, label }) => (
            <button
              key={value}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                timeRange === value
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "text-gray-700 hover:text-indigo-600"
              }`}
              onClick={() => setTimeRange(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default TimeRangeFilter;
