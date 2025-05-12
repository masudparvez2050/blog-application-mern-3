"use client";

import Image from "next/image";
import { FaUser, FaCamera } from "react-icons/fa";
import { motion } from "framer-motion";

/**
 * Profile header component that displays user profile picture and name
 */
const ProfileHeader = ({
  name,
  profilePicture,
  role,
  isVerified,
  isEditing,
  onImageChange,
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-indigo-100/50 transition-all hover:shadow-indigo-100">
      <div className="relative h-36 bg-gradient-to-r from-indigo-600 to-blue-500 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzUgMTBsNSA1TDUgNTBsLTUtNXoiLz48cGF0aCBkPSJNNTAgMzVsNSA1TDIwIDc1bC01LTV6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        {isEditing && (
          <div className="absolute top-3 right-3">
            <label
              htmlFor="profile-picture-upload"
              className="p-2 rounded-full bg-white bg-opacity-20 text-white hover:bg-opacity-30 cursor-pointer transition-all hover:scale-105"
              title="Change profile picture"
            >
              <FaCamera className="h-5 w-5" />
              <input
                id="profile-picture-upload"
                type="file"
                accept="image/*"
                onChange={onImageChange}
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>

      <div className="relative px-6 pb-6">
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
            className="relative h-32 w-32 rounded-full border-4 border-white overflow-hidden bg-white shadow-xl"
          >
            {profilePicture ? (
              <Image
                src={profilePicture}
                alt={name}
                style={{ objectFit: "cover" }}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={true}
                className="hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gradient-to-r from-blue-100 to-indigo-100">
                <FaUser className="h-16 w-16 text-indigo-300" />
              </div>
            )}
          </motion.div>
        </div>

        <div className="pt-20 text-center">
          <h3 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-indigo-600 to-blue-600 text-transparent bg-clip-text">
            {name}
          </h3>
          <div className="flex items-center justify-center text-gray-500 text-sm mt-1">
            <span className="capitalize">{role || "User"}</span>
            {isVerified && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.3,
                }}
                className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700"
              >
                <svg
                  className="mr-1 h-3 w-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                Verified
              </motion.span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
