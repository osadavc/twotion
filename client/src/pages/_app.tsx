import type { AppProps } from "next/app";
import Head from "next/head";

import "../styles/globals.css";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title></title>
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;
