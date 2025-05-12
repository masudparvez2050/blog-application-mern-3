"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/app/utils/dateFormatter";
import { motion } from "framer-motion";
import { Calendar, Tag, User, Bookmark } from "lucide-react";

const PostSidebar = memo(function PostSidebar({
  author,
  category,
  tags = [],
  createdAt,
}) {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, delay: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      className="sticky top-24"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Author Card */}
      {author && (
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6"
          variants={itemVariants}
        >
          <div className="flex flex-col items-center text-center mb-4">
            <div className="relative w-20 h-20 rounded-full overflow-hidden mb-3">
              <Image
                src={author.avatar || "/images/default-avatar.png"}
                alt={author.name}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
            <h3 className="font-bold text-lg text-gray-900">{author.name}</h3>
            {author.role && (
              <p className="text-sm text-gray-500">{author.role}</p>
            )}
          </div>

          {author.bio && (
            <p className="text-gray-700 text-sm mb-4 text-center line-clamp-3">
              {author.bio}
            </p>
          )}

          <Link
            href={`/profile/${author._id}`}
            className="block w-full text-center py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            View Profile
          </Link>
        </motion.div>
      )}

      {/* Post Info Card */}
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        variants={itemVariants}
      >
        <h3 className="font-bold text-gray-900 mb-4">Post Information</h3>

        <ul className="space-y-4">
          {/* Published Date */}
          <li className="flex items-start gap-3">
            <div className="flex-shrink-0 p-1.5 bg-blue-50 rounded-md text-blue-600">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Published</p>
              <p className="text-sm font-medium text-gray-900">
                {formatDate(createdAt)}
              </p>
            </div>
          </li>

          {/* Author */}
          {author && (
            <li className="flex items-start gap-3">
              <div className="flex-shrink-0 p-1.5 bg-blue-50 rounded-md text-blue-600">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Author</p>
                <p className="text-sm font-medium text-gray-900">
                  {author.name}
                </p>
              </div>
            </li>
          )}

          {/* Category */}
          {category && (
            <li className="flex items-start gap-3">
              <div className="flex-shrink-0 p-1.5 bg-blue-50 rounded-md text-blue-600">
                <Bookmark className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <Link
                  href={`/blogs?category=${category._id}`}
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  {category.name}
                </Link>
              </div>
            </li>
          )}

          {/* Tags */}
          {tags && tags.length > 0 && (
            <li className="flex items-start gap-3">
              <div className="flex-shrink-0 p-1.5 bg-blue-50 rounded-md text-blue-600">
                <Tag className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tags</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {tags.map((tag, index) => (
                    <Link
                      key={index}
                      href={`/blogs?search=${tag}`}
                      className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            </li>
          )}
        </ul>
      </motion.div>
    </motion.div>
  );
});

export default PostSidebar;
