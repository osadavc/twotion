import { Dialog, Transition } from "@headlessui/react";
import { Fragment, FC, useEffect, useState } from "react";
import { apiClient } from "services/apiClient";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  tweetId: string[];
}

const Popup: FC<PopupProps> = ({ isOpen, onClose, tweetId }) => {
  const [tweetHtml, setTweetHtml] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const data = await Promise.all(
        tweetId.map((tweet) => apiClient.get(`/twitter/getTweetHtml/${tweet}`))
      );

      setTweetHtml(data.map((item) => item.data.html).join("\n"));
    })();
  }, [tweetId]);

  useEffect(() => {
    const s = document.createElement("script");
    s.setAttribute("src", "https://platform.twitter.com/widgets.js");
    s.setAttribute("async", "true");
    document.head.appendChild(s);
  }, [tweetHtml, loading]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 8000);
  }, [tweetHtml]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-md transition-all">
                {loading && <p className="text-center">Loading</p>}

                <div className={loading ? "hidden" : ""}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: tweetHtml,
                    }}
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Popup;
