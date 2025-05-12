"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaCamera, FaTimes } from "react-icons/fa";

/**
 * Component for uploading and previewing profile pictures
 */
const ProfilePictureUploader = ({
  profileData,
  imagePreview,
  handleImageChange,
  setImagePreview,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageChange({ target: { files: [e.dataTransfer.files[0]] } });
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
  };

  return (
    <div className="relative mb-6">
      <div
        className={`relative h-40 w-40 mx-auto rounded-full overflow-hidden border-4 ${
          isDragging
            ? "border-indigo-500 bg-indigo-50"
            : "border-white bg-gray-100"
        } transition-all duration-200 shadow-lg`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {imagePreview || profileData.profilePicture ? (
          <>
            <Image
              src={imagePreview || profileData.profilePicture}
              alt="Profile Picture"
              fill
              sizes="160px"
              className="object-cover"
            />
            {imagePreview && (
              <motion.button
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
              >
                <FaTimes className="h-3 w-3" />
              </motion.button>
            )}
          </>
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center text-gray-400">
            <FaCamera className="h-10 w-10 mb-2" />
            <p className="text-xs text-center px-2">Drag or click to upload</p>
          </div>
        )}
      </div>

      <div className="mt-3 flex justify-center">
        <label
          htmlFor="profilePicture"
          className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <FaCamera className="mr-2 h-4 w-4" />
          {imagePreview ? "Change Photo" : "Upload Photo"}
          <input
            id="profilePicture"
            type="file"
            name="profilePicture"
            accept="image/*"
            onChange={handleImageChange}
            className="sr-only"
          />
        </label>
      </div>

      <p className="mt-2 text-xs text-gray-500 text-center">
        Upload a square image for best results. Max size: 2MB.
      </p>
    </div>
  );
};

export default ProfilePictureUploader;
