import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeBaseCurrency } from "../../utils/http/user";
import Select from "../common/Select";

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
      <Select
        name="base-currency"
        id="base-currency"
        onChange={handleChangeBaseCurrency}
        defaultValue={localStorage.getItem("baseCurrency")!}
      />
    </div>
  );
}
