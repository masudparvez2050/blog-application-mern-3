"use client";

import { memo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import LikeDislikeButtons from "@/app/components/shared/LikeDislikeButtons";
import { Tag } from "lucide-react";

const PostContent = memo(function PostContent({
  content,
  tags = [],
  likeCount,
  dislikeCount,
  isLiked,
  isDisliked,
  onLike,
  onDislike,
}) {
  // Container animation for post content
  const contentAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, delay: 0.3 },
    },
  };

  return (
    <div className="mb-12">
      {/* Main Content */}
      <motion.div
        className="prose prose-lg max-w-none mb-8"
        initial="hidden"
        animate="visible"
        variants={contentAnimation}
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center flex-wrap gap-2">
            <Tag className="text-gray-500" />
            {tags.map((tag, index) => (
              <Link
                key={index}
                href={`/blogs?search=${tag}`}
                className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Engagement Section */}
      <div className="border-t border-b border-gray-200 py-6 flex justify-between items-center">
        <LikeDislikeButtons
          likeCount={likeCount}
          dislikeCount={dislikeCount}
          isLiked={isLiked}
          isDisliked={isDisliked}
          onLike={onLike}
          onDislike={onDislike}
          size="medium"
        />

        {/* Social Share Links */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                navigator.clipboard.writeText(window.location.href);
                // Here you could trigger a toast notification
              }
            }}
            className="text-gray-500 hover:text-blue-600 transition-colors"
            aria-label="Copy link to clipboard"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
          </button>

          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
              typeof window !== "undefined" ? window.location.href : ""
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-blue-600 transition-colors"
            aria-label="Share on Twitter"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
            </svg>
          </a>

          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              typeof window !== "undefined" ? window.location.href : ""
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-blue-600 transition-colors"
            aria-label="Share on Facebook"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
});

export default PostContent;
