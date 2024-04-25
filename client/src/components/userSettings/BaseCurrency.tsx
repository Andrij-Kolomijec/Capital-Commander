import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { changeBaseCurrency } from "../../utils/http/user";
import Select from "../common/Select";
import Modal from "../common/Modal";
import Button from "../common/Button";

export default function BaseCurrency() {
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: changeBaseCurrency,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["currency"],
        exact: true,
      });
      setShowModal(true);
    },
  });

  function handleChangeBaseCurrency(e: React.ChangeEvent<HTMLSelectElement>) {
    e.preventDefault();
    mutate({ baseCurrency: e.target.value });
  }

  return (
    <div>
      <AnimatePresence>
        {showModal && (
          <Modal title="Base Currency" onClose={() => setShowModal(false)}>
            <p>Base currency changed successfully!</p>
            <Button
              onClick={() => setShowModal(false)}
              style={{ width: "50%" }}
            >
              Close
            </Button>
          </Modal>
        )}
      </AnimatePresence>
      <Select
        name="base-currency"
        id="base-currency"
        onChange={handleChangeBaseCurrency}
        defaultValue={localStorage.getItem("baseCurrency")!}
      />
    </div>
  );
}
