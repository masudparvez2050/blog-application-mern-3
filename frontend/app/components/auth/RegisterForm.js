import { useState } from "react";
import Link from "next/link";
import { FaEnvelope, FaLock, FaUser, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import FormInput from "./FormInput";
import SocialAuthButtons from "./SocialAuthButtons";
import { toast } from "react-hot-toast";

export default function RegisterForm({
  onSubmit,
  onGoogleLogin,
  onFacebookLogin,
  isLoading,
  redirectPath,
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

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

    try {
      // Remove confirmPassword since our API doesn't need it
      const { confirmPassword, ...userData } = formData;
      await onSubmit(userData);
    } catch (err) {
      setError(err.message || "Failed to register. Please try again.");
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
    <motion.div
      className="w-full max-w-md mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl px-8 pt-10 pb-8"
        variants={itemVariants}
      >
        <div className="text-center mb-8">
          <motion.h1
            className="text-3xl font-bold text-gray-900 mb-2"
            variants={itemVariants}
          >
            Create an account
          </motion.h1>
          <motion.p className="text-gray-600 text-sm" variants={itemVariants}>
            Join our community and start sharing your thoughts
          </motion.p>
        </div>

        {error && (
          <motion.div
            className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-5"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <FormInput
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              icon={FaUser}
              onFocus={() => handleFocus("name")}
              onBlur={() => handleBlur("name")}
              isFocused={isFocused.name || formData.name.length > 0}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <FormInput
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              icon={FaEnvelope}
              onFocus={() => handleFocus("email")}
              onBlur={() => handleBlur("email")}
              isFocused={isFocused.email || formData.email.length > 0}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <FormInput
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              icon={FaLock}
              onFocus={() => handleFocus("password")}
              onBlur={() => handleBlur("password")}
              isFocused={isFocused.password || formData.password.length > 0}
              info="Password must be at least 6 characters long"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <FormInput
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              icon={FaLock}
              onFocus={() => handleFocus("confirmPassword")}
              onBlur={() => handleBlur("confirmPassword")}
              isFocused={
                isFocused.confirmPassword || formData.confirmPassword.length > 0
              }
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
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
              ) : (
                <>
                  <span>Create Account</span>
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </motion.div>
        </motion.form>

        <SocialAuthButtons
          onGoogleSuccess={onGoogleLogin}
          onFacebookSuccess={onFacebookLogin}
          isLoading={isLoading}
        />

        <motion.div
          className="mt-8 text-center text-sm text-gray-600"
          variants={itemVariants}
        >
          Already have an account?{" "}
          <Link
            href={`/login${
              redirectPath !== "/dashboard" ? `?redirect=${redirectPath}` : ""
            }`}
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            Sign in
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
