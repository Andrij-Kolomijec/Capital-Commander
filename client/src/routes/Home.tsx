import { motion } from "framer-motion";
import classes from "./Home.module.css";
import PhotoGallery from "../components/common/PhotoGallery";

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      className={classes.home}
    >
      <h1>Welcome!</h1>
      <PhotoGallery />
    </motion.div>
  );
}
