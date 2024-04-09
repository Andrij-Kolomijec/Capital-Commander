import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import classes from "./Expenses.module.css";
import MonthlyExpenses from "../components/expenses/MonthlyExpenses";
import InputExpense from "../components/expenses/InputExpense";
import PopUp from "../components/PopUp";
import ExpenseGroup from "../components/expenses/ExpenseGroup";

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
            <MonthlyExpenses />
          </div>
          <div
            className={`${classes["expenses-row"]} ${classes["second-row"]}`}
          >
            <ExpenseGroup key="housing" group="housing" yearly={true} />
            <ExpenseGroup
              key="transportation"
              group="transportation"
              summing="gas"
            />
            <ExpenseGroup key="other" group="other" />
          </div>
        </div>
        <InputExpense />
      </div>
    </>
  );
}
