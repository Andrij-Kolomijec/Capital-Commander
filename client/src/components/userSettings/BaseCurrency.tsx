// import classes from "./BaseCurrency.module.css";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeBaseCurrency } from "../../utils/http/user";

export default function BaseCurrency() {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: changeBaseCurrency,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["currency"],
        exact: true,
      });
      alert("Base currency changed successfully!");
    },
  });

  function handleChangeBaseCurrency(e: React.ChangeEvent<HTMLSelectElement>) {
    e.preventDefault();
    mutate({ baseCurrency: e.target.value });
  }

  return (
    <div>
      <select
        name="base-currency"
        id="base-currency"
        onChange={handleChangeBaseCurrency}
        defaultValue={localStorage.getItem("baseCurrency")!}
      >
        <option value="CZK">CZK</option>
        <option value="EUR">EUR</option>
        <option value="USD">USD</option>
      </select>
    </div>
  );
}
