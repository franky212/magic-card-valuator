import Head from 'next/head';
import { invoke } from '@tauri-apps/api/tauri';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import React, { useEffect, useState, useMemo } from 'react';
import { debounce } from 'lodash';

export default function Home() {

  const [search, setSearch] = useState('');
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [queryParams, setQueryParams] = useState('');

  const searchForCard = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    setSearch(event.target.value);
    setLoading(true);
    await fetch(`https://api.scryfall.com/cards/search?q=${encodeURIComponent(event.target.value)}`)
      .then( res => res.json() )
      .then( ({data}) => {
        setCards(data);
        setLoading(false);
      })
      .catch( err => console.log(err) );
  };

  const debounceSearch = useMemo( () => debounce(searchForCard, 300), [search] );

  useEffect(() => {
    invoke('greet', { name: 'World' }).then(console.log).catch(console.error);
  }, []);

  return (
    <div>
      <Head>
        <title>Magic Card Valuator</title>
      </Head>

      <div className={`bg-center bg-no-repeat flex justify-center items-center mb-4 h-96 ${styles.hero}`}>
        <div className="w-3/4 text-center">
          <label htmlFor="search" className="block mx-auto font-bold mb-2 text-2xl">Search for a Magic Card</label>
          <input id="search" name="search" type="text" className={`block w-1/2 mx-auto rounded-full py-2 px-4 ${styles.search}`} onChange={debounceSearch} />
        </div>
      </div>

      <main className="container">
        <section className="flex flex-wrap">
          {loading && !cards.length ? 
            <div className="spinner"></div>
            :
            cards && cards.map( (card: any) => <Image className="hover:scale-110 transition-transform duration-150 ease-in-out w-1/6 p-2" key={card.id} alt={`${card.name} Card`} src={card.image_uris?.png || "https://via.placeholder.com/150" } width={100} height={100} /> )
          }
        </section>
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
