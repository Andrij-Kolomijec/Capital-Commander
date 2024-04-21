import { useQuery } from "@tanstack/react-query";
import classes from "./CurrencyConverter.module.css";
import { getCurrencyRates } from "../../utils/http/currencyRates";
import Select from "../common/Select";

type CurrencyConverterProps = {
  setCurrency: (currency: { multiplier: number; currency: string }) => void;
};

export default function CurrencyConverter({
  setCurrency,
}: CurrencyConverterProps) {
  const { data } = useQuery({
    queryKey: ["currency"],
    queryFn: getCurrencyRates,
    staleTime: 1000 * 60 * 10,
    placeholderData: [],
  });

  function handleChangeCurrency(e: React.ChangeEvent<HTMLSelectElement>) {
    setCurrency({
      multiplier: data[0][e.target.value],
      currency: e.target.value,
    });
  }

  const style = {
    margin: "0",
    fontSize: "1rem",
  };

  return (
    <div className={classes.wrapper}>
      <label htmlFor="currency-converter">Convert currency</label>
      <Select
        name="currency"
        id="currency-converter"
        onChange={handleChangeCurrency}
        defaultValue={localStorage.getItem("baseCurrency") || data[0]?.base}
        style={style}
      />
    </div>
  );
}
