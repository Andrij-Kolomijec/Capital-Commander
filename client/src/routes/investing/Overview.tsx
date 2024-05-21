import Portfolio from "../../components/investing/overview/Portfolio";
import classes from "./Overview.module.css";

export default function Overview() {
  return (
    <section className={classes.overview}>
      <Portfolio />
    </section>
  );
}
