import { useMutation, useQueryClient } from "@tanstack/react-query";
import classes from "./MonthlyExpenses.module.css";
import { deleteExpense, type ExpenseItem } from "../../utils/http";
import TableRow from "./TableRow";

export default function TransportationExpenses({
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

  const monthlySum = expenses.reduce((total, item) => {
    return total + +item.amount;
  }, 0);

  const gas = expenses.reduce((total, item) => {
    return total + +(item.description === "gas" && item.amount);
  }, 0);

  return (
    <table className={classes.table}>
      <caption>Transportation</caption>
      <thead>
        <tr>
          <th scope="col">Year</th>
          <th scope="col">Month</th>
          <th scope="col">Gas</th>
        </tr>
        <tr>
          <th scope="col">{monthlySum}</th>
          <th scope="col">{(monthlySum / 12).toFixed(0)}</th>
          <th scope="col">{gas}</th>
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
