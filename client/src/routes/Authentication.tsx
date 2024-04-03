import { Link, useNavigate, useSearchParams } from "react-router-dom";
import classes from "./Authentication.module.css";
import { useMutation } from "@tanstack/react-query";
import { AuthData, authenticate } from "../utils/http";
import { useRef } from "react";

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

  return (
    <>
      <form className={classes.form} onSubmit={handleAuth}>
        <label htmlFor="auth-email">Email</label>
        <input ref={email} type="email" id="auth-email" name="email" required />
        <label htmlFor="auth-password">Password</label>
        <input
          ref={pass}
          type="password"
          id="auth-password"
          name="password"
          required
        />
        {!isLogin && (
          <>
            <label htmlFor="auth-confirm-password">Confirm password</label>
            <input
              type="password"
              id="auth-confirm-password"
              name="passwordConfirm"
              required
            />
          </>
        )}
        <button disabled={isPending}>
          {isPending ? "Submitting..." : isLogin ? "Log In" : "Sign Up"}
        </button>
        {isLogin && (
          <button onClick={handleGuestLogin}>Log in as a Guest</button>
        )}
        {isLogin ? (
          <p>
            Don't have an account? <br /> Click{" "}
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
      {isError && <p>{error.info.error}</p>}
    </>
  );
}
