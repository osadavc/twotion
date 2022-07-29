import { redirectToNotion } from "components/Dashboard/ConnectNotion";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaTwitter } from "react-icons/fa";
import { SiNotion } from "react-icons/si";

const Header = () => {
  const router = useRouter();

  const { data: session } = useSession();
  const isDashboard = router.pathname === "/dashboard";

  return (
    <div className="mx-auto flex h-[90px] max-w-7xl items-center justify-between py-8 px-4">
      <Link href="/">
        <div className="cursor-pointer">
          <img src="/images/logo.png" alt="Twotion Logo" className="h-[70px]" />
        </div>
      </Link>

      {isDashboard ? (
        <div className="flex space-x-4">
          <button
            className="flex items-center justify-center space-x-2 rounded-md border-2 py-2 px-4 transition-all hover:bg-zinc-50"
            onClick={redirectToNotion}
          >
            <SiNotion className="text-zinc-800" />
            <p>Reconnect Notion</p>
          </button>
          <button
            className="flex items-center justify-center space-x-2 rounded-md border-2 py-2 px-4 transition-all hover:bg-zinc-50"
            onClick={() => {
              signOut({
                callbackUrl: "/",
              });
            }}
          >
            <p>Log Out</p>
          </button>
        </div>
      ) : (
        <div>
          {session ? (
            <button
              className="flex items-center justify-center space-x-2 rounded-md border-2 py-2 px-4 transition-all hover:bg-zinc-50"
              onClick={() => {
                router.push("/dashboard");
              }}
            >
              <p>Go To Dashboard</p>
            </button>
          ) : (
            <button
              className="flex items-center justify-center space-x-2 rounded-md border-2 py-2 px-4 transition-all hover:bg-zinc-50"
              onClick={() => {
                signIn("twitter", {
                  callbackUrl: "/dashboard",
                });
              }}
            >
              <FaTwitter className="text-zinc-800" />
              <p>Continue With Twitter</p>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Header;
