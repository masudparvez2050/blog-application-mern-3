"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaSpinner,
  FaArrowLeft,
  FaExclamationCircle,
  FaCheckCircle,
} from "react-icons/fa";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [devResetInfo, setDevResetInfo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });
    setDevResetInfo(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: "If an account with that email exists, a password reset link has been sent.",
        });

        if (process.env.NODE_ENV === "development" && data.devInfo) {
          setDevResetInfo(data.devInfo);
        }

        setEmail("");
      } else {
        throw new Error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      setMessage({
        type: "error",
        text: error.message || "Failed to process request. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <Link
          href="/login"
          className="flex items-center text-sm text-gray-600 hover:text-blue-600 mb-6 transition-colors duration-200"
        >
          <FaArrowLeft className="mr-2" />
          Back to login
        </Link>
        <h2 className="text-center text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700">
          Reset Your Password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your email address and we&apos;ll send you a link to reset your
          password.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-xl sm:px-10 border border-gray-100">
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={`mb-6 p-4 rounded-lg flex items-start ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 border-l-4 border-green-500"
                  : "bg-red-50 text-red-800 border-l-4 border-red-500"
              }`}
            >
              {message.type === "success" ? (
                <FaCheckCircle className="h-5 w-5 mr-2 mt-0.5 text-green-500" />
              ) : (
                <FaExclamationCircle className="h-5 w-5 mr-2 mt-0.5 text-red-500" />
              )}
              <p>{message.text}</p>
            </motion.div>
          )}

          {devResetInfo && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-6 p-4 rounded-lg bg-amber-50 text-amber-800 border-l-4 border-amber-500"
            >
              <h3 className="font-bold flex items-center">
                <FaExclamationCircle className="h-4 w-4 mr-2" />
                Development Mode
              </h3>
              <p className="mb-2 mt-1 text-sm">
                Email sending is disabled, but you can use this reset link:
              </p>
              <div className="bg-white p-3 rounded border border-amber-200 mb-2 text-sm">
                <p className="font-mono break-all">
                  <strong>Reset URL:</strong>{" "}
                  <a
                    href={devResetInfo.resetUrl}
                    className="text-blue-600 hover:underline"
                  >
                    {devResetInfo.resetUrl}
                  </a>
                </p>
              </div>
              <div className="bg-white p-3 rounded border border-amber-200 text-sm">
                <p className="font-mono break-all">
                  <strong>Reset Token:</strong> {devResetInfo.resetToken}
                </p>
              </div>
              {devResetInfo.error && (
                <p className="mt-2 text-red-600 text-sm">
                  {devResetInfo.error}
                </p>
              )}
            </motion.div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="youremail@example.com"
                  disabled={isLoading}
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </motion.button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Need help?</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <div className="text-center text-sm">
                <Link
                  href="/contact"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                >
                  Contact support
                </Link>
                <span className="mx-2 text-gray-400">•</span>
                <Link
                  href="/register"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                >
                  Create account
                </Link>
                <span className="mx-2 text-gray-400">•</span>
                <Link
                  href="/login"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
