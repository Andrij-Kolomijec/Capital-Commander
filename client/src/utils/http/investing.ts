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

  const response = await fetch(
    import.meta.env.VITE_PORT_MAIN + "investing/stocks/" + ticker,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

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
