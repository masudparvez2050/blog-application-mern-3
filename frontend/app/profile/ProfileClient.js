"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaTimes } from "react-icons/fa";

// Import profile components
import ProfilePictureUploader from "../components/profile/ProfilePictureUploader";
import ProfileForm from "../components/profile/ProfileForm";
import SecuritySection from "../components/profile/SecuritySection";
import AccountInfoCard from "../components/profile/AccountInfoCard";
import ActivityStatsCard from "../components/profile/ActivityStatsCard";
import EmailVerificationSection from "../components/profile/EmailVerificationSection";

export default function ProfileClient() {
  const {
    user,
    updateProfile,
    loading: authLoading,
    isAuthenticated,
    requestEmailVerification,
  } = useAuth();
  
  const router = useRouter();
  const [message, setMessage] = useState({ text: "", type: "" });
  const [activeTab, setActiveTab] = useState("profile");
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isSendingVerification, setIsSendingVerification] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login?redirect=/profile");
    }
  }, [authLoading, isAuthenticated, router]);

  const handleUpdateProfile = async (data) => {
    try {
      let profilePictureUrl = data.profilePicture;

      // Handle image upload if there's a new image
      if (imageFile) {
        try {
          setIsUploading(true);
          const formData = new FormData();
          formData.append("image", imageFile);

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/users/upload-profile-picture`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: formData,
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to upload profile picture");
          }

          const result = await response.json();
          profilePictureUrl = result.url;
        } catch (error) {
          setUploadError(error.message);
          throw error;
        } finally {
          setIsUploading(false);
        }
      }

      // Update profile
      await updateProfile({
        ...data,
        profilePicture: profilePictureUrl,
      });

      setMessage({
        text: "Profile updated successfully!",
        type: "success",
      });

      // Reset image states
      setImageFile(null);
      setImagePreview(null);
      setUploadError(null);

      return true;
    } catch (error) {
      setMessage({
        text: error.message || "Failed to update profile",
        type: "error",
      });
      return false;
    }
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
  // Loading state
  if (authLoading || !user) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
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
    <div className="py-8 px-4 sm:px-6 lg:px-8">      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-5xl mx-auto"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
            Your Profile
          </span>
          <span className="ml-3 text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {user?.role === 'admin' ? 'Administrator' : 'User'}
          </span>
        </h1>
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

        <div className="flex flex-col lg:flex-row gap-6 pb-8">
          <motion.div
            variants={{
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
            }}
            initial="hidden"
            animate="visible" 
            className="lg:w-80 space-y-5 flex-shrink-0"
          >
            <ProfilePictureUploader
              profileData={user}
              imagePreview={imagePreview}
              handleImageChange={handleImageChange}
              setImagePreview={setImagePreview}
              isUploading={isUploading}
              uploadError={uploadError}
            />

            <AccountInfoCard user={user} />
{/* 
            <ActivityStatsCard stats={{
              posts: user?.posts?.length || 0,
              published: user?.posts?.filter((post) => post.status === "published")?.length || 0,
              drafts: user?.posts?.filter((post) => post.status === "draft")?.length || 0,
              comments: user?.comments?.length || 0,
            }} /> */}
          </motion.div>

          <motion.div
            variants={{
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
            }}
            initial="hidden"
            animate="visible"
            className="flex-1"
          >            <div className="bg-white/90 backdrop-blur-md shadow-lg rounded-2xl overflow-hidden border border-indigo-100/50 transition-all hover:shadow-xl">
              <div className="flex border-b border-gray-200">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab("profile")}
                  className={`px-6 py-4 text-sm font-medium transition-colors flex items-center ${
                    activeTab === "profile"
                      ? "border-b-2 border-indigo-500 text-indigo-600 bg-indigo-50/70"
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

              <AnimatePresence mode="wait">
                {activeTab === "profile" ? (
                  <motion.div
                    key="profile-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProfileForm
                      initialData={{
                        name: user.name,
                        email: user.email,
                        bio: user.bio,
                        profilePicture: user.profilePicture
                      }}
                      onSubmit={handleUpdateProfile}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="security-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SecuritySection
                      user={user}
                      showPasswordSection={showPasswordSection}
                      setShowPasswordSection={setShowPasswordSection}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
