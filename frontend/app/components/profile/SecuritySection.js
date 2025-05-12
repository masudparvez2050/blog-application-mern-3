"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { FaLock, FaChevronDown, FaChevronUp } from "react-icons/fa";

const SecuritySection = ({
  user,
  profileData,
  handleChange,
  isSubmitting,
  handleSubmit,
  showPasswordSection,
  setShowPasswordSection,
  formErrors,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-indigo-100/50"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-full">
            <FaLock className="text-indigo-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Security Settings</h3>
        </div>
        <button
          type="button"
          onClick={() => setShowPasswordSection(!showPasswordSection)}
          className="text-indigo-600 hover:text-indigo-800 flex items-center gap-2"
        >
          {showPasswordSection ? (
            <>
              <span>Hide</span>
              <FaChevronUp />
            </>
          ) : (
            <>
              <span>Change Password</span>
              <FaChevronDown />
            </>
          )}
        </button>
      </div>

      {showPasswordSection && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Current Password
              </label>
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={profileData.currentPassword}
                onChange={handleChange}
                className={`w-full p-2 border ${
                  formErrors?.currentPassword
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                placeholder="Enter current password"
              />
              {formErrors?.currentPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {formErrors.currentPassword}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                New Password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                value={profileData.newPassword}
                onChange={handleChange}
                className={`w-full p-2 border ${
                  formErrors?.newPassword ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                placeholder="Enter new password"
              />
              {formErrors?.newPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {formErrors.newPassword}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmNewPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm New Password
              </label>
              <input
                id="confirmNewPassword"
                name="confirmNewPassword"
                type="password"
                value={profileData.confirmNewPassword}
                onChange={handleChange}
                className={`w-full p-2 border ${
                  formErrors?.confirmNewPassword
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                placeholder="Confirm new password"
              />
              {formErrors?.confirmNewPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {formErrors.confirmNewPassword}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <p>
          Password must be at least 6 characters long and contain a mix of
          letters, numbers, and special characters for better security.
        </p>
        <p className="mt-2">
          <strong>Last password change:</strong>{" "}
          {user?.passwordChangedAt
            ? new Date(user.passwordChangedAt).toLocaleDateString()
            : "Never"}
        </p>
      </div>
    </motion.div>
  );
};

export default SecuritySection;
