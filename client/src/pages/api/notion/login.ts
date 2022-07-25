import env from "config";
import { NextApiResponse } from "next";
import { createRouter } from "next-connect";
import qs from "qs";

import {
  auth,
  onError,
  onNoMatch,
  NextApiRequestWithUser,
} from "utils/apiUtils";

const router = createRouter<NextApiRequestWithUser, NextApiResponse>();

router.use(auth);

router.get(async (req, res) => {
  return res.json({
    data: `https://api.notion.com/v1/oauth/authorize?${qs.stringify({
      client_id: env.notionClientId,
      redirect_uri: `${env.nextAuthURL}/api/auth/callback/notion`,
      response_type: "code",
      owner: "user",
    })}`,
  });
});

export default router.handler({
  onError,
  onNoMatch,
});
