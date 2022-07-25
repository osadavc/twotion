chrome.runtime.onMessage.addListener(async (message, _, sendResponse) => {
  switch (message.type) {
    case "getCookie": {
      const twotionCookie = await chrome.cookies.get({
        name: "next-auth.session-token",
        url: "http://localhost:3000",
      });
      sendResponse(twotionCookie?.value);
      break;
    }
  }
});

export {};
