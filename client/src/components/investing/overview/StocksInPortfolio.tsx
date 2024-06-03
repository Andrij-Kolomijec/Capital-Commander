import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
    <div className={classes.table}>
      <StocksModal
        show={showModal}
        setShow={setShowModal}
        onClick={handleCancel}
        title="Add Stock"
        leftButtonText="Cancel"
        rightButtonText="Add"
      />
      <div className={classes.header}>
        <h4>Ticker</h4>
        <h4>Quantity</h4>
        <h4>Buy Price</h4>
        <h4>Current Price</h4>
        <h4>Profit</h4>
      </div>
      {portfolio.map((item: StockProps) => (
        <StocksRow stock={item} key={item.ticker} />
      ))}
      <img
        src={plusIcon}
        alt="Plus Icon"
        className={classes["plus-icon"]}
        onClick={() => setShowModal(true)}
      />
    </div>
  );
}
