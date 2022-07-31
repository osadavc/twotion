try {
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
        ({ isNotionPage }, _, sendResponse) => {
          if (isNotionPage) {
            addIndicators();

            observer.observe(
              document.querySelector(
                "#notion-app > div > div.notion-cursor-listener > div.notion-peek-renderer > div > div.notion-scroller.vertical > div.whenContentEditable > div:nth-child(4) > div > div"
              )!,
              {
                subtree: true,
                childList: true,
              }
            );
          }
          sendResponse(true);
        }
      );

      oldURL = window.location.href;
    }
  };

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

  const observer = new MutationObserver(() => {
    addIndicators();
  });

  if (window.location.href.includes("notion.so")) {
    setInterval(checkURLchange, 1000);
    addIndicators();
  }
} catch (error) {}

export {};
