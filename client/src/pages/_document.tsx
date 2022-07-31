import Document, { Head, Html, Main, NextScript } from "next/document";

export default class _Document extends Document {
  render() {
    return (
      <Html>
        <Head>
          <script
            async
            defer
            data-website-id="3f54dd22-45c2-4838-8908-f0aeba922770"
            src="https://analytics.osadavidath.com/umami.js"
          ></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
