import { useQuery } from "@tanstack/react-query";
import classes from "./Expenses.module.css";
import fetchExpenses, { type ExpenseItem } from "../utils/http";
import dateFormatter from "../utils/dateFormatter";

function groupExpensesByMonth(expenses: ExpenseItem[]) {
  const expensesByMonth: ExpenseItem[][] = [];
  expenses.forEach((expense) => {
    const date = new Date(expense.date);
    const month = date.getMonth();
    if (!expensesByMonth[month]) {
      expensesByMonth[month] = [];
    }
    expensesByMonth[month].push(expense);
  });
  return expensesByMonth.reverse();
}

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

export default function Expenses() {
  const { data, isFetching } = useQuery({
    queryKey: ["expenses"],
    queryFn: fetchExpenses,
    staleTime: 1000 * 60 * 1,
    placeholderData: { expenses: [] },
  });

  if (isFetching) {
    return <p>Loading...</p>;
  }

  console.log(data!.expenses);

  const monthlyExpenses = groupExpensesByMonth(data!.expenses);
  console.log(monthlyExpenses);

  return (
    <div className={classes.expenses}>
      {monthlyExpenses.map((month, index) => {
        const [groceries, total, miscellaneous] = calculateAmounts(month);
        return (
          <table key={index}>
            <thead>
              <tr>
                <th scope="col">Groceries</th>
                <th scope="col">Misc</th>
                <th scope="col">Total</th>
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
                  <tr key={expense._id}>
                    <td>{dateFormatter(expense)}</td>
                    <td>{expense.amount}</td>
                    <td title={expense.notes}>{expense.description}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        );
      })}
    </div>
  );
}
