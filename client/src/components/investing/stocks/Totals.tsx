import { useQuery } from "@tanstack/react-query";
import classes from "./Totals.module.css";
import { fetchPortfolio, getTickers } from "../../../utils/http/investing";
import { type TickerProps } from "./SearchTicker";
import { type StockProps } from "../overview/StocksInPortfolio";

export default function Totals() {
  const {
    data: portfolio,
    isFetching: fetchingPortfolio,
    isFetched: fetchedPortfolio,
  } = useQuery({
    queryKey: ["portfolio"],
    queryFn: fetchPortfolio,
    staleTime: 1000 * 60 * 5,
    placeholderData: [],
  });

  const {
    data: tickers,
    isFetching: fetchingTickers,
    isFetched: fetchedTickers,
  } = useQuery({
    queryKey: ["tickers"],
    queryFn: getTickers,
    staleTime: 1000 * 60 * 60 * 24 * 2,
    placeholderData: [],
  });

  if (
    (fetchingPortfolio && !fetchedPortfolio) ||
    (fetchingTickers && !fetchedTickers)
  ) {
    return;
  }

  function findCurrentPrice(ticker: string) {
    const stock = tickers.find((item: TickerProps) => item.symbol === ticker);
    return +stock.lastsale.replace("$", "");
  }

  const marketValue = portfolio.reduce((acc: number, item: StockProps) => {
    return item.quantity * findCurrentPrice(item.ticker) + acc;
  }, 0);

  const totalChange =
    (marketValue /
      portfolio.reduce((acc: number, item: StockProps) => {
        return item.quantity * item.avgPrice + acc;
      }, 0) -
      1) *
    100;

  return (
    <section className={classes.totals}>
      <div>
        <h4>Market value</h4>
        <p>
          {(Math.round(marketValue * 100) / 100).toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </p>
      </div>
      <div>
        <h4>Returns</h4>
        <p>{Math.round(totalChange * 100) / 100} %</p>
      </div>
    </section>
  );
}
