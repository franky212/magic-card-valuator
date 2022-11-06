import Image from "next/image";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

import ClientOnlyPortal from "./ClientOnlyPortal";
import { forwardRef, MutableRefObject, useEffect } from "react";

interface ModalProps {
  modalOpen: boolean
  toggleModal: Function
  card: any
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(({modalOpen, toggleModal, card}, ref) => {
  const data = {
    labels: ["Power", "Toughness"],
    datasets: [
      {
        label: "Card Power and Toughness",
        data: [card.power, card.toughness],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)"
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)"
        ],
        borderWidth: 1,
      },
    ]
  };

  useEffect(() => {
    if( (ref as MutableRefObject<HTMLDivElement>).current ) {
      (ref as MutableRefObject<HTMLDivElement>).current.scrollTo(0, 0);
    }
  }, [card])

  return (
    <ClientOnlyPortal selector="#modal-root">
      <div
        ref={ref}
        className={`fixed rounded-t-3xl modal overflow-y-auto max-w-screen-lg mt-4 ${
          modalOpen ? "open" : ""
        }`}
      >
        <>
          <button
            className="fixed flex justify-center items-center left-1/2 -translate-x-2/4 -translate-y-2/4 top-12 z-50 text-2xl"
            aria-label="Close the modal"
            title="Close Modal"
            onClick={() => {
              toggleModal(false);
              document.body.classList.remove("prevent-scroll");
            }}>
            <span className="material-symbols-outlined modal-close">cancel</span>
          </button>
          <div className="flex justify-center items-center relative">
            <div
              className="bg-cover bg-no-repeat blur-sm rounded-t-3xl w-full h-96"
              style={{
                backgroundImage: `url(${card.image_uris?.art_crop})`,
                backgroundPosition: "center 0",
              }}
            ></div>
            <p className="absolute font-bold italic w-1/2 text-center modal-flavor-text">
              {card.flavor_text}
            </p>
          </div>
          <div className="container flex p-8">
            <div className="w-1/2">
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
            <div className="w-full pl-4">
              <h1 className="text-3xl font-bold mb-4">{card?.name}</h1>
              <p className="whitespace-pre-line">{card.oracle_text}</p>
              <div className="w-1/2">
                <Pie
                  data={data}
                  options={{
                    plugins: {
                      legend: {
                        onClick: (e) => null,
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </>
      </div>
    </ClientOnlyPortal>
  );
});

export default Modal;
