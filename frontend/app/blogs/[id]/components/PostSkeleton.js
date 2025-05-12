"use client";

import { memo } from "react";

const PostSkeleton = memo(function PostSkeleton() {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-white">
      <div className="container mx-auto px-4 animate-pulse">
        {/* Title Skeleton */}
        <div className="h-10 bg-gray-200 rounded-lg w-3/4 mb-4"></div>
        <div className="h-6 bg-gray-200 rounded-lg w-1/2 mb-6"></div>

        {/* Post Metadata Skeleton */}
        <div className="flex flex-wrap items-center gap-6 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>

          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-6 bg-gray-200 rounded-full w-24 px-3"></div>
        </div>

        {/* Cover Image Skeleton */}
        <div className="relative w-full aspect-[21/9] rounded-xl overflow-hidden bg-gray-200 mb-8"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-8 xl:col-span-9">
            {/* Content Paragraphs */}
            <div className="space-y-4 mb-8">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5"></div>
            </div>

            {/* More Content */}
            <div className="space-y-6 mb-8">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>

            {/* Tags Skeleton */}
            <div className="mb-8">
              <div className="flex items-center flex-wrap gap-2">
                <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                <div className="h-6 bg-gray-200 rounded-full w-14"></div>
              </div>
            </div>

            {/* Engagement Section Skeleton */}
            <div className="border-t border-b border-gray-200 py-6 flex justify-between items-center mb-12">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
              </div>
            </div>

            {/* Comments Section Skeleton */}
            <div className="mb-16">
              <div className="h-8 bg-gray-200 rounded w-40 mb-8"></div>
              <div className="bg-gray-50 p-6 rounded-xl mb-8">
                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-24 bg-gray-200 rounded w-full mb-4"></div>
                <div className="flex justify-end">
                  <div className="h-10 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="lg:col-span-4 xl:col-span-3">
            {/* Author Card Skeleton */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <div className="flex flex-col items-center text-center mb-4">
                <div className="w-20 h-20 rounded-full bg-gray-200 mb-3"></div>
                <div className="h-5 bg-gray-200 rounded w-32 mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="h-16 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>

            {/* Post Info Card Skeleton */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default PostSkeleton;
