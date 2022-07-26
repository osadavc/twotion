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

router.post(async (req, res) => {
  const { pageId } = req.body;

  if (typeof pageId !== "string") {
    return res.status(400).json({ error: "pageId is required" });
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

  const { results } = await notion.search({
    page_size: 1,
    query: pageId,
  });

  if (results.length == 0) {
    return res.status(404).json({
      message: "Page not found",
      error: true,
    });
  }

  const { id } = results[0];

  const data = (await notion.blocks.children.list({
    block_id: id,
  })) as any;

  res.json(data);
});

export default router.handler({
  onError,
  onNoMatch,
});
