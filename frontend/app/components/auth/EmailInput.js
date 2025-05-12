"use client";

import { FaEnvelope } from "react-icons/fa";

/**
 * EmailInput Component - Reusable email input field with floating label
 *
 * @param {Object} props
 * @param {string} props.value - Current email value
 * @param {Function} props.onChange - Change handler function
 * @param {boolean} props.hasError - Whether there's an error with this input
 * @param {boolean} props.isFocused - Whether the input is currently focused
 * @param {Function} props.onFocus - Focus handler function
 * @param {Function} props.onBlur - Blur handler function
 * @param {boolean} props.disabled - Whether the input is disabled
 */
const EmailInput = ({
  value,
  onChange,
  hasError = false,
  isFocused = false,
  onFocus,
  onBlur,
  disabled = false,
}) => {
  return (
    <div className="relative">
      <div
        className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-all duration-300 ${
          isFocused || value ? "text-blue-600 -translate-y-9 text-xs" : ""
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
          hasError
            ? "border-red-300"
            : isFocused
            ? "border-blue-500"
            : "border-gray-300"
        } rounded-xl bg-white/50 placeholder-transparent focus:outline-none focus:ring-2 ${
          hasError ? "focus:ring-red-200" : "focus:ring-blue-200"
        } focus:border-blue-500 transition-all duration-200`}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder="Email Address"
        disabled={disabled}
      />
    </div>
  );
};

export default EmailInput;
