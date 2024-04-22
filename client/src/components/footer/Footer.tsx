import classes from "./Footer.module.css";
import github from "../../assets/icons/github.svg";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className={classes.footer}>
      <motion.a drag href="https://github.com/Andrij-Kolomijec">
        <motion.img
          src={github}
          alt="GitHub Icon"
          title="More of my work"
          drag
          whileDrag={{ scale: 2, rotate: "360deg" }}
          dragConstraints={{
            left: -500,
            right: 500,
            top: -700,
            bottom: 0,
          }}
        />
      </motion.a>
      {/* <span>
        Background image from&nbsp;
        <a
          title="Visit website"
          className="link"
          href="https://www.pexels.com/photo/empty-brown-canvas-235985/"
        >
          Pexels
        </a>
      </span> */}
    </footer>
  );
}
