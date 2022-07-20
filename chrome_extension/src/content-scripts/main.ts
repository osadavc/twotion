chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  switch (message.type) {
    case "getURL": {
      sendResponse(window.location.href);
      break;
    }
  }
});

export {};
