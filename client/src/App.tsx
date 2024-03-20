import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./routes/Home";
import Expenses from "./routes/Expenses";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "expenses", element: <Expenses /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
