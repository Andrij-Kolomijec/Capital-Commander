import { redirect } from "react-router-dom";

export function getAuthEmail() {
  const email = localStorage.getItem("email");

  return email || null;
}

export function getAuthToken() {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  // const tokenDuration = getTokenDuration();

  // if (tokenDuration < 0) {
  //   return "EXPIRED";
  // }

  return token;
}

export function getTokenDuration() {
  const storedExpirationDate = localStorage.getItem("expiration");
  const expirationDate = new Date(storedExpirationDate!);
  const now = new Date();
  const duration = expirationDate.getTime() - now.getTime();
  return duration;
}

// route protection via loader - to not display
// the pages(new, edit) to unauthorized users
export function checkAuthLoader() {
  const token = getAuthToken();

  if (!token) {
    return redirect("/authentication");
  }

  // loaders must at least return null (not undefined)
  return null;
}
