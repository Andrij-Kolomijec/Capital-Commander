import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import classes from "./LinkNav.module.css";

type LinkProps = {
  onClick?: (() => void) | undefined;
  to: string;
  text: string;
};

export default function LinkNav({ onClick = undefined, to, text }: LinkProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive ? `${classes.active} ${classes.link}` : classes.link
      }
      end
      onClick={onClick}
    >
      {({ isActive }) => (
        <>
          <motion.p layout>{text}</motion.p>
          {isActive && (
            <motion.div
              layoutId="tab-indicator"
              className={classes["active-tab-indicator"]}
            />
          )}
        </>
      )}
    </NavLink>
  );
}
