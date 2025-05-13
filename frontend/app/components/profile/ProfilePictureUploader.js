"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FaCamera, FaTimes, FaSpinner } from "react-icons/fa";

/**
 * Component for uploading and previewing profile pictures
 */
const ProfilePictureUploader = ({
  profileData,
  imagePreview,
  handleImageChange,
  setImagePreview,
  isUploading,
  uploadError
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);

  // Update image source when profile data or preview changes
  useEffect(() => {
    if (imagePreview) {
      setImageSrc(imagePreview);
    } else if (profileData?.profilePicture) {
      setImageSrc(profileData.profilePicture);
    } else {
      setImageSrc(null);
    }
  }, [imagePreview, profileData?.profilePicture]);

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
      const file = e.dataTransfer.files[0];
      validateAndHandleImage(file);
    }
  };

  const validateAndHandleImage = (file) => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Check file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size should be less than 2MB');
      return;
    }

    handleImageChange({ target: { files: [file] } });
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndHandleImage(e.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageSrc(profileData?.profilePicture || null);
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
        <AnimatePresence mode="wait">
          {isUploading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/50"
            >
              <FaSpinner className="h-8 w-8 text-white animate-spin" />
            </motion.div>
          ) : null}

          {imageSrc ? (
            <motion.div
              key="image"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full w-full relative"
            >
              <Image
                src={imageSrc}
                alt="Profile Picture"
                fill
                sizes="160px"
                className="object-cover"
                priority
              />
              {imagePreview && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition-colors"
                >
                  <FaTimes className="h-3.5 w-3.5" />
                </motion.button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full w-full flex flex-col items-center justify-center text-gray-400"
            >
              <FaCamera className="h-10 w-10 mb-2" />
              <p className="text-xs text-center px-2">Drag or click to upload</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {uploadError && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-500 text-center mt-2"
        >
          {uploadError}
        </motion.p>
      )}

      <div className="mt-3 flex justify-center">
        <label
          htmlFor="profilePicture"
          className={`cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
            isUploading
              ? "bg-indigo-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors`}
        >
          <FaCamera className="mr-2 h-4 w-4" />
          {imageSrc ? "Change Photo" : "Upload Photo"}
          <input
            id="profilePicture"
            type="file"
            name="profilePicture"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={isUploading}
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
