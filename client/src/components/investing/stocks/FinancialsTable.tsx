import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Tooltip } from "react-tooltip";
import classes from "./FinancialsTable.module.css";
import Loader from "../../common/Loader";
import { getStockData, getTickers } from "../../../utils/http/investing";
import { TickerProps } from "./SearchTicker";
import CalculatedFinancials from "./CalculatedFinancials";
import FinancialsRow from "./FinancialsRow";
import ChartROE, { type ChartROEProps } from "./ChartROE";
import {
  fundamentalsColorsExplanation,
  getTooltipAttributes,
} from "../../../utils/tooltips";

export type FinancialsProps = Record<string, string | number>;

export default function FinancialsTable({ stock }: { stock: string }) {
  const {
    data: tickers,
    error: tickersError,
    isError: tickersIsError,
  } = useQuery({
    queryKey: ["tickers"],
    queryFn: getTickers,
    staleTime: 1000 * 60 * 60 * 24 * 2,
    placeholderData: [],
  });

  const { data, isFetching, isFetched, error, isError } = useQuery({
    queryKey: ["stocks", stock],
    queryFn: () => getStockData(stock),
    staleTime: 1000 * 60 * 60 * 2,
    gcTime: 1000 * 60 * 60 * 2,
    placeholderData: [],
  });

  if (isFetching && !isFetched) {
    return <Loader style={{ marginTop: "15%" }} />;
  }

  if (tickersIsError) {
    return <p className={classes.error}>{(tickersError as Error).message}</p>;
  }

  if (isError) {
    return <p className={classes.error}>{(error as Error).message}</p>;
  }

  const tickerInfo = tickers.filter(
    (ticker: TickerProps) => ticker.symbol === stock.replace(".", "/")
  )[0];

  const financials: FinancialsProps = Object.fromEntries(
    Object.entries(data).filter(([key]) => key !== "ROE")
  ) as FinancialsProps;

  const ROE = Object.fromEntries(
    Object.entries(data).filter(([key]) => key === "ROE")
  ) as ChartROEProps;

  financials["Goodwill / Total Equity"] =
    Math.round(
      ((+(financials["Goodwill"] as string)?.replace(",", "") || 0) /
        +(financials["Total Stockholders Equity"] as string)?.replace(
          ",",
          ""
        )) *
        100
    ) / 100;

  financials["ROIC > WACC"] = `${financials["ROIC %"]} ${
    +financials["ROIC %"] > +financials["WACC %"] ? ">" : "<"
  } ${financials["WACC %"]}`;

  const variants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { opacity: 1, scale: 1 },
  };

  const green = "rgb(0, 100, 0)";
  const red = "rgb(140, 0, 0)";

  return (
    <motion.div
      layout
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className={classes.wrapper}
    >
      <table className={classes.table}>
        <tbody>
          <tr>
            <td>Company</td>
            <td>{tickerInfo.name}</td>
          </tr>
          <tr>
            <td>Symbol</td>
            <td>{tickerInfo.symbol}</td>
          </tr>
          {tickerInfo.sector && (
            <tr>
              <td>Sector</td>
              <td>{tickerInfo.sector}</td>
            </tr>
          )}
          {tickerInfo.industry && (
            <tr>
              <td>Industry</td>
              <td>{tickerInfo.industry}</td>
            </tr>
          )}
          <tr>
            <td>Country</td>
            <td>{tickerInfo.country}</td>
          </tr>
          {tickerInfo.ipoyear && (
            <tr>
              <td>IPO year</td>
              <td>{tickerInfo.ipoyear}</td>
            </tr>
          )}
          <tr>
            <td>Market capitalization</td>
            <td
              style={{
                color: +tickerInfo.marketCap > 500000000 ? green : red,
              }}
              {...getTooltipAttributes(fundamentalsColorsExplanation.marketCap)}
            >
              {(+tickerInfo.marketCap).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
              })}
            </td>
          </tr>
          <tr>
            <td>Stock price</td>
            <td
              style={{
                color:
                  +tickerInfo.lastsale.replace("$", "") >= 30 ? green : red,
              }}
              {...getTooltipAttributes(fundamentalsColorsExplanation.lastsale)}
            >
              {tickerInfo.lastsale}
            </td>
          </tr>
          {Object.keys(financials)
            .filter(
              (key) =>
                key !== "WACC %" && key !== "ROIC %" && key !== "Goodwill"
            )
            .map((key) => {
              return (
                <tr key={key}>
                  <FinancialsRow name={key} item={financials[key]} />
                </tr>
              );
            })}
        </tbody>
      </table>
      <div className={classes.column}>
        <CalculatedFinancials
          price={tickerInfo.lastsale}
          totalStockholdersEquity={financials["Total Stockholders Equity"]}
          sharesOutstanding={financials["Shares Outstanding (Diluted Average)"]}
          PEMedian={financials["PE Ratio (10y Median)"]}
          ROEMedian={financials["ROE (10y Median)"]}
          dividendPayoutRatio={financials["Dividend Payout Ratio"]}
        />
        {ROE && <ChartROE ROE={ROE.ROE} />}
      </div>
      <Tooltip id="tooltip" />
    </motion.div>
  );
}
