"use client";

import { motion } from "framer-motion";
import {
  FaCalendar,
  FaClock,
  FaEnvelope,
  FaUser,
  FaCheckCircle,
  FaIdBadge,
  FaCircle,
} from "react-icons/fa";
import Image from "next/image";

const AccountInfoCard = ({ user }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 backdrop-blur-md rounded-lg shadow border border-indigo-100/50 p-3 aspect-square flex flex-col transition-all hover:shadow-md"
    >
      {/* Header with verification badge */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-900">Account Info</h3>
        {user.isVerified && (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <FaCheckCircle className="mr-1 h-2.5 w-2.5" />
            Verified
          </span>
        )}
      </div>

      {/* Main info section */}
      <div className="grid grid-cols-1 gap-2 text-sm flex-grow">
        <div className="flex items-center">
          <div className="bg-indigo-100 p-1.5 rounded-md">
            <FaUser className="h-3.5 w-3.5 text-indigo-600" />
          </div>
          <div className="ml-2 overflow-hidden">
            <p className="text-xs text-gray-500 leading-tight">Username</p>
            <p className="font-medium text-gray-900 text-xs truncate">
              {user.username || "Not set"}
            </p>
          </div>
        </div>

        <div className="flex items-center">
          <div className="bg-indigo-100 p-1.5 rounded-md">
            <FaEnvelope className="h-3.5 w-3.5 text-indigo-600" />
          </div>
          <div className="ml-2 overflow-hidden">
            <p className="text-xs text-gray-500 leading-tight">Email</p>
            <p className="font-medium text-gray-900 text-xs truncate">
              {user.email}
            </p>
          </div>
        </div>

        <div className="flex items-center">
          <div className="bg-indigo-100 p-1.5 rounded-md">
            <FaCalendar className="h-3.5 w-3.5 text-indigo-600" />
          </div>
          <div className="ml-2 overflow-hidden">
            <p className="text-xs text-gray-500 leading-tight">Member Since</p>
            <p className="font-medium text-gray-900 text-xs truncate">
              {formatDate(user.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center">
          <div className="bg-indigo-100 p-1.5 rounded-md">
            <FaClock className="h-3.5 w-3.5 text-indigo-600" />
          </div>
          <div className="ml-2 overflow-hidden">
            <p className="text-xs text-gray-500 leading-tight">Last Updated</p>
            <p className="font-medium text-gray-900 text-xs truncate">
              {user.updatedAt ? formatDate(user.updatedAt) : "Never"}
            </p>
          </div>
        </div>
      </div>

      {/* Role and Status */}
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        <div className="flex items-center bg-indigo-50 rounded p-1.5">
          <div className="bg-indigo-100 p-1 rounded-md">
            <FaIdBadge className="h-3 w-3 text-indigo-600" />
          </div>
          <div className="ml-1.5 overflow-hidden">
            <p className="text-xs text-gray-500 leading-tight">Role</p>
            <p className="font-semibold text-indigo-600 text-xs capitalize truncate">
              {user.role || "User"}
            </p>
          </div>
        </div>

        <div className="flex items-center bg-indigo-50 rounded p-1.5">
          <div className="bg-indigo-100 p-1 rounded-md">
            <FaCircle className="h-3 w-3 text-indigo-600" />
          </div>
          <div className="ml-1.5 overflow-hidden">
            <p className="text-xs text-gray-500 leading-tight">Status</p>
            <p className="font-semibold text-indigo-600 text-xs capitalize truncate">
              {user.status || "Active"}
            </p>
          </div>
        </div>
      </div>

      {/* Bio section - only if available */}
      {user.bio && (
        <div className="mt-2 bg-gray-50 rounded p-1.5">
          <p className="text-xs text-gray-500 mb-0.5">Bio</p>
          <p className="text-xs text-gray-700 line-clamp-2">{user.bio}</p>
        </div>
      )}
    </motion.div>
  );
};

export default AccountInfoCard;
