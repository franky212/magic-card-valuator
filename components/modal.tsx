import { forwardRef, MutableRefObject, useEffect, useState } from "react";
import Image from "next/image";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

import ClientOnlyPortal from "./ClientOnlyPortal";

interface ModalProps {
  modalOpen: boolean
  toggleModal: Function
  card: any
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(({modalOpen, toggleModal, card}, ref) => {
  const [randomQuote, setRandomQuote] = useState("");

  const barData = {
    labels: ["USD", "USD Foil", "USD Etched", "Euro", "Euro Foil", "Tix"],
    datasets: [
      {
        label: "Card Prices",
        data: [
          card.prices?.usd, 
          card.prices?.usd_foil, 
          card.prices?.usd_etched, 
          card.prices?.eur, 
          card.prices?.eur_foil, 
          card.prices?.tix
        ],
        backgroundColor: [
          "rgb(0,33,71)",
          "rgb(0,33,71)",
          "rgb(255, 221, 0)",
          "rgb(255, 221, 0)",
          "rgb(255, 221, 0)",
          "rgb(255, 255, 255)",
        ],
      }
    ]
  };

  const pieData = {
    labels: ["Power", "Toughness"],
    datasets: [
      {
        label: "Card Power and Toughness",
        data: [card.power, card.toughness],
        backgroundColor: [
          "rgb(200, 16, 46)",
          "rgb(0, 33, 71)"
        ],
        borderColor: [
          "rgba(200, 16, 46, 0.2)",
          "rgba(0, 33, 71, 0.2)"
        ]
      },
    ]
  };

  useEffect(() => {
    fetch('https://api.quotable.io/random').then( res => res.json() ).then( quote => setRandomQuote(`${quote.content} — ${quote.author}`));
    if( (ref as MutableRefObject<HTMLDivElement>).current ) {
      (ref as MutableRefObject<HTMLDivElement>).current.scrollTo(0, 0);
    }
  }, [card]);

  return (
    <ClientOnlyPortal selector="#modal-root">
      <div
        ref={ref}
        className={`fixed rounded-t-3xl modal overflow-y-auto max-w-screen-lg mt-4 ${
          modalOpen ? "open" : ""
        }`}
      >
        <>
          <div className="flex justify-center items-center relative">
            <button
              className={`fixed flex justify-center items-center left-1/2 -translate-x-2/4 -translate-y-2/4 ${ modalOpen ? "top-12" : "top-100" } z-50 text-2xl`}
              aria-label="Close the modal"
              title="Close Modal"
              onClick={() => {
                toggleModal(false);
                document.body.classList.remove("prevent-scroll");
              }}>
              <span className="material-symbols-outlined modal-close">cancel</span>
            </button>
            <div
              className="bg-cover bg-no-repeat blur-sm rounded-t-3xl w-full h-96"
              style={{
                backgroundImage: `url(${card.image_uris?.art_crop})`,
                backgroundPosition: "center 0",
              }}
            ></div>
            <p className="absolute font-bold italic w-1/2 text-center modal-flavor-text">
              {card.flavor_text || randomQuote}
            </p>
          </div>
          <div className="container md:flex p-8">
            <div className="w-1/2 mx-auto md:w-1/2 lg:w-2/6">
              {card && (
                <Image
                  className="w-full"
                  src={card.image_uris?.png}
                  width={100}
                  height={100}
                  alt={`${card.name} Card`}
                />
              )}
            </div>
            <div className="md:w-1/2 lg:w-4/6 pl-4">
              <h1 className="text-3xl font-bold mb-4">{card?.name}</h1>
              <p className="whitespace-pre-line">{card.oracle_text}</p>
              <div className="lg:flex items-center">
                <div className="w-3/6 mx-auto lg:w-2/6">
                  <Pie
                    data={pieData}
                    options={{
                      plugins: {
                        legend: {
                          labels: {
                            color: 'white'
                          },
                          onClick: (e) => null,
                        },
                      },
                    }}
                  />
                </div>
                <div className="lg:w-4/6">
                  <p className="font-bold">Prices</p>
                  <Bar
                    data={barData}
                    options={{
                      scales: {
                        y: {
                          ticks: { color: 'white'  }
                        },
                        x: {
                          ticks: { color: 'white' }
                        }
                      },
                      plugins: {
                        legend: {
                          display: false
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      </div>
    </ClientOnlyPortal>
  );
});

export default Modal;
