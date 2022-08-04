import Spinner from "./Common/Spinner";
import logo from "../images/logo.png";
import { useEffect, useState } from "react";
import { useUser } from "../context/AuthContext";
import {
  getNotionInfo,
  isPageTweeted,
  tweetNotionPage,
} from "../services/apiService";

const App = () => {
  const [error, setError] = useState("");
  const [message, setMessage] = useState<boolean | string>(false);
  const [appError, setAppError] = useState<string | null>("");
  const [appSuccess, setAppSuccess] = useState(false);
  const [tweeted, setTweeted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [path, setPath] = useState("");
  const [code, setCode] = useState<number>();
  const user = useUser();

  useEffect(() => {
    setIsPageLoading(true);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id!,
        { type: "getURL" },
        async (response) => {
          if (!response) {
            setIsPageLoading(false);
            return setError(
              "You're not inside notion. Please open notion before proceeding"
            );
          }

          const pageDetails = new URL(response);

          if (
            (pageDetails.host === "notion.so" ||
              pageDetails.host === "www.notion.so") &&
            pageDetails.pathname !== "/"
          ) {
            const path =
              pageDetails.searchParams.get("p") ??
              pageDetails.pathname.split("/").at(-1)!;

            if (!path || path.length !== 32) {
              setError(
                "Please select a page or go to the database you selected during the configuration"
              );
            }

            setPath(path);
            try {
              const [notionInfo, isTweeted] = await Promise.all([
                getNotionInfo(path),
                isPageTweeted(path),
              ]);

              setTweeted(isTweeted.isTweeted);
              setCode(notionInfo.code);
              setError(notionInfo.error);
              setMessage(notionInfo.message);
            } catch (error) {
              setError("Error Ocurred");

              setCode((error as any).response.status === 401 ? 401 : 500);
              if ((error as any).response.status === 401) {
                setError("Login To Twotion Before Continuing");
              }
            } finally {
              setIsPageLoading(false);
            }
          } else {
            setError(
              "You're not inside notion. Please open notion before proceeding"
            );
            setCode(10);
            setIsPageLoading(false);
          }
        }
      );
    });
  }, []);

  const handleTweet = async () => {
    setLoading(true);

    try {
      await tweetNotionPage(path);
      setTweeted(true);
      setAppSuccess(true);
      setAppError(null);
    } catch (error) {
      console.log(error);
      setAppError((error as any).response.data.message);
      setAppSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-w-[350px] max-w-[350px] min-h-[380px] bg-white flex px-6 pt-5 flex-col">
      <div className="max-h-[75px] flex justify-center items-center">
        <img src={logo} alt="logo" className="h-[75px] mx-auto" />
      </div>

      <div className="w-full">
        {user.isLoading || isPageLoading ? (
          <div className="h-[400px] flex justify-center items-center">
            <Spinner />
          </div>
        ) : (
          <div className="mt-12 h-full justify-center items-center flex flex-col">
            {error && (
              <p className="capitalize text-center text-red-500 text-lg">
                {error}
              </p>
            )}

            {message && (
              <p className="capitalize text-center text-green-500 text-lg">
                {message}
              </p>
            )}

            {code === 10 && (
              <button
                className="flex items-center justify-center space-x-2 rounded-md border-2 py-[0.45rem] px-4 transition-all hover:bg-zinc-50 mt-4 text-[1.1rem]"
                onClick={() => {
                  window.open("https://notion.so/");
                }}
              >
                Open Notion
              </button>
            )}

            {code === 401 && (
              <button
                className="flex items-center justify-center space-x-2 rounded-md border-2 py-[0.45rem] px-4 transition-all hover:bg-zinc-50 mt-4 text-[1.1rem]"
                onClick={() => {
                  window.open("https://twotion.osadavidath.com/");
                }}
              >
                Open Twotion
              </button>
            )}

            {!error && !message && (
              <div className="flex flex-col justify-center items-center">
                <button
                  className="disabled:opacity-75 py-2 px-5 w-full bg-zinc-300 text-lg rounded-md focus:ring focus:ring-offset-2 focus:ring-zinc-500/50 disabled:cursor-not-allowed"
                  disabled={tweeted || loading}
                  onClick={handleTweet}
                >
                  {loading ? (
                    <Spinner width={27} height={27} />
                  ) : tweeted ? (
                    "Already Tweeted"
                  ) : (
                    "Tweet"
                  )}
                </button>
                <p className="text-base mt-4 text-center">
                  See example for how your page should look like{" "}
                  <a
                    href="https://osadavc.notion.site/3dbc792f46b94d40bf776c48985f9026?v=fbc91cbcb5a34ca3a42b2cf84ad73169"
                    target="_blank"
                    className="text-blue-500"
                  >
                    here
                  </a>
                </p>
                <p className="mt-1 text-center">
                  Tweets that exceeds the character limit are highlighted in red
                </p>

                {appError && (
                  <p className="mt-1 text-center text-red-500">{appError}</p>
                )}

                {appSuccess && (
                  <p className="mt-1 text-center text-green-500">
                    Successfully Tweeted
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
