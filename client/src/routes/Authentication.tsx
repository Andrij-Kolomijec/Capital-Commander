import { useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import classes from "./Authentication.module.css";
import { AuthData, authenticate, type FetchError } from "../utils/http/user";
import Button from "../components/common/Button";
import hide from "../assets/hide.svg";
import show from "../assets/show.svg";

export default function Authentication() {
  const [searchParams /*, setSearchParams*/] = useSearchParams();
  const [passwordType, setPasswordType] = useState<"password" | "text">(
    "password"
  );
  const isLogin = searchParams.get("mode") === "login";
  const navigate = useNavigate();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: authenticate,
    onSuccess: () => {
      navigate("/expenses");
    },
  });

  function handleAuth(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setPasswordType("password");

    const formData = new FormData(e.currentTarget);
    const userData = Object.fromEntries(formData);

    mutate({ userData, mode: searchParams.get("mode") } as AuthData);
  }

  const email = useRef<HTMLInputElement>(null);
  const pass = useRef<HTMLInputElement>(null);

  function handleGuestLogin() {
    email.current!.value = "guest@test.org";
    pass.current!.value = import.meta.env.VITE_PORT_GUEST;
  }

  function togglePasswordType(
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) {
    e.preventDefault();
    setPasswordType((prev) => (prev === "password" ? "text" : "password"));
  }

  /* Trying to animate form itself by adding layout to 
  form, email div and password div (to prevent distortion)
  causes border-radius to behave strangely. */

  const section = {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0 },
  };

  const inputFields = {
    hidden: { opacity: 0, scale: 0 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <motion.section
      // layout
      variants={section}
      initial="hidden"
      animate="visible"
      transition={{
        when: "beforeChildren",
        staggerChildren: 0.05,
      }}
      className={classes["form-wrapper"]}
    >
      <form className={classes.form} onSubmit={handleAuth}>
        <motion.div
          variants={inputFields}
          whileFocus={{ display: "none" }}
          className={classes.input}
        >
          <input
            ref={email}
            type="email"
            id="auth-email"
            name="email"
            placeholder=""
            required
          />
          <label htmlFor="auth-email">Email</label>
        </motion.div>
        <motion.div variants={inputFields} className={classes.input}>
          <input
            ref={pass}
            type={passwordType}
            id="auth-password"
            name="password"
            placeholder=""
            required
          />
          <label htmlFor="auth-password">Password</label>
          {!isPending && (
            <img
              src={passwordType === "password" ? hide : show}
              title={
                passwordType === "password" ? "Show password" : "Hide password"
              }
              onClick={togglePasswordType}
              className={classes["password-toggle"]}
            />
          )}
        </motion.div>
        {!isLogin && (
          <motion.div variants={inputFields} className={classes.input}>
            <input
              type={passwordType}
              id="auth-confirm-password"
              name="passwordConfirm"
              placeholder=""
              required
            />
            <label htmlFor="auth-confirm-password">Confirm password</label>
          </motion.div>
        )}
        <motion.div
          layout
          variants={inputFields}
          transition={{
            type: "spring",
            duration: 0.2,
            bounce: 0,
            stiffness: 150,
          }}
          className={classes["checkbox-container"]}
        >
          <input type="checkbox" id="remember-me" name="rememberMe" />
          <label htmlFor="remember-me">
            <span className={classes["custom-checkbox"]}></span>
            Remember me
          </label>
        </motion.div>
        <motion.div variants={inputFields} className={classes.buttons}>
          <Button disabled={isPending} loader={isPending}>
            {isPending ? "Logging in..." : isLogin ? "Log In" : "Sign Up"}
          </Button>
          {isLogin && (
            <Button onClick={handleGuestLogin} disabled={isPending}>
              Log in as a Guest
            </Button>
          )}
        </motion.div>
        {isLogin ? (
          <motion.p variants={inputFields}>
            Don't have an account yet? <br /> Click{" "}
            <Link className="link" to="?mode=signup">
              here
            </Link>{" "}
            to sign up.
          </motion.p>
        ) : (
          <motion.p variants={inputFields}>
            Already have an account? <br /> Click{" "}
            <Link className="link" to="?mode=login">
              here
            </Link>{" "}
            to log in.
          </motion.p>
        )}
      </form>
      {isError && (
        <p className={classes.error}>{(error as FetchError).info.error}</p>
      )}
    </motion.section>
  );
}
