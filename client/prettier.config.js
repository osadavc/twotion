module.exports = {
  singleQuote: false,
  semi: true,
  plugins: [require("prettier-plugin-tailwindcss")],
  importOrder: [
    "^(next/(.*)$)|^(next$)",
    "<THIRD_PARTY_MODULES>",
    "next-seo.config",
    "^components/(.*)$",
    "^utils/(.*)$|^store",
    "^assets/(.*)$",
    "^[./]",
  ],
  importOrderSeparation: true,
};
