import Spinner from "./Common/Spinner";
import logo from "../images/logo.png";
import { useEffect, useState } from "react";
import { useUser } from "../context/AuthContext";
import { getNotionInfo } from "../services/apiService";

const App = () => {
  const [error, setError] = useState("");
  const [message, setMessage] = useState(false);
  const user = useUser();

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id!,
        { type: "getURL" },
        async (response) => {
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

  return (
    <div className="min-w-[350px] max-w-[350px] min-h-[380px] bg-white flex px-4 pt-5 flex-col">
      <div className="max-h-[75px] flex justify-center items-center">
        <img src={logo} alt="logo" className="h-[75px] mx-auto" />
      </div>

      <div className="w-full">
        {user.isLoading ? (
          <div className="h-[400px] flex justify-center items-center">
            <Spinner />
          </div>
        ) : (
          <div className="mt-16 h-full justify-center items-center flex">
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
                <button className="py-3 px-6 bg-zinc-300 text-xl rounded-md focus:ring focus:ring-zinc-500">
                  Verify and Tweet
                </button>
                <p className="text-lg mt-4 text-center">
                  See example for how your page should look like{" "}
                  <a
                    href="https://osadavc.notion.site/3dbc792f46b94d40bf776c48985f9026?v=fbc91cbcb5a34ca3a42b2cf84ad73169"
                    target="_blank"
                    className="text-blue-500"
                  >
                    here
                  </a>
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
