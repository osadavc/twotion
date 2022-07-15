import { NextApiRequest, NextApiResponse } from "next";

import { getSession } from "next-auth/react";

export interface NextApiRequestWithUser extends NextApiRequest {
  user: User;
}

export interface User {
  id: string;
}

export const auth = async (
  req: NextApiRequestWithUser,
  res: NextApiResponse,
  next: Function
) => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({
      status: 401,
      error: "Unauthorized",
    });
  }

  req.user = session.user as User;
  next();
};

export const onError = (
  err: any,
  req: NextApiRequest,
  res: NextApiResponse
) => {
  console.log(err);
  res.status(500).json({ statusCode: 500, message: err.message });
};

export const onNoMatch = (req: NextApiRequest, res: NextApiResponse) => {
  res.status(404).json({ statusCode: 404, message: "Not Found" });
};
