"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaPen, FaCheckCircle, FaTimes } from "react-icons/fa";

// Import profile components
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileForm from "../components/profile/ProfileForm";
import SecuritySection from "../components/profile/SecuritySection";
import AccountInfoCard from "../components/profile/AccountInfoCard";
import ActivityStatsCard from "../components/profile/ActivityStatsCard";
import EmailVerificationSection from "../components/profile/EmailVerificationSection";

export default function ProfileClient() {
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
  const [formErrors, setFormErrors] = useState({});

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
    const errors = {};

    if (profileData.newPassword) {
      if (profileData.newPassword.length < 6) {
        errors.newPassword = "New password must be at least 6 characters long";
      }

      if (profileData.newPassword !== profileData.confirmNewPassword) {
        errors.confirmNewPassword = "New passwords do not match";
      }

      if (!profileData.currentPassword) {
        errors.currentPassword =
          "Current password is required to set a new password";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
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
      setFormErrors({});
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

  const getActivityStats = () => {
    return {
      posts: user?.posts?.length || 0,
      published:
        user?.posts?.filter((post) => post.status === "published")?.length || 0,
      drafts:
        user?.posts?.filter((post) => post.status === "draft")?.length || 0,
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
          <p className="mt-4 text-sm text-indigo-600 font-medium">
            Loading your profile...
          </p>
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
          <EmailVerificationSection
            user={user}
            isSendingVerification={isSendingVerification}
            handleSendVerificationEmail={handleSendVerificationEmail}
          />
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          <motion.div variants={itemVariants} className="lg:w-80 space-y-6">
            {/* Profile Header */}
            <ProfileHeader
              user={user}
              profileData={profileData}
              imagePreview={imagePreview}
              isEditing={isEditing}
              handleImageChange={handleImageChange}
            />

            {/* Account Info Card */}
            <AccountInfoCard user={user} />

            {/* Activity Stats Card */}
            <ActivityStatsCard stats={stats} />
          </motion.div>

          <motion.div variants={itemVariants} className="flex-1">
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
                  <span className="mr-2">👤</span>
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
                  <span className="mr-2">🔒</span>
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
                        setFormErrors({});
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
                          <ProfileForm
                            profileData={profileData}
                            handleChange={handleChange}
                            isSubmitting={isSubmitting}
                            isEditing={isEditing}
                            setIsEditing={setIsEditing}
                            handleSubmit={handleSubmit}
                          />

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
                      <SecuritySection
                        user={user}
                        profileData={profileData}
                        handleChange={handleChange}
                        isSubmitting={isSubmitting}
                        handleSubmit={handleSubmit}
                        showPasswordSection={showPasswordSection}
                        setShowPasswordSection={setShowPasswordSection}
                        formErrors={formErrors}
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
                      />
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
