import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Remove any automatic redirects from authOptions
const handler = NextAuth({
  ...authOptions,
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error', // This ensures errors are shown
    signOut: '/auth/signin'
  },
  callbacks: {
    ...authOptions.callbacks,
    redirect({ url, baseUrl }) {
      // Don't redirect on error pages
      if (url.includes('/auth/error')) {
        return url;
      }
      // Handle other redirects normally
      if (url.startsWith(baseUrl)) {
        return url;
      }
      return baseUrl;
    },
  },
});

export { handler as GET, handler as POST }; 