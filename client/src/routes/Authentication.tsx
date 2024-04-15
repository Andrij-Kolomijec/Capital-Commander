import { useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import classes from "./Authentication.module.css";
import { AuthData, authenticate, type FetchError } from "../utils/http";
import Button from "../components/Button";

export default function Authentication() {
  const [searchParams /*, setSearchParams*/] = useSearchParams();
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

  /* Trying to animate form itself by adding layout to 
  form, email div and password div (to prevent distortion)
  causes border-radius to behave strangely. */

  return (
    <motion.section
      // layout
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      className={classes["form-wrapper"]}
    >
      <form className={classes.form} onSubmit={handleAuth}>
        <div>
          <label htmlFor="auth-email">Email</label>
          <input
            ref={email}
            type="email"
            id="auth-email"
            name="email"
            placeholder="Type your username"
            required
          />
        </div>
        <div>
          <label htmlFor="auth-password">Password</label>
          <input
            ref={pass}
            type="password"
            id="auth-password"
            name="password"
            placeholder="Type your password"
            required
          />
        </div>
        {!isLogin && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
          >
            <label htmlFor="auth-confirm-password">Confirm password</label>
            <input
              type="password"
              id="auth-confirm-password"
              name="passwordConfirm"
              placeholder="Type the password again"
              required
            />
          </motion.div>
        )}
        <div className={classes.buttons}>
          <Button disabled={isPending}>
            {isPending ? "Logging in..." : isLogin ? "Log In" : "Sign Up"}
          </Button>
          {isLogin && (
            <Button onClick={handleGuestLogin} disabled={isPending}>
              Log in as a Guest
            </Button>
          )}
        </div>
        {isLogin ? (
          <p>
            Don't have an account yet? <br /> Click{" "}
            <Link className="link" to="?mode=signup">
              here
            </Link>{" "}
            to sign up.
          </p>
        ) : (
          <p>
            Already have an account? <br /> Click{" "}
            <Link className="link" to="?mode=login">
              here
            </Link>{" "}
            to log in.
          </p>
        )}
      </form>
      {isError && (
        <p className={classes.error}>{(error as FetchError).info.error}</p>
      )}
    </motion.section>
  );
}
