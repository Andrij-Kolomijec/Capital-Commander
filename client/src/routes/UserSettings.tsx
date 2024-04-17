import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import classes from "./UserSettings.module.css";
import Button from "../components/Button";
import { deleteUser } from "../utils/http";

export default function UserSettings() {
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
    mutate();
  }

  const style = {
    backgroundColor: "red",
    color: "black",
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.settings}>
        <Button style={style} onClick={handleDeletion}>
          Delete account
        </Button>
      </div>
    </div>
  );
}
