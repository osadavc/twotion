import axios from "axios";

export const BASE_URL = "http://localhost:3000/api";

export const client = axios.create({
  baseURL: BASE_URL,
});

export const getSession = async (noCookie: boolean = false) => {
  if (!noCookie) {
    const cookie = await chrome.runtime.sendMessage({ type: "getCookie" });
    client.defaults.headers.common[
      "Cookie"
    ] = `next-auth.session-token=${cookie}`;
  }

  const { data } = await client.get("/auth/session");
  return data;
};

export const getNotionInfo = async (pageId: string) => {
  const { data } = await client.get("/notion/info", {
    params: {
      pageId,
    },
  });

  return data;
};

export const tweetNotionPage = async (pageId: string) => {
  const { data } = await client.post("/notion/tweet", {
    pageId,
  });

  return data;
};
