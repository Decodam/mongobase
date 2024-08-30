import { auth } from "@/auth";
import { NextResponse } from "next/server";

const protectedRoutes = ["/profile"];
const publicRoutes = ["/"];
const authRoutes = ["/login", "/signup"];
const adminRoutes = ["/admin"];

export default auth((req) => {
  const { pathname, searchParams } = req.nextUrl;
  const user = req.auth?.user || null;
  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  // Redirect non-authenticated users trying to access protected routes
  if (!isAuthenticated && protectedRoutes.includes(pathname)) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("next", pathname);
    return Response.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth routes like login and signup
  if (isAuthenticated && authRoutes.includes(pathname)) {
    const nextUrl = searchParams.get("next") || "/profile";
    return Response.redirect(new URL(nextUrl, req.nextUrl.origin));
  }

  // Redirect non-admin users trying to access admin routes
  if (!isAdmin && adminRoutes.includes(pathname)) {
    const notAuthorizedUrl = new URL("/", req.nextUrl.origin);
    return Response.redirect(notAuthorizedUrl);
  }

  // Allow access if the route matches public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Fallback for undefined routes (can be customized further)
  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
