import env from "config";
import { useEffect, useState } from "react";
import { SiGooglechrome } from "react-icons/si";

const InstallExtension = () => {
  const [isExtension, setIsExtension] = useState(false);

  useEffect(() => {
    try {
      chrome.runtime.sendMessage(
        env.chromeExtensionId,
        { message: "version" },
        (reply) => {
          if (reply) {
            if (reply.version) {
              if (reply.version >= env.chromeExtensionVersion) {
                setIsExtension(true);
              }
            }
          } else {
            setIsExtension(false);
          }
        }
      );
    } catch (error) {
      setIsExtension(false);
    }
  }, []);

  if (isExtension) return null;

  return (
    <div className="flex h-[300px] flex-col items-center justify-center rounded-md bg-zinc-50 px-5">
      <h2 className="text-center text-2xl font-semibold">
        Install Twotion Extension To Use Twotion
      </h2>

      <p className="mt-2 w-[50%] text-center">
        Install Extension To Your Chromium Based Browser As Mentioned{" "}
        <a
          href="https://google.com/"
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-zinc-900"
        >
          Here
        </a>{" "}
        To Use Twotion
      </p>

      <button
        className="mt-6 flex items-center justify-center space-x-2 rounded-md border-2 py-2 px-4 transition-all hover:bg-zinc-100"
        onClick={() => {
          window.open("https://google.com/");
        }}
      >
        <SiGooglechrome className="text-zinc-800" />
        <p>Install Extension</p>
      </button>
    </div>
  );
};

export default InstallExtension;
