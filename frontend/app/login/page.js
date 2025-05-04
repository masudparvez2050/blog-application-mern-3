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
  FaArrowRight,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

// Component to handle search params retrieval
function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [redirectPath, setRedirectPath] = useState(
    searchParams.get("redirect") || ""
  );
  const { login, oauthLogin, user } = useAuth();

  useEffect(() => {
    // Set redirect path based on user role when user data changes
    if (user) {
      startTransition(() => {
        const path = user.role === "admin" ? "/admin" : "/dashboard";
        router.push(redirectPath || path);
      });
    }
  }, [user, redirectPath, router]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isFocused, setIsFocused] = useState({
    email: false,
    password: false,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(formData);
      toast.success("Login successful!");
    } catch (err) {
      setError(
        err.message || "Failed to login. Please check your credentials."
      );
      toast.error(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      setIsLoading(true);
      await oauthLogin("google", credentialResponse.credential);
      toast.success("Google login successful!");
    } catch (err) {
      setError(err.message || "Google login failed. Please try again.");
      toast.error("Google login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookLogin = async (response) => {
    try {
      setIsLoading(true);
      if (response.accessToken) {
        await oauthLogin("facebook", response.accessToken);
        toast.success("Facebook login successful!");
      } else {
        throw new Error("Facebook login failed. Please try again.");
      }
    } catch (err) {
      setError(err.message || "Facebook login failed. Please try again.");
      toast.error("Facebook login failed");
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
        <div className="absolute top-20 left-[10%] w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-[10%] w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-[30%] w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        className="max-w-md w-full"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
            Welcome Back
          </h2>
          <p className="mt-3 text-base text-gray-600">
            Sign in to continue to your account
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
          <form className="space-y-7" onSubmit={handleSubmit}>
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
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
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
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <FaEyeSlash className="h-5 w-5" />
                ) : (
                  <FaEye className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  href="/forgot-password"
                  className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
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
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Sign in
                    <FaArrowRight className="ml-2 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </span>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8">
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
                    text="signin_with"
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

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-all duration-200"
              >
                Sign up now
              </Link>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Loading fallback component
function LoginLoadingFallback() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      <div className="max-w-md w-full text-center">
        <div className="relative w-20 h-20 mx-auto">
          <div className="absolute top-0 w-full h-full rounded-full border-4 border-indigo-200 opacity-30"></div>
          <div className="absolute top-0 w-full h-full rounded-full border-t-4 border-indigo-600 animate-spin"></div>
        </div>
        <p className="mt-4 text-indigo-600 font-medium">
          Loading your experience...
        </p>
      </div>
    </div>
  );
}

// Need to add this to globals.css
// @keyframes blob {
//   0% { transform: translate(0px, 0px) scale(1); }
//   33% { transform: translate(30px, -50px) scale(1.1); }
//   66% { transform: translate(-20px, 20px) scale(0.9); }
//   100% { transform: translate(0px, 0px) scale(1); }
// }
// .animate-blob {
//   animation: blob 7s infinite;
// }
// .animation-delay-2000 {
//   animation-delay: 2s;
// }
// .animation-delay-4000 {
//   animation-delay: 4s;
// }

// Main component that wraps with Suspense
export default function Login() {
  return (
    <Suspense fallback={<LoginLoadingFallback />}>
      <LoginContent />
    </Suspense>
  );
}
