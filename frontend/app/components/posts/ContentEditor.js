"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaLayerGroup, FaEye } from "react-icons/fa";
import dynamic from "next/dynamic";
import { formAnimationVariants, quillModules } from "@/app/utils/postFormUtils";

// Import ReactQuill dynamically to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

/**
 * Content Editor component with edit and preview modes
 */
const ContentEditor = ({ content, onChange }) => {
  const [activeTab, setActiveTab] = useState("edit"); // 'edit' or 'preview'

  return (
    <motion.div
      variants={formAnimationVariants.containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white shadow rounded-lg overflow-hidden"
    >
      {/* Editor Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            type="button"
            onClick={() => setActiveTab("edit")}
            className={`py-3 px-6 inline-flex items-center ${
              activeTab === "edit"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <FaLayerGroup
              className={`mr-2 h-4 w-4 ${
                activeTab === "edit" ? "text-blue-600" : "text-gray-500"
              }`}
            />
            Edit
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`py-3 px-6 inline-flex items-center ${
              activeTab === "preview"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <FaEye
              className={`mr-2 h-4 w-4 ${
                activeTab === "preview" ? "text-blue-600" : "text-gray-500"
              }`}
            />
            Preview
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="p-4">
        {activeTab === "edit" ? (
          <motion.div variants={formAnimationVariants.itemVariants}>
            <div className="min-h-[400px]">
              {typeof window !== "undefined" && (
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={onChange}
                  modules={quillModules}
                  className="h-[350px]"
                  placeholder="Write your post content here..."
                />
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            variants={formAnimationVariants.itemVariants}
            className="min-h-[400px] prose max-w-none p-4 border rounded-md"
          >
            {content ? (
              <div dangerouslySetInnerHTML={{ __html: content }} />
            ) : (
              <div className="text-gray-400 italic">
                Your preview will appear here once you start writing...
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ContentEditor;
