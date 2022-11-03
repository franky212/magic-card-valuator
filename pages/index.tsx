import Head from 'next/head';
import { invoke } from '@tauri-apps/api/tauri';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    invoke('greet', { name: 'World' }).then(console.log).catch(console.error);
    fetch(`https://api.scryfall.com/cards/search?order=cmc&q=c%3Ared+pow%3D3`).then( data => console.log( data ) );
  }, []);
  return (
    <div className="container">
      <Head>
        <title>Magic Card Valuator</title>
      </Head>

      <main>
        <h4 className="text-4xl font-bold text-red-500 underline">
          Hello world!
        </h4>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span>
            <Image className="fill-white" src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
