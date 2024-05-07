import classes from "./CalculatedFinancials.module.css";
import { FinancialsProps } from "./FinancialsTable";

export default function CalculatedFinancials(props: FinancialsProps) {
  const { PEMedian, ROEMedian, dividendPayoutRatio = 0 } = props;
  let { price, totalStockholdersEquity, sharesOutstanding } = props;

  price = +(price as string).replace("$", "");
  totalStockholdersEquity = +(totalStockholdersEquity as string).replace(
    ",",
    ""
  );
  sharesOutstanding = +(sharesOutstanding as string).replace(",", "");

  const totalEquityPerShare =
    Math.round((totalStockholdersEquity / sharesOutstanding) * 100) / 100;
  const eps = (totalEquityPerShare * +ROEMedian) / 100;
  const dividend = eps * +dividendPayoutRatio;

  const rows = [
    {
      totalEquityPerShare: Math.round(totalEquityPerShare * 100) / 100,
      eps: Math.round(eps * 100) / 100,
      dividend: Math.round(dividend * 100) / 100,
    },
  ];

  for (let i = 1; i < 7; i++) {
    const prevRow = rows[i - 1];
    const totalEquityPerShare =
      prevRow.totalEquityPerShare + prevRow.eps - prevRow.dividend;
    const eps = (totalEquityPerShare * +ROEMedian) / 100;
    const dividend = eps * +dividendPayoutRatio;
    rows.push({
      totalEquityPerShare: Math.round(totalEquityPerShare * 100) / 100,
      eps: Math.round(eps * 100) / 100,
      dividend: Math.round(dividend * 100) / 100,
    });
  }

  const totalDividend =
    Math.round(
      rows.reduce((total, row) => total + row.dividend, 0) * 0.85 * 100
    ) / 100;
  const estPriceDividend =
    Math.round(
      ((+PEMedian > 25 ? 25 : +PEMedian) * rows[6].eps + totalDividend) * 100
    ) / 100;
  const profitIn7Years = Math.round((estPriceDividend - price) * 100) / 100;
  const profitIn7YearsInPercent =
    Math.round(((estPriceDividend - price) / price) * 100) / 100;
  const yearlyProfitInPercent =
    Math.round(((profitIn7YearsInPercent + 1) ** (1 / 7) - 1) * 10000) / 10000;

  return (
    <>
      <table className={classes["table-first"]}>
        <thead>
          <tr>
            <td>
              <b>Estimates</b>
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Total Equity per Share</td>
            <td>{totalEquityPerShare || "N/A"}</td>
          </tr>
          <tr>
            <td>Total dividend</td>
            <td>{totalDividend || "N/A"}</td>
          </tr>
          <tr>
            <td>Estimated price + dividend</td>
            <td>{estPriceDividend || "N/A"}</td>
          </tr>
          <tr>
            <td>Profit in 7 years</td>
            <td>{profitIn7Years || "N/A"}</td>
          </tr>
          <tr>
            <td>Profit in 7 years in %</td>
            <td>{Math.round(profitIn7YearsInPercent * 100) || "N/A"}</td>
          </tr>
          <tr>
            <td>Yearly profit in %</td>
            <td>{Math.round(yearlyProfitInPercent * 10000) / 100 || "N/A"}</td>
          </tr>
        </tbody>
      </table>
      <table className={classes["table-second"]}>
        <thead>
          <tr>
            <td>Year</td>
            <td>TE per Share</td>
            <td>EPS</td>
            <td>Dividend</td>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            return (
              <tr key={index}>
                <td>{index + 1 || "N/A"}</td>
                <td>{row.totalEquityPerShare || "N/A"}</td>
                <td>{row.eps || "N/A"}</td>
                <td>{row.dividend || "N/A"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
