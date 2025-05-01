import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/app/utils/dateFormatter";

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
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-2">
          {post.categories.slice(0, 2).map((category, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
            >
              {category}
            </span>
          ))}
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {post.title}
        </h3>
        <p className="text-gray-600 mb-4">{post.excerpt}</p>
        <div className="flex items-center">
          <div className="relative h-10 w-10 rounded-full overflow-hidden mr-4">
            <Image
              src={post.author.profilePicture}
              alt={post.author.name}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {post.author.name}
            </p>
            <p className="text-xs text-gray-500">
              {formatDate(post.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
