import { StockProps } from "../../components/investing/overview/StocksInPortfolio";
import { getAuthToken } from "../authJWT";
import { type FetchError } from "./user";

const investingURL = import.meta.env.VITE_PORT_MAIN + "investing/";

export async function getTickers() {
  const token = getAuthToken();

  const response = await fetch(investingURL + "stocks/", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  if (!response.ok) {
    const info = await response.json();
    const error = new Error(info.error) as FetchError;
    error.code = response.status;
    error.info = info;
    throw error;
  }

  const { tickers } = await response.json();

  return tickers.data.rows;
}

export async function getStockData(ticker: string) {
  const token = getAuthToken();

  const response = await fetch(investingURL + "stocks/" + ticker, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  if (!response.ok) {
    const info = await response.json();
    const error = new Error(info.error) as FetchError;
    error.code = response.status;
    error.info = info;
    throw error;
  }

  const { financials } = await response.json();

  return financials;
}

export async function fetchPortfolio() {
  const token = getAuthToken();

  const response = await fetch(investingURL, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  if (!response.ok) {
    const error = new Error(
      "An error occurred while fetching portfolio."
    ) as FetchError;
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { portfolio } = await response.json();

  return portfolio[0].stocks;
}

export async function updatePortfolio({
  ticker,
  avgPrice,
  quantity,
}: StockProps) {
  const token = getAuthToken();

  const response = await fetch(investingURL, {
    method: "PATCH",
    body: JSON.stringify({ ticker, avgPrice, quantity }),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });

  if (!response.ok) {
    const error = new Error(
      "An error occurred while updating portfolio."
    ) as FetchError;
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return response.json();
}

export async function deleteTicker(ticker: string) {
  const token = getAuthToken();

  const response = await fetch(investingURL, {
    method: "DELETE",
    body: JSON.stringify({ ticker }),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });

  if (!response.ok) {
    const error = new Error(
      "An error occurred while deleting ticker."
    ) as FetchError;
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return response.json();
}
