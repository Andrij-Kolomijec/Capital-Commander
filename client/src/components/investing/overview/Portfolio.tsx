import { motion } from "framer-motion";
import classes from "./Portfolio.module.css";
import StocksInPortfolio from "./StocksInPortfolio";

export default function Portfolio() {
  return (
    <motion.section
      variants={{
        visible: {
          scale: 1,
          opacity: 1,
        },
        hidden: { scale: 0, opacity: 0 },
      }}
      initial="hidden"
      animate="visible"
      className={classes.wrapper}
    >
      <h1>
        <i>Portfolio</i>
      </h1>
      <StocksInPortfolio />
    </motion.section>
  );
}
