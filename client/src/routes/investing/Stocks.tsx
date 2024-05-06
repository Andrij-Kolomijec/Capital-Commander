import { useState } from "react";
import SearchTicker from "../../components/investing/SearchTicker";
import classes from "./Stocks.module.css";
import FinancialsTable from "../../components/investing/FinancialsTable";

export default function Stocks() {
  const [stock, setStock] = useState("");

  return (
    <section className={classes.wrapper}>
      <SearchTicker setStock={setStock} />
      {stock && <FinancialsTable stock={stock} />}
    </section>
  );
}
