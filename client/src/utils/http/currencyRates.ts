import { getAuthToken } from "../authJWT";
import { type FetchUserError } from "./user";

export type CurrencyData = {
  date: Date;
  base: string;
  CZK: number;
  EUR: number;
  USD: number;
};

async function fetchRatesFromAPI(base: string) {
  const token = getAuthToken();

  const response = await fetch(
    import.meta.env.VITE_PORT_RATES +
      base +
      import.meta.env.VITE_PORT_RATES_KEY,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  if (!response.ok) {
    const error = new Error(
      "An error occurred while fetching current currency data."
    ) as FetchUserError;
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { rates } = await response.json();

  return rates;
}

async function updateCurrencyRates({
  date,
  base,
  CZK,
  EUR,
  USD,
}: CurrencyData) {
  const token = getAuthToken();

  const response = await fetch(import.meta.env.VITE_PORT_MAIN + "currency/", {
    method: "PATCH",
    body: JSON.stringify({ date, base, CZK, EUR, USD }),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });

  if (!response.ok) {
    const error = new Error(
      "An error occurred while updating currency data."
    ) as FetchUserError;
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { rates } = await response.json();

  return rates;
}

async function fetchRatesFromDB() {
  const token = getAuthToken();

  const response = await fetch(import.meta.env.VITE_PORT_MAIN + "currency/", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  if (!response.ok) {
    const error = new Error(
      "An error occurred while fetching currency data."
    ) as FetchUserError;
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { rates } = await response.json();

  return rates;
}

export async function getCurrencyRates() {
  const dbRates = await fetchRatesFromDB();
  const dbTime = new Date(dbRates[0].date);
  const currentTime = new Date();
  const timeDifference = currentTime.getTime() - dbTime.getTime();

  if (timeDifference > 1000 * 60 * 60 * 6) {
    const base = localStorage.getItem("baseCurrency") || "CZK";
    const apiRates = await fetchRatesFromAPI(base);
    const allowed = ["CZK", "EUR", "USD"];
    const filteredRates = Object.fromEntries(
      Object.entries(apiRates).filter(([key]) => allowed.includes(key))
    );

    const response = await updateCurrencyRates({
      date: new Date(),
      base,
      CZK: filteredRates.CZK as number,
      EUR: filteredRates.EUR as number,
      USD: filteredRates.USD as number,
    });

    return response;
  }

  return dbRates;
}
