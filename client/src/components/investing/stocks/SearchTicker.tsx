import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import classes from "./SearchTicker.module.css";
import { getTickers } from "../../../utils/http/investing";
import ProgressBar from "./ProgressBar";

type SearchProps = {
  stock: string;
  setStock: React.Dispatch<React.SetStateAction<string>>;
};

export type TickerProps = {
  symbol: string;
  name: string;
  sector: string;
  industry: string;
  country: string;
  ipoyear: string;
  marketCap: string;
  lastsale: string;
};

export default function SearchTicker({ stock, setStock }: SearchProps) {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [canSubmit, setCanSubmit] = useState(true);
  const [history, setHistory] = useState<string[]>([]);

  const { data } = useQuery({
    queryKey: ["tickers"],
    queryFn: getTickers,
    staleTime: 1000 * 60 * 60 * 24 * 2,
    placeholderData: [],
  });

  function handleSuggest(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setInputValue(value);
    if (value.length > 0) {
      const filteredSuggestions = data.filter(
        (suggestion: TickerProps) =>
          suggestion.symbol.toUpperCase().startsWith(value.toUpperCase())
        // || suggestion.name.toLowerCase().includes(value.toLowerCase()) // slows down UI
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  }

  function handleSubmit(
    e:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLLIElement, MouseEvent>,
    symbol: string
  ) {
    e.preventDefault();
    if (canSubmit || history.includes(symbol.toUpperCase())) {
      setInputValue(symbol.toUpperCase());
      setStock(symbol.toUpperCase().replace("/", "."));
      setSuggestions([]);
      !history.includes(symbol.toUpperCase()) && setCanSubmit(false);
      setHistory((prev) => [
        symbol.toUpperCase(),
        ...prev.filter((i) => i !== symbol.toLocaleUpperCase()),
      ]);
    } else {
      alert("Please wait a minute before submitting another request!");
    }
  }

  return (
    <>
      <form
        className={classes.form}
        onSubmit={(e) => handleSubmit(e, inputValue)}
      >
        <label htmlFor="search-ticker">Search for Ticker</label>
        <input
          type="text"
          id="search-ticker"
          placeholder="input ticker symbol"
          value={inputValue}
          onChange={handleSuggest}
        />
        {suggestions.length > 0 && (
          <ul className={classes.suggestions}>
            {suggestions.map((suggestion: TickerProps, index) => (
              <li
                key={index}
                onClick={(e) => handleSubmit(e, suggestion.symbol)}
              >
                {suggestion.symbol}, {suggestion.name}
              </li>
            ))}
          </ul>
        )}
      </form>
      {!canSubmit && (
        <ProgressBar
          stock={stock}
          canSubmit={canSubmit}
          setCanSubmit={setCanSubmit}
        />
      )}
      <ul>
        {history.map((ticker) => {
          return (
            <li key={ticker} onClick={(e) => handleSubmit(e, ticker)}>
              {ticker}
            </li>
          );
        })}
      </ul>
    </>
  );
}
