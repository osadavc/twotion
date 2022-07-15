import env from "config";
import prisma from "lib/prisma";
import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
import qs from "qs";
import { JWT } from "next-auth/jwt";
import { twitterClient } from "services/twitterClient";

const refreshAccessToken = async (token: JWT) => {
  try {
    const { data } = await twitterClient.post(
      "/oauth2/token",
      qs.stringify({
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
        client_id: env.twitterClientId,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${env.twitterClientId}:${env.twitterClientSecret}`
          ).toString("base64")}`,
        },
      }
    );

    return {
      ...token,
      accessToken: data.access_token,
      accessTokenExpires: Date.now() + data.expires_in * 1000,
      refreshToken: data.refresh_token,
    };
  } catch (error: any) {
    console.log(error.response.data);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
};

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
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        return {
          accessToken: account.access_token,
          accessTokenExpires: (account.expires_at as number) * 1000,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          user,
        };
      }

      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      return await refreshAccessToken(token);
    },
    async signIn({ user }) {
      const existingUser = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
      });

      if (!existingUser) {
        const newUser = await prisma.user.create({
          data: {
            id: user.id,
            name: user.name,
            image: user.image,
          },
        });

        return !!newUser;
      } else {
        return true;
      }
    },
    async session({ session, token }: any) {
      session.user = token.user;
      session.accessToken = token.accessToken;
      session.error = token.error;

      return session;
    },
  },
});
