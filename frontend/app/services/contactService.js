import { handleApiError } from "@/app/utils/errorHandler";

/**
 * Submits the contact form data to the API
 * @param {Object} formData - The contact form data
 * @param {string} formData.name - The user's name
 * @param {string} formData.email - The user's email
 * @param {string} formData.subject - The subject of the contact message
 * @param {string} formData.message - The content of the contact message
 * @returns {Promise} - A promise that resolves when the form is successfully submitted
 */
export const submitContactForm = async (formData) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/contact`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw await handleApiError(response);
    }

    return await response.json();
  } catch (error) {
    console.error("Error submitting contact form:", error);
    throw error;
  }
};

/**
 * Subscribes an email to the newsletter
 * @param {string} email - The email to subscribe
 * @returns {Promise} - A promise that resolves when the email is successfully subscribed
 */
export const subscribeNewsletter = async (email) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/subscribe`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw await handleApiError(response);
    }

    return await response.json();
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    throw error;
  }
};
