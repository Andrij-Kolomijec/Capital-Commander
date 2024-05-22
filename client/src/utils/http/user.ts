import { getAuthToken } from "../authJWT";

export type FetchUserError = Error & {
  code: number;
  info: { error: string };
};

export type AuthData = {
  userData: {
    email: string;
    password: string;
    passwordConfirm?: string;
    rememberMe?: "on";
  };
  mode: string;
};

export type PasswordData = {
  passwordData: {
    passwordOld: string;
    passwordNew: string;
    passwordNewConfirm: string;
  };
};

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
    ) as FetchUserError;
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.json();
  const token = resData.token;
  const email = resData.email;
  const baseCurrency = resData.baseCurrency;

  localStorage.setItem("token", token);
  localStorage.setItem("email", email);
  localStorage.setItem("baseCurrency", baseCurrency);

  const expiration = new Date();
  expiration.setHours(expiration.getHours() + (userData.rememberMe ? 168 : 12));
  localStorage.setItem("expiration", expiration.toISOString());
}

export async function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("email");
  localStorage.removeItem("expiration");
  localStorage.removeItem("baseCurrency");
}

export async function changePassword({ passwordData }: PasswordData) {
  const token = getAuthToken();

  const response = await fetch(import.meta.env.VITE_PORT_MAIN + "settings/", {
    method: "POST",
    body: JSON.stringify(passwordData),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });

  if (!response.ok) {
    const error = new Error(
      "An error occurred while changing the password."
    ) as FetchUserError;
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return response.json();
}

export async function deleteUser() {
  const token = getAuthToken();

  const response = await fetch(import.meta.env.VITE_PORT_MAIN + "settings/", {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  if (!response.ok) {
    const error = new Error(
      "An error occurred while deleting the user."
    ) as FetchUserError;
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  logout();

  return response.json();
}

export async function changeBaseCurrency({
  baseCurrency,
}: {
  baseCurrency: string;
}) {
  const token = getAuthToken();

  const response = await fetch(
    import.meta.env.VITE_PORT_MAIN + "settings/expenses/",
    {
      method: "POST",
      body: JSON.stringify({ baseCurrency }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }
  );

  if (!response.ok) {
    const error = new Error(
      "An error occurred while changing base currency."
    ) as FetchUserError;
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  localStorage.setItem("baseCurrency", baseCurrency);

  return response.json();
}
