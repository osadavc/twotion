import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { FaTwitter } from "react-icons/fa";

const HeroSection = () => {
  const router = useRouter();

  const { data: session } = useSession();
  const isDashboard = router.pathname === "/dashboard";

  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-20">
      <img
        src="/images/logo.png"
        alt="Twotion Logo"
        className="h-[120px] md:h-[150px]"
      />

      <h1 className="mt-4 text-center text-5xl font-extrabold capitalize leading-[60px] md:!leading-[83px] lg:text-7xl">
        Write{" "}
        <span className="bg-gradient-to-br from-pink-600 to-purple-600 bg-clip-text text-transparent">
          Amazing threads
        </span>{" "}
        for twitter without leaving notion
      </h1>

      <p className="mx-auto mt-4 w-[90%] text-center text-lg text-zinc-700 md:w-[65%] md:text-xl">
        Write engaging threads for twitter without leaving your favourite
        productivity application for completely free
      </p>

      <div className="mt-10">
        {isDashboard ? (
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
    </div>
  );
};

export default HeroSection;
