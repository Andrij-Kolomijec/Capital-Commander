import { motion } from "framer-motion";
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
  const variants = {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className={classes.wrapper}>
      <motion.section
        variants={variants}
        initial="hidden"
        animate="visible"
        transition={{
          when: "beforeChildren",
          staggerChildren: 0.03,
        }}
        className={classes.gallery}
      >
        <motion.img variants={variants} src={calculator} alt="Calculator" />
        <motion.img variants={variants} src={calendar} alt="Calendar" />
        <motion.img variants={variants} src={laptop} alt="Laptop" />
        <motion.img variants={variants} src={globe} alt="Globe" />
        <motion.img variants={variants} src={clock} alt="Clock" />
        <motion.img variants={variants} src={car} alt="Car" />
        <motion.img variants={variants} src={chart} alt="Chart" />
        <motion.img variants={variants} src={server} alt="Server" />
      </motion.section>
    </div>
  );
}
