// filepath: e:\PROJECTS\InteractiveCares\blog-application-mern-3\frontend\app\components\auth\RememberMeCheckbox.js
"use client";

/**
 * RememberMeCheckbox Component - A reusable "Remember me" checkbox for authentication forms
 *
 * @param {Object} props
 * @param {boolean} props.checked - Whether the checkbox is checked
 * @param {Function} props.onChange - Function to call when the checkbox state changes
 * @param {boolean} props.disabled - Whether the checkbox is disabled
 */
const RememberMeCheckbox = ({
  checked = false,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="flex items-center">
      <input
        id="remember-me"
        name="remember-me"
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      />
      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
        Remember me
      </label>
    </div>
  );
};

export default RememberMeCheckbox;
