import { Outlet } from "react-router-dom";
import LinkNav from "../../components/common/LinkNav";
import NavItem from "../../components/common/NavItem";
import SideNav from "../../components/common/SideNav";
import classes from "./Investing.module.css";

export default function Investing() {
  return (
    <div className={classes.wrapper}>
      <SideNav>
        <NavItem>
          <LinkNav to="/investing/stocks" text="Stocks" />
        </NavItem>
        <NavItem>
          <LinkNav to="/investing/etfs" text="ETFs" />
        </NavItem>
        <NavItem>
          <LinkNav to="/investing/options" text="Options" />
        </NavItem>
      </SideNav>
      <Outlet />
    </div>
  );
}
