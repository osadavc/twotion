import axios from "axios";
import env from "config";
import prisma from "lib/prisma";
import { NextApiResponse } from "next";
import { createRouter } from "next-connect";

import {
  auth,
  onError,
  onNoMatch,
  NextApiRequestWithUser,
} from "utils/apiUtils";

const router = createRouter<NextApiRequestWithUser, NextApiResponse>();

router.use(auth).get(async (req, res) => {
  const { code } = req.query;

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

  await prisma.user.update({
    where: {
      id: req.user.id,
    },
    data: {
      notion: {
        create: {
          accessToken: notionResponse.access_token,
          botId: notionResponse.bot_id,
          owner: notionResponse.owner,
          workspaceName: notionResponse.workspace_name,
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
