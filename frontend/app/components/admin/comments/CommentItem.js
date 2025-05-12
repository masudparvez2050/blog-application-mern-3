"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaCheck,
  FaTimes,
  FaCalendarAlt,
  FaUser,
  FaEye,
  FaFlag,
  FaTrash,
  FaChevronDown,
  FaChevronRight,
  FaExclamationTriangle,
} from "react-icons/fa";

/**
 * CommentItem - Displays a single comment with actions
 */
const CommentItem = ({ comment, onAction, itemVariants }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const getStatusBadge = (comment) => {
    if (comment.isApproved === true) {
      return (
        <span className="ml-2 px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
          <FaCheck className="mr-1 h-3 w-3" />
          Approved
        </span>
      );
    } else if (comment.isApproved === false) {
      return (
        <span className="ml-2 px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
          <FaTimes className="mr-1 h-3 w-3" />
          Rejected
        </span>
      );
    } else {
      return (
        <span className="ml-2 px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
          <FaExclamationTriangle className="mr-1 h-3 w-3" />
          Pending
        </span>
      );
    }
  };

  return (
    <motion.li
      variants={itemVariants}
      exit={{ opacity: 0, height: 0 }}
      className={`hover:bg-indigo-50 transition-colors ${
        comment.isFlagged ? "bg-orange-50" : ""
      }`}
    >
      <div className="px-6 py-5">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <FaUser className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">
                    {comment.author?.name || "Anonymous"}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center">
                    <FaCalendarAlt className="mr-1 h-3 w-3" />
                    <span>
                      {new Date(comment.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {getStatusBadge(comment)}

              {comment.isFlagged && (
                <span className="px-2 py-1 inline-flex items-center text-xs leading-4 font-medium rounded-full bg-orange-100 text-orange-800">
                  <FaFlag className="mr-1 h-3 w-3" />
                  Flagged
                </span>
              )}
            </div>

            <div className="ml-2 flex-shrink-0 flex items-center space-x-1">
              <Link
                href={`/blogs/${comment.post?._id}`}
                className="inline-flex items-center p-2 border border-transparent rounded-lg shadow-sm text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                title="View on Post"
              >
                <FaEye className="h-4 w-4" />
              </Link>
              {comment.isApproved !== true && (
                <button
                  onClick={() => onAction(comment, "approve")}
                  className="inline-flex items-center p-2 border border-transparent rounded-lg shadow-sm text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all"
                  title="Approve Comment"
                >
                  <FaCheck className="h-4 w-4" />
                </button>
              )}
              {comment.isApproved !== false && (
                <button
                  onClick={() => onAction(comment, "reject")}
                  className="inline-flex items-center p-2 border border-transparent rounded-lg shadow-sm text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all"
                  title="Reject Comment"
                >
                  <FaTimes className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => onAction(comment, "delete")}
                className="inline-flex items-center p-2 border border-transparent rounded-lg shadow-sm text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all"
                title="Delete Comment"
              >
                <FaTrash className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-1">
            <div className="p-4 bg-gray-50 rounded-lg" onClick={toggleExpand}>
              <div className="flex justify-between cursor-pointer">
                <p className="text-gray-800 whitespace-pre-wrap">
                  {isExpanded
                    ? comment.content
                    : truncateText(comment.content, 150)}
                </p>
                {comment.content?.length > 150 && (
                  <button className="ml-2 text-indigo-500 hover:text-indigo-700 flex items-center text-xs font-medium">
                    {isExpanded ? (
                      <>
                        Show less <FaChevronDown className="ml-1" />
                      </>
                    ) : (
                      <>
                        Show more <FaChevronRight className="ml-1" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-600">
            <span className="font-medium">Post:</span>{" "}
            <Link
              href={`/blogs/${comment.post?._id}`}
              className="text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              {comment.post?.title || "Unknown Post"}
            </Link>
          </div>
        </div>
      </div>
    </motion.li>
  );
};

export default CommentItem;
