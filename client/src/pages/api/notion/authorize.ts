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
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: {
      notion: true,
    },
  });

  res.json({
    isAuthenticated: true,
    isNotionAuthorized: !!user?.notion?.accessToken,
  });
});

export default router.handler({
  onError,
  onNoMatch,
});
