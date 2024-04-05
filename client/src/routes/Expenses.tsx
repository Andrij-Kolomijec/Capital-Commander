import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import classes from "./Expenses.module.css";
import { fetchExpenses, type ExpenseItem } from "../utils/http";
import MonthlyExpenses from "../components/expenses/MonthlyExpenses";
import InputExpense from "../components/expenses/InputExpense";
import HousingExpenses from "../components/expenses/HousingExpenses";
import TransportationExpenses from "../components/expenses/TransportationExpenses";
import OtherExpenses from "../components/expenses/OtherExpenses";
import PopUp from "../components/PopUp";
import { AnimatePresence } from "framer-motion";

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
  const [showTooltip, setShowTooltip] = useState(false);
  const [scrollValue, setScrollValue] = useState<number | null>(null);
  const [tooltipDisplayed, setTooltipDisplayed] = useState(false);

  useEffect(() => {
    if (showTooltip && !tooltipDisplayed) {
      const timer = setTimeout(() => {
        setShowTooltip(false);
        setTooltipDisplayed(true);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showTooltip, tooltipDisplayed]);

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

  function handleShowScrollTooltip(e: React.WheelEvent<HTMLDivElement>) {
    const currentTime = new Date().getTime();
    const expirationTime = new Date(
      localStorage.getItem("expiration")!
    ).getTime();
    const differenceInHours = (expirationTime - currentTime) / (1000 * 60 * 60);

    const currentScrollValue = e.currentTarget.scrollLeft;

    if (
      !tooltipDisplayed &&
      scrollValue &&
      scrollValue !== currentScrollValue
    ) {
      setTooltipDisplayed(true);
    } else if (
      scrollValue === currentScrollValue &&
      differenceInHours > 11.5 &&
      !tooltipDisplayed
    ) {
      setShowTooltip(!showTooltip);
    } else if (!tooltipDisplayed) {
      setScrollValue(currentScrollValue);
    } else {
      return;
    }
  }

  return (
    <>
      <AnimatePresence>
        {showTooltip && (
          <PopUp children="Hold shift + scroll to scroll horizontally." />
        )}
      </AnimatePresence>
      <div className={classes["expenses-wrapper"]}>
        <div className={classes.expenses}>
          <div
            className={classes["expenses-row"]}
            onWheel={handleShowScrollTooltip}
          >
            {monthlyExpenses.map((month, index) => {
              return <MonthlyExpenses month={month} key={index} />;
            })}
          </div>
          <div className={classes["expenses-row"]}>
            <HousingExpenses expenses={housingExpenses} />
            <TransportationExpenses expenses={transportationExpenses} />
            <OtherExpenses expenses={otherExpenses} />
          </div>
        </div>
        <InputExpense />
      </div>
    </>
  );
}
