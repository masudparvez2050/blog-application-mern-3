// "use client";

// import { useEffect, useTransition } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useAuth } from "../context/AuthContext";
// import { toast } from "react-hot-toast";
// import RegisterForm from "../components/auth/RegisterForm";
// import AuthPageLayout from "../components/auth/AuthPageLayout";

// export default function RegisterPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [isPending, startTransition] = useTransition();
//   const redirectPath = searchParams.get("redirect") || "/dashboard";
//   const { register, oauthLogin } = useAuth();

//   const handleRegister = async (userData) => {
//     try {
//       await register(userData);
//       toast.success("Registration successful!");
//       startTransition(() => {
//         router.push(redirectPath);
//       });
//     } catch (err) {
//       toast.error(err.message || "Registration failed");
//       throw err; // Re-throw to be handled by the form
//     }
//   };

//   const handleGoogleLogin = async (credential) => {
//     try {
//       await oauthLogin("google", credential);
//       toast.success("Google signup successful!");
//       startTransition(() => {
//         router.push(redirectPath);
//       });
//     } catch (err) {
//       toast.error(err.message || "Google signup failed");
//       throw err;
//     }
//   };

//   const handleFacebookLogin = async (accessToken) => {
//     try {
//       await oauthLogin("facebook", accessToken);
//       toast.success("Facebook signup successful!");
//       startTransition(() => {
//         router.push(redirectPath);
//       });
//     } catch (err) {
//       toast.error(err.message || "Facebook signup failed");
//       throw err;
//     }
//   };

//   return (
//     <AuthPageLayout
//       title="Join our community"
//       subtitle="Create an account to get started"
//       backLink={{ href: "/", text: "Back to home" }}
//     >
//       <RegisterForm
//         onSubmit={handleRegister}
//         onGoogleLogin={handleGoogleLogin}
//         onFacebookLogin={handleFacebookLogin}
//         isLoading={isPending}
//         redirectPath={redirectPath}
//       />
//     </AuthPageLayout>
//   );
// }

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 bg-[linear-gradient(135deg,#f5f7fa_0%,#e4e7eb_100%)]">
      {/* Subtle decorative elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-indigo-100 rounded-full filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-100 rounded-full filter blur-3xl opacity-30 animate-float animation-delay-3000"></div>
      </div>

      <motion.div
        className="max-w-md w-full bg-white/80 backdrop-blur-md border border-gray-100/50 rounded-2xl shadow-xl p-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="text-center mb-4">
          <h2 className="text-3xl font-semibold text-gray-900">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">Join our community</p>
        </motion.div>

        {error && (
          <motion.div
            variants={itemVariants}
            className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-md text-sm text-red-700 flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <svg
              className="h-5 w-5 text-red-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {error}
          </motion.div>
        )}

        <form className="space-y-3" onSubmit={handleSubmit}>
          <motion.div variants={itemVariants}>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="appearance-none block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                id="password"
                name="password"
                type={showPassword.password ? "text" : "password"}
                autoComplete="new-password"
                required
                className="appearance-none block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Must be at least 6 characters
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword.confirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                className="appearance-none block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
          </motion.div>

          <motion.div variants={itemVariants}>
            <button
              type="submit"
              disabled={isLoading || isPending}
              className="w-full flex justify-center items-center mt-4 py-3 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
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
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </motion.div>
        </form>

        <motion.div variants={itemVariants} className="mt-3">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-4">
            <motion.div variants={itemVariants}>
              <GoogleOAuthProvider
                clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
              >
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() =>
                    setError("Google signup failed. Please try again.")
                  }
                  useOneTap
                  type="standard"
                  width="100%"
                  logo_alignment="center"
                  shape="rectangular"
                  text="signup_with"
                  size="medium"
                />
              </GoogleOAuthProvider>
            </motion.div>
            <motion.div variants={itemVariants}>
              <FacebookLogin
                appId={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}
                autoLoad={false}
                fields="name,email,picture"
                callback={handleFacebookLogin}
                render={(renderProps) => (
                  <button
                    onClick={renderProps.onClick}
                    className="w-full flex justify-center items-center py-1 px-4 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
                    disabled={isLoading}
                  >
                    <FaFacebook className="h-5 w-5 text-blue-600 mr-2" />
                    <span>Facebook</span>
                  </button>
                )}
              />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-6 text-center text-sm text-gray-600"
        >
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            Sign in
          </Link>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-4 text-center text-xs text-gray-600"
        >
          By signing up, you agree to our{" "}
          <Link
            href="/terms"
            className="font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            Privacy Policy
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

function RegisterLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 bg-[linear-gradient(135deg,#f5f7fa_0%,#e4e7eb_100%)]">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
          <div className="absolute inset-0 rounded-full border-t-4 border-indigo-600 animate-spin"></div>
        </div>
        <p className="mt-4 text-gray-600">Setting up your account...</p>
      </div>
    </div>
  );
}

export default function Register() {
  return (
    <Suspense fallback={<RegisterLoadingFallback />}>
      <RegisterContent />
    </Suspense>
  );
}
