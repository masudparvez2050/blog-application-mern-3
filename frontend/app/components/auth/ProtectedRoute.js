"use client";

import { useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext"; 
import { useRouter, usePathname } from "next/navigation";

/**
 * ProtectedRoute HOC - Wraps components that require authentication
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render when authenticated
 * @param {boolean} props.adminOnly - Whether the route is restricted to admin users only
 * @param {string} props.redirectPath - Path to redirect to if not authenticated
 * @returns {React.ReactNode} - The wrapped component or null (during redirect)
 */
export default function ProtectedRoute({
  children,
  adminOnly = false,
  redirectPath = "/login",
}) {
  const { isAuthenticated, isAdmin, loading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return; // Wait until auth state is determined

    // Build redirect URL with current path as the redirect parameter
    const encodedRedirectPath = encodeURIComponent(pathname);
    const loginRedirect = `${redirectPath}?redirect=${encodedRedirectPath}`;

    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      router.push(loginRedirect);
    } else if (adminOnly && !isAdmin) {
      // Redirect to dashboard if authenticated but not admin (for admin-only routes)
      router.push("/dashboard");
    }
  }, [isAuthenticated, isAdmin, loading, router, pathname, redirectPath, adminOnly]);

  // Show nothing while loading or redirecting
  if (loading || !isAuthenticated || (adminOnly && !isAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
            <div className="absolute inset-0 rounded-full border-t-4 border-indigo-600 animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Render children when authenticated and authorized
  return children;
}
