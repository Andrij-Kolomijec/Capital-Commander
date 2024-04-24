import { createPortal } from "react-dom";
import { HTMLMotionProps, motion } from "framer-motion";
import classes from "./Modal.module.css";

type ModalProps = HTMLMotionProps<"dialog"> &
  React.DialogHTMLAttributes<HTMLDialogElement> & {
    title: React.ReactNode;
    children: React.ReactNode;
    onClose: () => void;
  };

export default function Modal({
  title,
  children,
  onClose,
  ...props
}: ModalProps) {
  return createPortal(
    <>
      <div className={classes.backdrop} onClick={onClose} />
      <motion.dialog
        variants={{
          hidden: { opacity: 0, scale: 0 },
          visible: { opacity: 1, scale: 1 },
        }}
        initial="hidden"
        animate="visible"
        exit="hidden"
        transition={{
          type: "spring",
          duration: 0.2,
          // bounce: 0.4,
          // stiffness: 100,
          // mass: 1,
          // damping: 10,
        }}
        open
        className={classes.modal}
        {...props}
      >
        <h2>{title}</h2>
        {children}
      </motion.dialog>
    </>,
    document.getElementById("modal") as Element
  );
}
