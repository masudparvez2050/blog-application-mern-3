"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaImage, FaTimes } from "react-icons/fa";
import { formAnimationVariants } from "@/app/utils/postFormUtils";

/**
 * Cover Image Uploader component
 * Handles image uploading, preview and removal
 */
const CoverImageUploader = ({ imagePreview, onImageChange, onImageRemove }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleImageFile(file);
    }
  };

  const handleImageFile = (file) => {
    if (file && file.type.match(/image.*/)) {
      onImageChange(file);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleImageFile(e.target.files[0]);
    }
  };

  return (
    <motion.div
      variants={formAnimationVariants.containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white shadow rounded-lg overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <label className="block text-lg font-medium text-gray-700">
            <FaImage className="inline mr-2 text-blue-600" /> Cover Image
          </label>
        </div>

        <motion.div
          variants={formAnimationVariants.itemVariants}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative mt-1 border-2 ${
            dragActive
              ? "border-blue-500 bg-blue-50"
              : "border-dashed border-gray-300"
          } rounded-lg transition-colors duration-200 ease-in-out`}
        >
          {imagePreview ? (
            <div className="relative">
              <div className="relative w-full h-64 mx-auto rounded-md overflow-hidden">
                <Image
                  src={imagePreview}
                  alt="Cover image preview"
                  fill
                  unoptimized={true}
                  style={{ objectFit: "cover" }}
                  className="transition-transform duration-300 hover:scale-105"
                />
              </div>
              <button
                type="button"
                onClick={onImageRemove}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 focus:outline-none shadow-lg"
                title="Remove image"
              >
                <FaTimes className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="px-6 pt-5 pb-6 flex items-center justify-center">
              <div className="space-y-1 text-center">
                <div className="flex flex-col items-center">
                  <FaImage className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-1 text-sm text-gray-600">
                    Drag and drop an image, or
                    <label
                      htmlFor="cover-image-upload"
                      className="relative cursor-pointer ml-1 text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>browse</span>
                      <input
                        id="cover-image-upload"
                        name="cover-image-upload"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleImageChange}
                      />
                    </label>
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CoverImageUploader;
