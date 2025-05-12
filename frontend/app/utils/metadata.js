/**
 * Generate metadata for pages
 * @param {Object} options - Metadata options
 * @param {string} options.title - Page title
 * @param {string} options.description - Page description
 * @returns {Object} Metadata object for Next.js
 */
export const getMetadata = ({ title, description }) => {
  const baseTitle = "Blog Admin";
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://blog-application-mern-3.vercel.app";

  return {
    metadataBase: new URL(baseUrl),
    title: title ? `${title} | ${baseTitle}` : baseTitle,
    description: description || "Blog administration dashboard",
    openGraph: {
      title: title ? `${title} | ${baseTitle}` : baseTitle,
      description: description || "Blog administration dashboard",
    },
  };
};
