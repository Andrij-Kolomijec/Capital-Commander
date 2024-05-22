import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion, stagger, useAnimate } from "framer-motion";
import classes from "./PasswordChange.module.css";
import {
  type PasswordData,
  changePassword,
  type FetchUserError,
} from "../../utils/http/user";
import Button from "../common/Button";
import hide from "../../assets/icons/hide.svg";
import show from "../../assets/icons/show.svg";
import Modal from "../common/Modal";

export default function PasswordChange() {
  const [passwordType, setPasswordType] = useState<"password" | "text">(
    "password"
  );
  const [showModal, setShowModal] = useState(false);
  const [scope, animate] = useAnimate();
  const oldPassword = useRef<HTMLInputElement | null>(null);
  const newPassword = useRef<HTMLInputElement | null>(null);
  const confirmNewPassword = useRef<HTMLInputElement | null>(null);

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      setShowModal(true);
    },
  });

  function handlePassChange(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (
      !oldPassword.current!.value.trim() ||
      !newPassword.current!.value.trim() ||
      !confirmNewPassword.current!.value.trim()
    ) {
      animate(
        "input",
        { x: [-20, 0, 20, 0] },
        {
          type: "spring",
          duration: 0.3,
          delay: stagger(0.1, { startDelay: 0.1 }),
        }
      );
    }

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
    <div className={classes.wrapper}>
      <AnimatePresence>
        {showModal && (
          <Modal
            title="Password changed successfully."
            onClose={() => setShowModal(false)}
          >
            <Button
              onClick={() => setShowModal(false)}
              style={{ width: "50%" }}
            >
              Close
            </Button>
          </Modal>
        )}
      </AnimatePresence>
      <form ref={scope} className={classes.form} onSubmit={handlePassChange}>
        <div className={classes.input}>
          <input
            id="password-old"
            type={passwordType}
            name="passwordOld"
            placeholder=""
            ref={oldPassword}
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
            ref={newPassword}
          />
          <label htmlFor="password-new">New password</label>
        </div>
        <div className={classes.input}>
          <input
            id="password-new-confirm"
            type={passwordType}
            name="passwordNewConfirm"
            placeholder=""
            ref={confirmNewPassword}
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
          {(error as FetchUserError).info.error}
        </motion.p>
      )}
    </div>
  );
}
