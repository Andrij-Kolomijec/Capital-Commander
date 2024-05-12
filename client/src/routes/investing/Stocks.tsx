import { useState } from "react";
import { motion } from "framer-motion";
import classes from "./Stocks.module.css";
import SearchTicker from "../../components/investing/stocks/SearchTicker";
import FinancialsTable from "../../components/investing/stocks/FinancialsTable";

export default function Stocks() {
  const [stock, setStock] = useState("");

  const variants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.section
      variants={variants}
      animate="visible"
      initial="hidden"
      className={classes.wrapper}
    >
      <SearchTicker setStock={setStock} stock={stock} />
      {stock && <FinancialsTable stock={stock} />}
    </motion.section>
  );
}
