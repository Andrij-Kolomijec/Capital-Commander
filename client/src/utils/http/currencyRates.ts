import { type FetchError } from "./user";

export type CurrencyData = {
  date: Date;
  base: string;
  EUR: number;
  USD: number;
};

async function fetchRatesFromAPI() {
  const response = await fetch(import.meta.env.VITE_PORT_RATES);

  if (!response.ok) {
    const error = new Error(
      "An error occurred while fetching current currency data."
    ) as FetchError;
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { rates } = await response.json();

  return rates;
}

async function updateCurrencyRates({ date, base, EUR, USD }: CurrencyData) {
  const response = await fetch(import.meta.env.VITE_PORT_MAIN + "currency/", {
    method: "PATCH",
    body: JSON.stringify({ date, base, EUR, USD }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = new Error(
      "An error occurred while updating currency data."
    ) as FetchError;
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { rates } = await response.json();

  console.log(rates);

  return rates;
}

async function fetchRatesFromDB() {
  const response = await fetch(import.meta.env.VITE_PORT_MAIN + "currency/");

  if (!response.ok) {
    const error = new Error(
      "An error occurred while fetching currency data."
    ) as FetchError;
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

  if (timeDifference > 1000 * 60 * 60 * 12) {
    const apiRates = await fetchRatesFromAPI();
    const allowed = ["EUR", "USD"];
    const filteredRates = Object.fromEntries(
      Object.entries(apiRates).filter(([key]) => allowed.includes(key))
    );

    const response = await updateCurrencyRates({
      date: new Date(),
      base: "CZK",
      EUR: filteredRates.EUR as number,
      USD: filteredRates.USD as number,
    });
    console.log(response);

    return response;
  }

  return dbRates;
}
