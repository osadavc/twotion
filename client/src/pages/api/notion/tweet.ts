import { Client } from "@notionhq/client";
import axios from "axios";
import prisma from "lib/prisma";
import { NextApiResponse } from "next";
import { createRouter } from "next-connect";
import { TwitterApi } from "twitter-api-v2";
import { fileTypeFromBuffer } from "file-type";

import {
  auth,
  onError,
  onNoMatch,
  NextApiRequestWithUser,
} from "utils/apiUtils";
import env from "config";

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

  const postedTweet = await prisma.twitterThreads.findFirst({
    where: {
      notionPageId: id,
    },
  });

  if (postedTweet) {
    return res.status(400).json({
      message: "Tweet already posted",
      error: true,
    });
  }

  const tweetFormat: Array<any> = [];

  const twitterClient = new TwitterApi({
    appKey: env.twitterClientId,
    appSecret: env.twitterClientSecret,
    accessToken: req.accessToken,
    accessSecret: req.accessSecret,
  });

  for (const item of pageContents) {
    const itemData = item as any;

    if (
      itemData.type === "paragraph" &&
      itemData.paragraph.rich_text.length > 0
    ) {
      if (
        itemData.paragraph.rich_text[0]?.text?.content.replace("\n", " ").trim()
          .length > 280
      ) {
        return res.status(400).json({
          message: "One or more tweets are too long",
          error: true,
        });
      }

      tweetFormat.push({
        text: itemData.paragraph.rich_text[0]?.text?.content,
        media: {
          media_ids: [],
        },
      });

      continue;
    }

    const lastItem = tweetFormat.at(-1);

    if (itemData.type === "image" && lastItem) {
      const buffer = Buffer.from(
        (
          await axios.get(itemData.image.file.url, {
            responseType: "arraybuffer",
          })
        ).data,
        "utf-8"
      );
      const mediaId = await twitterClient.v1.uploadMedia(buffer, {
        mimeType: (await fileTypeFromBuffer(buffer))?.mime,
      });

      tweetFormat.pop();
      tweetFormat.push({
        ...lastItem,
        media: {
          media_ids: [...lastItem.media?.media_ids, mediaId],
        },
      });

      continue;
    }
  }

  if (tweetFormat.length == 0) {
    return res.status(400).json({
      message: "No tweets found",
      error: true,
    });
  }

  const data = await twitterClient.v2.tweetThread(
    tweetFormat.map((item) => ({
      ...item,
      media: item.media?.media_ids.length > 0 ? item.media : undefined,
    }))
  );

  await prisma.twitterThreads.create({
    data: {
      tweets: {
        create: data.map((item, index) => ({
          id: item.data.id,
          text: item.data.text,
          images: {
            createMany: {
              data: tweetFormat[index].media.media_ids.map((item: any) => ({
                imageId: item,
              })),
            },
          },
        })),
      },
      User: {
        connect: {
          id: req.user.id,
        },
      },
      notionPageId: id,
    },
    include: {
      tweets: {
        include: {
          images: true,
        },
      },
    },
  });

  res.json({
    message: "Tweet posted",
  });
});

export default router.handler({
  onError,
  onNoMatch,
});
