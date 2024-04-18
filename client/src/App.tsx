import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Layout from "./components/Layout";
import Home from "./routes/Home";
import Expenses from "./routes/Expenses";
import Authentication from "./routes/Authentication";
import About from "./routes/About";
import Error from "./routes/Error";
import UserSettings from "./routes/UserSettings";
import { blockAuthIfLoggedIn, checkAuthLoader } from "./utils/authJWT";
import Account from "./components/userSettings/Account";
import ExpensesSettings from "./components/userSettings/ExpensesSettings";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <Error />,
    children: [
      { index: true, element: <Home /> },
      { path: "expenses", element: <Expenses />, loader: checkAuthLoader },
      {
        path: "authentication",
        element: <Authentication />,
        loader: blockAuthIfLoggedIn,
      },
      { path: "about", element: <About /> },
      {
        path: "settings",
        element: <UserSettings />,
        loader: checkAuthLoader,
        children: [
          { index: true, element: <Account /> },
          { path: "expenses", element: <ExpensesSettings /> },
        ],
      },
    ],
  },
]);

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
