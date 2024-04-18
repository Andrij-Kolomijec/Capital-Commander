import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import classes from "./PasswordChange.module.css";
import {
  type PasswordData,
  changePassword,
  type FetchError,
} from "../../utils/http";
import Button from "../common/Button";
import hide from "../../assets/hide.svg";
import show from "../../assets/show.svg";

export default function PasswordChange() {
  const [passwordType, setPasswordType] = useState<"password" | "text">(
    "password"
  );

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      alert("Password changed successfully!");
    },
  });

  function handlePassChange(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const passwordData = Object.fromEntries(formData);

    mutate({ passwordData } as PasswordData);
  }

  function togglePasswordType(
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) {
    e.preventDefault();
    setPasswordType((prev) => (prev === "password" ? "text" : "password"));
  }

  return (
    <>
      <form className={classes.form} onSubmit={handlePassChange}>
        <div className={classes.input}>
          <input
            id="password-old"
            type={passwordType}
            name="passwordOld"
            placeholder=""
          />
          <label htmlFor="password-old">Current password</label>
          <img
            src={passwordType === "password" ? hide : show}
            title={
              passwordType === "password" ? "Show passwords" : "Hide passwords"
            }
            onClick={togglePasswordType}
            className={classes["password-toggle"]}
          />
        </div>
        <div className={classes.input}>
          <input
            id="password-new"
            type={passwordType}
            name="passwordNew"
            placeholder=""
          />
          <label htmlFor="password-new">New password</label>
        </div>
        <div className={classes.input}>
          <input
            id="password-new-confirm"
            type={passwordType}
            name="passwordNewConfirm"
            placeholder=""
          />
          <label htmlFor="password-new-confirm">Confirm new password</label>
        </div>
        <Button disabled={isPending} loader={isPending}>
          {isPending ? "Processing..." : "Submit"}
        </Button>
      </form>
      {isError && (
        <motion.p
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className={classes.error}
        >
          {(error as FetchError).info.error}
        </motion.p>
      )}
    </>
  );
}
