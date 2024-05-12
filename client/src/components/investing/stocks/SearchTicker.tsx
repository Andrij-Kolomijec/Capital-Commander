import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["tickers"],
    queryFn: getTickers,
    staleTime: 1000 * 60 * 60 * 24 * 2,
    placeholderData: [],
  });

  const { data: history } = useQuery<string[]>({
    queryKey: ["history"],
    queryFn: () => [],
    staleTime: 1000 * 60 * 60 * 2,
    gcTime: 1000 * 60 * 60 * 2,
    placeholderData: [],
  });

  const { mutate } = useMutation({
    mutationFn: async (ticker: string) => {
      await queryClient.cancelQueries({
        queryKey: ["history"],
      });
      const prevHistory = queryClient.getQueryData<string[]>(["history"]) || [];
      const newHistory = [ticker, ...prevHistory.filter((i) => i !== ticker)];
      return queryClient.setQueryData(["history"], newHistory);
    },
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
    if (canSubmit || history?.includes(symbol.toUpperCase())) {
      setInputValue(symbol.toUpperCase());
      setStock(symbol.toUpperCase().replace("/", "."));
      setSuggestions([]);
      !history?.includes(symbol.toUpperCase()) && setCanSubmit(false);
      mutate(symbol);
    } else {
      alert("Please wait a minute before submitting another request!");
    }
  }

  return (
    <div className={classes.wrapper}>
      {!canSubmit && (
        <ProgressBar
          stock={stock}
          canSubmit={canSubmit}
          setCanSubmit={setCanSubmit}
        />
      )}
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
      {history!.length > 0 && (
        <ul className={classes.history}>
          <h4>Search history</h4>
          {history!.map((ticker) => {
            return (
              <li key={ticker} onClick={(e) => handleSubmit(e, ticker)}>
                {ticker}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
