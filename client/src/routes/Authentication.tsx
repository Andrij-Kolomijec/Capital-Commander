import { Link, useNavigate, useSearchParams } from "react-router-dom";
import classes from "./Authentication.module.css";
import { useMutation } from "@tanstack/react-query";
import { AuthData, authenticate } from "../utils/http";

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

  return (
    <>
      <form className={classes.form} onSubmit={handleAuth}>
        <label htmlFor="auth-email">Email</label>
        <input type="email" id="auth-email" name="email" required />
        <label htmlFor="auth-password">Password</label>
        <input type="password" id="auth-password" name="password" required />
        <button disabled={isPending}>
          {isPending ? "Submitting..." : isLogin ? "Log In" : "Sign Up"}
        </button>
        {isLogin ? (
          <p>
            Don't have an account? <br /> Click{" "}
            <Link className="clickable" to="?mode=signup">
              here
            </Link>{" "}
            to sign up.
          </p>
        ) : (
          <p>
            Already have an account? <br /> Click{" "}
            <Link className="clickable" to="?mode=login">
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
