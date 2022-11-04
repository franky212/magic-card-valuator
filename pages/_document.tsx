import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <title>Magic Card Valuator</title>
      </Head>
      <body>
        <Main />
        {/* Here we will mount our modal portal */}
        <div id="modal-root" />
        <NextScript />
      </body>
    </Html>
  )
}