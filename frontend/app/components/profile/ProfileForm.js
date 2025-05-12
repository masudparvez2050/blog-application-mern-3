"use client";

import {
  FaUser,
  FaEnvelope,
  FaPen,
  FaCheckCircle,
  FaTimes,
} from "react-icons/fa";
import { motion } from "framer-motion";

/**
 * Profile form component for editing user information
 */
const ProfileForm = ({
  profileData,
  handleChange,
  isSubmitting,
  isEditing,
  setIsEditing,
  handleSubmit,
}) => {
  // Animation variants
  const formItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    }),
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-indigo-100/50">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
        <div className="p-2 mr-2 rounded-lg bg-indigo-100 text-indigo-600">
          <FaPen className="h-5 w-5" />
        </div>
        {isEditing ? "Edit Profile" : "Profile Information"}
        <div className="ml-auto">
          {!isEditing ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)}
              className="text-sm flex items-center px-3 py-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg font-medium transition-colors"
            >
              <FaPen className="mr-1 h-3 w-3" />
              Edit
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(false)}
              className="text-sm flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
            >
              <FaTimes className="mr-1 h-3 w-3" />
              Cancel
            </motion.button>
          )}
        </div>
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <motion.div
            variants={formItemVariants}
            custom={0}
            initial={isEditing ? "hidden" : "visible"}
            animate="visible"
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="h-4 w-4 text-gray-400" />
              </div>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              ) : (
                <div className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700">
                  {profileData.name}
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            variants={formItemVariants}
            custom={1}
            initial={isEditing ? "hidden" : "visible"}
            animate="visible"
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-4 w-4 text-gray-400" />
              </div>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              ) : (
                <div className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700">
                  {profileData.email}
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            variants={formItemVariants}
            custom={2}
            initial={isEditing ? "hidden" : "visible"}
            animate="visible"
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                <FaPen className="h-4 w-4 text-gray-400" />
              </div>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Tell us a little about yourself..."
                />
              ) : (
                <div className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 min-h-[96px]">
                  {profileData.bio || "No bio provided"}
                </div>
              )}
            </div>
          </motion.div>

          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 flex justify-end"
            >
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <FaCheckCircle className="mr-1.5 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </button>
            </motion.div>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
