import { Client } from "@notionhq/client";
import axios from "axios";
import prisma from "lib/prisma";
import { NextApiResponse } from "next";
import { createRouter } from "next-connect";
import FormData from "form-data";
import { TwitterApi } from "twitter-api-v2";

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

  const { results: searchResults } = await notion.search({
    page_size: 1,
    query: pageId,
  });

  if (searchResults.length == 0) {
    return res.status(404).json({
      message: "Page not found",
      error: true,
    });
  }

  const { id } = searchResults[0];

  const { results: pageContents } = await notion.blocks.children.list({
    block_id: id,
    page_size: 100,
  });

  const tweetFormat: Array<any> = [];

  const buffer = Buffer.from(
    (
      await axios.get(
        "https://s3.us-west-2.amazonaws.com/secure.notion-static.com/ffd38ed7-c408-4a08-b6c9-d161ca82fc2e/icon.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220727%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220727T025937Z&X-Amz-Expires=3600&X-Amz-Signature=9c2ffebb1c3494e257165b06d7c191d94a943489bc46fbf27b0c4213249ba436&X-Amz-SignedHeaders=host&x-id=GetObject",
        {
          responseType: "arraybuffer",
        }
      )
    ).data,
    "utf-8"
  );

  console.log(buffer.toString("base64"));

  const form = new FormData();
  form.append("media_data", buffer.toString("base64"));

  // pageContents.forEach(async (item) => {
  //   const itemData = item as any;

  //   if (
  //     itemData.type === "paragraph" &&
  //     itemData.paragraph.rich_text.length > 0
  //   ) {
  //     tweetFormat.push({
  //       text: itemData.paragraph.rich_text[0]?.text?.content,
  //       media: {
  //         media_ids: [],
  //       },
  //     });
  //   }

  //   const lastItem = tweetFormat.at(-1);
  //   const twitterClient = new TwitterApi(req.accessToken);

  //   // itemData.image.file.url

  //   if (itemData.type === "image" && lastItem) {
  //     tweetFormat.pop();
  //     tweetFormat.push({
  //       ...lastItem,
  //       media: {
  //         media_ids: [...lastItem.media?.media_ids, mediaId],
  //       },
  //     });
  //   }
  // });

  console.log(tweetFormat);
  res.json(tweetFormat);
});

export default router.handler({
  onError,
  onNoMatch,
});
