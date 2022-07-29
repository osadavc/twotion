let NEXTAUTH_URL;

let TWITTER_CLIENT_ID;
let TWITTER_CLIENT_SECRET;

let NOTION_CLIENT_ID;
let NOTION_CLIENT_SECRET;

let CHROME_EXTENSION_ID;
let CHROME_EXTENSION_VERSION;

try {
  NEXTAUTH_URL = process.env.NEXTAUTH_URL;

  TWITTER_CLIENT_ID = process.env.TWITTER_CLIENT_ID;
  TWITTER_CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET;

  NOTION_CLIENT_ID = process.env.NOTION_CLIENT_ID;
  NOTION_CLIENT_SECRET = process.env.NOTION_CLIENT_SECRET;

  CHROME_EXTENSION_ID = process.env.NEXT_PUBLIC_CHROME_EXTENSION_ID;
  CHROME_EXTENSION_VERSION = process.env.NEXT_PUBLIC_CHROME_EXTENSION_VERSION;
} catch (error) {
  console.log(error);
}

const env = {
  nextAuthURL: NEXTAUTH_URL,
  twitterClientId: TWITTER_CLIENT_ID ?? "",
  twitterClientSecret: TWITTER_CLIENT_SECRET ?? "",
  notionClientId: NOTION_CLIENT_ID ?? "",
  notionClientSecret: NOTION_CLIENT_SECRET ?? "",
  chromeExtensionId: CHROME_EXTENSION_ID ?? "",
  chromeExtensionVersion: CHROME_EXTENSION_VERSION ?? "",
};

export default env;
