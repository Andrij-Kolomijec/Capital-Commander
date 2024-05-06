import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import classes from "./SearchTicker.module.css";
import { getTickers } from "../../utils/http/investing";

type SearchProps = {
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

export default function SearchTicker({ setStock }: SearchProps) {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [canSubmit, setCanSubmit] = useState(true);
  const [progress, setProgress] = useState(0);

  const { data } = useQuery({
    queryKey: ["tickers"],
    queryFn: getTickers,
    staleTime: 1000 * 60 * 60 * 24 * 2,
    placeholderData: [],
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setCanSubmit(true);
      setProgress(0);
    }, 50000);
    return () => clearTimeout(timer);
  }, [canSubmit]);

  useEffect(() => {
    if (!canSubmit) {
      let fillDuration = 12;
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          const newProgress = prevProgress + 100 / fillDuration;
          if (newProgress >= 100) {
            if (fillDuration === 12) {
              fillDuration = 38;
            } else {
              fillDuration = 12;
            }
            return 0;
          }
          return newProgress;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [canSubmit]);

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

  function handleSuggestionClick(symbol: string) {
    if (canSubmit) {
      setInputValue(symbol);
      setStock(symbol.replace("/", "."));
      setSuggestions([]);
      setCanSubmit(false);
    } else {
      alert("Please wait 50 seconds before submitting another request!");
    }
  }

  function handleSuggestionSubmit(
    e: React.FormEvent<HTMLFormElement>,
    symbol: string
  ) {
    e.preventDefault();
    if (canSubmit) {
      setInputValue(symbol.toUpperCase());
      setStock(symbol.toUpperCase().replace("/", "."));
      setSuggestions([]);
      setCanSubmit(false);
    } else {
      alert("Please wait 50 seconds before submitting another request!");
    }
  }

  return (
    <>
      <form
        className={classes.form}
        onSubmit={(e) => handleSuggestionSubmit(e, inputValue)}
      >
        <label htmlFor="search-ticker">Search for Ticker</label>
        <input
          type="text"
          id="search-ticker"
          placeholder="MSFT, AAPL, TSLA..."
          value={inputValue}
          onChange={handleSuggest}
        />
        {suggestions.length > 0 && (
          <ul className={classes.suggestions}>
            {suggestions.map((suggestion: TickerProps, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(suggestion.symbol)}
              >
                {suggestion.symbol}, {suggestion.name}
              </li>
            ))}
          </ul>
        )}
      </form>
      {!canSubmit && (
        <progress className={classes.progressBar} value={progress} max="100" />
      )}
    </>
  );
}
