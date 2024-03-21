import { useQuery } from "@tanstack/react-query";
import classes from "./Expenses.module.css";
import { fetchExpenses, type ExpenseItem } from "../utils/http";
import MonthlyExpenses from "../components/expenses/MonthlyExpenses";
import InputExpense from "../components/expenses/InputExpense";

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

export default function Expenses() {
  const { data, isFetching } = useQuery({
    queryKey: ["expenses"],
    queryFn: fetchExpenses,
    staleTime: 1000 * 60 * 1,
    placeholderData: [],
  });

  if (isFetching) {
    return <p>Loading...</p>;
  }

  if (!data) {
    return <p>No data available.</p>;
  }

  const monthlyExpenses = data && groupExpensesByMonth(data);

  return (
    <>
      <div className={classes.expenses}>
        {monthlyExpenses.map((month, index) => {
          return <MonthlyExpenses month={month} key={index} />;
        })}
      </div>
      <InputExpense />
    </>
  );
}
