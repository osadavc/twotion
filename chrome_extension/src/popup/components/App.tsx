import Spinner from "./Common/Spinner";
import logo from "../images/logo.png";
import { useEffect, useState } from "react";

const App = () => {
  const [isNotion, setIsNotion] = useState(false);
  const [notionPath, setNotionPath] = useState("");

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id!, { type: "getURL" }, (response) => {
        const pageDetails = new URL(response);

        if (
          (pageDetails.host === "notion.so" ||
            pageDetails.host === "www.notion.so") &&
          pageDetails.pathname !== "/"
        ) {
          setIsNotion(true);

          const path = pageDetails.pathname.split("/")[1];
          setNotionPath(path);
        }
      });
    });
  }, []);

  return (
    <div className="min-w-[380px] max-w-[380px] min-h-[600px] bg-zinc-50 flex justify-center px-4 pt-5">
      <div className="max-h-[75px] flex justify-center items-center">
        <img src={logo} alt="logo" className="h-[75px] mx-auto" />
      </div>
    </div>
  );
};

export default App;
