import { useRef, useEffect, useState, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  children: ReactNode
  selector: string
}

export default function ClientOnlyPortal({ children, selector }: Props) {
  const ref = useRef();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    ref.current = document.querySelector(selector);
    setMounted(true);
  }, [selector]);

  return mounted ? createPortal(children, ref.current!) : null;
}