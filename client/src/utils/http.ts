import { getAuthToken } from "./authJWT";

export type ExpenseItem = {
  _id?: number;
  description: string;
  date: Date;
  amount: number;
  notes?: string;
  category?: string;
};

export type FetchError = Error & {
  code: number;
  info: string;
};

export type AuthData = {
  userData: {
    email: string;
    password: string;
    passwordConfirm?: string;
  };
  mode: string;
};

const expensesURL = import.meta.env.VITE_PORT_MAIN + "expenses/";

export async function fetchExpenses(): Promise<ExpenseItem[]> {
  const token = getAuthToken();

  const response = await fetch(expensesURL, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

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
  const token = getAuthToken();

  const response = await fetch(expensesURL, {
    method: "POST",
    body: JSON.stringify(expenseData),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
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
  const token = getAuthToken();

  const response = await fetch(expensesURL + id, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
    },
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

export async function authenticate({ userData, mode }: AuthData) {
  const url = import.meta.env.VITE_PORT_MAIN + "authentication/" + mode;

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(userData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = new Error(
      "An error occurred while authenticating."
    ) as FetchError;
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.json();
  const token = resData.token;
  const email = resData.email;

  localStorage.setItem("token", token);
  localStorage.setItem("email", email);

  const expiration = new Date();
  expiration.setHours(expiration.getHours() + 12);
  localStorage.setItem("expiration", expiration.toISOString());
}

export async function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("email");
  localStorage.removeItem("expiration");
}
