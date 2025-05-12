/**
 * Post Form Utilities - Helper functions for post form operations
 */

/**
 * Convert a file to base64 format
 * @param {File} file - The file object to convert
 * @returns {Promise<string>} - Base64 representation of the file
 */
export const fileToBase64 = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Validate the post form data
 * @param {Object} postData - Post data object
 * @returns {Object} - Validation result { isValid, errorMessage }
 */
export const validatePostForm = (postData) => {
  if (!postData.title.trim()) {
    return { isValid: false, errorMessage: "Title is required" };
  }

  if (!postData.content.trim()) {
    return { isValid: false, errorMessage: "Content is required" };
  }

  return { isValid: true, errorMessage: "" };
};

/**
 * Get default excerpt from content if none provided
 * @param {Object} postData - Post data object
 * @returns {Object} - Updated post data with excerpt
 */
export const processPostData = (postData) => {
  // Clone the post data
  const updatedData = { ...postData };

  // If no excerpt provided, generate one from content
  if (!updatedData.excerpt || updatedData.excerpt.trim() === "") {
    // Strip HTML tags and limit to 150 characters
    const contentText = updatedData.content
      .replace(/<[^>]*>/g, "")
      .substring(0, 150);
    updatedData.excerpt =
      contentText + (contentText.length >= 150 ? "..." : "");
  }

  return updatedData;
};

/**
 * Prepare post data for submission to the API
 * @param {Object} postData - Raw post data from form
 * @param {string} finalStatus - The final status to use (draft, pending)
 * @returns {Object} - Prepared post data
 */
export const preparePostDataForSubmission = (postData, finalStatus) => {
  // Create a new object to avoid modifying the original
  const preparedData = {
    ...processPostData(postData),
    status: finalStatus,
  };

  // Map category objects to just their IDs
  preparedData.categories = postData.categories.map((cat) => cat._id);

  return preparedData;
};

/**
 * Animation variants for Framer Motion
 */
export const formAnimationVariants = {
  containerVariants: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  },

  itemVariants: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  },
};

/**
 * React Quill editor configuration
 */
export const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["link", "image", "video"],
    ["clean"],
    [{ color: [] }, { background: [] }],
    ["blockquote", "code-block"],
  ],
};
