/**
 * Cookie utility functions for handling cookies in Next.js
 */

// Set a cookie with provided name, value, and optional expiration time
export function setCookie(name, value, days = 30) {
  // Calculate expiration date
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + days);

  // Convert value to string if it's an object
  const stringValue = typeof value === "object" ? JSON.stringify(value) : value;

  // Create cookie string with name, value and expiration
  const cookieValue = `${encodeURIComponent(name)}=${encodeURIComponent(
    stringValue
  )}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Lax`;

  // Set the cookie if we're in browser context
  if (typeof document !== "undefined") {
    document.cookie = cookieValue;
  }
}

// Get a cookie by name
export function getCookie(name) {
  if (typeof document === "undefined") {
    return null;
  }

  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((c) =>
    c.startsWith(`${encodeURIComponent(name)}=`)
  );

  if (!cookie) {
    return null;
  }

  const value = decodeURIComponent(cookie.split("=")[1]);

  // Try to parse as JSON if possible
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

// Remove a cookie by name
export function removeCookie(name) {
  if (typeof document !== "undefined") {
    document.cookie = `${encodeURIComponent(
      name
    )}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
  }
}
