import { useState } from "react";
import SearchTicker from "../../components/investing/stocks/SearchTicker";
import classes from "./Stocks.module.css";
import FinancialsTable from "../../components/investing/stocks/FinancialsTable";

export default function Stocks() {
  const [stock, setStock] = useState("");

  return (
    <section className={classes.wrapper}>
      <SearchTicker setStock={setStock} stock={stock} />
      {stock && <FinancialsTable stock={stock} />}
    </section>
  );
}
