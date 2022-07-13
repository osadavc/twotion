let TWITTER_CLIENT_ID;
let TWITTER_CLIENT_SECRET;

try {
  TWITTER_CLIENT_ID = process.env.TWITTER_CLIENT_ID;
  TWITTER_CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET;
} catch (error) {
  console.log(error);
}

const env = {
  twitterClientId: TWITTER_CLIENT_ID ?? "",
  twitterClientSecret: TWITTER_CLIENT_SECRET ?? "",
};

export default env;
