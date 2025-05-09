"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

export default function VerifyEmail() {
  const { token } = useParams();
  const router = useRouter();
  const { updateUser, logout } = useAuth();

  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState({
    isValid: false,
    message: "",
    user: null,
  });

  // Verify the token when component mounts
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) return;

      setIsVerifying(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-email/${token}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (response.ok && data.valid) {
          setVerificationStatus({
            isValid: true,
            message:
              data.message || "Your email has been verified successfully!",
            user: data.user,
          });

          // Update the user state in context
          if (data.user) {
            updateUser({ isVerified: true });

            // Log user out immediately after successful verification
            setTimeout(() => {
              logout();
              router.push("/login");
            }, 2000); // Short delay to allow the user to see the success message
          }
        } else {
          setVerificationStatus({
            isValid: false,
            message:
              data.message ||
              "Email verification failed. Invalid or expired token.",
            user: null,
          });
        }
      } catch (error) {
        console.error("Email verification error:", error);
        setVerificationStatus({
          isValid: false,
          message: "An error occurred during verification. Please try again.",
          user: null,
        });
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [token, updateUser, logout, router]);

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

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <FaSpinner className="animate-spin h-12 w-12 text-blue-500 mb-4" />
          <h2 className="text-xl font-medium text-gray-900">
            Verifying your email...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <motion.div
        className="max-w-md w-full mx-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div
          variants={itemVariants}
          className={`text-center p-8 rounded-lg shadow-lg bg-white ${
            verificationStatus.isValid ? "border-green-500" : "border-red-500"
          } border-t-4`}
        >
          {verificationStatus.isValid ? (
            <>
              <FaCheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
              <h1 className="text-2xl font-bold mb-2">Email Verified!</h1>
              <p className="text-gray-600 mb-6">{verificationStatus.message}</p>
              <p className="text-sm text-gray-600 mb-2">
                You will be logged out and redirected to the login page in a
                moment...
              </p>
            </>
          ) : (
            <>
              <FaTimesCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
              <h1 className="text-2xl font-bold mb-2">Verification Failed</h1>
              <p className="text-gray-600 mb-6">{verificationStatus.message}</p>
              <div className="space-y-4">
                <Link
                  href="/login"
                  className="inline-block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
                  Back to Login
                </Link>
                <p className="text-sm text-gray-500">
                  If you still have trouble, please contact support or try
                  to&nbsp;
                  <Link href="/login" className="text-blue-600 hover:underline">
                    log in
                  </Link>
                  &nbsp;and request a new verification email.
                </p>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
