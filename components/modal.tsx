import Image from "next/image";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

import ClientOnlyPortal from "./ClientOnlyPortal";
import { forwardRef, MutableRefObject, Ref, RefObject, useEffect } from "react";

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
      <div ref={ref}
        className={`fixed container rounded-t-3xl p-8 modal overflow-y-auto mt-4 ${
          modalOpen ? "open" : ""
        }`}
      >
        <div className="flex">
          <div className="w-1/2">
            {card && 
            <Image
              className="w-full"
              src={card.image_uris?.png}
              width={100}
              height={100}
              alt={`${card.name} Card`}
            />}
          </div>
          <div className="w-full pl-4">
            <h1 className="text-3xl font-bold mb-4">{card?.name}</h1>
            <p className="whitespace-pre-line">{card.oracle_text}</p>
            <p className="italic">{card.flavor_text}</p>
            <div className="w-1/2">
              <Pie data={data} options={{
                plugins: {
                  legend: {
                    onClick: e => null
                  }
                }
              }} />
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            toggleModal(false);
            document.body.classList.remove("prevent-scroll");
          }}
        >
          Close
        </button>
      </div>
    </ClientOnlyPortal>
  );
});

export default Modal;
