import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
// import classes from "./Account.module.css";
import { deleteUser } from "../../utils/http/user";
import Button from "../common/Button";
import PasswordChange from "./PasswordChange";
import Fieldset from "./Fieldset";

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
    margin: "2rem",
    width: "auto",
    alignSelf: "center",
  };

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };
  return (
    <>
      <Fieldset variants={variants} legend="Change password">
        <PasswordChange />
      </Fieldset>
      <Fieldset variants={variants} legend="Delete account">
        <Button style={style} onClick={handleDeletion}>
          Delete account
        </Button>
      </Fieldset>
    </>
  );
}
