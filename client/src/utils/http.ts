export type ExpenseItem = {
  _id: number;
  description: string;
  date: Date;
  amount: number;
  notes?: string;
};

type FetchError = {
  code: number;
  info: string;
};

export default async function fetchExpenses(): Promise<{
  expenses: ExpenseItem[];
}> {
  const url = import.meta.env.VITE_PORT_MAIN + "expenses";

  const response = await fetch(url);

  if (!response.ok) {
    const error: FetchError = {
      code: response.status,
      info: "An error occurred while fetching data.",
    };
    throw error;
  }

  const expenses: { expenses: ExpenseItem[] } = await response.json();

  return expenses;
}
