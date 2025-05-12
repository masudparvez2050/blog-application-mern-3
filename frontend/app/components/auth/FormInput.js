import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";

export default function FormInput({
  id,
  name,
  type = "text",
  autoComplete,
  required = true,
  value,
  onChange,
  placeholder,
  icon: Icon,
  error,
  info,
  onFocus,
  onBlur,
  isFocused,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === "password";
  const inputType = isPasswordField
    ? showPassword
      ? "text"
      : "password"
    : type;

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="relative">
      <div
        className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-all duration-300 ${
          isFocused || value ? "text-blue-600 -translate-y-9 text-xs" : ""
        }`}
      >
        {Icon && <Icon className="inline mr-1" />}
        <span>{placeholder}</span>
      </div>
      <input
        id={id}
        name={name}
        type={inputType}
        autoComplete={autoComplete}
        required={required}
        className={`appearance-none block w-full px-4 py-3.5 border ${
          error
            ? "border-red-300"
            : isFocused
            ? "border-blue-500"
            : "border-gray-300"
        } rounded-xl bg-white/50 placeholder-transparent focus:outline-none focus:ring-2 ${
          error ? "focus:ring-red-200" : "focus:ring-blue-200"
        } focus:border-blue-500 transition-all duration-200 ${
          isPasswordField ? "pr-10" : ""
        }`}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
      />
      {isPasswordField && (
        <button
          type="button"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          onClick={togglePasswordVisibility}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <FaEyeSlash className="h-5 w-5" />
          ) : (
            <FaEye className="h-5 w-5" />
          )}
        </button>
      )}
      {info && <p className="mt-1 text-xs text-gray-500 ml-1">{info}</p>}
    </div>
  );
}
