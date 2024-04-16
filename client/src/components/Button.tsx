import { motion, HTMLMotionProps } from "framer-motion";
import classes from "./Button.module.css";

type ButtonProps = HTMLMotionProps<"button"> &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
    loader?: boolean;
    bgColor?: string;
    color?: string;
  };

export default function Button({
  children,
  loader = false,
  ...props
}: ButtonProps) {
  const transition = {
    type: "spring",
    duration: 0.3,
    bounce: 0.4,
    stiffness: 100,
    mass: 1,
    damping: 10,
  };

  const whileInteraction = !loader
    ? {
        scale: 1.1,
        backgroundColor: "#00b5d4",
      }
    : {};

  const whileTap = !loader ? { scale: 0.98 } : {};

  return (
    <motion.div
      layout
      transition={transition}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      // exit={{ opacity: 0, scale: 0 }}
      className={loader ? classes.loader : ""}
    >
      <motion.button
        className={classes.button}
        // layout
        whileHover={whileInteraction}
        whileFocus={whileInteraction}
        whileTap={whileTap}
        transition={transition}
        // initial={{ opacity: 0, scale: 0 }}
        // animate={{ opacity: 1, scale: 1 }}
        // exit={{ opacity: 0, scale: 0 }}
        {...props}
      >
        {children}
      </motion.button>
    </motion.div>
  );
}
