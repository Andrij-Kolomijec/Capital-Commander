import { useQuery } from "@tanstack/react-query";
import classes from "./FinancialsTable.module.css";
import Loader from "../common/Loader";
import { getStockData, getTickers } from "../../utils/http/investing";
import { TickerProps } from "./SearchTicker";
import CalculatedFinancials from "./CalculatedFinancials";
import FinancialsRow from "./FinancialsRow";

export type FinancialsProps = Record<string, string | number>;

export default function FinancialsTable({ stock }: { stock: string }) {
  const { data: tickers } = useQuery({
    queryKey: ["tickers"],
    queryFn: getTickers,
    staleTime: 1000 * 60 * 60 * 24 * 2,
    placeholderData: [],
  });

  const { data, isFetching, isFetched } = useQuery({
    queryKey: [stock],
    queryFn: () => getStockData(stock),
    staleTime: 1000 * 60 * 60 * 2,
    placeholderData: [],
  });

  if (isFetching && !isFetched) {
    return <Loader />;
  }

  const tickerInfo = tickers.filter(
    (ticker: TickerProps) => ticker.symbol === stock.replace(".", "/")
  )[0];

  const financials: FinancialsProps = Object.fromEntries(
    Object.entries(data).filter(([key]) => key !== "ROE")
  ) as FinancialsProps;

  console.log(financials);
  // financials["Goodwill / Total Equity"] =
  //   Math.round(
  //     (+(financials["Goodwill"] as string).replace(",", "") /
  //       +(financials["Total Stockholders Equity"] as string).replace(",", "")) *
  //       100
  //   ) / 100;

  return (
    <>
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
                color: +tickerInfo.marketCap > 500000000 ? "green" : "red",
              }}
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
            <td>{tickerInfo.lastsale}</td>
          </tr>
          {Object.keys(financials).map((key) => {
            return (
              <tr key={key}>
                <FinancialsRow name={key} item={financials[key]} />
                {/* <td>{key}</td>
                <td>{financials[key] as React.ReactNode}</td> */}
              </tr>
            );
          })}
        </tbody>
      </table>
      <CalculatedFinancials
        price={tickerInfo.lastsale}
        totalStockholdersEquity={financials["Total Stockholders Equity"]}
        sharesOutstanding={financials["Shares Outstanding (Diluted Average)"]}
        PEMedian={financials["PE Ratio (10y Median)"]}
        ROEMedian={financials["ROE (10y Median)"]}
        dividendPayoutRatio={financials["Dividend Payout Ratio"]}
      />
    </>
  );
}
