"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaPen,
  FaCheckCircle,
  FaCamera,
  FaCalendarAlt,
  FaUserTag,
  FaShieldAlt,
  FaTimes,
  FaLock,
  FaInfo,
  FaExclamationTriangle,
  FaCog,
  FaBriefcase,
  FaChartLine,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";

export default function Profile() {
  const {
    user,
    updateProfile,
    loading,
    isAuthenticated,
    requestEmailVerification,
  } = useAuth();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    bio: "",
    profilePicture: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isSendingVerification, setIsSendingVerification] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login?redirect=/profile");
    } else if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        profilePicture: user.profilePicture || "",
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    }
  }, [user, loading, isAuthenticated, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (profileData.newPassword) {
      if (profileData.newPassword.length < 6) {
        setMessage({
          text: "New password must be at least 6 characters long",
          type: "error",
        });
        return false;
      }

      if (profileData.newPassword !== profileData.confirmNewPassword) {
        setMessage({
          text: "New passwords do not match",
          type: "error",
        });
        return false;
      }

      if (!profileData.currentPassword) {
        setMessage({
          text: "Current password is required to set a new password",
          type: "error",
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      let profilePictureUrl = profileData.profilePicture;

      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const token = localStorage.getItem("token");
        const uploadResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/upload-profile-picture`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(
            errorData.message || "Failed to upload profile picture"
          );
        }

        const uploadResult = await uploadResponse.json();
        profilePictureUrl = uploadResult.url;
      }

      const updateData = {
        name: profileData.name,
        bio: profileData.bio,
      };

      if (profileData.email !== user.email) {
        updateData.email = profileData.email;
      }

      if (profilePictureUrl && profilePictureUrl !== user.profilePicture) {
        updateData.profilePicture = profilePictureUrl;
      }

      if (profileData.newPassword) {
        updateData.currentPassword = profileData.currentPassword;
        updateData.password = profileData.newPassword;
      }

      await updateProfile(updateData);

      setMessage({
        text: "Profile updated successfully!",
        type: "success",
      });

      setIsEditing(false);
      setShowPasswordSection(false);

      setProfileData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      }));

      setImageFile(null);
    } catch (error) {
      setMessage({
        text: error.message || "Failed to update profile",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendVerificationEmail = async () => {
    try {
      setIsSendingVerification(true);

      const result = await requestEmailVerification();

      setMessage({
        text: "Verification email sent successfully! Please check your inbox.",
        type: "success",
      });

      if (result?.devInfo) {
        console.log("Verification URL:", result.devInfo.verificationUrl);
      }
    } catch (error) {
      setMessage({
        text: error.message || "Failed to send verification email",
        type: "error",
      });
    } finally {
      setIsSendingVerification(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: { duration: 1.5, repeat: Infinity }
  };

  const getActivityStats = () => {
    return {
      posts: user?.posts?.length || 0,
      published: user?.posts?.filter(post => post.status === 'published')?.length || 0,
      drafts: user?.posts?.filter(post => post.status === 'draft')?.length || 0,
      comments: user?.comments?.length || 0,
    };
  };

  const stats = getActivityStats();

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-white">
        <div className="flex flex-col items-center">
          <div className="relative h-20 w-20">
            <div className="h-20 w-20 rounded-full border-t-4 border-b-4 border-indigo-600 animate-spin"></div>
            <div className="absolute top-0 left-0 h-20 w-20 rounded-full border-r-4 border-l-4 border-indigo-300 animate-pulse"></div>
          </div>
          <p className="mt-4 text-sm text-indigo-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-indigo-50 via-blue-50 to-white">
      <motion.div
        className="max-w-5xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <AnimatePresence>
          {message.text && (
            <motion.div
              key="message"
              className={`mb-8 p-4 rounded-xl shadow-lg backdrop-blur-sm border ${
                message.type === "success"
                  ? "bg-green-50/90 border-green-200 text-green-700"
                  : "bg-red-50/90 border-red-200 text-red-700"
              }`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {message.type === "success" ? (
                    <div className="p-2 bg-green-100 rounded-full">
                      <FaCheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                  ) : (
                    <div className="p-2 bg-red-100 rounded-full">
                      <FaTimes className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{message.text}</p>
                </div>
                <button 
                  className="ml-auto text-gray-400 hover:text-gray-500"
                  onClick={() => setMessage({ text: "", type: "" })}
                >
                  <FaTimes className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {user && !user.isVerified && (
          <motion.div
            variants={itemVariants}
            className="mb-8 p-4 rounded-xl backdrop-blur-md bg-amber-50/90 border border-amber-200 text-amber-700 shadow-lg"
            animate={pulseAnimation}
          >
            <div className="flex items-start md:items-center flex-col md:flex-row">
              <div className="flex-shrink-0 p-2 bg-amber-100 rounded-full">
                <FaExclamationTriangle className="h-5 w-5 text-amber-500" />
              </div>
              <div className="mt-3 md:mt-0 md:ml-3 flex-1">
                <p className="text-sm font-medium">Email verification needed</p>
                <p className="text-xs mt-1">
                  Please verify your email address to access all features of the platform.
                </p>
              </div>
              <button
                onClick={handleSendVerificationEmail}
                disabled={isSendingVerification}
                className="mt-3 md:mt-0 md:ml-6 inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-lg text-amber-700 bg-amber-100 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors shadow-sm"
              >
                {isSendingVerification ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-amber-700"
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
                    Sending...
                  </>
                ) : (
                  "Verify Email"
                )}
              </button>
            </div>
          </motion.div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          <motion.div
            variants={itemVariants}
            className="lg:w-80 space-y-6"
          >
            {/* Profile Card */}
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
                        onChange={handleImageChange}
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
                    {profileData.profilePicture || imagePreview ? (
                      <Image
                        src={imagePreview || profileData.profilePicture}
                        alt={profileData.name}
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
                    {user.name}
                  </h3>
                  <div className="flex items-center justify-center text-gray-500 text-sm mt-1">
                    <span className="capitalize">{user.role || "User"}</span>
                    {user.isVerified && (
                      <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 260, 
                          damping: 20,
                          delay: 0.3 
                        }}
                        className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700"
                      >
                        <FaCheckCircle className="mr-1 h-3 w-3" />
                        Verified
                      </motion.span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Account Info Card */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-indigo-100/50 hover:shadow-indigo-100 transition-all">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <div className="p-2 mr-2 rounded-lg bg-indigo-100 text-indigo-600">
                  <FaCog className="h-5 w-5" />
                </div>
                Account Info
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 group">
                  <div className="flex items-center text-gray-600 group-hover:text-indigo-600 transition-colors">
                    <div className="p-1.5 rounded-md bg-indigo-50 text-indigo-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors mr-2">
                      <FaCalendarAlt className="h-4 w-4" />
                    </div>
                    <span className="text-sm">Member Since</span>
                  </div>
                  <span className="text-sm font-medium text-gray-800 bg-gray-100 px-2 py-1 rounded-md">
                    {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-t border-gray-100 group">
                  <div className="flex items-center text-gray-600 group-hover:text-indigo-600 transition-colors">
                    <div className="p-1.5 rounded-md bg-indigo-50 text-indigo-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors mr-2">
                      <FaUserTag className="h-4 w-4" />
                    </div>
                    <span className="text-sm">Account Type</span>
                  </div>
                  <span className="text-sm font-medium capitalize bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md">
                    {user.role || "User"}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-t border-gray-100 group">
                  <div className="flex items-center text-gray-600 group-hover:text-indigo-600 transition-colors">
                    <div className="p-1.5 rounded-md bg-indigo-50 text-indigo-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors mr-2">
                      <FaShieldAlt className="h-4 w-4" />
                    </div>
                    <span className="text-sm">Status</span>
                  </div>
                  <span className={`text-sm font-medium px-2 py-1 rounded-md ${
                    user.isVerified 
                      ? "bg-green-100 text-green-700" 
                      : "bg-amber-100 text-amber-700"
                  }`}>
                    {user.isVerified ? "Verified" : "Unverified"}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Activity Stats Card */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-indigo-100/50 hover:shadow-indigo-100 transition-all">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <div className="p-2 mr-2 rounded-lg bg-blue-100 text-blue-600">
                  <FaChartLine className="h-5 w-5" />
                </div>
                Activity Stats
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <motion.div 
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-xl text-center shadow-sm"
                >
                  <div className="text-2xl font-bold text-indigo-600">{stats.posts}</div>
                  <div className="text-xs text-gray-600 mt-1">Total Posts</div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  className="bg-gradient-to-br from-green-50 to-emerald-100 p-4 rounded-xl text-center shadow-sm"
                >
                  <div className="text-2xl font-bold text-green-600">{stats.published}</div>
                  <div className="text-xs text-gray-600 mt-1">Published</div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl text-center shadow-sm"
                >
                  <div className="text-2xl font-bold text-amber-600">{stats.drafts}</div>
                  <div className="text-xs text-gray-600 mt-1">Drafts</div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  className="bg-gradient-to-br from-blue-50 to-cyan-100 p-4 rounded-xl text-center shadow-sm"
                >
                  <div className="text-2xl font-bold text-cyan-600">{stats.comments}</div>
                  <div className="text-xs text-gray-600 mt-1">Comments</div>
                </motion.div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            variants={itemVariants}
            className="flex-1"
          >
            <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl overflow-hidden border border-indigo-100/50 transition-all hover:shadow-indigo-100">
              <div className="flex border-b border-gray-200">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab("profile")}
                  className={`px-6 py-4 text-sm font-medium transition-colors flex items-center ${
                    activeTab === "profile"
                      ? "border-b-2 border-indigo-500 text-indigo-600 bg-indigo-50/50"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50/50"
                  }`}
                >
                  <FaUser className="mr-2" />
                  Profile Information
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab("security")}
                  className={`px-6 py-4 text-sm font-medium transition-colors flex items-center ${
                    activeTab === "security"
                      ? "border-b-2 border-indigo-500 text-indigo-600 bg-indigo-50/50"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50/50"
                  }`}
                >
                  <FaLock className="mr-2" />
                  Security
                </motion.button>
              </div>

              <div className="p-6">
                <div className="flex justify-end mb-6">
                  {!isEditing ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                    >
                      <FaPen className="mr-2 h-4 w-4" />
                      <span>Edit Profile</span>
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setIsEditing(false);
                        setShowPasswordSection(false);
                        setImageFile(null);
                        setImagePreview(null);
                        setProfileData({
                          name: user.name || "",
                          email: user.email || "",
                          bio: user.bio || "",
                          profilePicture: user.profilePicture || "",
                          currentPassword: "",
                          newPassword: "",
                          confirmNewPassword: "",
                        });
                      }}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                    >
                      <FaTimes className="mr-2 h-4 w-4" />
                      <span>Cancel Editing</span>
                    </motion.button>
                  )}
                </div>

                <AnimatePresence mode="wait">
                  {activeTab === "profile" && (
                    <motion.div
                      key="profile-tab"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                          <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 p-6 rounded-xl border border-indigo-100/30 shadow-sm">
                            <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                              <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600 mr-2">
                                <FaInfo className="h-4 w-4" />
                              </div>
                              Basic Information
                            </h3>
                            
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                              <div>
                                <label
                                  htmlFor="name"
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  Full Name
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaUser className="h-4 w-4 text-gray-400" />
                                  </div>
                                  {isEditing ? (
                                    <input
                                      type="text"
                                      name="name"
                                      id="name"
                                      value={profileData.name}
                                      onChange={handleChange}
                                      className="block w-full pl-10 pr-3 py-2.5 sm:text-sm border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                                      placeholder="Your full name"
                                    />
                                  ) : (
                                    <div className="block w-full pl-10 pr-3 py-2.5 sm:text-sm bg-white border border-gray-300 rounded-lg text-gray-900">
                                      {profileData.name}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div>
                                <label
                                  htmlFor="email"
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  Email Address
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaEnvelope className="h-4 w-4 text-gray-400" />
                                  </div>
                                  {isEditing ? (
                                    <input
                                      type="email"
                                      name="email"
                                      id="email"
                                      value={profileData.email}
                                      onChange={handleChange}
                                      className="block w-full pl-10 pr-3 py-2.5 sm:text-sm border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                                      placeholder="your.email@example.com"
                                    />
                                  ) : (
                                    <div className="block w-full pl-10 pr-3 py-2.5 sm:text-sm bg-white border border-gray-300 rounded-lg text-gray-900">
                                      {profileData.email}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="sm:col-span-2">
                                <label
                                  htmlFor="bio"
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  Bio
                                </label>
                                <div className="mt-1">
                                  {isEditing ? (
                                    <textarea
                                      id="bio"
                                      name="bio"
                                      rows="4"
                                      value={profileData.bio}
                                      onChange={handleChange}
                                      placeholder="Tell us about yourself..."
                                      className="block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    ></textarea>
                                  ) : (
                                    <div className="block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 bg-white min-h-[100px] sm:text-sm text-gray-900">
                                      {profileData.bio || "No bio provided."}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {isEditing && (
                            <motion.div 
                              className="flex justify-end"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.2 }}
                            >
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex justify-center py-2.5 px-6 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                              >
                                {isSubmitting ? (
                                  <span className="flex items-center">
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
                                  </span>
                                ) : (
                                  "Save Changes"
                                )}
                              </motion.button>
                            </motion.div>
                          )}
                        </div>
                      </form>
                    </motion.div>
                  )}

                  {activeTab === "security" && (
                    <motion.div
                      key="security-tab"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <form onSubmit={handleSubmit}>
                        <div className="space-y-8">
                          <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 p-6 rounded-xl border border-indigo-100/30 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600 mr-2">
                                  <FaLock className="h-4 w-4" />
                                </div>
                                Password
                              </h3>

                              {!isEditing ? (
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  type="button"
                                  onClick={() => {
                                    setIsEditing(true);
                                    setShowPasswordSection(true);
                                  }}
                                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                                >
                                  <FaPen className="mr-2 h-3.5 w-3.5" />
                                  <span>Change</span>
                                </motion.button>
                              ) : null}
                            </div>

                            <AnimatePresence>
                              {isEditing && showPasswordSection ? (
                                <motion.div 
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="grid grid-cols-1 gap-6 sm:grid-cols-2"
                                >
                                  <div className="sm:col-span-2">
                                    <label
                                      htmlFor="currentPassword"
                                      className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                      Current Password
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaLock className="h-4 w-4 text-gray-400" />
                                      </div>
                                      <input
                                        type={showCurrentPassword ? "text" : "password"}
                                        name="currentPassword"
                                        id="currentPassword"
                                        value={profileData.currentPassword}
                                        onChange={handleChange}
                                        className="block w-full pl-10 pr-10 py-2.5 sm:text-sm border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Enter your current password"
                                      />
                                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <button
                                          type="button"
                                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                          className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                        >
                                          {showCurrentPassword ? (
                                            <FaEyeSlash className="h-4 w-4" />
                                          ) : (
                                            <FaEye className="h-4 w-4" />
                                          )}
                                        </button>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <label
                                      htmlFor="newPassword"
                                      className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                      New Password
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaLock className="h-4 w-4 text-gray-400" />
                                      </div>
                                      <input
                                        type={showNewPassword ? "text" : "password"}
                                        name="newPassword"
                                        id="newPassword"
                                        value={profileData.newPassword}
                                        onChange={handleChange}
                                        className="block w-full pl-10 pr-10 py-2.5 sm:text-sm border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="New password (min. 6 characters)"
                                      />
                                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <button
                                          type="button"
                                          onClick={() => setShowNewPassword(!showNewPassword)}
                                          className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                        >
                                          {showNewPassword ? (
                                            <FaEyeSlash className="h-4 w-4" />
                                          ) : (
                                            <FaEye className="h-4 w-4" />
                                          )}
                                        </button>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <label
                                      htmlFor="confirmNewPassword"
                                      className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                      Confirm New Password
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaLock className="h-4 w-4 text-gray-400" />
                                      </div>
                                      <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmNewPassword"
                                        id="confirmNewPassword"
                                        value={profileData.confirmNewPassword}
                                        onChange={handleChange}
                                        className="block w-full pl-10 pr-10 py-2.5 sm:text-sm border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Confirm your new password"
                                      />
                                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <button
                                          type="button"
                                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                          className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                        >
                                          {showConfirmPassword ? (
                                            <FaEyeSlash className="h-4 w-4" />
                                          ) : (
                                            <FaEye className="h-4 w-4" />
                                          )}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              ) : (
                                <motion.div 
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200"
                                >
                                  <div className="flex items-center">
                                    <div className="h-10 w-10 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-full">
                                      <FaLock className="h-5 w-5" />
                                    </div>
                                    <span className="ml-3 text-gray-700">
                                      Password is set
                                    </span>
                                  </div>
                                  <div className="text-xs text-gray-500">Last changed: {new Date(user.updatedAt || user.createdAt).toLocaleDateString()}</div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 p-6 rounded-xl border border-indigo-100/30 shadow-sm">
                            <h3 className="text-lg font-medium text-gray-900 flex items-center mb-6">
                              <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600 mr-2">
                                <FaShieldAlt className="h-4 w-4" />
                              </div>
                              Account Verification
                            </h3>

                            <motion.div 
                              whileHover={{ boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                              className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200 transition-shadow"
                            >
                              <div className="flex items-center">
                                <div className={`h-12 w-12 flex items-center justify-center ${
                                  user.isVerified ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"
                                } rounded-full`}>
                                  {user.isVerified ? (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{
                                        type: "spring",
                                        stiffness: 260,
                                        damping: 20,
                                      }}
                                    >
                                      <FaCheckCircle className="h-6 w-6" />
                                    </motion.div>
                                  ) : (
                                    <motion.div
                                      animate={{ 
                                        rotate: [0, 10, -10, 10, 0],
                                      }}
                                      transition={{ 
                                        duration: 2,
                                        repeat: Infinity,
                                        repeatDelay: 3
                                      }}
                                    >
                                      <FaExclamationTriangle className="h-6 w-6" />
                                    </motion.div>
                                  )}
                                </div>
                                <div className="ml-4">
                                  <span className="text-gray-900 font-medium">
                                    {user.isVerified ? "Email Verified" : "Email Not Verified"}
                                  </span>
                                  <p className="text-xs text-gray-500 mt-0.5">
                                    {user.isVerified 
                                      ? "Your email has been successfully verified."
                                      : "Please verify your email address to access all features."
                                    }
                                  </p>
                                </div>
                              </div>
                              {!user.isVerified && (
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  type="button"
                                  onClick={handleSendVerificationEmail}
                                  disabled={isSendingVerification}
                                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                                >
                                  {isSendingVerification ? (
                                    <span className="flex items-center">
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
                                      Sending...
                                    </span>
                                  ) : (
                                    "Verify Now"
                                  )}
                                </motion.button>
                              )}
                            </motion.div>
                          </div>

                          {isEditing && showPasswordSection && (
                            <motion.div 
                              className="flex justify-end"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.2 }}
                            >
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                onClick={() => {
                                  setShowPasswordSection(false);
                                  setProfileData(prev => ({
                                    ...prev,
                                    currentPassword: "",
                                    newPassword: "",
                                    confirmNewPassword: "",
                                  }));
                                }}
                                className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                Cancel
                              </motion.button>
                              
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex justify-center py-2.5 px-6 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                              >
                                {isSubmitting ? (
                                  <span className="flex items-center">
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
                                    Updating...
                                  </span>
                                ) : (
                                  "Update Password"
                                )}
                              </motion.button>
                            </motion.div>
                          )}
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
