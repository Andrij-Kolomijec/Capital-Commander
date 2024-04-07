import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import classes from "./Header.module.css";
import { getAuthEmail, getAuthToken, getTokenDuration } from "../utils/authJWT";
import { logout } from "../utils/http";
import logoutIcon from "../assets/logout.svg";

export default function Header() {
  const token = getAuthToken();
  const email = getAuthEmail();
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["expenses"] });
      navigate("/authentication?mode=login");
    },
  });

  function handleClick() {
    mutate();
  }

  useEffect(() => {
    if (!token) {
      return;
    }
    if (token === "EXPIRED") {
      mutate();
      return;
    }
    const tokenDuration = getTokenDuration();

    setTimeout(() => {
      mutate();
    }, tokenDuration);
  }, [token, mutate]);

  return (
    <header className={classes.navigation}>
      <h1 data-text="Capital Commander">Capital Commander</h1>
      <section className={classes.links}>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? classes.active : undefined)}
          end
        >
          {({ isActive }) => (
            <>
              <p>Home</p>
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  className={classes["active-tab-indicator"]}
                />
              )}
            </>
          )}
        </NavLink>
        {!token ? (
          <NavLink
            to="/authentication?mode=login"
            className={({ isActive }) =>
              isActive ? classes.active : undefined
            }
          >
            {({ isActive }) => (
              <>
                <p>Authentication</p>
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className={classes["active-tab-indicator"]}
                  />
                )}
              </>
            )}
          </NavLink>
        ) : (
          <>
            <NavLink
              to="/expenses"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
            >
              {({ isActive }) => (
                <>
                  <p>Expenses</p>
                  {isActive && (
                    <motion.div
                      layoutId="tab-indicator"
                      className={classes["active-tab-indicator"]}
                    />
                  )}
                </>
              )}
            </NavLink>
          </>
        )}
      </section>
      {token && (
        <section className={classes.account}>
          <i>{email}</i>
          <img
            onClick={handleClick}
            src={logoutIcon}
            alt="Logout Icon"
            title="Log Out"
          />
        </section>
      )}
    </header>
  );
}
