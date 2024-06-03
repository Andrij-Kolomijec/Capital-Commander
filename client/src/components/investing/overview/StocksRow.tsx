import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import classes from "./StocksRow.module.css";
import { getTickers, deleteTicker } from "../../../utils/http/investing";
import { type TickerProps } from "../stocks/SearchTicker";
import { type StockProps } from "./StocksInPortfolio";
import editIcon from "../../../assets/icons/edit.svg";
import Icon from "../../header/Icon";
import StocksModal from "./StocksModal";

export default function StocksRow({ stock }: { stock: StockProps }) {
  const [mouseHovered, setMouseHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { data } = useQuery({
    queryKey: ["tickers"],
    queryFn: getTickers,
    staleTime: 1000 * 60 * 60 * 24 * 2,
    placeholderData: [],
  });

  const queryClient = useQueryClient();

  const { mutate: deleteStock } = useMutation({
    mutationFn: deleteTicker,
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["portfolio"],
      });
      const previousPortfolio = queryClient.getQueryData([
        "portfolio",
      ]) as StockProps[];
      queryClient.setQueryData(
        ["portfolio"],
        previousPortfolio!.filter((i) => i.ticker !== stock.ticker)
      );
      return { previousPortfolio };
    },
    onError: (error, data, context) => {
      if (error) {
        console.error("Mutation failed:", error);
        console.log("Data passed to mutation:", data);
      }
      queryClient.setQueryData(["portfolio"], context!.previousPortfolio);
    },
  });

  function findCurrentPrice(ticker: string) {
    const stock = data.find((item: TickerProps) => item.symbol === ticker);
    return +stock.lastsale.replace("$", "");
  }

  const currentPrice = findCurrentPrice(stock.ticker);
  const profit = Math.round((currentPrice / stock.avgPrice - 1) * 1000) / 10;

  function handleDelete(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    setShowModal(false);
    deleteStock(stock.ticker);
  }

  function handleOpenEdit() {
    setShowModal(true);
    setTimeout(() => setMouseHovered(false), 100);
  }

  function handleIconKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleOpenEdit();
    }
  }

  return (
    <motion.div
      key={stock.ticker}
      variants={{
        visible: {
          opacity: 1,
          scale: [0.8, 1.1, 1],
          transition: { duration: 0.5 },
        },
      }}
      exit={{ x: 50, opacity: 0, transition: { duration: 0.2 } }}
      transition={{ type: "spring" }}
      layout
      className={classes.row}
      onMouseEnter={() => setMouseHovered(true)}
      onMouseLeave={() => setMouseHovered(false)}
    >
      <StocksModal
        show={showModal}
        setShow={setShowModal}
        stock={stock}
        onClick={handleDelete}
        title="Edit Stock"
        leftButtonText="Delete"
        rightButtonText="Done"
      />
      <Icon
        src={editIcon}
        alt="Edit Icon"
        tabIndex={0}
        title="Edit"
        className={`${classes.edit} ${
          mouseHovered ? classes.visible : classes.hidden
        }`}
        onClick={handleOpenEdit}
        onKeyDown={handleIconKeyDown}
      />
      <span>{stock.ticker}</span>
      <span>{stock.quantity}</span>
      <span>{stock.avgPrice}</span>
      <span>{currentPrice}</span>
      <span>{profit} %</span>
    </motion.div>
  );
}
