import { useQuery } from "@tanstack/react-query";
import classes from "./Summary.module.css";
import { fetchExpenses } from "../../utils/http/expense";
import Loader from "../common/Loader";
import calendar from "../../assets/calendar-month.svg";
import housing from "../../assets/housing.svg";
import transportation from "../../assets/transportation.svg";
import miscellaneous from "../../assets/miscellaneous.svg";

export default function Summary({ multiplier = 1, currency = "CZK" }) {
  const { data, isFetching, isFetched } = useQuery({
    queryKey: ["expenses"],
    queryFn: fetchExpenses,
    staleTime: 1000 * 60 * 10,
    placeholderData: [],
  });

  if (isFetching && !isFetched) {
    return <Loader />;
  }

  if (!data) {
    return <p>No data available.</p>;
  }

  const currentMonth = new Date().getMonth() + 1;

  const sum1 =
    data
      .filter((item) => item.category === "none")
      .reduce((total, item) => {
        return total + item.amount;
      }, 0) * multiplier;

  const sum2 =
    data
      .filter((item) => item.category !== "housing")
      .reduce((total, item) => {
        return total + item.amount;
      }, 0) * multiplier;

  const sum3 =
    data
      .filter((item) => item.category === "housing")
      .reduce((total, item) => {
        return total + item.amount;
      }, 0) * multiplier;

  const locale = currency === "USD" ? "en-US" : "cs-CZ";

  return (
    <section className={classes.summary}>
      <h4>Monthly Summary</h4>
      <div title="Groceries + Other, Transportation, Miscellaneous, Housing">
        <span className={classes.icons}>
          <img
            src={calendar}
            alt="Groceries + Other"
            title="Groceries + Other"
          />
          <img
            src={transportation}
            alt="Transportation"
            title="Transportation"
          />
          <img src={miscellaneous} alt="Miscellaneous" title="Miscellaneous" />
          <img src={housing} alt="Housing" title="Housing" />
        </span>
        <p>
          {(sum2 / currentMonth + sum3).toLocaleString(locale, {
            style: "currency",
            currency: currency,
          })}
        </p>
      </div>

      <div title="Groceries + Other, Transportation, Miscellaneous">
        <span className={classes.icons}>
          <img
            src={calendar}
            alt="Groceries + Other"
            title="Groceries + Other"
          />
          <img
            src={transportation}
            alt="Transportation"
            title="Transportation"
          />
          <img src={miscellaneous} alt="Miscellaneous" title="Miscellaneous" />
        </span>
        <p>
          {(sum2 / currentMonth).toLocaleString(locale, {
            style: "currency",
            currency: currency,
          })}
        </p>
      </div>
      <div title="Groceries + Other">
        <span className={classes.icons}>
          <img
            src={calendar}
            alt="Groceries + Other"
            title="Groceries + Other"
          />
        </span>
        <p>
          {(sum1 / currentMonth).toLocaleString(locale, {
            style: "currency",
            currency: currency,
          })}
        </p>
      </div>
    </section>
  );
}
