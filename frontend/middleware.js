import { NextResponse } from "next/server";

/**
 * Next.js middleware for route protection
 * This runs on the edge, before pages are rendered
 */
export function middleware(request) {
  // Get the path of the request
  const path = request.nextUrl.pathname;

  // Define admin and authenticated paths
  const isAdminPath = path.startsWith("/admin");
  const isAuthPath =
    path.startsWith("/dashboard") || path.startsWith("/profile");

  // Skip for public paths
  if (!isAdminPath && !isAuthPath) {
    return NextResponse.next();
  }

  // Check if user is authenticated
  const token = request.cookies.get("token")?.value;
  const user = request.cookies.get("user")?.value;

  // If no token or user found and trying to access protected route
  if ((!token || !user) && (isAuthPath || isAdminPath)) {
    // Create the redirect URL with the original path as redirect parameter
    const redirectUrl = new URL(
      `/login?redirect=${encodeURIComponent(path)}`,
      request.url
    );
    return NextResponse.redirect(redirectUrl);
  }

  // For admin paths, verify user is an admin
  if (isAdminPath) {
    try {
      // Parse user data from cookie
      const userData = user ? JSON.parse(user) : null;

      // If not an admin, redirect to dashboard
      if (!userData || userData.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch (error) {
      // If error parsing user data, redirect to login
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // If all checks pass, continue to the requested page
  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    // Match all admin and dashboard routes
    "/admin/:path*",
    "/dashboard/:path*",
    "/profile",
  ],
};
