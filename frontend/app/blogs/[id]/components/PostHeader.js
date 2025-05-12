"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, Clock } from "lucide-react";
import { fadeIn } from "@/app/utils/animation";

const PostHeader = memo(function PostHeader({
  title,
  coverImage,
  author,
  createdAt,
  category,
  readTime,
}) {
  return (
    <motion.header
      className="mb-8"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      {/* Title */}
      <motion.h1
        className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
        }}
      >
        {title}
      </motion.h1>

      {/* Post Metadata */}
      <div className="flex flex-wrap items-center gap-6 mb-6 text-gray-600 text-sm">
        {/* Author + Avatar */}
        {author && (
          <Link
            href={`/profile/${author._id}`}
            className="flex items-center gap-2 hover:text-blue-600"
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden">
              <Image
                src={author.avatar || "/images/default-avatar.png"}
                alt={author.name}
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>
            <span className="font-medium">{author.name}</span>
          </Link>
        )}

        {/* Date */}
        <div className="flex items-center gap-1.5">
          <CalendarDays className="w-4 h-4" />
          <span>{createdAt}</span>
        </div>

        {/* Read Time */}
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          <span>{readTime} read</span>
        </div>

        {/* Category */}
        {category && (
          <Link
            href={`/blogs?category=${category._id}`}
            className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
          >
            {category.name}
          </Link>
        )}
      </div>

      {/* Cover Image */}
      <motion.div
        className="relative w-full aspect-[21/9] rounded-xl overflow-hidden shadow-lg"
        variants={{
          hidden: { opacity: 0, scale: 0.98 },
          visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.8, ease: "easeOut" },
          },
        }}
      >
        <Image
          src={coverImage || "/images/default-post-cover.jpg"}
          alt={title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 60vw"
          className="object-cover"
        />
      </motion.div>
    </motion.header>
  );
});

export default PostHeader;
