"use client";

import { useState, useEffect, useTransition, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import FacebookLogin from "@greatsumini/react-facebook-login";
import { motion } from "framer-motion";
import {
  FaFacebook,
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaLock,
  FaUser,
  FaArrowRight,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

// Component to handle search params retrieval
function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const redirectPath = searchParams.get("redirect") || "/dashboard";
  const { register, oauthLogin } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const [isFocused, setIsFocused] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const handleFocus = (field) => {
    setIsFocused((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  const handleBlur = (field) => {
    setIsFocused((prev) => ({
      ...prev,
      [field]: false,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user types
    if (error) setError("");
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      toast.error("Password must be at least 6 characters long");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Remove confirmPassword since our API doesn't need it
      const { confirmPassword, ...userData } = formData;
      await register(userData);
      toast.success("Registration successful!");
      startTransition(() => {
        router.push(redirectPath);
      });
    } catch (err) {
      setError(err.message || "Failed to register. Please try again.");
      toast.error(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      setIsLoading(true);
      await oauthLogin("google", credentialResponse.credential);
      toast.success("Google signup successful!");
      startTransition(() => {
        router.push(redirectPath);
      });
    } catch (err) {
      setError(err.message || "Google signup failed. Please try again.");
      toast.error("Google signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookLogin = async (response) => {
    try {
      setIsLoading(true);
      // Check if the response has an accessToken
      if (response.accessToken) {
        await oauthLogin("facebook", response.accessToken);
        toast.success("Facebook signup successful!");
        startTransition(() => {
          router.push(redirectPath);
        });
      } else {
        throw new Error("Facebook signup failed. Please try again.");
      }
    } catch (err) {
      setError(err.message || "Facebook signup failed. Please try again.");
      toast.error("Facebook signup failed");
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
        staggerChildren: 0.12,
        delayChildren: 0.1,
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
        damping: 10,
      },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      {/* Background decorative elements */}
      <div className="absolute w-full h-full top-0 left-0 overflow-hidden -z-10">
        <div className="absolute top-20 right-[10%] w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 left-[10%] w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 right-[30%] w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        className="max-w-md w-full"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
            Create Account
          </h2>
          <p className="mt-3 text-base text-gray-600">
            Join our blog community and start sharing your thoughts
          </p>
        </motion.div>

        {error && (
          <motion.div
            variants={itemVariants}
            className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm backdrop-blur-sm bg-opacity-80"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          variants={itemVariants}
          className="backdrop-blur-sm bg-white bg-opacity-70 py-8 px-6 shadow-2xl sm:rounded-2xl sm:px-10 border border-gray-100/50"
        >
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="relative">
              <div
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-all duration-300 ${
                  isFocused.name || formData.name
                    ? "text-blue-600 -translate-y-9 text-xs"
                    : ""
                }`}
              >
                <FaUser className="inline mr-1" />
                <span>Full Name</span>
              </div>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className={`appearance-none block w-full px-4 py-3.5 border ${
                  error
                    ? "border-red-300"
                    : isFocused.name
                    ? "border-blue-500"
                    : "border-gray-300"
                } rounded-xl bg-white/50 placeholder-transparent focus:outline-none focus:ring-2 ${
                  error ? "focus:ring-red-200" : "focus:ring-blue-200"
                } focus:border-blue-500 transition-all duration-200`}
                value={formData.name}
                onChange={handleChange}
                onFocus={() => handleFocus("name")}
                onBlur={() => handleBlur("name")}
                placeholder="Full Name"
              />
            </div>

            <div className="relative">
              <div
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-all duration-300 ${
                  isFocused.email || formData.email
                    ? "text-blue-600 -translate-y-9 text-xs"
                    : ""
                }`}
              >
                <FaEnvelope className="inline mr-1" />
                <span>Email Address</span>
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`appearance-none block w-full px-4 py-3.5 border ${
                  error
                    ? "border-red-300"
                    : isFocused.email
                    ? "border-blue-500"
                    : "border-gray-300"
                } rounded-xl bg-white/50 placeholder-transparent focus:outline-none focus:ring-2 ${
                  error ? "focus:ring-red-200" : "focus:ring-blue-200"
                } focus:border-blue-500 transition-all duration-200`}
                value={formData.email}
                onChange={handleChange}
                onFocus={() => handleFocus("email")}
                onBlur={() => handleBlur("email")}
                placeholder="Email Address"
              />
            </div>

            <div className="relative">
              <div
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-all duration-300 ${
                  isFocused.password || formData.password
                    ? "text-blue-600 -translate-y-9 text-xs"
                    : ""
                }`}
              >
                <FaLock className="inline mr-1" />
                <span>Password</span>
              </div>
              <input
                id="password"
                name="password"
                type={showPassword.password ? "text" : "password"}
                autoComplete="new-password"
                required
                className={`appearance-none block w-full px-4 py-3.5 border ${
                  error
                    ? "border-red-300"
                    : isFocused.password
                    ? "border-blue-500"
                    : "border-gray-300"
                } rounded-xl bg-white/50 placeholder-transparent focus:outline-none focus:ring-2 ${
                  error ? "focus:ring-red-200" : "focus:ring-blue-200"
                } focus:border-blue-500 transition-all duration-200 pr-10`}
                value={formData.password}
                onChange={handleChange}
                onFocus={() => handleFocus("password")}
                onBlur={() => handleBlur("password")}
                placeholder="Password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => togglePasswordVisibility("password")}
                aria-label={
                  showPassword.password ? "Hide password" : "Show password"
                }
              >
                {showPassword.password ? (
                  <FaEyeSlash className="h-5 w-5" />
                ) : (
                  <FaEye className="h-5 w-5" />
                )}
              </button>
              <p className="mt-1 text-xs text-gray-500 ml-1">
                Must be at least 6 characters
              </p>
            </div>

            <div className="relative">
              <div
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-all duration-300 ${
                  isFocused.confirmPassword || formData.confirmPassword
                    ? "text-blue-600 -translate-y-9 text-xs"
                    : ""
                }`}
              >
                <FaLock className="inline mr-1" />
                <span>Confirm Password</span>
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword.confirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                className={`appearance-none block w-full px-4 py-3.5 border ${
                  error
                    ? "border-red-300"
                    : isFocused.confirmPassword
                    ? "border-blue-500"
                    : "border-gray-300"
                } rounded-xl bg-white/50 placeholder-transparent focus:outline-none focus:ring-2 ${
                  error ? "focus:ring-red-200" : "focus:ring-blue-200"
                } focus:border-blue-500 transition-all duration-200 pr-10`}
                value={formData.confirmPassword}
                onChange={handleChange}
                onFocus={() => handleFocus("confirmPassword")}
                onBlur={() => handleBlur("confirmPassword")}
                placeholder="Confirm Password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => togglePasswordVisibility("confirmPassword")}
                aria-label={
                  showPassword.confirmPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword.confirmPassword ? (
                  <FaEyeSlash className="h-5 w-5" />
                ) : (
                  <FaEye className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading || isPending}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-medium disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg shadow-md shadow-indigo-500/30"
              >
                {isLoading || isPending ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Create Account
                    <FaArrowRight className="ml-2 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </span>
                )}
              </button>
            </div>
          </form>

          <div className="mt-7">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300/50"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white bg-opacity-70 text-gray-500 backdrop-blur-sm">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="transform hover:scale-105 transition-transform">
                <GoogleOAuthProvider
                  clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
                >
                  <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={() =>
                      setError("Google login failed. Please try again.")
                    }
                    useOneTap
                    type="standard"
                    width="100%"
                    logo_alignment="center"
                    shape="pill"
                    text="signup_with"
                  />
                </GoogleOAuthProvider>
              </div>
              <div className="transform hover:scale-105 transition-transform">
                <FacebookLogin
                  appId={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}
                  autoLoad={false}
                  fields="name,email,picture"
                  callback={handleFacebookLogin}
                  render={(renderProps) => (
                    <button
                      onClick={renderProps.onClick}
                      className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-full shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      disabled={isLoading}
                    >
                      <FaFacebook className="h-5 w-5 text-blue-600 mr-2" />
                      <span>Facebook</span>
                    </button>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="mt-7 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-all duration-200"
              >
                Sign in instead
              </Link>
            </p>
          </div>

          <div className="mt-5 text-xs text-center text-gray-500">
            By signing up, you agree to our{" "}
            <Link
              href="/terms"
              className="font-medium text-gray-700 hover:text-gray-900 hover:underline transition-colors"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="font-medium text-gray-700 hover:text-gray-900 hover:underline transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Loading fallback component
function RegisterLoadingFallback() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      <div className="max-w-md w-full text-center">
        <div className="relative w-20 h-20 mx-auto">
          <div className="absolute top-0 w-full h-full rounded-full border-4 border-indigo-200 opacity-30"></div>
          <div className="absolute top-0 w-full h-full rounded-full border-t-4 border-indigo-600 animate-spin"></div>
        </div>
        <p className="mt-4 text-indigo-600 font-medium">
          Setting up your account...
        </p>
      </div>
    </div>
  );
}

// Main component that wraps with Suspense
export default function Register() {
  return (
    <Suspense fallback={<RegisterLoadingFallback />}>
      <RegisterContent />
    </Suspense>
  );
}
