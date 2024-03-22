import { useMutation, useQueryClient } from "@tanstack/react-query";
import classes from "./MonthlyExpenses.module.css";
import { type ExpenseItem, deleteExpense } from "../../utils/http";
import TableRow from "./TableRow";

export default function HousingExpenses({
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

  return (
    <table className={classes.table}>
      <caption>Housing</caption>
      <thead>
        <tr>
          <th scope="col">Year</th>
          <th scope="col">Month</th>
          <th scope="col"></th>
        </tr>
        <tr>
          <th scope="col">{monthlySum * 12}</th>
          <th scope="col">{monthlySum}</th>
          <th scope="col">Item</th>
        </tr>
      </thead>
      <tbody>
        {expenses.map((expense) => {
          return (
            <TableRow
              key={expense._id}
              expense={expense}
              onDelete={handleDelete}
              housing={true}
            />
          );
        })}
      </tbody>
    </table>
  );
}
