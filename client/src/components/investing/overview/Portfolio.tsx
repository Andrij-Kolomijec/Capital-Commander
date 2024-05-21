import classes from "./Portfolio.module.css";
import StocksInPortfolio from "./StocksInPortfolio";

export default function Portfolio() {
  return (
    <section className={classes.wrapper}>
      <h1>
        <i>Portfolio</i>
      </h1>
      <StocksInPortfolio />
    </section>
  );
}
