import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import classes from "./Expenses.module.css";
import MonthlyExpenses from "../components/expenses/MonthlyExpenses";
import InputExpense from "../components/expenses/InputExpense";
import PopUp from "../components/header/PopUp";
import ExpenseGroup from "../components/expenses/ExpenseGroup";
import Summary from "../components/expenses/Summary";
import { useQuery } from "@tanstack/react-query";
import { fetchExpenses } from "../utils/http/expense";
import Loader from "../components/common/Loader";
import CurrencyConverter from "../components/expenses/CurrencyConverter";

export default function Expenses() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [scrollValue, setScrollValue] = useState<number | null>(null);
  const [tooltipDisplayed, setTooltipDisplayed] = useState(false);
  const [currency, setCurrency] = useState({ multiplier: 1, currency: "CZK" });

  const { isFetching, isFetched } = useQuery({
    queryKey: ["expenses"],
    queryFn: fetchExpenses,
    staleTime: 1000 * 60 * 10,
    placeholderData: [],
  });

  useEffect(() => {
    if (showTooltip && !tooltipDisplayed) {
      const timer = setTimeout(() => {
        setShowTooltip(false);
        setTooltipDisplayed(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showTooltip]);

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
      differenceInHours > 11.9 &&
      !tooltipDisplayed
    ) {
      setShowTooltip(true);
    } else if (!tooltipDisplayed) {
      setScrollValue(currentScrollValue);
    } else {
      return;
    }
  }

  if (isFetching && !isFetched) {
    return <Loader />;
  }

  // working but unusable because of limited row height
  // function handleScroll(e) {
  // if (e.deltaY > 0) {
  //   e.target.scrollLeft += 100;
  // } else if (e.deltaY < 0) {
  //   e.target.scrollLeft -= 100;
  // }
  // e.target.scrollBy({
  //   left: e.deltaY < 0 ? -100 : 100,
  // });
  // }

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
            className={`${classes["expenses-row"]} scrollable`}
            onWheel={handleShowScrollTooltip}
          >
            <MonthlyExpenses multiplier={currency.multiplier} />
          </div>
          <div
            className={`${classes["expenses-row"]} ${classes["second-row"]}`}
          >
            <ExpenseGroup
              key="housing"
              multiplier={currency.multiplier}
              group="housing"
              yearly={true}
            />
            <ExpenseGroup
              key="transportation"
              multiplier={currency.multiplier}
              group="transportation"
              summing="gas"
            />
            <ExpenseGroup
              key="other"
              multiplier={currency.multiplier}
              group="other"
            />
          </div>
        </div>
        <div className={classes.side}>
          <InputExpense multiplier={currency.multiplier} />
          <Summary
            multiplier={currency.multiplier}
            currency={currency.currency}
          />
          <CurrencyConverter setCurrency={setCurrency} />
        </div>
      </div>
    </>
  );
}
