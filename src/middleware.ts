import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const publicPaths = [
  '/auth/signin',
  '/auth/error',
  '/auth/unauthorized',
  '/api/auth',
];

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuthPath = publicPaths.some(path => 
      req.nextUrl.pathname.startsWith(path)
    );
    
    // Allow access to auth-related paths
    if (isAuthPath) return NextResponse.next();

    // Check if site requires authentication
    const requireAuth = process.env.NEXT_PUBLIC_REQUIRE_AUTH === 'true';
    
    // If auth is required and user is not logged in, redirect to signin
    if (requireAuth && !token) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    // Handle admin routes
    if (req.nextUrl.pathname.startsWith("/admin")) {
      if (!token?.isAdmin) {
        return NextResponse.redirect(new URL("/auth/unauthorized", req.url));
      }
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow public paths without auth
        if (publicPaths.some(path => req.nextUrl.pathname.startsWith(path))) {
          return true;
        }
        
        // If auth is required, check for token
        if (process.env.NEXT_PUBLIC_REQUIRE_AUTH === 'true') {
          return !!token;
        }
        
        // If auth is not required, allow access
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    // Protect all routes except public paths
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 