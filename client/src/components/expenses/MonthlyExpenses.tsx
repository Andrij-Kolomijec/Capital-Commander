import classes from "./MonthlyExpenses.module.css";
import dateFormatter from "../../utils/dateFormatter";
import { type ExpenseItem, deleteExpense } from "../../utils/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function calculateAmounts(items: ExpenseItem[]) {
  const groceries = items.reduce((total, item) => {
    return total + +(item.description === "nákup" && item.amount);
  }, 0);
  const total = items.reduce((total, item) => {
    return total + item.amount;
  }, 0);
  const miscellaneous = total - groceries;
  return [groceries, total, miscellaneous];
}

export default function MonthlyExpenses({ month }: { month: ExpenseItem[] }) {
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

  const [groceries, total, miscellaneous] = calculateAmounts(month);
  return (
    <table className={classes.table}>
      <thead>
        <tr>
          <th scope="col">Groceries</th>
          <th scope="col">Misc</th>
          <th scope="col">Total ({month.length})</th>
        </tr>
        <tr>
          <th scope="col">{groceries}</th>
          <th scope="col">{miscellaneous}</th>
          <th scope="col">{total}</th>
        </tr>
      </thead>
      <tbody>
        {month.map((expense) => {
          return (
            <tr key={expense._id} onClick={() => handleDelete(expense._id!)}>
              <td>{dateFormatter(expense)}</td>
              <td>{expense.amount}</td>
              <td title={expense.notes}>{expense.description}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
