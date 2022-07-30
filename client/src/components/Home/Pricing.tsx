import { signIn } from "next-auth/react";

const Pricing = () => {
  return (
    <div className="mx-auto max-w-7xl pt-36">
      <h1 className="mt-4 text-center text-3xl font-extrabold capitalize lg:text-4xl">
        Pricing
      </h1>

      <p className="mx-auto mt-4 text-center text-zinc-700 md:text-lg">
        Use Twotion for completely free forever.
      </p>

      <div className="mt-12 flex flex-col justify-center space-y-10 px-4 md:flex-row md:space-y-0 md:space-x-8">
        <div className="border lg:min-w-[350px]">
          <div className="rounded-b-md bg-gradient-to-br from-pink-600 to-purple-600 py-3 text-center text-xl font-bold text-white">
            <h1>Free</h1>
          </div>

          <div className="px-8 pb-10 text-center">
            <h3 className="py-16 text-center text-5xl font-bold">
              <span className="mr-1 text-3xl">$</span>0
            </h3>

            <p className="text-md">Use all the Twotion features for free</p>

            <div className="mt-8 space-y-2 text-lg font-semibold">
              <h3>Unlimited Tweeter Threads</h3>
              <h3>Unlimited Tweets Per Thread</h3>
              <h3>Use Images In Tweets</h3>
            </div>

            <button
              className="mt-8 w-full rounded-md border py-2 px-4"
              onClick={() => {
                signIn("twitter", {
                  callbackUrl: "/dashboard",
                });
              }}
            >
              Start Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
