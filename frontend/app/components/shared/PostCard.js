import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/app/utils/dateFormatter";
import LikeDislikeButtons from "./LikeDislikeButtons";

export default function PostCard({ post }) {
  return (
    <Link
      href={`/blogs/${post._id}`}
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
    >
      <div className="relative h-48 w-full">
        <Image
          src={post.coverImage}
          alt={post.title}
          style={{ objectFit: "cover" }}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-2">
          {post.categories?.slice(0, 2).map((category, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
            >
              {category.name}
            </span>
          ))}
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {post.title}
        </h3>
        <p className="text-gray-600 mb-4">{post.excerpt}</p>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="relative h-10 w-10 rounded-full overflow-hidden mr-4">
              <Image
                src={post.author.profilePicture}
                alt={post.author.name}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            <p className="text-sm font-medium text-gray-900">
              {post.author.name}
            </p>
          </div>
          <div className="text-sm text-gray-500">
            {formatDate(post.createdAt)}
          </div>
        </div>
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
          <LikeDislikeButtons
            postId={post._id}
            initialLikes={post.likes?.length || 0}
            initialDislikes={post.dislikes?.length || 0}
            compact={true}
          />
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500 mr-1"
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
            <span className="text-gray-500">{post.commentCount || 0}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
