import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import classes from "./Account.module.css";
import { deleteUser } from "../../utils/http";
import Button from "../common/Button";
import PasswordChange from "./PasswordChange";

export default function Account() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["expenses"] });
      navigate("/authentication?mode=signup");
    },
  });

  function handleDeletion() {
    if (localStorage.getItem("email") !== "guest@test.org") {
      mutate();
    } else {
      alert("Cannot delete guest account!");
    }
  }

  const style = {
    backgroundColor: "red",
    color: "black",
  };

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };
  return (
    <>
      <motion.fieldset
        variants={variants}
        initial="hidden"
        animate="visible"
        className={`${classes.fieldset} ${classes.password}`}
      >
        <legend>Change password</legend>
        <PasswordChange />
      </motion.fieldset>
      <motion.fieldset
        variants={variants}
        initial="hidden"
        animate="visible"
        className={`${classes.fieldset} ${classes.delete}`}
      >
        <legend>Delete account</legend>
        <Button style={style} onClick={handleDeletion}>
          Delete account
        </Button>
      </motion.fieldset>
    </>
  );
}
