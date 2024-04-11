import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import classes from "./PopUp.module.css";

type ModalProps = {
  title?: React.ReactNode;
  children: React.ReactNode;
};

export default function PopUp({ title, children }: ModalProps) {
  return createPortal(
    <motion.div
      className={classes.popup}
      initial={{ opacity: 0, y: -30 }}
      exit={{ opacity: 0.5, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ bounce: 0.4, duration: 0.5, type: "spring" }}
    >
      {title && <h2>{title}</h2>}
      <p>{children}</p>
    </motion.div>,
    document.getElementById("modal") as Element
  );
}
