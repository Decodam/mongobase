import { auth } from "@/auth"

const publicRoutes = ["/"];
const protectedRoutes = ["/profile"]; // Add your protected routes here
const authRoutes = ["/login", "/signup"]; // Add your auth routes here

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // If the route is public, allow access
  if (publicRoutes.includes(pathname)) {
    return;
  }

  // If the route is protected and the user is not authenticated, redirect to login
  if (protectedRoutes.includes(pathname) && !req.auth) {
    const newUrl = new URL("/login", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }

  // If the route is an auth route and the user is authenticated, redirect to the home page
  if (authRoutes.includes(pathname) && req.auth) {
    const newUrl = new URL("/", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    // - Public assets like images
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
