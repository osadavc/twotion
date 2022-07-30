import type { AppProps } from "next/app";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";

import "../styles/globals.css";
import Layout from "components/Layout";

import nProgress from "nprogress";
import "nprogress/nprogress.css";
import Router from "next/router";

Router.events.on("routeChangeStart", nProgress.start);
Router.events.on("routeChangeError", nProgress.done);
Router.events.on("routeChangeComplete", nProgress.done);

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {
  return (
    <SessionProvider session={session}>
      <Layout>
        <Head>
          <title>Twotion | Write Twitter Threads With Ease</title>
          <link
            rel="shortcut icon"
            href="/images/logo.png"
            type="image/x-icon"
          />
        </Head>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
};

export default MyApp;
