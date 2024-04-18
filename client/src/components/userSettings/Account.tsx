import { useMutation, useQueryClient } from "@tanstack/react-query";
import classes from "./Account.module.css";
import { useNavigate } from "react-router-dom";
import { deleteUser } from "../../utils/http";
import Button from "../common/Button";

export default function Account() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["expenses"] });
      navigate("/authentication");
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
  return (
    <Button style={style} onClick={handleDeletion}>
      Delete account
    </Button>
  );
}
