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
  const { pageId } = req.query;

  if (typeof pageId != "string") {
    return res.status(200).json({
      error: "pageId is required",
    });
  }

  const { notion: notionResponse } = (await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
    include: {
      notion: {
        select: {
          accessToken: true,
          databaseId: true,
          pageSlug: true,
        },
      },
    },
  }))!;

  if (notionResponse?.pageSlug == pageId) {
    return res.status(200).json({
      message:
        "You're in the correct database. Create a new page inside it to start creating new twitter thread",
      error: false,
    });
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

  const { id, object, parent } = results[0] as any;

  if (object == "database" && id != notionResponse?.databaseId) {
    return res.status(200).json({
      message:
        "You're not in the correct database. Please open the connected database",
      error: true,
    });
  }

  if (
    object !== "database" &&
    parent.database_id != notionResponse?.databaseId
  ) {
    return res.status(200).json({
      message:
        "Your page is not in the correct database. Please open a page in the correct database",
      error: true,
    });
  }

  return res.status(200).json({
    error: false,
  });
});

export default router.handler({
  onError,
  onNoMatch,
});
