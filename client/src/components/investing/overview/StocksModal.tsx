import { AnimatePresence } from "framer-motion";
import classes from "./StocksModal.module.css";
import Modal from "../../common/Modal";
import Button from "../../common/Button";
import { StockProps } from "./StocksInPortfolio";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTickers, updatePortfolio } from "../../../utils/http/investing";
import { useState } from "react";
import { TickerProps } from "../stocks/SearchTicker";

type StockModalProps = {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  stock?: StockProps | null;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  title: string;
  leftButtonText: string;
  rightButtonText: string;
};

export default function StocksModal({
  show,
  setShow,
  stock = null,
  onClick,
  title,
  leftButtonText,
  rightButtonText,
}: StockModalProps) {
  const [inputValue, setInputValue] = useState(stock?.ticker || "");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { data } = useQuery({
    queryKey: ["tickers"],
    queryFn: getTickers,
    staleTime: 1000 * 60 * 60 * 24 * 2,
    placeholderData: [],
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: updatePortfolio,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["portfolio"],
      });
      setShow(false);
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    // const data = Object.fromEntries(formData);
    const data = {
      ticker: formData.get("ticker"),
      avgPrice: Number(formData.get("avgPrice")),
      quantity: Number(formData.get("quantity")),
    };
    mutate(data as StockProps);
  }

  const style = {
    width: "70px",
  };

  function handleSuggest(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setInputValue(value);
    if (value.length > 0) {
      const filteredSuggestions = data.filter((suggestion: TickerProps) =>
        suggestion.symbol.toUpperCase().startsWith(value.toUpperCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  }

  function handleSelectSuggestion(
    e: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) {
    const value = e.currentTarget.innerText;
    setInputValue(value);
  }

  function handleFocus() {
    setShowSuggestions(true);
  }

  function handleBlur() {
    setTimeout(() => setShowSuggestions(false), 100);
  }

  return (
    <AnimatePresence>
      {show && (
        <Modal onClose={() => setShow(false)} title={title}>
          <form className={classes.form} onSubmit={handleSubmit}>
            <div
              className={`${classes["form-row"]} ${classes["ticker-input"]}`}
            >
              <label htmlFor="ticker">Ticker</label>
              <input
                type="text"
                id="ticker"
                name="ticker"
                value={inputValue}
                onChange={handleSuggest}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              {suggestions.length > 0 && showSuggestions && (
                <ul className={classes.suggestions}>
                  {suggestions.map((suggestion: TickerProps) => (
                    <li
                      key={suggestion.symbol}
                      value={suggestion.symbol}
                      onClick={handleSelectSuggestion}
                    >
                      {suggestion.symbol}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className={classes["form-row"]}>
              <label htmlFor="quantity">Quantity</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                defaultValue={stock ? stock.quantity : ""}
              />
            </div>
            <div className={classes["form-row"]}>
              <label htmlFor="price">Price</label>
              <input
                type="number"
                id="price"
                name="avgPrice"
                defaultValue={stock ? stock.avgPrice : ""}
              />
            </div>
            <div className={classes.buttons}>
              <div className={classes["left-button"]}>
                <Button type="button" onClick={onClick} style={style}>
                  {leftButtonText}
                </Button>
              </div>
              <div className={classes["right-button"]} style={style}>
                <Button
                  type="submit"
                  style={style}
                  loader={isPending}
                  disabled={isPending}
                >
                  {rightButtonText}
                </Button>
              </div>
            </div>
          </form>
        </Modal>
      )}
    </AnimatePresence>
  );
}
