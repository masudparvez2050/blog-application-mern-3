/**
 * Validates user form data
 * @param {Object} formData - The user form data
 * @returns {Object} - { isValid: boolean, error: string | null }
 */
export const validateUserForm = (formData) => {
  if (!formData.name.trim()) {
    return { isValid: false, error: 'Name is required' };
  }

  if (!formData.email.trim()) {
    return { isValid: false, error: 'Email is required' };
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email.trim())) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  if (!formData.password) {
    return { isValid: false, error: 'Password is required' };
  }

  if (formData.password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters' };
  }

  if (formData.password !== formData.confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' };
  }

  // If all validations pass
  return { isValid: true, error: null };
};
