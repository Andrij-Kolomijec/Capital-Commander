import { motion } from "framer-motion";
import classes from "./Icon.module.css";

export default function Icon({ ...props }) {
  return (
    <motion.img
      whileHover={{ scale: 1.5 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        duration: 0.1,
        bounce: 0.5,
        // stiffness: 10,
        // mass: 1,
        damping: 1,
      }}
      className={classes.icon}
      {...props}
    />
  );
}
