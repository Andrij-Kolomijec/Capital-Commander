import { Outlet } from "react-router-dom";
import classes from "./UserSettings.module.css";
import LinkNav from "../components/common/LinkNav";

export default function UserSettings() {
  return (
    <div className={classes.wrapper}>
      <nav className={classes.navigation}>
        <LinkNav to="/settings" text="Account" />
        <LinkNav to="/settings/expenses" text="Expenses settings" />
      </nav>
      <section className={classes.content}>
        <Outlet />
      </section>
    </div>
  );
}
