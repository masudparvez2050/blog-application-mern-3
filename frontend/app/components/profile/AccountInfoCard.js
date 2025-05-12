"use client";

import { FaUserCircle, FaCalendarAlt } from "react-icons/fa";
import Image from "next/image";
import { formatDate } from "../../utils/dateFormatter";

/**
 * Account info card component showing user's basic account information
 */
const AccountInfoCard = ({ user }) => {
  // Format the join date to a readable string
  const joinDate = user?.createdAt ? formatDate(user.createdAt) : "N/A";

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-indigo-100/50 hover:shadow-indigo-100 transition-all">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
        <div className="p-2 mr-2 rounded-lg bg-purple-100 text-purple-600">
          <FaUserCircle className="h-5 w-5" />
        </div>
        Account Info
      </h3>

      <div className="flex items-center mb-4">
        {user?.avatar ? (
          <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-indigo-100">
            <Image
              src={user.avatar}
              alt={user?.name || "User"}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-white">
            <span className="text-xl font-bold">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </span>
          </div>
        )}

        <div className="ml-4">
          <h4 className="font-semibold text-lg text-gray-900">
            {user?.name || "Anonymous User"}
          </h4>
          <p className="text-sm text-gray-600">
            {user?.email || "No email provided"}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between border-t border-gray-200 pt-2">
          <span className="text-sm text-gray-500 flex items-center">
            <FaCalendarAlt className="mr-1.5 h-3 w-3 text-indigo-400" />
            Member Since:
          </span>
          <span className="text-sm font-medium text-gray-900">{joinDate}</span>
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 pt-2">
          <span className="text-sm text-gray-500">Role:</span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
            {user?.role === "admin" ? "Admin" : "Member"}
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 pt-2">
          <span className="text-sm text-gray-500">Status:</span>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              user?.isVerified
                ? "bg-green-100 text-green-800"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            {user?.isVerified ? "Verified" : "Unverified"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AccountInfoCard;
