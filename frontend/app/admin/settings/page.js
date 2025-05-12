"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaCog,
  FaGlobe,
  FaEnvelope,
  FaBell,
  FaLock,
  FaCloudUploadAlt,
  FaSave,
  FaExclamationTriangle,
} from "react-icons/fa";

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // General settings
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "Blog Application",
    siteDescription: "A modern blog platform for readers and writers",
    siteKeywords: "blog, articles, writing, content",
    defaultPostsPerPage: 10,
    allowComments: true,
    requireApprovalForComments: true,
    allowUserRegistration: true,
  });

  // Email settings
  const [emailSettings, setEmailSettings] = useState({
    smtpServer: "",
    smtpPort: "",
    smtpUsername: "",
    smtpPassword: "",
    fromEmail: "",
    emailTemplate: "default",
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    newUserNotification: true,
    newCommentNotification: true,
    newPostNotification: false,
    emailAdmin: true,
    weeklyDigest: true,
  });

  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    enableTwoFactor: false,
    loginAttempts: 5,
    lockoutTime: 30,
    passwordExpiry: 90,
    requireStrongPasswords: true,
  });

  const handleSubmit = async (e, settingType) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const token = localStorage.getItem("token");
      let settingsData;

      switch (settingType) {
        case "general":
          settingsData = generalSettings;
          break;
        case "email":
          settingsData = emailSettings;
          break;
        case "notifications":
          settingsData = notificationSettings;
          break;
        case "security":
          settingsData = securitySettings;
          break;
        default:
          throw new Error("Invalid settings type");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/settings/${settingType}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(settingsData),
        }
      );

      if (response.ok) {
        setSuccessMessage(
          `${
            settingType.charAt(0).toUpperCase() + settingType.slice(1)
          } settings updated successfully!`
        );

        // Auto-hide success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } else {
        const data = await response.json();
        throw new Error(data.message || "Failed to update settings");
      }
    } catch (error) {
      console.error(`Error updating ${settingType} settings:`, error);
      setErrorMessage(
        error.message ||
          `An error occurred while updating ${settingType} settings`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <FaCog className="mr-2 h-6 w-6 text-indigo-500" />
              Admin Settings
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Configure your blog application&apos;s settings
            </p>
          </div>
        </div>
      </motion.div>

      {/* Success and Error Messages */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-sm"
        >
          <div className="flex items-center">
            <FaSave className="h-5 w-5 text-green-600 mr-3" />
            <p className="text-green-700">{successMessage}</p>
          </div>
        </motion.div>
      )}

      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm"
        >
          <div className="flex items-center">
            <FaExclamationTriangle className="h-5 w-5 text-red-600 mr-3" />
            <p className="text-red-700">{errorMessage}</p>
          </div>
        </motion.div>
      )}

      {/* Settings Tabs and Content */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab("general")}
              className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center ${
                activeTab === "general"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <FaGlobe
                className={`mr-2 h-4 w-4 ${
                  activeTab === "general" ? "text-indigo-500" : "text-gray-400"
                }`}
              />
              General
            </button>
            <button
              onClick={() => setActiveTab("email")}
              className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center ${
                activeTab === "email"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <FaEnvelope
                className={`mr-2 h-4 w-4 ${
                  activeTab === "email" ? "text-indigo-500" : "text-gray-400"
                }`}
              />
              Email
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center ${
                activeTab === "notifications"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <FaBell
                className={`mr-2 h-4 w-4 ${
                  activeTab === "notifications"
                    ? "text-indigo-500"
                    : "text-gray-400"
                }`}
              />
              Notifications
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center ${
                activeTab === "security"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <FaLock
                className={`mr-2 h-4 w-4 ${
                  activeTab === "security" ? "text-indigo-500" : "text-gray-400"
                }`}
              />
              Security
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* General Settings */}
          {activeTab === "general" && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <h2 className="text-lg font-medium text-gray-900">
                General Settings
              </h2>
              <p className="text-sm text-gray-500">
                Configure basic blog settings and defaults.
              </p>

              <form
                onSubmit={(e) => handleSubmit(e, "general")}
                className="space-y-6"
              >
                <motion.div
                  variants={itemVariants}
                  className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2"
                >
                  <div>
                    <label
                      htmlFor="siteName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Site Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="siteName"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={generalSettings.siteName}
                        onChange={(e) =>
                          setGeneralSettings({
                            ...generalSettings,
                            siteName: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="defaultPostsPerPage"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Default Posts Per Page
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        id="defaultPostsPerPage"
                        min="1"
                        max="50"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={generalSettings.defaultPostsPerPage}
                        onChange={(e) =>
                          setGeneralSettings({
                            ...generalSettings,
                            defaultPostsPerPage: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="siteDescription"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Site Description
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="siteDescription"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={generalSettings.siteDescription}
                        onChange={(e) =>
                          setGeneralSettings({
                            ...generalSettings,
                            siteDescription: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="siteKeywords"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Site Keywords (comma separated)
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="siteKeywords"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={generalSettings.siteKeywords}
                        onChange={(e) =>
                          setGeneralSettings({
                            ...generalSettings,
                            siteKeywords: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-4">
                  <div className="relative flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="allowComments"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        checked={generalSettings.allowComments}
                        onChange={(e) =>
                          setGeneralSettings({
                            ...generalSettings,
                            allowComments: e.target.checked,
                          })
                        }
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="allowComments"
                        className="font-medium text-gray-700"
                      >
                        Allow Comments
                      </label>
                      <p className="text-gray-500">
                        Enable commenting on blog posts
                      </p>
                    </div>
                  </div>

                  <div className="relative flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="requireApprovalForComments"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        checked={generalSettings.requireApprovalForComments}
                        onChange={(e) =>
                          setGeneralSettings({
                            ...generalSettings,
                            requireApprovalForComments: e.target.checked,
                          })
                        }
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="requireApprovalForComments"
                        className="font-medium text-gray-700"
                      >
                        Require Approval for Comments
                      </label>
                      <p className="text-gray-500">
                        Review comments before they are public
                      </p>
                    </div>
                  </div>

                  <div className="relative flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="allowUserRegistration"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        checked={generalSettings.allowUserRegistration}
                        onChange={(e) =>
                          setGeneralSettings({
                            ...generalSettings,
                            allowUserRegistration: e.target.checked,
                          })
                        }
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="allowUserRegistration"
                        className="font-medium text-gray-700"
                      >
                        Allow User Registration
                      </label>
                      <p className="text-gray-500">
                        Let visitors create accounts on your site
                      </p>
                    </div>
                  </div>
                </motion.div>

                <div className="pt-5 flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {isLoading ? (
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
                      <>
                        <FaSave className="mr-2 h-4 w-4" />
                        Save General Settings
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Email Settings */}
          {activeTab === "email" && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <h2 className="text-lg font-medium text-gray-900">
                Email Settings
              </h2>
              <p className="text-sm text-gray-500">
                Configure your email server settings for sending notifications.
              </p>

              <form
                onSubmit={(e) => handleSubmit(e, "email")}
                className="space-y-6"
              >
                <motion.div
                  variants={itemVariants}
                  className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2"
                >
                  <div>
                    <label
                      htmlFor="smtpServer"
                      className="block text-sm font-medium text-gray-700"
                    >
                      SMTP Server
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="smtpServer"
                        placeholder="smtp.example.com"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={emailSettings.smtpServer}
                        onChange={(e) =>
                          setEmailSettings({
                            ...emailSettings,
                            smtpServer: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="smtpPort"
                      className="block text-sm font-medium text-gray-700"
                    >
                      SMTP Port
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="smtpPort"
                        placeholder="587"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={emailSettings.smtpPort}
                        onChange={(e) =>
                          setEmailSettings({
                            ...emailSettings,
                            smtpPort: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="smtpUsername"
                      className="block text-sm font-medium text-gray-700"
                    >
                      SMTP Username
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="smtpUsername"
                        placeholder="user@example.com"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={emailSettings.smtpUsername}
                        onChange={(e) =>
                          setEmailSettings({
                            ...emailSettings,
                            smtpUsername: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="smtpPassword"
                      className="block text-sm font-medium text-gray-700"
                    >
                      SMTP Password
                    </label>
                    <div className="mt-1">
                      <input
                        type="password"
                        id="smtpPassword"
                        placeholder="••••••••"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={emailSettings.smtpPassword}
                        onChange={(e) =>
                          setEmailSettings({
                            ...emailSettings,
                            smtpPassword: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="fromEmail"
                      className="block text-sm font-medium text-gray-700"
                    >
                      &quot;From&quot; Email Address
                    </label>
                    <div className="mt-1">
                      <input
                        type="email"
                        id="fromEmail"
                        placeholder="noreply@yourblog.com"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={emailSettings.fromEmail}
                        onChange={(e) =>
                          setEmailSettings({
                            ...emailSettings,
                            fromEmail: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="emailTemplate"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email Template
                    </label>
                    <div className="mt-1">
                      <select
                        id="emailTemplate"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={emailSettings.emailTemplate}
                        onChange={(e) =>
                          setEmailSettings({
                            ...emailSettings,
                            emailTemplate: e.target.value,
                          })
                        }
                      >
                        <option value="default">Default Template</option>
                        <option value="minimal">Minimal</option>
                        <option value="modern">Modern</option>
                        <option value="branded">Branded</option>
                      </select>
                    </div>
                  </div>
                </motion.div>

                <div className="pt-5 flex justify-end">
                  <button
                    type="button"
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Test Connection
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {isLoading ? (
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
                      <>
                        <FaSave className="mr-2 h-4 w-4" />
                        Save Email Settings
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Notification Settings */}
          {activeTab === "notifications" && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <h2 className="text-lg font-medium text-gray-900">
                Notification Settings
              </h2>
              <p className="text-sm text-gray-500">
                Configure when to send notifications and alerts.
              </p>

              <form
                onSubmit={(e) => handleSubmit(e, "notifications")}
                className="space-y-6"
              >
                <motion.div variants={itemVariants} className="space-y-4">
                  <div className="relative flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="newUserNotification"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        checked={notificationSettings.newUserNotification}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            newUserNotification: e.target.checked,
                          })
                        }
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="newUserNotification"
                        className="font-medium text-gray-700"
                      >
                        New User Registrations
                      </label>
                      <p className="text-gray-500">
                        Get notified when a new user registers
                      </p>
                    </div>
                  </div>

                  <div className="relative flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="newCommentNotification"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        checked={notificationSettings.newCommentNotification}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            newCommentNotification: e.target.checked,
                          })
                        }
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="newCommentNotification"
                        className="font-medium text-gray-700"
                      >
                        New Comments
                      </label>
                      <p className="text-gray-500">
                        Get notified when a new comment is posted
                      </p>
                    </div>
                  </div>

                  <div className="relative flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="newPostNotification"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        checked={notificationSettings.newPostNotification}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            newPostNotification: e.target.checked,
                          })
                        }
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="newPostNotification"
                        className="font-medium text-gray-700"
                      >
                        New Posts
                      </label>
                      <p className="text-gray-500">
                        Get notified when a new post is published
                      </p>
                    </div>
                  </div>

                  <div className="relative flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="emailAdmin"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        checked={notificationSettings.emailAdmin}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            emailAdmin: e.target.checked,
                          })
                        }
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="emailAdmin"
                        className="font-medium text-gray-700"
                      >
                        Email Administrators
                      </label>
                      <p className="text-gray-500">
                        Send notification emails to all administrators
                      </p>
                    </div>
                  </div>

                  <div className="relative flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="weeklyDigest"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        checked={notificationSettings.weeklyDigest}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            weeklyDigest: e.target.checked,
                          })
                        }
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="weeklyDigest"
                        className="font-medium text-gray-700"
                      >
                        Weekly Digest
                      </label>
                      <p className="text-gray-500">
                        Send a weekly summary of activity
                      </p>
                    </div>
                  </div>
                </motion.div>

                <div className="pt-5 flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {isLoading ? (
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
                      <>
                        <FaSave className="mr-2 h-4 w-4" />
                        Save Notification Settings
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Security Settings */}
          {activeTab === "security" && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <h2 className="text-lg font-medium text-gray-900">
                Security Settings
              </h2>
              <p className="text-sm text-gray-500">
                Configure security options for your blog application.
              </p>

              <form
                onSubmit={(e) => handleSubmit(e, "security")}
                className="space-y-6"
              >
                <motion.div variants={itemVariants}>
                  <div className="relative flex items-start mb-4">
                    <div className="flex h-5 items-center">
                      <input
                        id="enableTwoFactor"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        checked={securitySettings.enableTwoFactor}
                        onChange={(e) =>
                          setSecuritySettings({
                            ...securitySettings,
                            enableTwoFactor: e.target.checked,
                          })
                        }
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="enableTwoFactor"
                        className="font-medium text-gray-700"
                      >
                        Enable Two-Factor Authentication
                      </label>
                      <p className="text-gray-500">
                        Require 2FA for administrator accounts
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="loginAttempts"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Login Attempts Before Lockout
                      </label>
                      <div className="mt-1">
                        <input
                          type="number"
                          id="loginAttempts"
                          min="1"
                          max="10"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={securitySettings.loginAttempts}
                          onChange={(e) =>
                            setSecuritySettings({
                              ...securitySettings,
                              loginAttempts: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="lockoutTime"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Lockout Time (minutes)
                      </label>
                      <div className="mt-1">
                        <input
                          type="number"
                          id="lockoutTime"
                          min="5"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={securitySettings.lockoutTime}
                          onChange={(e) =>
                            setSecuritySettings({
                              ...securitySettings,
                              lockoutTime: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="passwordExpiry"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Password Expiry (days)
                      </label>
                      <div className="mt-1">
                        <input
                          type="number"
                          id="passwordExpiry"
                          min="0"
                          max="365"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={securitySettings.passwordExpiry}
                          onChange={(e) =>
                            setSecuritySettings({
                              ...securitySettings,
                              passwordExpiry: Number(e.target.value),
                            })
                          }
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Set to 0 for no expiry
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 relative flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="requireStrongPasswords"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        checked={securitySettings.requireStrongPasswords}
                        onChange={(e) =>
                          setSecuritySettings({
                            ...securitySettings,
                            requireStrongPasswords: e.target.checked,
                          })
                        }
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="requireStrongPasswords"
                        className="font-medium text-gray-700"
                      >
                        Require Strong Passwords
                      </label>
                      <p className="text-gray-500">
                        Passwords must contain at least 8 characters with
                        uppercase, lowercase, numbers, and special characters
                      </p>
                    </div>
                  </div>
                </motion.div>

                <div className="pt-5 flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {isLoading ? (
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
                      <>
                        <FaSave className="mr-2 h-4 w-4" />
                        Save Security Settings
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
