"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  FaEye,
  FaHeart,
  FaComment,
  FaEdit,
  FaTrash,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { formatDate, getStatusColor } from "@/app/utils/dashboardUtils";
import { animationVariants } from "@/app/utils/dashboardUtils";

/**
 * Post Card component for displaying a post in the dashboard
 */
const PostCard = ({ post, onDelete }) => {
  // Dynamic import of icons based on status
  const getStatusIcon = (status) => {
    switch (status) {
      case "published":
        return <FaCheckCircle className="mr-1.5" />;
      case "pending":
        return <FaHourglassHalf className="mr-1.5" />;
      case "draft":
        return <FaPencilAlt className="mr-1.5" />;
      default:
        return null;
    }
  };

  // Import these icons only when they're used
  const {
    FaCheckCircle,
    FaHourglassHalf,
    FaPencilAlt,
  } = require("react-icons/fa");

  const handleDeletePost = async () => {
    if (confirm("Are you sure you want to delete this post?")) {
      await onDelete(post._id);
    }
  };

  return (
    <motion.div
      variants={animationVariants.itemVariants}
      className="bg-white rounded-2xl shadow-md hover:shadow-lg border border-gray-100 overflow-hidden transition-all duration-300"
    >
      <div className="flex flex-col md:flex-row">
        {/* Post Thumbnail */}
        <div className="relative w-full md:w-48 h-48 md:h-auto flex-shrink-0">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            priority={true}
          />
          <div
            className={`absolute top-2 left-2 px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getStatusColor(
              post.status
            )}`}
          >
            <div className="flex items-center">
              {getStatusIcon(post.status)}
              <span>
                {post.status === "published"
                  ? "Published"
                  : post.status === "pending"
                  ? "Pending"
                  : "Draft"}
              </span>
            </div>
          </div>
        </div>

        {/* Post Info */}
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
            {post.title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>

          <div className="mt-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center text-sm text-gray-500">
              <span className="mr-4">{formatDate(post.createdAt)}</span>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <FaEye className="h-4 w-4 mr-1 text-gray-400" />
                  <span>{post.views || 0}</span>
                </div>
                <div className="flex items-center">
                  <FaHeart className="h-4 w-4 mr-1 text-gray-400" />
                  <span>{post.likes?.length || 0}</span>
                </div>
                <div className="flex items-center">
                  <FaComment className="h-4 w-4 mr-1 text-gray-400" />
                  <span>{post.comments?.length || 0}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/blogs/${post._id}`}
                className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition-colors"
                title="View post"
              >
                <FaExternalLinkAlt />
              </Link>
              <Link
                href={`/dashboard/edit-post/${post._id}`}
                className="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-50 transition-colors"
                title="Edit post"
              >
                <FaEdit />
              </Link>
              <button
                onClick={handleDeletePost}
                className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                title="Delete post"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PostCard;
