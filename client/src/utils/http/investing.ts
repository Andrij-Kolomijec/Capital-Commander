import { getAuthToken } from "../authJWT";
import { type FetchError } from "./user";

export async function getTickers() {
  const token = getAuthToken();

  const response = await fetch(
    import.meta.env.VITE_PORT_MAIN + "investing/stocks/",
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  if (!response.ok) {
    const error = new Error(
      "An error occurred while fetching tickers."
    ) as FetchError;
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { tickers } = await response.json();

  return tickers.data.rows;
}

export async function getStockData(ticker: string) {
  const token = getAuthToken();

  const response = await fetch(
    import.meta.env.VITE_PORT_MAIN + "investing/stocks/" + ticker,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  if (!response.ok) {
    const error = new Error(
      "An error occurred while fetching stock data."
    ) as FetchError;
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { financials } = await response.json();

  return financials;
}
