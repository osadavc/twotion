import axios from "axios";
import { SiNotion } from "react-icons/si";

const ConnectNotion = () => {
  const redirectToNotion = async () => {
    const {
      data: { data },
    } = await axios.get("/api/notion/login");

    window.location.href = data;
  };

  return (
    <div className="flex h-[300px] flex-col items-center justify-center rounded-md bg-zinc-50 px-5">
      <h2 className="text-center text-2xl font-semibold">
        Connect Your Notion Account
      </h2>

      <p className="mt-2 w-[50%] text-center">
        Connect your Notion account and make sure to select an empty database to
        store your tweets
      </p>

      <button
        className="mt-6 flex items-center justify-center space-x-2 rounded-md border-2 py-2 px-4 transition-all hover:bg-zinc-100"
        onClick={redirectToNotion}
      >
        <SiNotion className="text-zinc-800" />
        <p>Connect Notion</p>
      </button>
    </div>
  );
};

export default ConnectNotion;
