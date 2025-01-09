import { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { getMemberInfo, getMemberRoles, REQUIRED_ROLE_ID, ADMIN_ROLE_ID } from "@/lib/discord";

export const authOptions: NextAuthOptions = {
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
    signOut: '/auth/signin'
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider !== "discord") {
        throw new Error('AccessDenied');
      }

      try {
        const roles = await getMemberRoles(profile?.id as string);
        if (!roles.includes(REQUIRED_ROLE_ID)) {
          throw new Error('AccessDenied');
        }
        return true;
      } catch (error) {
        console.error("Auth check failed:", error);
        throw new Error('AccessDenied');
      }
    },

    async redirect({ url, baseUrl }) {
      if (url.includes('/auth/error')) {
        return url;
      }
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },

    async jwt({ token, account, profile }) {
      if (account && profile) {
        try {
          const roles = await getMemberRoles(profile.id as string);
          token.isAdmin = roles.includes(ADMIN_ROLE_ID);
        } catch (error) {
          console.error('Failed to get roles for JWT:', error);
          token.isAdmin = false;
        }
      }
      if (typeof token.isAdmin === 'undefined') {
        token.isAdmin = false;
      }
      return token;
    },

    async session({ session, token }) {
      if (session?.user) {
        const memberInfo = await getMemberInfo(token.sub!);
        if (memberInfo) {
          session.user.id = memberInfo.id;
          session.user.name = memberInfo.name;
          session.user.image = memberInfo.image;
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
  debug: process.env.NODE_ENV === 'development',
}; 