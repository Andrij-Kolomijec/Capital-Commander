import classes from "./Footer.module.css";
import github from "../assets/github.svg";

export default function Footer() {
  return (
    <footer className={classes.footer}>
      <a href="https://github.com/Andrij-Kolomijec">
        <img src={github} alt="GitHub Icon" title="More of my work" />
      </a>
      <span>
        Background image from&nbsp;
        <a
          title="Visit website"
          className="link"
          href="https://www.pexels.com/photo/empty-brown-canvas-235985/"
        >
          Pexels
        </a>
      </span>
    </footer>
  );
}
