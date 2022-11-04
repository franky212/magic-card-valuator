import { createPortal } from "react-dom";

import ClientOnlyPortal from "./ClientOnlyPortal";

export default function Modal({open}: { open: Function }) {
  return (
    <ClientOnlyPortal selector="#modal-root">
      <div className='fixed bottom-0 container left-0 rounded-md modal'>
        Hello
        <button onClick={() => open(false)}>Close</button>
      </div>
    </ClientOnlyPortal>
   );
}