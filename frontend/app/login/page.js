// "use client";

// import { useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useAuth } from "../context/AuthContext";
// import { useTransition } from "react";
// import LoginForm from "../components/auth/LoginForm";
// import AuthPageLayout from "../components/auth/AuthPageLayout";

// export default function LoginPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [isPending, startTransition] = useTransition();
//   const redirectPath = searchParams.get("redirect") || "";
//   const { user } = useAuth();

//   useEffect(() => {
//     // Redirect based on user role when user data is available
//     if (user) {
//       startTransition(() => {
//         const path = user.role === "admin" ? "/admin" : "/dashboard";
//         router.push(redirectPath || path);
//       });
//     }
//   }, [user, redirectPath, router]);

//   return (
//     <AuthPageLayout
//       title="Welcome Back"
//       subtitle="Sign in to continue to your account"
//     >
//       <LoginForm redirectPath={redirectPath} />
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
  FaArrowRight,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [redirectPath, setRedirectPath] = useState(
    searchParams.get("redirect") || ""
  );
  const { login, oauthLogin, user } = useAuth();

  useEffect(() => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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
      startTransition(() => {
        router.push(redirectPath);
      });
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
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 bg-[linear-gradient(135deg,#f5f7fa_0%,#e4e7eb_100%)]">
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
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h2 className="text-3xl font-semibold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
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

        <form className="space-y-6" onSubmit={handleSubmit}>
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
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className="appearance-none block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 text-gray-600">
                Remember me
              </label>
            </div>
            <Link
              href="/forgot-password"
              className="text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Forgot password?
            </Link>
          </motion.div>

          <motion.div variants={itemVariants}>
            <button
              type="submit"
              disabled={isLoading || isPending}
              className="w-full flex justify-center items-center py-3 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
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
                  Sign In
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </motion.div>
        </form>

        <motion.div variants={itemVariants} className="mt-6">
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

          <div className="mt-6 grid grid-cols-2 gap-4">
            <motion.div variants={itemVariants} className=" h-10">
              <div className="h-full">
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
                    text="signin_with"
                    shape="rectangular"
                    logo_alignment="center"
                    size="medium"
                  />
                </GoogleOAuthProvider>
              </div>
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
                    className="w-full h-9 flex justify-center items-center border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
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
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            Sign up
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

function LoginLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 bg-[linear-gradient(135deg,#f5f7fa_0%,#e4e7eb_100%)]">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
          <div className="absolute inset-0 rounded-full border-t-4 border-indigo-600 animate-spin"></div>
        </div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<LoginLoadingFallback />}>
      <LoginContent />
    </Suspense>
  );
}
