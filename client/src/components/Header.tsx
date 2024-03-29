import { NavLink, useNavigate } from "react-router-dom";
import classes from "./Header.module.css";
import { getAuthEmail, getAuthToken } from "../utils/authJWT";
import { logout } from "../utils/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function Header() {
  const token = getAuthToken();
  const email = getAuthEmail();
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["expenses"] });
      navigate("/");
    },
  });

  function handleClick() {
    mutate();
  }
  return (
    <header className={classes.navigation}>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/expenses">Expenses</NavLink>
      {!token ? (
        <NavLink to="/authentication?mode=login">Authentication</NavLink>
      ) : (
        <>
          <button onClick={handleClick}>Logout</button>
          <p>{email}</p>
        </>
      )}
    </header>
  );
}
