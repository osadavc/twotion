let NEXTAUTH_URL;

let TWITTER_CLIENT_ID;
let TWITTER_CLIENT_SECRET;

let NOTION_CLIENT_ID;
let NOTION_CLIENT_SECRET;

try {
  NEXTAUTH_URL = process.env.NEXTAUTH_URL;

  TWITTER_CLIENT_ID = process.env.TWITTER_CLIENT_ID;
  TWITTER_CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET;

  NOTION_CLIENT_ID = process.env.NOTION_CLIENT_ID;
  NOTION_CLIENT_SECRET = process.env.NOTION_CLIENT_SECRET;
} catch (error) {
  console.log(error);
}

const env = {
  nextAuthURL: NEXTAUTH_URL,
  twitterClientId: TWITTER_CLIENT_ID ?? "",
  twitterClientSecret: TWITTER_CLIENT_SECRET ?? "",
  notionClientId: NOTION_CLIENT_ID ?? "",
  notionClientSecret: NOTION_CLIENT_SECRET ?? "",
};

export default env;
