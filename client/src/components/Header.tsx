import { useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
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
    pixelsScrolled.set(0);
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

  // Header animation
  const scrollThreshold = [0, 50];
  const { scrollY } = useScroll();
  const scrollYOnDirectionChange = useRef(scrollY.get());
  const lastScrollDirection = useRef<string | undefined>();
  const lastPixelsScrolled = useRef<number | undefined>();
  const pixelsScrolled = useMotionValue(0);
  const height = useTransform(pixelsScrolled, scrollThreshold, ["10vh", "5vh"]);
  const textHeight = useTransform(pixelsScrolled, scrollThreshold, [
    "50px",
    "30px",
  ]);
  const logoutTop = useTransform(pixelsScrolled, scrollThreshold, [
    "10px",
    "5px",
  ]);
  // const backgroundOpacity = useTransform(
  //   pixelsScrolled,
  //   scrollThreshold,
  //   [1, 0.9]
  // );
  // const backgroundColorTemplate = useMotionTemplate`rgba(141 135 65 / ${backgroundOpacity})`;

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest < 0) return;

    const isScrollingDown = scrollY.getPrevious()! - latest < 0;

    const scrollDirection = isScrollingDown ? "down" : "up";

    const currentPixelsScrolled = pixelsScrolled.get();

    let newPixelsScrolled;

    if (lastScrollDirection.current !== scrollDirection) {
      lastPixelsScrolled.current = currentPixelsScrolled;
      scrollYOnDirectionChange.current = latest;
    }

    if (isScrollingDown) {
      newPixelsScrolled = Math.min(
        lastPixelsScrolled.current! +
          (latest - scrollYOnDirectionChange.current),
        scrollThreshold[1]
      );
    } else {
      newPixelsScrolled = Math.max(
        lastPixelsScrolled.current! -
          (scrollYOnDirectionChange.current - latest),
        scrollThreshold[0]
      );
    }

    pixelsScrolled.set(newPixelsScrolled);
    lastScrollDirection.current! = scrollDirection;
  });

  function handleSwitchPage() {
    pixelsScrolled.set(0);
  }

  return (
    <motion.header
      className={classes.navigation}
      style={{
        height,
        // background: backgroundColorTemplate,
      }}
    >
      <motion.h1 style={{ fontSize: textHeight }} data-text="Capital Commander">
        Capital Commander
      </motion.h1>
      <section className={classes.links}>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? classes.active : undefined)}
          end
          onClick={handleSwitchPage}
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
        <NavLink
          to="/about"
          className={({ isActive }) => (isActive ? classes.active : undefined)}
          end
        >
          {({ isActive }) => (
            <>
              <p>About</p>
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
            onClick={handleSwitchPage}
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
          <NavLink
            to="/expenses"
            className={({ isActive }) =>
              isActive ? classes.active : undefined
            }
            onClick={handleSwitchPage}
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
        )}
      </section>
      {token && (
        <motion.section style={{ top: logoutTop }} className={classes.account}>
          <i>{email}</i>
          <motion.img
            onClick={handleClick}
            src={logoutIcon}
            alt="Logout Icon"
            title="Log Out"
            whileHover={{ scale: 1.5 }}
            whileTap={{ scale: 0.98 }}
            transition={{
              type: "spring",
              duration: 0.1,
              bounce: 0.5,
              // stiffness: 10,
              // mass: 1,
              damping: 1,
            }}
          />
        </motion.section>
      )}
    </motion.header>
  );
}
