import { useMutation, useQueryClient } from "@tanstack/react-query";
import classes from "./InputExpense.module.css";
import { ExpenseItem, createExpense } from "../../utils/http";

export default function InputExpense() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["expenses"],
        exact: true,
      });
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    // const data = Object.fromEntries(formData);
    const data: ExpenseItem = {
      description: formData.get("description") as string,
      date: new Date(formData.get("date") as string),
      amount: Number(formData.get("amount")),
      notes: formData.get("notes") as string | undefined,
      category: formData.get("category") as string | undefined,
    };

    mutate({ ...data });
  }

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <div>
        <label htmlFor="expense-date">Date</label>
        <input id="expense-date" type="date" name="date" />
      </div>
      <div>
        <label htmlFor="expense-amount">Amount</label>
        <input id="expense-amount" type="number" name="amount" />
      </div>
      <div>
        <label htmlFor="expense-description">Description</label>
        <input id="expense-description" type="text" name="description" />
      </div>
      <div>
        <label htmlFor="expense-notes">Notes</label>
        <input id="expense-notes" type="text" name="notes" />
      </div>
      <div>
        <label htmlFor="expense-category">Category</label>
        <select name="category" id="expense-category">
          <option value="none">--Optional--</option>
          <option value="housing">Housing</option>
          <option value="transportation">Transportation</option>
          <option value="other">Miscellaneous</option>
        </select>
      </div>
      <button disabled={isPending}>
        {isPending ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
