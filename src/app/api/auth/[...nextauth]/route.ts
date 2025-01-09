import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { getMemberInfo, getMemberRoles, REQUIRED_ROLE_ID, ADMIN_ROLE_ID } from "@/lib/discord";

const handler = NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "identify guilds guilds.members.read email",
        },
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    signOut: '/',
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider !== "discord") return false;

      try {
        const roles = await getMemberRoles(profile.id);
        return roles.includes(REQUIRED_ROLE_ID);
      } catch (error) {
        console.error("Auth check failed:", error);
        return false;
      }
    },

    async jwt({ token, account, profile, user }) {
      // Only add isAdmin during initial sign in
      if (account && profile) {
        try {
          const roles = await getMemberRoles(profile.id);
          token.isAdmin = roles.includes(ADMIN_ROLE_ID);
          console.log('Setting isAdmin in JWT:', token.isAdmin);
        } catch (error) {
          console.error('Failed to get roles for JWT:', error);
          token.isAdmin = false;
        }
      }
      // Ensure isAdmin exists on token
      if (typeof token.isAdmin === 'undefined') {
        token.isAdmin = false;
      }
      console.log('JWT Token:', { ...token, isAdmin: token.isAdmin });
      return token;
    },

    async session({ session, token }) {
      if (session?.user) {
        const memberInfo = await getMemberInfo(token.sub!);
        if (memberInfo) {
          session.user.id = memberInfo.id;
          session.user.name = memberInfo.name;
          session.user.image = memberInfo.image;
          // Explicitly set isAdmin from token
          session.user.isAdmin = Boolean(token.isAdmin);
          
          console.log('Session User:', {
            ...session.user,
            isAdmin: session.user.isAdmin
          });
        }
      }
      return session;
    },
  },
  // Add debug mode to see more logs
  debug: process.env.NODE_ENV === 'development',
});

export { handler as GET, handler as POST }; 