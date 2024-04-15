import { motion, HTMLMotionProps } from "framer-motion";
import classes from "./Button.module.css";

type ButtonProps = HTMLMotionProps<"button"> &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
    bgColor?: string;
    color?: string;
  };

export default function Button({ children, ...props }: ButtonProps) {
  return (
    <motion.button
      className={classes.button}
      layout
      whileHover={{
        scale: 1.1,
        backgroundColor: "#00b5d4",
      }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        duration: 0.3,
        bounce: 0.4,
        stiffness: 100,
        mass: 1,
        damping: 10,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
