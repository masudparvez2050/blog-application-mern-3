/**
 * Validates user profile data
 */
export const validateProfileData = (data) => {
  const errors = {};

  // Name validation
  if (!data.name) {
    errors.name = "Name is required";
  } else if (data.name.length < 2) {
    errors.name = "Name must be at least 2 characters long";
  } else if (data.name.length > 50) {
    errors.name = "Name cannot exceed 50 characters";
  }

  // Email validation
  if (!data.email) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Please enter a valid email address";
  }

  // Bio validation (optional)
  if (data.bio && data.bio.length > 500) {
    errors.bio = "Bio cannot exceed 500 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Gets remaining character count for bio
 */
export const getBioCharacterCount = (bio) => {
  const maxLength = 500;
  const remaining = maxLength - (bio?.length || 0);
  return {
    current: bio?.length || 0,
    remaining,
    maxLength
  };
};
