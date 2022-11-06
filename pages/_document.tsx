import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
      </Head>
      <body>
        <Main />
        {/* Here we will mount our modal portal */}
        <div id="modal-root"/>
        <NextScript />
      </body>
    </Html>
  )
}