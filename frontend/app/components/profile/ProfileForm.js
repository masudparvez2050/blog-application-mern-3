"use client";

import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaPen } from "react-icons/fa";
import { validateProfileData, getBioCharacterCount } from "../../utils/validations/profileValidation";
import FormStatusIndicator from "../shared/FormStatusIndicator";
import { useProfileForm } from "../../hooks/useProfileForm";
import { useAutosave } from "../../hooks/useAutosave";
import { useState, useEffect } from "react";

const ProfileForm = ({ initialData, onSubmit }) => {
  const {
    profileData,
    handleChange,
    isSubmitting,
    isEditing,
    errors,
    hasUnsavedChanges,
    handleEdit,
    handleCancel,
    handleSubmit
  } = useProfileForm(initialData, onSubmit);

  const {
    queueAutosave,
    isSaving,
    lastSaved,
    error: autosaveError,
    clearError
  } = useAutosave(() => onSubmit(profileData));

  const [bioCount, setBioCount] = useState({ current: 0, remaining: 500, maxLength: 500 });

  // Update bio character count
  useEffect(() => {
    setBioCount(getBioCharacterCount(profileData.bio));
  }, [profileData.bio]);

  // Queue autosave when form changes
  useEffect(() => {
    if (hasUnsavedChanges && isEditing) {
      const { isValid } = validateProfileData(profileData);
      if (isValid) {
        queueAutosave();
      }
    }
  }, [profileData, hasUnsavedChanges, isEditing, queueAutosave]);

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
    <div className="relative bg-white/80 backdrop-blur-md rounded-lg p-6">
      <FormStatusIndicator
        isSaving={isSaving}
        lastSaved={lastSaved}
        error={autosaveError}
        hasUnsavedChanges={hasUnsavedChanges}
        onDismissError={clearError}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div
          variants={formItemVariants}
          custom={0}
          initial="hidden"
          animate="visible"
          className="relative"
        >
          <label 
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Full Name
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              id="name"
              name="name"
              value={profileData.name}
              onChange={handleChange}
              disabled={!isEditing}
              className={`block w-full pl-10 pr-3 py-2 border ${
                errors.name ? "border-red-500" : isEditing ? "border-gray-300" : "border-gray-200 bg-gray-50"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>
        </motion.div>

        <motion.div
          variants={formItemVariants}
          custom={1}
          initial="hidden"
          animate="visible"
          className="relative"
        >
          <label 
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email Address
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEnvelope className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={profileData.email}
              onChange={handleChange}
              disabled={!isEditing}
              className={`block w-full pl-10 pr-3 py-2 border ${
                errors.email ? "border-red-500" : isEditing ? "border-gray-300" : "border-gray-200 bg-gray-50"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>
        </motion.div>

        <motion.div
          variants={formItemVariants}
          custom={2}
          initial="hidden"
          animate="visible"
          className="relative"
        >
          <div className="flex justify-between items-center mb-1">
            <label 
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700"
            >
              Bio
            </label>
            <span className={`text-xs ${bioCount.remaining < 50 ? "text-red-500" : "text-gray-500"}`}>
              {bioCount.remaining} characters remaining
            </span>
          </div>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute top-3 left-3 flex items-start pointer-events-none">
              <FaPen className="h-4 w-4 text-gray-400" />
            </div>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              value={profileData.bio}
              onChange={handleChange}
              disabled={!isEditing}
              maxLength={bioCount.maxLength}
              className={`block w-full pl-10 pr-3 py-2 border ${
                errors.bio ? "border-red-500" : isEditing ? "border-gray-300" : "border-gray-200 bg-gray-50"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
              placeholder="Tell us a little about yourself..."
            />
            {errors.bio && (
              <p className="mt-1 text-sm text-red-500">{errors.bio}</p>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Brief description for your profile. URLs are hyperlinked.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-end gap-3"
        >
          {!isEditing ? (
            <button
              type="button"
              onClick={handleEdit}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <FaPen className="mr-2 h-4 w-4" />
              Edit Profile
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || Object.keys(errors).length > 0}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                  "Save Changes"
                )}
              </button>
            </>
          )}
        </motion.div>
      </form>
    </div>
  );
};

export default ProfileForm;
