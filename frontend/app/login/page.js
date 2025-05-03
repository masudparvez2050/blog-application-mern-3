"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import FacebookLogin from "@greatsumini/react-facebook-login";
import { motion } from "framer-motion";
import { FaFacebook } from "react-icons/fa";

// Component to handle search params retrieval
function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [redirectPath, setRedirectPath] = useState(
    searchParams.get("redirect") || ""
  );
  const { login, oauthLogin, loading, user } = useAuth();

  console.log(searchParams);

  useEffect(() => {
    // Set redirect path based on user role when user data changes
    if (user) {
      if (user.role === "admin") {
        setRedirectPath((prev) => prev || "/admin");
      } else {
        setRedirectPath((prev) => prev || "/dashboard");
      }
    }
  }, [user]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(formData);
      router.push(redirectPath);
    } catch (err) {
      setError(
        err.message || "Failed to login. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      setIsLoading(true);
      await oauthLogin("google", credentialResponse.credential);
      router.push(redirectPath);
    } catch (err) {
      setError(err.message || "Google login failed. Please try again.");
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
        router.push(redirectPath);
      } else {
        throw new Error("Facebook login failed. Please try again.");
      }
    } catch (err) {
      setError(err.message || "Facebook login failed. Please try again.");
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <motion.div
        className="max-w-md w-full"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to continue to your account
          </p>
        </motion.div>

        {error && (
          <motion.div
            variants={itemVariants}
            className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm"
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
          className="mt-8 bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10"
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  href="/forgot-password"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
              >
                {isLoading ? (
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
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div>
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
                    shape="rectangular"
                    text="signin_with"
                  />
                </GoogleOAuthProvider>
              </div>
              <FacebookLogin
                appId={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}
                autoLoad={false}
                fields="name,email,picture"
                callback={handleFacebookLogin}
                render={(renderProps) => (
                  <button
                    onClick={renderProps.onClick}
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    disabled={isLoading}
                  >
                    <FaFacebook className="h-5 w-5 text-blue-600 mr-2" />
                    <span>Facebook</span>
                  </button>
                )}
              />
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
              >
                Sign up
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
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

// Main component that wraps with Suspense
export default function Login() {
  return (
    <Suspense fallback={<LoginLoadingFallback />}>
      <LoginContent />
    </Suspense>
  );
}
