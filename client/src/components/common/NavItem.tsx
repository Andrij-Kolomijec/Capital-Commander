import { motion } from "framer-motion";
import classes from "./NavItem.module.css";

const variants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};

export default function NavItem({ children }: { children: React.ReactNode }) {
  return (
    <motion.div variants={variants} className={classes.wrapper} tabIndex={-1}>
      {children}
    </motion.div>
  );
}
