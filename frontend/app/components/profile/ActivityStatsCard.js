"use client";

import { FaChartLine, FaEdit, FaComment, FaHeart } from "react-icons/fa";

/**
 * Activity stats card component showing user's activity statistics
 */
const ActivityStatsCard = ({ stats }) => {
  const { posts = 0, comments = 0, likes = 0 } = stats || {};

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-indigo-100/50 hover:shadow-indigo-100 transition-all">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
        <div className="p-2 mr-2 rounded-lg bg-blue-100 text-blue-600">
          <FaChartLine className="h-5 w-5" />
        </div>
        Activity Stats
      </h3>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center p-3 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50">
          <div className="p-2 rounded-full bg-purple-100 text-purple-600 mb-2">
            <FaEdit className="h-4 w-4" />
          </div>
          <span className="block text-lg font-bold text-purple-700">
            {posts}
          </span>
          <span className="text-xs text-gray-500">Posts</span>
        </div>

        <div className="flex flex-col items-center p-3 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50">
          <div className="p-2 rounded-full bg-blue-100 text-blue-600 mb-2">
            <FaComment className="h-4 w-4" />
          </div>
          <span className="block text-lg font-bold text-blue-700">
            {comments}
          </span>
          <span className="text-xs text-gray-500">Comments</span>
        </div>

        <div className="flex flex-col items-center p-3 rounded-xl bg-gradient-to-br from-rose-50 to-pink-50">
          <div className="p-2 rounded-full bg-rose-100 text-rose-600 mb-2">
            <FaHeart className="h-4 w-4" />
          </div>
          <span className="block text-lg font-bold text-rose-700">{likes}</span>
          <span className="text-xs text-gray-500">Likes</span>
        </div>
      </div>
    </div>
  );
};

export default ActivityStatsCard;
