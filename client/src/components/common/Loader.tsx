import classes from "./Loader.module.css";

export default function Loader() {
  return (
    <div className={classes.wrapper}>
      <span className={classes.loader}></span>
    </div>
  );
}
