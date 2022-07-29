import axios from "axios";
import env from "config";
import prisma from "lib/prisma";
import { NextApiResponse } from "next";
import { createRouter } from "next-connect";
import { Client } from "@notionhq/client";

import {
  auth,
  onError,
  onNoMatch,
  NextApiRequestWithUser,
} from "utils/apiUtils";

const router = createRouter<NextApiRequestWithUser, NextApiResponse>();

router.use(auth).get(async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: "code is required" });
  }

  const { data: notionResponse } = await axios.post(
    "https://api.notion.com/v1/oauth/token",
    {
      grant_type: "authorization_code",
      code,
      redirect_uri: `${env.nextAuthURL}/api/auth/callback/notion`,
    },
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${env.notionClientId}:${env.notionClientSecret}`
        ).toString("base64")}`,
      },
    }
  );

  if (!notionResponse.access_token) {
    return res.status(400).json({ error: "access_token is required" });
  }

  const notion = new Client({
    auth: notionResponse.access_token,
  });
  const { results } = await notion.search({
    page_size: 10,
  });

  const notionDatabase = results.find(
    (result) => result.object === "database"
  ) as {
    id: string;
    url: string;
  };
  const pageSlug = notionDatabase?.url
    ? notionDatabase?.url.split("/").pop()
    : null;

  await prisma.user.update({
    where: {
      id: req.user.id,
    },
    data: {
      notion: {
        upsert: {
          create: {
            accessToken: notionResponse.access_token,
            botId: notionResponse.bot_id,
            owner: notionResponse.owner,
            workspaceName: notionResponse.workspace_name,
            databaseId: notionDatabase?.id,
            pageSlug: pageSlug ? pageSlug : null,
            error: !!(!notionDatabase?.id || !pageSlug),
          },
          update: {
            accessToken: notionResponse.access_token,
            botId: notionResponse.bot_id,
            owner: notionResponse.owner,
            workspaceName: notionResponse.workspace_name,
            databaseId: notionDatabase?.id,
            pageSlug: pageSlug ? pageSlug : null,
            error: !!(!notionDatabase?.id || !pageSlug),
          },
        },
      },
    },
  });

  return res.status(200).redirect("/dashboard");
});

export default router.handler({
  onError,
  onNoMatch,
});
