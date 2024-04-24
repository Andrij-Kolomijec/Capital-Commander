import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import classes from "./DeleteAccount.module.css";
import Modal from "../common/Modal";
import Button from "../common/Button";
import { deleteUser } from "../../utils/http/user";

export default function DeleteAccount() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
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
      alert("Guest account cannot be deleted!");
    }
  }

  const style = {
    backgroundColor: "#8b0000",
    color: "black",
    margin: "2rem",
    width: "auto",
    alignSelf: "center",
  };

  return (
    <>
      <AnimatePresence>
        {showDeleteDialog && (
          <Modal
            title="Confirm Deletion"
            onClose={() => setShowDeleteDialog(false)}
          >
            <p>Are you sure you want to delete your account? </p>
            <p>This action cannot be undone.</p>
            <div className={classes.buttons}>
              <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
              <Button
                onClick={handleDeletion}
                hoverColor="#ff0000"
                style={{ backgroundColor: "#8b0000", color: "black" }}
              >
                Confirm
              </Button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
      <Button
        style={style}
        hoverColor="#ff0000"
        onClick={() => setShowDeleteDialog(true)}
      >
        Delete account
      </Button>
    </>
  );
}
