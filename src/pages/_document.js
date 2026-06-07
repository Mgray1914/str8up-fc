import { Html, Head, Main, NextScript } from 'next/document'
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta property="og:title" content="Global Soccer Challenge — Str8Up Gaming" />
        <meta property="og:description" content="Free-to-play peer-to-peer contest. $1,400 in prizes. World Cup 2026." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://str8upgaming.com/og-promo.png" />
        <meta property="og:url" content="https://str8upgaming.com/promo" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Global Soccer Challenge — Str8Up Gaming" />
        <meta name="twitter:description" content="Free-to-play peer-to-peer contest. $1,400 in prizes. World Cup 2026." />
        <meta name="twitter:image" content="https://str8upgaming.com/og-promo.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
