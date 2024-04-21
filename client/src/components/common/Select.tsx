import classes from "./Select.module.css";

export default function Select({ ...props }) {
  return (
    <select className={classes.select} {...props}>
      <option value="CZK">CZK</option>
      <option value="EUR">EUR</option>
      <option value="USD">USD</option>
    </select>
  );
}
