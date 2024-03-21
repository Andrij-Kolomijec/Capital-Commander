export type ExpenseItem = {
  _id?: number;
  description: string;
  date: Date;
  amount: number;
  notes?: string;
};

type FetchError = Error & {
  code: number;
  info: string;
};

const expensesURL = import.meta.env.VITE_PORT_MAIN + "expenses/";

export async function fetchExpenses(): Promise<ExpenseItem[]> {
  const response = await fetch(expensesURL);

  if (!response.ok) {
    const error = new Error(
      "An error occurred while fetching data."
    ) as FetchError;
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { expenses } = await response.json();

  return expenses;
}

export async function createExpense(expenseData: ExpenseItem) {
  const response = await fetch(expensesURL, {
    method: "POST",
    body: JSON.stringify(expenseData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = new Error(
      "An error occurred while creating the expense."
    ) as FetchError;
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const expense = await response.json();

  return expense;
}

export async function deleteExpense({ id }: { id: number }) {
  const response = await fetch(expensesURL + id, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = new Error(
      "An error occurred while deleting the expense."
    ) as FetchError;
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return response.json();
}
