// import classes from './CurrencyConverter.module.css';
import { useQuery } from "@tanstack/react-query";
import { getCurrencyRates } from "../../utils/http/currencyRates";

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

  return (
    <div>
      <label htmlFor="currency-converter">Convert currency</label>
      <select
        name="currency"
        id="currency-converter"
        onChange={handleChangeCurrency}
        defaultValue={localStorage.getItem("baseCurrency") || data[0]?.base}
      >
        <option value="CZK">CZK</option>
        <option value="EUR">EUR</option>
        <option value="USD">USD</option>
      </select>
    </div>
  );
}
