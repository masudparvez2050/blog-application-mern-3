"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowRight } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

import { useAuth } from "../../context/AuthContext";
import EmailInput from "./EmailInput";
import PasswordInput from "./PasswordInput";
import SocialLoginButtons from "./SocialLoginButtons";
import AlertMessage from "../shared/AlertMessage";
import SubmitButton from "./SubmitButton";
import AuthHelpLinks from "./AuthHelpLinks";
import RememberMeCheckbox from "./RememberMeCheckbox";

/**
 * LoginForm Component - Handles user login with email/password and social logins
 *
 * @param {Object} props
 * @param {string} props.redirectPath - Path to redirect to after successful login
 */
const LoginForm = ({ redirectPath = "" }) => {
  const router = useRouter();
  const { login, oauthLogin } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

  const handleGoogleError = () => {
    setError("Google login failed. Please try again.");
    toast.error("Google login failed");
  };

  // Animation variants for form elements
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  // Links for the AuthHelpLinks component
  const authLinks = [
    { text: "Forgot password?", href: "/forgot-password" },
    { text: "Don't have an account?", href: "/register", highlight: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold text-center mb-6 text-gray-800 "
      >
        Login to Your Account
      </motion.h2>

      {error && <AlertMessage message={error} type="error" />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <motion.div
          custom={0}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <EmailInput
            value={formData.email}
            onChange={handleChange}
            onFocus={() => handleFocus("email")}
            onBlur={() => handleBlur("email")}
            isFocused={isFocused.email}
            error={error && error.includes("email") ? error : ""}
          />
        </motion.div>

        <motion.div
          custom={1}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <PasswordInput
            value={formData.password}
            onChange={handleChange}
            onFocus={() => handleFocus("password")}
            onBlur={() => handleBlur("password")}
            isFocused={isFocused.password}
            error={error && error.includes("password") ? error : ""}
          />
        </motion.div>

        <motion.div
          custom={2}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-between"
        >
          <RememberMeCheckbox
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
          />
        </motion.div>

        <motion.div
          custom={3}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <SubmitButton
            text="Login"
            icon={<FaArrowRight className="ml-2" />}
            isLoading={isLoading}
          />
        </motion.div>

        <motion.div
          custom={4}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <SocialLoginButtons
            onGoogleSuccess={handleGoogleLogin}
            onGoogleError={handleGoogleError}
            onFacebookSuccess={handleFacebookLogin}
          />
        </motion.div>

        <motion.div
          custom={5}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <AuthHelpLinks links={authLinks} />
        </motion.div>
      </form>
    </motion.div>
  );
};

export default LoginForm;
