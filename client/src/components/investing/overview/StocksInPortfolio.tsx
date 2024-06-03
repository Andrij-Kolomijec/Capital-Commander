import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import classes from "./StocksInPortfolio.module.css";
import { fetchPortfolio, getTickers } from "../../../utils/http/investing";
import Loader from "../../common/Loader";
import StocksRow from "./StocksRow";
import plusIcon from "../../../assets/icons/plus.svg";
import StocksModal from "./StocksModal";

export type StockProps = {
  ticker: string;
  avgPrice: number;
  quantity: number;
  currentPrice?: number;
};

export default function StocksInPortfolio() {
  const [showModal, setShowModal] = useState(false);

  const { isFetching, isFetched } = useQuery({
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

  if (isFetching && !isFetched) {
    return <Loader />;
  }

  if (!portfolio) {
    return <p>No data available.</p>;
  }

  function handleCancel(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    setShowModal(false);
  }

  return (
    <motion.div
      variants={{
        visible: {
          scale: 1,
          opacity: 1,
          transition: { staggerChildren: 0.03 },
        },
        hidden: { scale: 0, opacity: 0 },
      }}
      initial="hidden"
      animate="visible"
      layout
      className={classes.table}
    >
      <img
        src={plusIcon}
        alt="Plus Icon"
        tabIndex={0}
        className={classes["plus-icon"]}
        onClick={() => setShowModal(true)}
        onKeyDown={(e) => e.key === "Enter" && setShowModal(true)}
      />
      <StocksModal
        show={showModal}
        setShow={setShowModal}
        onClick={handleCancel}
        title="Add Stock"
        leftButtonText="Cancel"
        rightButtonText="Add"
      />
      <motion.div layout className={classes.header}>
        <h4>Ticker</h4>
        <h4>Quantity</h4>
        <h4>Buy Price</h4>
        <h4>Current Price</h4>
        <h4>Profit</h4>
      </motion.div>
      {portfolio.map((item: StockProps) => (
        <StocksRow stock={item} key={item.ticker} />
      ))}
    </motion.div>
  );
}
