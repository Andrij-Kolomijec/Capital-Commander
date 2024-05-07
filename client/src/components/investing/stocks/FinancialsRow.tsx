// import classes from './FinancialsRow.module.css';

type FinancialsRowProps = {
  name: string;
  item: string | number | React.ReactNode;
};

export default function FinancialsRow({ name, item }: FinancialsRowProps) {
  const style = { color: "black" };
  const good = "green";
  const acceptable = "orange";
  const bad = "red";

  if (item === null || item === undefined || item === "-") {
    return (
      <>
        <td>{name}</td>
        <td>-</td>
      </>
    );
  }

  if (typeof item === "string") {
    item = item.replace(",", "");
  }

  item = Number(item);

  switch (name) {
    case "PE Ratio":
      style.color =
        item! > 8 && item < 10 ? good : item < 15 ? acceptable : bad;
      break;
    // case "Shiller PE Ratio":
    //   style.color = item > 8 && item < 10 ? good : item < 15 ? acceptable : bad;
    //   break;
    case "Altman Z-Score":
      style.color = item > 3 ? good : bad;
      break;
    case "Piotroski F-Score":
      style.color = item > 4 ? good : bad;
      break;
    case "Beneish M-Score":
      style.color = item < -2.22 ? good : bad;
      break;
    case "PEG Ratio":
      style.color = item < 0.8 ? good : bad;
      break;
    case "Price-to-Free-Cash-Flow":
      style.color = item < 10 ? good : item < 15 ? acceptable : bad;
      break;
    // case "PS Ratio":
    //   style.color = item > 4 ? good : bad;
    //   break;
    case "Price-to-Tangible-Book":
      style.color = item < 1.5 ? good : bad;
      break;
    case "Dividend Yield %":
      style.color = item > 4 ? good : bad;
      break;
    case "Dividend Payout Ratio":
      style.color = item < 1 ? good : bad;
      break;
    // case "Shares Buyback Ratio %":
    //   style.color = item > 4 ? good : bad;
    //   break;
    case "ROE %":
      style.color = item > 17 ? good : bad;
      break;
    case "Goodwill / Total Equity":
      style.color = item < 0.3 ? good : bad;
      break;
    case "Current Ratio":
      style.color = item > 1.5 ? good : bad;
      break;
    case "Quick Ratio":
      style.color = item > 1 ? good : bad;
      break;
    case "Debt-to-Equity":
      style.color = item < 1 ? good : item < 2 ? acceptable : bad;
      break;
    // case "Net Margin %":
    //   style.color = item > 4 ? good : bad;
    //   break;
    // case "EPS without NRI":
    //   style.color = item > 4 ? good : bad;
    //   break;
    case "WACC %":
      style.color = bad;
      break;
    case "ROIC %":
      style.color = good;
      break;
  }

  return (
    <>
      <td>{name}</td>
      <td style={style}>{item}</td>
    </>
  );
}
