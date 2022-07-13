import { PrismaAdapter } from "@next-auth/prisma-adapter";
import env from "config";
import prisma from "lib/prisma";
import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";

export default NextAuth({
  providers: [
    TwitterProvider({
      clientId: env.twitterClientId,
      clientSecret: env.twitterClientSecret,
      version: "2.0",
      authorization: {
        params: {
          scope: [
            "tweet.write",
            "users.read",
            "offline.access",
            "tweet.read",
          ].join(" "),
        },
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/",
  },
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        username: user.username,
      },
    }),
  },
});
