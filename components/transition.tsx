import { FC, ReactNode } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface TransitionProps {
  children?: ReactNode;
  className?: string;
}

const Transition: FC<TransitionProps> = ({ children, className }) => {
  const shouldReduceMotion = useReducedMotion();
  return (
    <AnimatePresence>
      <motion.div
        className={className}
        initial={{ 
          y: 100, 
          opacity: 0
        }}
        whileInView={{ 
          y: 0, 
          opacity: 1
        }}
        viewport={{ once: true }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default Transition;
