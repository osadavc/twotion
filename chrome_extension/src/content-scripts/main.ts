chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  switch (message.type) {
    case "getURL": {
      sendResponse(window.location.href);
      break;
    }
  }
});

let oldURL = "";

const checkURLchange = async () => {
  if (window.location.href != oldURL) {
    await chrome.runtime.sendMessage({
      type: "getValidPage",
      url: window.location.href,
    });

    chrome.runtime.onMessage.addListener(
      ({ isNotionPage }, sender, sendResponse) => {
        if (isNotionPage) {
          addIndicators();
        }
        sendResponse(true);
      }
    );
    oldURL = window.location.href;
  }
};

setInterval(checkURLchange, 1000);

const addIndicators = async () => {
  document
    .querySelectorAll(".notion-selectable.notion-text-block")
    .forEach((element) => {
      const selectedElement = element as any;

      const textData = selectedElement.innerText;
      if (textData.length > 280) {
        selectedElement.style.backgroundColor = "#f87171";
      } else {
        selectedElement.style.backgroundColor = "";
      }

      const observer = new MutationObserver(() => {
        const textData = selectedElement.innerText;
        if (textData.length > 280) {
          selectedElement.style.backgroundColor = "#f87171";
        } else {
          selectedElement.style.backgroundColor = "";
        }
      });

      observer.observe(element!, {
        subtree: true,
        attributes: true,
        childList: true,
        characterData: true,
        characterDataOldValue: true,
      });
    });
};

export {};
