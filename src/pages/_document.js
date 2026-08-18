import { Html, Head, Main, NextScript } from 'next/document'
import { activePromo } from '../config/promoMeta'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta property="og:title" content={activePromo.title} />
        <meta property="og:description" content={activePromo.ogDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={activePromo.ogImage} />
        <meta property="og:url" content="https://str8upgaming.com/promo" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={activePromo.title} />
        <meta name="twitter:description" content={activePromo.ogDescription} />
        <meta name="twitter:image" content={activePromo.ogImage} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
