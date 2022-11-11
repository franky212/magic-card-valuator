import Head from 'next/head';
import { invoke } from '@tauri-apps/api/tauri';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { useEffect, useState, useMemo, useRef } from 'react';
import { debounce } from 'lodash';
import { motion } from 'framer-motion';

import Modal from '../components/modal';
import Transition from '../components/transition';

export async function getStaticProps(context) {

  const res = await fetch(`https://api.scryfall.com/cards/search?q=${encodeURIComponent('knight')}`);
  const {data} = await res.json();

  return {
    props: {
      initialCards: data
    }
  }
}

export default function Home(props) {

  const [search, setSearch] = useState('');
  const [selectedCard, setSelectedCard] = useState({});
  const [cardRow, setCardRow] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const searchForCard = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    setSearch(event.target.value);
    setLoading(true);
    setError(false);
    setErrorMessage("");
    if( event.target.value !== '' ) {
      await fetch(`https://api.scryfall.com/cards/search?q=${encodeURIComponent(event.target.value)}`)
      .then( res => res.json() )
      .then( (res) => {
        if( res.data ) {
          let cardMatrix = [];
          for(let i = 0; i < res.data.length; i += 4) {
            cardMatrix.push(res.data.slice(i, i + 4))
          }
          setCardRow(cardMatrix);
          setLoading(false);
        } else {
          setLoading(false);
          if( res.code === 'not_found' ) {
            setErrorMessage(res.details);
            setError(true);
          }
        }
      })
      .catch( err => {
        console.log(err);
        setLoading(false);
        setErrorMessage(err.details);
        setError(true);
      } );
    }
  };

  const debounceSearch = useMemo( () => debounce(searchForCard, 300), [search] );

  useEffect(() => {
    invoke('greet', { name: 'World' }).then(console.log).catch(console.error);
    return () => {
      debounceSearch.cancel();
    }
  }, []);

  return (
    <div>
      <Head>
        <title>Magic Card Valuator</title>
      </Head>

      <div className={`fixed bg-red-800 w-96 bg-red-800 ${ error ? "right-0" : "left-full"} rounded-md mr-4 mt-4 p-8`}>
        {errorMessage}
      </div>

      <div className={`bg-center bg-no-repeat flex justify-center items-center h-96 ${styles.hero}`}>
        <div className="container text-center">
          <label htmlFor="search" className="block mx-auto font-bold mb-2 text-2xl">Search for a Magic Card</label>
          <input id="search" name="search" type="text" className={`block w-full md:w-1/2 mx-auto rounded-full py-2 px-4 ${styles.search}`} onChange={debounceSearch} />
        </div>
      </div>

        <main className="container my-4">
          { cardRow.length === 0 ?
            <div className="text-center search-placeholder">
              <div className="card-container h-48 relative">
                  {props.initialCards.map( (card: any) => 
                  <Image
                    className="card" 
                    key={card.id} 
                    alt={`${card.name} Card`} src={card.image_uris?.png || "https://via.placeholder.com/150" } width={100} height={100} />
                  ).slice(0, 5)
                  }
              </div>
              <h2>Please search for a card!</h2>
            </div>
            :
            <section className="flex flex-wrap justify-center items-center">
              {loading && search !== "" ? 
                <div className="spinner mx-auto"></div>
                :
                cardRow && cardRow.map( (row: any, i: number) => 
                  <Transition className="flex">
                    {row.map( (card: any, i: number) => 
                      <Image onClick={() => {
                        setSelectedCard(card);
                        setModalOpen(true);
                        document.body.classList.toggle('prevent-scroll');
                      }} 
                        className="cursor-pointer hover:scale-110 transition-transform duration-150 ease-in-out w-1/2 md:w-1/3 lg:w-1/4 p-2" 
                        key={card.id} 
                        alt={`${card.name} Card`} src={card.image_uris?.png || "https://via.placeholder.com/150" } width={100} height={100} />
                      )}
                  </Transition>
                )
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

      { !modalOpen &&
        <div 
          title="Back to top" 
          aria-label="Scrool back to the top of the page" 
          className="bg-red-600 bottom-4 cursor-pointer fixed flex justify-center items-center right-4 rounded-full p-4" onClick={() => window.scrollTo(0, 0)}>
          <span className="material-symbols-outlined">
            arrow_upward
          </span>
        </div>
      }

      <Modal ref={modalRef} modalOpen={modalOpen} toggleModal={setModalOpen} card={selectedCard} />

    </div>
  )
}
