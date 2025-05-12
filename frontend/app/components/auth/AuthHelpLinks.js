"use client";

import Link from "next/link";

/**
 * AuthHelpLinks Component - Navigation links for authentication pages
 *
 * @param {Object} props
 * @param {Array} props.links - Array of link objects with href and text properties
 */
const AuthHelpLinks = ({ links = [] }) => {
  // Default links if none are provided
  const defaultLinks = [
    { href: "/contact", text: "Contact support" },
    { href: "/register", text: "Create account" },
    { href: "/login", text: "Sign in" },
  ];

  const linksToUse = links.length > 0 ? links : defaultLinks;

  return (
    <div className="mt-8">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Need help?</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3">
        <div className="text-center text-sm">
          {linksToUse.map((link, index) => (
            <>
              {index > 0 && <span className="mx-2 text-gray-400">•</span>}
              <Link
                key={link.href}
                href={link.href}
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
              >
                {link.text}
              </Link>
            </>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthHelpLinks;
