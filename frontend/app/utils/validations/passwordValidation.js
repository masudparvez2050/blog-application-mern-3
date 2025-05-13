/**
 * Validates password complexity requirements
 * @param {string} password - The password to validate
 * @returns {Object} Object containing validation result and error messages
 */
export const validatePassword = (password) => {
  const errors = [];
  
  // Length check
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  
  // Contains uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  
  // Contains lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  
  // Contains number
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  
  // Contains special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Common password validation rules text
 */
export const passwordRules = [
  "At least 8 characters long",
  "Contains at least one uppercase letter",
  "Contains at least one lowercase letter",
  "Contains at least one number",
  "Contains at least one special character"
];
