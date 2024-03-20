import { NavLink } from "react-router-dom";
import classes from "./Header.module.css";

export default function Header() {
  return (
    <header>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/expenses">Expenses</NavLink>
    </header>
  );
}
