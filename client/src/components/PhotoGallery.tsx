import classes from "./PhotoGallery.module.css";

import calculator from "../assets/images/calculator.jpg";
import calendar from "../assets/images/calendar.jpg";
import car from "../assets/images/car.jpg";
import chart from "../assets/images/chart.jpg";
import clock from "../assets/images/clock.jpg";
import laptop from "../assets/images/laptop.jpg";
import globe from "../assets/images/globe.jpg";
import server from "../assets/images/server.jpg";

export default function PhotoGallery() {
  return (
    <div className={classes.wrapper}>
      <section className={classes.gallery}>
        <img src={calculator} alt="Calculator" />
        <img src={calendar} alt="Calendar" />
        <img src={laptop} alt="Laptop" />
        <img src={globe} alt="Globe" />
        <img src={clock} alt="Clock" />
        <img src={car} alt="Car" />
        <img src={chart} alt="Chart" />
        <img src={server} alt="Server" />
      </section>
    </div>
  );
}
