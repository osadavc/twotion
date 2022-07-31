const why = [
  {
    title: "Create An Account",
    description: (
      <p>Connect your Twitter account and create a Twotion account</p>
    ),
  },
  {
    title: "Create A Notion Database",
    description: (
      <p>
        Create a new Notion Database.{" "}
        <a
          href="https://osadavc.notion.site/3dbc792f46b94d40bf776c48985f9026?v=fbc91cbcb5a34ca3a42b2cf84ad73169"
          target="_blank"
          className="bg-gradient-to-br from-pink-600 to-purple-600 bg-clip-text text-transparent"
        >
          This
        </a>{" "}
        might be a good example
      </p>
    ),
  },
  {
    title: "Connect To The Account",
    description: (
      <p>
        Login to Twotion and connect your Notion account with the correct
        database selected
      </p>
    ),
  },
  {
    title: "Install Browser Extension",
    description: (
      <p>
        Install the browser extension from{" "}
        <a
          href="https://github.com/osadavc/twotion#how-to-install-browser-extension"
          target="_blank"
          className="bg-gradient-to-br from-pink-600 to-purple-600 bg-clip-text text-transparent"
        >
          here
        </a>{" "}
        and start using Twotion
      </p>
    ),
  },
  {
    title: "Tweet",
    description: (
      <p>
        Write a tweet inside your Notion database and post it from the browser
        extension
      </p>
    ),
  },
  {
    title: "Enjoy",
    description: (
      <p>
        Write twitter threads more easily. No more copying and pasting from
        Notion 🎉
      </p>
    ),
  },
];

const HowTwotion = () => {
  return (
    <div className="mx-auto max-w-7xl pt-44">
      <h1 className="mt-4 text-center text-3xl font-extrabold capitalize lg:text-4xl">
        How To Get Started With{" "}
        <span className="bg-gradient-to-br from-pink-600 to-purple-600 bg-clip-text text-transparent">
          Twotion
        </span>{" "}
        In Few Easy Steps
      </h1>

      <p className="mx-auto mt-4 w-[90%] text-center text-zinc-700 md:w-[65%] md:text-lg">
        It is really simple to get going with Twotion. See how you can do it
      </p>

      <div className="mt-12 grid gap-5 px-4 lg:grid-cols-2">
        {why.map((item, index) => (
          <div
            key={index}
            className="flex w-full flex-col items-center rounded-xl border py-10 px-4 text-center md:px-10"
          >
            <h1 className="text-4xl font-bold">{index + 1}</h1>
            <h2 className="mt-7 mb-3 text-center text-xl font-extrabold capitalize lg:text-2xl">
              {item.title}
            </h2>
            {item.description}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowTwotion;
