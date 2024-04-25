import { Outlet } from "react-router-dom";
import classes from "./UserSettings.module.css";
import LinkNav from "../components/common/LinkNav";
import SideNav from "../components/common/SideNav";
import NavItem from "../components/common/NavItem";

export default function UserSettings() {
  return (
    <div className={classes.wrapper}>
      <SideNav>
        <NavItem>
          <LinkNav to="/settings" text="Account" />
        </NavItem>
        <NavItem>
          <LinkNav to="/settings/expenses" text="Expenses settings" />
        </NavItem>
      </SideNav>
      <section className={classes.content}>
        <Outlet />
      </section>
    </div>
  );
}
