import axios from "axios";
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
  const { id } = req.query;

  const {
    data: { html },
  } = await axios.get("https://publish.twitter.com/oembed", {
    params: {
      url: `https://twitter.com/i/status/${id}`,
      hide_thread: "true",
    },
  });

  res.json({ html });
});

export default router.handler({
  onError,
  onNoMatch,
});
