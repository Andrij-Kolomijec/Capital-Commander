import { useMutation, useQueryClient } from "@tanstack/react-query";
import classes from "./MonthlyExpenses.module.css";
import { deleteExpense, type ExpenseItem } from "../../utils/http";
import TableRow from "./TableRow";

export default function OtherExpenses({
  expenses,
}: {
  expenses: ExpenseItem[];
}) {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });

  function handleDelete(id: number) {
    mutate({ id });
  }

  const sum = expenses.reduce((total, item) => {
    return total + +item.amount;
  }, 0);

  return (
    <table className={classes.table}>
      <caption>Miscellaneous</caption>
      <thead>
        <tr>
          <th scope="col">Total</th>
          <th scope="col">{sum}</th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        {expenses.map((expense) => {
          return (
            <TableRow
              key={expense._id}
              expense={expense}
              onDelete={handleDelete}
            />
          );
        })}
      </tbody>
    </table>
  );
}
