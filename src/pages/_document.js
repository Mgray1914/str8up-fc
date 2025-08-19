import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* <title>1v1 Predictions. No House. Just You vs Them</title> */}
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
        <script src="https://cdn.jsdelivr.net/npm/flowbite@3.1.2/dist/flowbite.min.js"></script>
      </body>
    </Html>
  );
}
