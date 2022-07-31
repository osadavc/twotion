import { Client } from "@notionhq/client";
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

router.use(auth);

router.get(async (req, res) => {
  const pageId = req.query.pageId;

  if (typeof pageId !== "string") {
    return res.status(200).json({
      isTweeted: false,
    });
  }

  const { notion: notionResponse } = (await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
    include: {
      notion: true,
    },
  }))!;

  if (!notionResponse) {
    return res.status(400).json({ error: "Notion is not configured" });
  }

  const notion = new Client({
    auth: notionResponse?.accessToken,
  });

  const notionData = (
    await notion.search({
      page_size: 1,
      query: pageId,
    })
  )?.results?.[0];

  if (!notionData) {
    return res.status(200).json({
      isTweeted: false,
    });
  }

  const notionPageId = (
    await prisma.twitterThreads.findFirst({
      where: {
        notionPageId: notionData?.id,
      },
    })
  )?.notionPageId;

  if (notionPageId) {
    return res.status(200).json({
      isTweeted: true,
    });
  }

  return res.status(200).json({
    isTweeted: false,
  });
});

export default router.handler({
  onError,
  onNoMatch,
});
