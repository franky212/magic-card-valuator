import Head from 'next/head';
import { invoke } from '@tauri-apps/api/tauri';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import React, { useEffect, useState, useMemo } from 'react';
import { debounce } from 'lodash';

import Modal from '../components/modal';

export default function Home() {

  const [search, setSearch] = useState('');
  const [selectedCard, setSelectedCard] = useState({});
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [queryParams, setQueryParams] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const searchForCard = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    setSearch(event.target.value);
    setLoading(true);
    if( event.target.value !== '' ) {
      await fetch(`https://api.scryfall.com/cards/search?q=${encodeURIComponent(event.target.value)}`)
      .then( res => res.json() )
      .then( ({data}) => {
        setCards(data);
        setLoading(false);
      })
      .catch( err => setError(err) );
    }
  };

  const debounceSearch = useMemo( () => debounce(searchForCard, 300), [search] );

  useEffect(() => {
    invoke('greet', { name: 'World' }).then(console.log).catch(console.error);
  }, []);

  return (
    <div>

      <div className="absolute bg-red-800 w-96 bg-red-800 right-0 top-0 rounded-md mr-4 mt-4 p-4">
        {error}
      </div>

      <div className={`bg-center bg-no-repeat flex justify-center items-center h-96 ${styles.hero}`}>
        <div className="container text-center">
          <label htmlFor="search" className="block mx-auto font-bold mb-2 text-2xl">Search for a Magic Card</label>
          <input id="search" name="search" type="text" className={`block w-full md:w-1/2 mx-auto rounded-full py-2 px-4 ${styles.search}`} onChange={debounceSearch} />
        </div>
      </div>

      <main className="container my-4">
        { cards?.length === 0 || !cards ?
          <div>Please search for a card</div>
          :
          <section className="flex flex-wrap justify-center items-center">
            {loading && search !== "" ? 
              <div className="spinner mx-auto"></div>
              :
              cards && cards.map( (card: any) => <Image onClick={() => {
                setSelectedCard(card);
                setModalOpen(true);
              }} className="cursor-pointer hover:scale-110 transition-transform duration-150 ease-in-out w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2" key={card.id} alt={`${card.name} Card`} src={card.image_uris?.png || "https://via.placeholder.com/150" } width={100} height={100} /> )
            }
          </section>
        }
      </main>

      <footer className={styles.footer}>
        <a
          href="https://www.linkedin.com/in/frank-delaguila/"
          target="_blank"
          rel="noopener noreferrer">
            Frank Delaguila
          </a>
      </footer>

      {modalOpen ? 
        <Modal open={setModalOpen} />
       : null}

    </div>
  )
}
