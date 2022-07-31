import { TwitterThreads } from "@prisma/client";
import { FC, useEffect, useState } from "react";
import { FiExternalLink } from "react-icons/fi";
import { MdPreview } from "react-icons/md";
import { Tooltip } from "@nextui-org/react";
import Popup from "components/Dashboard/TweetThreadPopup";

interface TwitterThreadListProps {
  twitterThreads: (TwitterThreads & {
    tweets: {
      id: string;
      text: string;
    }[];
  })[];
}

const TwitterThreadList: FC<TwitterThreadListProps> = ({ twitterThreads }) => {
  const [tweetId, setTweetId] = useState<Array<string>>([]);

  return (
    <div className="pt-5">
      <div>
        <h1 className="text-3xl font-bold md:text-4xl">Tweeted Threads</h1>
        <p className="mt-1 md:text-lg">
          See the threads you tweeted from here. Use the browser extension to
          tweet threads.
        </p>
      </div>

      <Popup
        isOpen={tweetId.length > 0}
        onClose={() => {
          setTweetId([]);
        }}
        tweetId={tweetId}
      />

      <div className="mt-8 space-y-3">
        {twitterThreads.length === 0 && (
          <p className="mt-16 text-center text-lg text-gray-500">
            You haven't tweeted any threads yet. Use the browser extension to
            tweet threads.
          </p>
        )}

        {twitterThreads.map((thread) => {
          const [postedDate, setPostedDate] = useState<string>("");

          useEffect(() => {
            setPostedDate(new Date(thread.postedTime!).toLocaleString());
          }, [thread.postedTime]);

          return (
            <div
              key={thread.id}
              className="flex justify-between bg-zinc-50 px-5 py-4"
            >
              <div>
                <h1 className="font-semibold md:text-xl">
                  {thread.tweets[0].text.replace("\n", " ").slice(0, 100)}
                </h1>
                <h2 className="mt-[0.125rem]">
                  Thread contains{" "}
                  <span className="rounded-xl bg-zinc-100 py-1 px-1 font-bold">
                    {thread.tweets.length}
                  </span>{" "}
                  tweets
                </h2>

                <h3 className="mt-4">Published At {postedDate}</h3>
              </div>

              <div className="flex flex-col justify-between text-xl text-zinc-600">
                <Tooltip content="Open In Twitter">
                  <button
                    onClick={() => {
                      window.open(
                        `https://twitter.com/user/status/${thread.tweets[0].id}`,
                        "_blank"
                      );
                    }}
                  >
                    <FiExternalLink />
                  </button>
                </Tooltip>
                <Tooltip content="Preview Thread">
                  <button
                    onClick={() => {
                      setTweetId(thread.tweets.map((tweet) => tweet.id));
                    }}
                  >
                    <MdPreview />
                  </button>
                </Tooltip>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TwitterThreadList;
