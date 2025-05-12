"use client";

import { motion } from "framer-motion";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

export default function FormMessage({ message }) {
  if (!message || !message.text) return null;

  const isError = message.type === "error";
  const isSuccess = message.type === "success";

  const bgColor = isError
    ? "bg-red-50"
    : isSuccess
    ? "bg-green-50"
    : "bg-blue-50";

  const textColor = isError
    ? "text-red-800"
    : isSuccess
    ? "text-green-800"
    : "text-blue-800";

  const borderColor = isError
    ? "border-red-400"
    : isSuccess
    ? "border-green-400"
    : "border-blue-400";

  const Icon = isError ? FaExclamationTriangle : FaCheckCircle;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-md ${bgColor} p-4 mb-4 border ${borderColor}`}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${textColor}`} aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className={`text-sm font-medium ${textColor}`}>{message.text}</p>
        </div>
      </div>
    </motion.div>
  );
}
