import type { NextPage } from "next";
import { signIn } from "next-auth/react";

const Home: NextPage = () => {
  return (
    <div>
      <button
        onClick={() => {
          signIn("twitter");
        }}
      >
        SignIn
      </button>
    </div>
  );
};

export default Home;
