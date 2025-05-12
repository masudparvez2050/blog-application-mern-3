"use client";

import { useState } from "react";
import AlertMessage from "../shared/AlertMessage";
import DevModeInfo from "../shared/DevModeInfo";
import EmailInput from "./EmailInput";
import SubmitButton from "./SubmitButton";
import { requestPasswordReset } from "@/app/services/authService";

/**
 * ForgotPasswordForm Component - Handles password reset requests
 */
const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [devResetInfo, setDevResetInfo] = useState(null);

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });
    setDevResetInfo(null);

    try {
      const data = await requestPasswordReset(email);

      setMessage({
        type: "success",
        text: "If an account with that email exists, a password reset link has been sent.",
      });

      // Show development information if in development mode
      if (process.env.NODE_ENV === "development" && data.devInfo) {
        setDevResetInfo(data.devInfo);
      }

      setEmail("");
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to process request. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AlertMessage type={message.type} message={message.text} />

      <DevModeInfo data={devResetInfo} title="Development Mode" />

      <form className="space-y-6" onSubmit={handleSubmit}>
        <EmailInput
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />

        <SubmitButton
          isLoading={isLoading}
          text="Send Reset Link"
          loadingText="Sending..."
        />
      </form>
    </>
  );
};

export default ForgotPasswordForm;
