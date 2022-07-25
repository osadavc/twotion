import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:3000/api",
});

export const getSession = async () => {
  const cookie = await chrome.runtime.sendMessage({ type: "getCookie" });
  client.defaults.headers.common[
    "Cookie"
  ] = `next-auth.session-token=${cookie}`;

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
