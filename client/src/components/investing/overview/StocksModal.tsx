import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, stagger, useAnimate, motion } from "framer-motion";
import classes from "./StocksModal.module.css";
import Modal from "../../common/Modal";
import Button from "../../common/Button";
import { StockProps } from "./StocksInPortfolio";
import {
  fetchPortfolio,
  getTickers,
  updatePortfolio,
} from "../../../utils/http/investing";
import { type TickerProps } from "../stocks/SearchTicker";
import { type FetchExpenseError as FetchPortfolioError } from "../../../utils/http/expense";

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
  const [suggestions, setSuggestions] = useState<TickerProps[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [tickerError, setTickerError] = useState(false);

  const { data } = useQuery({
    queryKey: ["tickers"],
    queryFn: getTickers,
    staleTime: 1000 * 60 * 60 * 24 * 2,
    placeholderData: [],
  });

  const { data: portfolio } = useQuery({
    queryKey: ["portfolio"],
    queryFn: fetchPortfolio,
    staleTime: 1000 * 60 * 5,
    placeholderData: [],
  });

  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: updatePortfolio,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["portfolio"],
      });
      setShow(false);
      if (!stock) setInputValue("");
    },
  });

  const [scope, animate] = useAnimate();

  const ticker = useRef<HTMLInputElement>(null);
  const quantity = useRef<HTMLInputElement>(null);
  const avgPrice = useRef<HTMLInputElement | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const filteredData = data.find(
      (suggestion: TickerProps) =>
        suggestion.symbol === inputValue.toUpperCase()
    );
    if (!filteredData) {
      return setTickerError(true);
    }

    if (
      !ticker.current?.value.trim() ||
      !quantity.current?.value.trim() ||
      !avgPrice.current?.value.trim()
    ) {
      animate(
        `input`,
        { x: [8, 0] },
        {
          type: "spring",
          duration: 0.3,
          delay: stagger(0.1, { startDelay: 0.1 }),
        }
      );
    }

    const formData = new FormData(e.currentTarget);
    // const data = Object.fromEntries(formData);
    const inputData = {
      ticker: formData.get("ticker"),
      avgPrice: Number(formData.get("avgPrice")),
      quantity: Number(formData.get("quantity")),
    };

    const prevValues = portfolio.find(
      (stock: StockProps) => stock.ticker === inputData.ticker
    );

    if (prevValues && !stock) {
      inputData.avgPrice =
        Math.round(
          ((prevValues.avgPrice * prevValues.quantity +
            inputData.avgPrice * inputData.quantity) /
            (inputData.quantity + prevValues.quantity)) *
            100
        ) / 100;
      inputData.quantity = prevValues.quantity + inputData.quantity;
    }

    mutate(inputData as StockProps);
    setTickerError(false);
    setSuggestions([]);
  }

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
    setTickerError(false);
  }

  function handleFocus() {
    setShowSuggestions(true);
  }

  function handleBlur() {
    setTimeout(() => setShowSuggestions(false), 100);
  }

  const buttonStyle = {
    width: "70px",
  };

  return (
    <AnimatePresence>
      {show && (
        <Modal onClose={() => setShow(false)} title={title}>
          <form ref={scope} className={classes.form} onSubmit={handleSubmit}>
            <div
              className={`${classes["form-row"]} ${classes["ticker-input"]}`}
            >
              <label htmlFor="ticker">Ticker</label>
              <input
                ref={ticker}
                type="text"
                id="ticker"
                name="ticker"
                autoComplete="off"
                autoFocus
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
                ref={quantity}
                type="number"
                id="quantity"
                name="quantity"
                defaultValue={stock ? stock.quantity : ""}
              />
            </div>
            <div className={classes["form-row"]}>
              <label htmlFor="price">Price</label>
              <input
                ref={avgPrice}
                type="number"
                id="price"
                name="avgPrice"
                defaultValue={stock ? stock.avgPrice : ""}
              />
            </div>
            <div className={classes.buttons}>
              <div className={classes["left-button"]}>
                <Button type="button" onClick={onClick} style={buttonStyle}>
                  {leftButtonText}
                </Button>
              </div>
              <div className={classes["right-button"]} style={buttonStyle}>
                <Button
                  type="submit"
                  style={buttonStyle}
                  loader={isPending}
                  disabled={isPending}
                >
                  {rightButtonText}
                </Button>
              </div>
            </div>
            <div className={classes.errors}>
              {isError && (
                <>
                  {Object.entries(
                    (error as FetchPortfolioError).info.errors
                  ).map((error) => (
                    <motion.p
                      key={error[0]}
                      variants={{
                        hidden: { opacity: 0, scale: 0 },
                        visible: { opacity: 1, scale: 1 },
                      }}
                      initial="hidden"
                      animate="visible"
                    >
                      {error[1]}
                    </motion.p>
                  ))}
                </>
              )}
              {tickerError && (
                <motion.p
                  variants={{
                    hidden: { opacity: 0, scale: 0 },
                    visible: { opacity: 1, scale: 1 },
                  }}
                  initial="hidden"
                  animate="visible"
                >
                  Invalid ticker.
                </motion.p>
              )}
            </div>
          </form>
        </Modal>
      )}
    </AnimatePresence>
  );
}
