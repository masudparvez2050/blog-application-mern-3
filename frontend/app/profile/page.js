"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaPen,
  FaCheckCircle,
  FaCamera,
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
  const [imageFile, setImageFile] = useState(null); // Store the actual file object
  const [isSendingVerification, setIsSendingVerification] = useState(false);

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
      setImageFile(file); // Store the actual file object for later upload

      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    // Password validation
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

      // Handle image upload separately if a new image was selected
      let profilePictureUrl = profileData.profilePicture;

      if (imageFile) {
        // Create a FormData object to upload the image
        const formData = new FormData();
        formData.append("image", imageFile);

        // Upload the image to backend or a cloud service
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

        // Get the URL of the uploaded image
        const uploadResult = await uploadResponse.json();
        profilePictureUrl = uploadResult.url;
      }

      // Create data object with only the fields that should be updated
      const updateData = {
        name: profileData.name,
        bio: profileData.bio,
      };

      // Only include email if it has changed
      if (profileData.email !== user.email) {
        updateData.email = profileData.email;
      }

      // Only include profile picture if it has changed
      if (profilePictureUrl && profilePictureUrl !== user.profilePicture) {
        updateData.profilePicture = profilePictureUrl;
      }

      // Only include password fields if a new password was entered
      if (profileData.newPassword) {
        updateData.currentPassword = profileData.currentPassword;
        updateData.password = profileData.newPassword;
      }

      // Call the updateProfile function from AuthContext
      const updatedUser = await updateProfile(updateData);

      setMessage({
        text: "Profile updated successfully!",
        type: "success",
      });

      setIsEditing(false);

      // Clear password fields after successful update
      setProfileData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      }));

      // Clear the image file state
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

      // Use the requestEmailVerification function obtained from useAuth at the component level
      const result = await requestEmailVerification();

      setMessage({
        text: "Verification email sent successfully! Please check your inbox.",
        type: "success",
      });

      // Show developer info if available (in development mode)
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

  // Animation variants
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
      },
    },
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-black py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <motion.div
        className="max-w-3xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">My Profile</h1>
          <p className="mt-2 text-sm text-gray-600">
            View and manage your personal information
          </p>
        </motion.div>

        {message.text && (
          <motion.div
            variants={itemVariants}
            className={`mb-6 p-4 rounded-md ${
              message.type === "success"
                ? "bg-green-50 border-l-4 border-green-500 text-green-700"
                : "bg-red-50 border-l-4 border-red-500 text-red-700"
            }`}
          >
            <div className="flex">
              <div className="flex-shrink-0">
                {message.type === "success" ? (
                  <FaCheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <svg
                    className="h-5 w-5 text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Email Verification Banner */}
        {user && !user.isVerified && (
          <motion.div
            variants={itemVariants}
            className="mb-6 p-4 rounded-md bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium">Email verification needed</p>
                <p className="text-xs mt-1">
                  Please verify your email address to access all features of the
                  platform.
                </p>
                <div className="mt-2">
                  <button
                    onClick={handleSendVerificationEmail}
                    disabled={isSendingVerification}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-xs leading-4 font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                  >
                    {isSendingVerification ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-yellow-700"
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
                      "Resend Verification Email"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          variants={itemVariants}
          className="bg-white shadow-lg rounded-lg overflow-hidden"
        >
          {/* Profile Header */}
          <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 h-48">
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
              <div className="relative h-32 w-32 rounded-full border-4 border-white overflow-hidden bg-white">
                {profileData.profilePicture || imagePreview ? (
                  <Image
                    src={imagePreview || profileData.profilePicture}
                    alt={profileData.name}
                    style={{ objectFit: "cover" }}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={true}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gray-200">
                    <FaUser className="h-16 w-16 text-gray-400" />
                  </div>
                )}
                {isEditing && (
                  <label
                    htmlFor="profile-picture-upload"
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <FaCamera className="h-8 w-8 text-white" />
                    <input
                      id="profile-picture-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-20 px-6 pb-8">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isEditing ? (
                  <>
                    <span>Cancel</span>
                  </>
                ) : (
                  <>
                    <FaPen className="mr-2 h-4 w-4" />
                    <span>Edit Profile</span>
                  </>
                )}
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div
                  className={`grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 ${
                    isEditing ? "opacity-100" : "opacity-90"
                  }`}
                >
                  {/* Name Field */}
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Full Name
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                        <FaUser className="h-4 w-4" />
                      </span>
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={profileData.name}
                          onChange={handleChange}
                          className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      ) : (
                        <div className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 bg-gray-50 sm:text-sm">
                          {profileData.name}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email Address
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                        <FaEnvelope className="h-4 w-4" />
                      </span>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={profileData.email}
                          onChange={handleChange}
                          className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      ) : (
                        <div className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 bg-gray-50 sm:text-sm">
                          {profileData.email}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bio Field */}
                  <div className="sm:col-span-6">
                    <label
                      htmlFor="bio"
                      className="block text-sm font-medium text-gray-700"
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
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        ></textarea>
                      ) : (
                        <div className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 min-h-[100px] sm:text-sm">
                          {profileData.bio || "No bio provided."}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Password Fields (Only visible when editing) */}
                  {isEditing && (
                    <>
                      <div className="sm:col-span-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                          Change Password
                        </h3>
                      </div>

                      <div className="sm:col-span-6">
                        <label
                          htmlFor="currentPassword"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Current Password
                        </label>
                        <div className="mt-1">
                          <input
                            type="password"
                            name="currentPassword"
                            id="currentPassword"
                            value={profileData.currentPassword}
                            onChange={handleChange}
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="newPassword"
                          className="block text-sm font-medium text-gray-700"
                        >
                          New Password
                        </label>
                        <div className="mt-1">
                          <input
                            type="password"
                            name="newPassword"
                            id="newPassword"
                            value={profileData.newPassword}
                            onChange={handleChange}
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Must be at least 6 characters long
                        </p>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="confirmNewPassword"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Confirm New Password
                        </label>
                        <div className="mt-1">
                          <input
                            type="password"
                            name="confirmNewPassword"
                            id="confirmNewPassword"
                            value={profileData.confirmNewPassword}
                            onChange={handleChange}
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Submit Button (Only visible when editing) */}
                {isEditing && (
                  <div className="pt-5">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="mr-3 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </form>

            {/* Account Statistics */}
            <div className="mt-10 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Account Information
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-sm font-medium text-gray-500">
                    Member Since
                  </p>
                  <p className="mt-1 text-xl font-semibold text-gray-900">
                    {new Date(
                      user.createdAt || Date.now()
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-sm font-medium text-gray-500">Role</p>
                  <p className="mt-1 text-xl font-semibold text-gray-900 capitalize">
                    {user.role || "User"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="mt-1 text-xl font-semibold text-green-600">
                    {user.isVerified ? "Verified" : "Unverified"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
