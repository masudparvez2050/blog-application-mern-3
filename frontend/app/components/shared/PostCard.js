"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { formatDate } from "@/app/utils/dateFormatter";
import LikeDislikeButtons from "./LikeDislikeButtons";

export default function PostCard({ post }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group h-full flex flex-col bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/blogs/${post._id}`} className="flex-1 flex flex-col">
        <div className="relative h-52 w-full overflow-hidden">
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-50 z-10 transition-opacity duration-300 ${
              isHovered ? "opacity-70" : "opacity-30"
            }`}
          ></div>
          <Image
            src={post.coverImage}
            alt={post.title}
            style={{
              objectFit: "cover",
              transition: "transform 0.6s ease",
            }}
            className={`w-full h-full ${isHovered ? "scale-110" : "scale-100"}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {post.categories?.slice(0, 2).map((category, index) => (
            <span
              key={index}
              className="ml-2 mt-4 px-3 py-1 text-xs font-medium bg-blue-600/90 text-white rounded-full backdrop-blur-sm shadow-sm"
              style={{
                transform: isHovered ? "translateY(0)" : "translateY(-5px)",
                opacity: isHovered ? 1 : 0.9,
                transition: `transform 0.3s ease ${
                  index * 0.1
                }s, opacity 0.3s ease ${index * 0.1}s`,
              }}
            >
              {category.name}
            </span>
          ))}
        </div>

        <div className="p-6 flex-1 flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {post.title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center">
              <div className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-white shadow-sm mr-3">
                <Image
                  src={post.author.profilePicture}
                  alt={post.author.name}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {post.author.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(post.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex gap-x-3 items-center">
              <div className="flex items-center text-gray-500 text-sm">
                <svg
                  className="h-4 w-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  ></path>
                </svg>
                {post.views}
              </div>
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-500 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
                <span className="text-xs text-gray-500">
                  {post.commentCount || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>

      <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/80">
        <LikeDislikeButtons
          postId={post._id}
          initialLikes={post.likes?.length || 0}
          initialDislikes={post.dislikes?.length || 0}
          compact={true}
        />
      </div>
    </div>
  );
}
