"use client";

import { useState, useEffect, memo } from "react";
import { motion } from "framer-motion";
import { Send, Check, X, AlertTriangle, Loader2 } from "lucide-react";

// Form validation helpers
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

const validateRequired = (value) => {
  return value.trim().length > 0;
};

const ContactForm = memo(function ContactForm({ onSubmit, status }) {
  const { loading, success, error } = status;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    subject: false,
    message: false,
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // Reset form after successful submission
  useEffect(() => {
    if (success) {
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setTouched({
        name: false,
        email: false,
        subject: false,
        message: false,
      });
    }
  }, [success]);

  const validate = () => {
    const newErrors = {
      name: !validateRequired(formData.name) ? "Name is required" : "",
      email: !validateRequired(formData.email)
        ? "Email is required"
        : !validateEmail(formData.email)
        ? "Please enter a valid email"
        : "",
      subject: !validateRequired(formData.subject) ? "Subject is required" : "",
      message: !validateRequired(formData.message)
        ? "Message is required"
        : formData.message.length < 20
        ? "Message should be at least 20 characters long"
        : "",
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate on change if field has been touched
    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]:
          name === "email"
            ? !validateRequired(value)
              ? "Email is required"
              : !validateEmail(value)
              ? "Please enter a valid email"
              : ""
            : name === "message" && value.length > 0 && value.length < 20
            ? "Message should be at least 20 characters long"
            : !validateRequired(value)
            ? `${name.charAt(0).toUpperCase() + name.slice(1)} is required`
            : "",
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Validate on blur
    handleChange(e);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(touched).reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    if (validate()) {
      onSubmit(formData);
    }
  };

  // If there was a successful submission, allow dismissing the success message
  const dismissSuccessMessage = () => {
    onSubmit({ success: false });
  };

  // If there was an error, allow dismissing the error message
  const dismissErrorMessage = () => {
    onSubmit({ error: null });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Send Us a Message
      </h2>

      {success && (
        <motion.div
          className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-6 flex items-start justify-between"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start">
            <Check className="w-5 h-5 mr-3 mt-0.5 text-green-500" />
            <div>
              <p className="font-medium">Message sent successfully!</p>
              <p className="text-sm">
                Thank you for contacting us. We will get back to you soon.
              </p>
            </div>
          </div>
          <button
            onClick={dismissSuccessMessage}
            className="text-green-500 hover:text-green-700"
            aria-label="Dismiss message"
          >
            <X className="w-5 h-5" />
          </button>
        </motion.div>
      )}

      {error && (
        <motion.div
          className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6 flex items-start justify-between"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 mr-3 mt-0.5 text-red-500" />
            <div>
              <p className="font-medium">Failed to send message</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
          <button
            onClick={dismissErrorMessage}
            className="text-red-500 hover:text-red-700"
            aria-label="Dismiss error"
          >
            <X className="w-5 h-5" />
          </button>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-4">
          {/* Name Input */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading || success}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-offset-0 focus:outline-none transition-colors
                ${
                  errors.name && touched.name
                    ? "border-red-300 text-red-900 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                }`}
              placeholder="Your full name"
            />
            {errors.name && touched.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading || success}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-offset-0 focus:outline-none transition-colors
                ${
                  errors.email && touched.email
                    ? "border-red-300 text-red-900 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                }`}
              placeholder="your.email@example.com"
            />
            {errors.email && touched.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Subject Input */}
          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              required
              value={formData.subject}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading || success}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-offset-0 focus:outline-none transition-colors
                ${
                  errors.subject && touched.subject
                    ? "border-red-300 text-red-900 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                }`}
              placeholder="What is this regarding?"
            />
            {errors.subject && touched.subject && (
              <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
            )}
          </div>

          {/* Message Input */}
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows="5"
              required
              value={formData.message}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading || success}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-offset-0 focus:outline-none transition-colors
                ${
                  errors.message && touched.message
                    ? "border-red-300 text-red-900 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                }`}
              placeholder="Your message..."
            ></textarea>
            {errors.message && touched.message && (
              <p className="mt-1 text-sm text-red-600">{errors.message}</p>
            )}
            <div className="mt-1 text-xs text-gray-500 flex justify-end">
              {formData.message.length}/500 characters
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || success}
              className={`w-full flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg text-white 
                ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : success
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-blue-600 hover:bg-blue-700"
                }
                transition-colors duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Sending...
                </>
              ) : success ? (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Sent Successfully
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
});

export default ContactForm;
