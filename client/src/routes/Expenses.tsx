import { useQuery } from "@tanstack/react-query";
import classes from "./Expenses.module.css";
import { fetchExpenses, type ExpenseItem } from "../utils/http";
import MonthlyExpenses from "../components/expenses/MonthlyExpenses";
import InputExpense from "../components/expenses/InputExpense";
import HousingExpenses from "../components/expenses/HousingExpenses";
import TransportationExpenses from "../components/expenses/TransportationExpenses";
import OtherExpenses from "../components/expenses/OtherExpenses";

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
  console.log(data);

  const normalExpenses = data.filter(
    (item) => item.category === "none" || !item.category
  );

  const transportationExpenses = data.filter(
    (item) => item.category && item.category === "transportation"
  );

  const housingExpenses = data.filter(
    (item) => item.category && item.category === "housing"
  );

  const otherExpenses = data.filter(
    (item) => item.category && item.category === "other"
  );

  const monthlyExpenses = groupExpensesByMonth(normalExpenses);

  return (
    <>
      <div className={classes.expenses}>
        {monthlyExpenses.map((month, index) => {
          return <MonthlyExpenses month={month} key={index} />;
        })}
      </div>
      <div className={classes.expenses}>
        <HousingExpenses expenses={housingExpenses} />
        <TransportationExpenses expenses={transportationExpenses} />
        <OtherExpenses expenses={otherExpenses} />
      </div>
      <InputExpense />
    </>
  );
}
