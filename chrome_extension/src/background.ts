import { BASE_URL } from "./popup/services/apiService";

chrome.runtime.onMessage.addListener(async (message, _, sendResponse) => {
  switch (message.type) {
    case "getCookie": {
      const twotionCookie = await chrome.cookies.get({
        name: "next-auth.session-token",
        url: BASE_URL.split("/api")[0],
      });
      sendResponse(twotionCookie?.value);

      break;
    }
    case "getValidPage": {
      const twotionCookie = await chrome.cookies.get({
        name: "next-auth.session-token",
        url: BASE_URL.split("/api")[0],
      });

      const pageDetails = new URL(message.url);

      if (
        (pageDetails.host === "notion.so" ||
          pageDetails.host === "www.notion.so") &&
        pageDetails.pathname !== "/"
      ) {
        const path =
          pageDetails.searchParams.get("p") ??
          pageDetails.pathname.split("/")[1];

        if (!path) {
          return;
        }
        try {
          const pageDetails = await fetch(
            `${BASE_URL}/notion/info?pageId=${path}`,
            {
              headers: {
                Cookie: `next-auth.session-token=${twotionCookie?.value}`,
              },
            }
          ).then((data) => data.json());

          chrome.tabs.query({ active: true, currentWindow: true }, function(
            tabs
          ) {
            if (!pageDetails.error && !pageDetails.message) {
              chrome.tabs.sendMessage(tabs[0].id!, {
                isNotionPage: true,
              });
            } else {
              chrome.tabs.sendMessage(tabs[0].id!, {
                isNotionPage: false,
              });
            }
          });
        } catch {}
      }

      break;
    }
  }
});

export {};
