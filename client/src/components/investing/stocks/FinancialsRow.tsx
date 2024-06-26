import {
  fundamentalParametersExplanation,
  fundamentalsColorsExplanation,
  getTooltipAttributes,
} from "../../../utils/tooltips";

type FinancialsRowProps = {
  name: string;
  item: string | number | React.ReactNode;
};

export default function FinancialsRow({ name, item }: FinancialsRowProps) {
  const tooltipExplanationProps = getTooltipAttributes(
    fundamentalParametersExplanation[name]
  );

  const tooltipValuesProps = getTooltipAttributes(
    fundamentalsColorsExplanation[name]
  );

  const style = {
    color: "black",
    width: "fit-content",
    minWidth: "3rem",
    // cursor: "help",
  };
  const good = "rgb(0, 100, 0)";
  const acceptable = "rgb(180, 100, 0)";
  const bad = "rgb(140, 0, 0)";

  if (name === "ROIC > WACC") {
    return (
      <>
        <td {...tooltipExplanationProps}>{name}</td>
        <td
          style={{ color: (item as string).includes(">") ? good : bad }}
          {...tooltipValuesProps}
        >
          {item}
        </td>
      </>
    );
  }

  if (typeof item === "string") {
    item = item.replace(",", "");
  }

  if (item === null || item === undefined || item === "-" || isNaN(+item)) {
    return (
      <>
        <td {...tooltipExplanationProps}>{name}</td>
        <td {...tooltipValuesProps}>-</td>
      </>
    );
  }

  item = Number(item);

  switch (name) {
    case "PE Ratio":
      style.color =
        item! > 8 && item < 10 ? good : item < 15 ? acceptable : bad;
      break;
    case "Shiller PE Ratio":
      style.color = item < 15 ? good : item < 20 ? acceptable : bad;
      break;
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
    case "PS Ratio":
      style.color = item < 3 ? good : bad;
      break;
    case "Price-to-Tangible-Book":
      style.color = item < 1.5 ? good : bad;
      break;
    case "Dividend Yield %":
      style.color = item > 4 ? good : bad;
      break;
    case "Dividend Payout Ratio":
      style.color = item < 1 ? good : bad;
      break;
    case "Shares Buyback Ratio %":
      style.color = item > 0 ? good : bad;
      break;
    case "ROE %":
      style.color = item > 15 ? good : bad;
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
    case "Net Margin %":
      style.color =
        item > 10 && item < 20
          ? good
          : item > 5 && item < 30
          ? acceptable
          : bad;
      break;
    case "EPS without NRI":
      style.color = item > 5 ? good : item > 3 ? acceptable : bad;
      break;
  }

  return (
    <>
      <td {...tooltipExplanationProps}>{name}</td>
      <td>
        <p style={style} {...tooltipValuesProps}>
          {item}
        </p>
      </td>
    </>
  );
}
