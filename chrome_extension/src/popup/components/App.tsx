import Spinner from "./Common/Spinner";
import logo from "../images/logo.png";
import { useEffect, useState } from "react";
import { useUser } from "../context/AuthContext";
import { getNotionInfo, tweetNotionPage } from "../services/apiService";

const App = () => {
  const [error, setError] = useState("");
  const [message, setMessage] = useState(false);
  const [tweeted, setTweeted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [path, setPath] = useState("");
  const user = useUser();

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id!,
        { type: "getURL" },
        async (response) => {
          if (!response) {
            setError(
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
              pageDetails.pathname.split("/")[1];

            if (!path) {
              setError(
                "Please select a page or go to the database you selected during the configuration"
              );
            }

            setPath(path);
            try {
              const data = await getNotionInfo(path);

              setError(data.error);
              setMessage(data.message);
            } catch (error) {
              setError("Error Ocurred");
            }
          } else {
            setError(
              "You're not inside notion. Please open notion before proceeding"
            );
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
    } catch (error) {
      console.log(error);
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
        {user.isLoading ? (
          <div className="h-[400px] flex justify-center items-center">
            <Spinner />
          </div>
        ) : (
          <div className="mt-12 h-full justify-center items-center flex">
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
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
