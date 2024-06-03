import Portfolio from "../../components/investing/overview/Portfolio";
import Totals from "../../components/investing/overview/Totals";
import classes from "./Overview.module.css";

export default function Overview() {
  return (
    <section className={classes.overview}>
      <Portfolio />
      <Totals />
    </section>
  );
}
