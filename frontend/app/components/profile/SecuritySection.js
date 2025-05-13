"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { validatePassword } from "../../utils/validations/passwordValidation";

const SecuritySection = ({
  user,
  showPasswordSection,
  setShowPasswordSection,
}) => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = "Current password is required";
    }

    if (passwordData.newPassword) {
      const { isValid, errors: passwordErrors } = validatePassword(passwordData.newPassword);
      if (!isValid) {
        errors.newPassword = passwordErrors;
      }
    } else {
      errors.newPassword = "New password is required";
    }

    if (passwordData.confirmPassword !== passwordData.newPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error when field is edited
    setValidationErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const renderPasswordRequirements = () => {
    if (!passwordData.newPassword) return null;

    const { errors } = validatePassword(passwordData.newPassword);
    const requirements = [
      { text: "At least 8 characters", met: passwordData.newPassword.length >= 8 },
      { text: "One uppercase letter", met: /[A-Z]/.test(passwordData.newPassword) },
      { text: "One lowercase letter", met: /[a-z]/.test(passwordData.newPassword) },
      { text: "One number", met: /\d/.test(passwordData.newPassword) },
      { text: "One special character", met: /[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword) },
    ];

    return (
      <div className="mt-2 space-y-1">
        {requirements.map((req, index) => (
          <div key={index} className="flex items-center space-x-2 text-sm">
            <div className={`h-2 w-2 rounded-full ${req.met ? "bg-green-500" : "bg-red-500"}`} />
            <span className={req.met ? "text-green-600" : "text-red-600"}>{req.text}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderPasswordField = (label, name, placeholder, showPassword) => (
    <div className="relative rounded-md shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaLock className="h-4 w-4 text-gray-400" />
      </div>
      <input
        type={showPassword ? "text" : "password"}
        id={name}
        name={name}
        value={passwordData[name]}
        onChange={handleChange}
        className={`block w-full pl-10 pr-10 py-2 border ${
          validationErrors[name] ? "border-red-500" : "border-gray-300"
        } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={() => togglePasswordVisibility(name)}
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
      >
        {showPassword ? (
          <FaEyeSlash className="h-4 w-4" />
        ) : (
          <FaEye className="h-4 w-4" />
        )}
      </button>
      {validationErrors[name] && (
        <p className="mt-1 text-sm text-red-500">
          {Array.isArray(validationErrors[name])
            ? validationErrors[name].join(", ")
            : validationErrors[name]}
        </p>
      )}
    </div>
  );

  return (
    <div className="space-y-6 p-6">
      {!showPasswordSection ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <button
            onClick={() => setShowPasswordSection(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <FaLock className="mr-2 h-4 w-4" />
            Change Password
          </button>
        </motion.div>
      ) : (
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Current Password
              </label>
              {renderPasswordField(
                "Current Password",
                "currentPassword",
                "Enter your current password",
                showPasswords.current
              )}
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                New Password
              </label>
              {renderPasswordField(
                "New Password",
                "newPassword",
                "Enter your new password",
                showPasswords.new
              )}
              {renderPasswordRequirements()}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm New Password
              </label>
              {renderPasswordField(
                "Confirm New Password",
                "confirmPassword",
                "Confirm your new password",
                showPasswords.confirm
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setShowPasswordSection(false);
                setPasswordData({
                  currentPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                });
                setValidationErrors({});
              }}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                if (validateForm()) {
                  // Handle password update
                }
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Update Password
            </button>
          </div>
        </motion.form>
      )}
    </div>
  );
};

export default SecuritySection;
