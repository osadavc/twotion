import env from "config";
import prisma from "lib/prisma";
import NextAuth, { NextAuthOptions } from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";

export const authOptions: NextAuthOptions = {
  providers: [
    TwitterProvider({
      clientId: env.twitterClientId,
      clientSecret: env.twitterClientSecret,
      authorization: {
        params: {
          scope: ["tweet.write", "users.read", "tweet.read"].join(" "),
        },
      },
    }),
  ],
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        console.log(account);

        return {
          accessToken: account.oauth_token,
          accessSecret: account.oauth_token_secret,
          user,
        };
      }

      return token;
    },
    async signIn({ user }) {
      try {
        const existingUser = await prisma.user.findUnique({
          where: {
            id: user.id,
          },
        });

        if (existingUser) return true;

        await prisma.user.create({
          data: {
            id: user.id,
            name: user.name,
            image: user.image,
          },
        });

        return true;
      } catch (error) {
        return false;
      }
    },
    async session({ session, token }: any) {
      session.user = token.user;
      session.accessToken = token.accessToken;
      session.accessSecret = token.accessSecret;
      session.error = token.error;

      return session;
    },
  },
};

export default NextAuth(authOptions);
