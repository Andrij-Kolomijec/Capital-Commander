import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Layout from "./components/Layout";
import Home from "./routes/Home";
import Expenses from "./routes/Expenses";
import Authentication from "./routes/Authentication";
import About from "./routes/About";
import Error from "./routes/Error";
import UserSettings from "./routes/settings/UserSettings";
import { blockAuthIfLoggedIn, checkAuthLoader } from "./utils/authJWT";
import Account from "./routes/settings/Account";
import ExpensesSettings from "./components/userSettings/ExpensesSettings";
import Investing from "./routes/investing/Investing";
import InvestingSettings from "./routes/settings/InvestingSettings";
import Overview from "./routes/investing/Overview";
import Stocks from "./routes/investing/Stocks";
import Options from "./routes/investing/Options";
import Commodities from "./routes/investing/Commodities";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <Error />,
    children: [
      { index: true, element: <Home /> },
      { path: "expenses", element: <Expenses />, loader: checkAuthLoader },
      {
        path: "investing",
        element: <Investing />,
        loader: checkAuthLoader,
        children: [
          { index: true, element: <Overview /> },
          { path: "stocks", element: <Stocks /> },
          { path: "options", element: <Options /> },
          { path: "commodities", element: <Commodities /> },
        ],
      },
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
          { path: "investing", element: <InvestingSettings /> },
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
