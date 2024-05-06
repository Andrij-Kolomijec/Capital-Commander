import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import classes from "./Header.module.css";
import {
  getAuthEmail,
  getAuthToken,
  getTokenDuration,
} from "../../utils/authJWT";
import { logout } from "../../utils/http/user";
import logoutIcon from "../../assets/icons/logout.svg";
import cogIcon from "../../assets/icons/cog.svg";
import Icon from "./Icon";
import LinkNav from "../common/LinkNav";

export default function Header() {
  const token = getAuthToken();
  const email = getAuthEmail();
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const location = useLocation();

  const { mutate } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["expenses"] });
      navigate("/authentication?mode=login");
    },
  });

  function handleLogout() {
    mutate();
    pixelsScrolled.set(0);
  }

  function handleGoToSettings() {
    navigate("/settings");
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

  useEffect(() => {
    handleSwitchPage();
  }, [location]);

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
        <LinkNav to="/" text="Home" />
        <LinkNav to="/about" text="About" />
        {!token ? (
          <LinkNav to="/authentication?mode=login" text="Authentication" />
        ) : (
          <>
            <LinkNav to="/expenses" text="Expenses" />
            <LinkNav to="/investing" text="Investing" />
          </>
        )}
      </section>
      {token && (
        <motion.section style={{ top: logoutTop }} className={classes.account}>
          <i>{email}</i>
          <Icon
            onClick={handleGoToSettings}
            src={cogIcon}
            alt="Settings Icon"
            title="Settings"
          />
          <Icon
            onClick={handleLogout}
            src={logoutIcon}
            alt="Logout Icon"
            title="Log Out"
          />
        </motion.section>
      )}
    </motion.header>
  );
}
