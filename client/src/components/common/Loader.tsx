import classes from "./Loader.module.css";

type LoaderProps = React.HTMLAttributes<HTMLDivElement>;

export default function Loader(props: LoaderProps) {
  return (
    <div {...props} className={classes.wrapper}>
      <span className={classes.loader}></span>
    </div>
  );
}
