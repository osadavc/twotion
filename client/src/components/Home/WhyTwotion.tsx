import { MdOutlineMobileFriendly } from "react-icons/md";
import { SiNotion } from "react-icons/si";

const why = [
  {
    icon: MdOutlineMobileFriendly,
    title: "Easy to use",
    description:
      "Twotion is super easy to use and has no learning curve because it uses Notion under the hood.",
  },
  {
    icon: SiNotion,
    title: "Uses Notion",
    description: "Twotion uses Notion to create and manage a thread.",
  },
  {
    icon: MdOutlineMobileFriendly,
    title: "Free Of Charge",
    description:
      "Twotion is free to use and has no cost. Notion PRO plan is not required",
  },
];

const WhyTwotion = () => {
  return (
    <div className="mx-auto max-w-7xl pt-24">
      <h1 className="mt-4 text-center text-3xl font-extrabold capitalize lg:text-4xl">
        Why Should You Use{" "}
        <span className="bg-gradient-to-br from-pink-600 to-purple-600 bg-clip-text text-transparent">
          Twotion
        </span>
      </h1>

      <p className="mx-auto mt-4 w-[90%] text-center text-zinc-700 md:w-[65%] md:text-lg">
        Twotion stands out in many cases compared to other twitter thread
        writing applications.
      </p>

      <div className="mt-12 grid gap-5 px-4 lg:grid-cols-3">
        {why.map((item, index) => (
          <div
            key={index}
            className="flex w-full flex-col items-center  rounded-xl border py-10"
          >
            <item.icon className="text-5xl" />
            <h2 className="mt-7 text-center text-2xl font-extrabold capitalize lg:text-4xl">
              {item.title}
            </h2>
            <p className="mx-auto mt-3 w-full text-center text-zinc-700 md:w-[65%] md:text-lg">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyTwotion;
