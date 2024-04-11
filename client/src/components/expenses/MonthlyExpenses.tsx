import { AnimatePresence, motion } from "framer-motion";
import classes from "./ExpenseGroup.module.css";
import {
  type ExpenseItem,
  deleteExpense,
  fetchExpenses,
} from "../../utils/http";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import TableRow from "./TableRow";
import Loader from "../Loader";

function calculateAmounts(items: ExpenseItem[]) {
  const groceries = items.reduce((total, item) => {
    return total + +(item.description === "groceries" && item.amount);
  }, 0);
  const total = items.reduce((total, item) => {
    return total + item.amount;
  }, 0);
  const other = total - groceries;
  return [groceries, total, other];
}

function groupExpensesByMonth(expenses: ExpenseItem[]) {
  const expensesByMonth: ExpenseItem[][] = [];
  expenses.forEach((expense) => {
    const date = new Date(expense.date);
    const month = date.getMonth();
    if (!expensesByMonth[month]) {
      expensesByMonth[month] = [];
    }
    expensesByMonth[month].push(expense);
  });
  return expensesByMonth.reverse();
}

export default function MonthlyExpenses() {
  const queryClient = useQueryClient();

  const { data, isFetching, isFetched } = useQuery({
    queryKey: ["expenses"],
    queryFn: fetchExpenses,
    staleTime: 1000 * 60 * 10,
    placeholderData: [],
  });

  const { mutate } = useMutation({
    mutationFn: deleteExpense,
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({
        queryKey: ["expenses"],
        exact: true,
      });
      const previousExpenses = queryClient.getQueryData<ExpenseItem[]>([
        "expenses",
      ]);
      queryClient.setQueryData(
        ["expenses"],
        previousExpenses!.filter((i) => i._id !== id)
      );
      return { previousExpenses };
    },
    onError: (error, data, context) => {
      if (error) {
        console.error("Mutation failed:", error);
        console.log("Data passed to mutation:", data);
      }
      queryClient.setQueryData(["expenses"], context!.previousExpenses);
    },
  });

  function handleDelete(id: number) {
    mutate({ id });
  }

  if (isFetching && !isFetched) {
    return <Loader />;
  }

  if (!data) {
    return <p>No data available.</p>;
  }

  const expenses = data.filter((item) => item.category === "none");

  const monthlyExpenses = groupExpensesByMonth(expenses);

  return (
    <>
      <AnimatePresence mode="popLayout">
        {monthlyExpenses.map((month) => {
          const key = new Date(month[0].date).getUTCMonth();
          const [groceries, total, other] = calculateAmounts(month);
          return (
            <motion.table
              key={key}
              variants={{
                visible: {
                  scale: 1,
                  opacity: 1,
                  transition: { staggerChildren: 0.03 },
                },
                hidden: { scale: 0, opacity: 0 },
              }}
              initial="hidden"
              animate="visible"
              exit="hidden"
              layout
              className={classes.table}
            >
              <motion.thead layout>
                <tr>
                  <th scope="col">Groceries</th>
                  <th scope="col">Other</th>
                  <motion.th
                    key={`Total ${month.length}  ${key}`}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.3 }}
                    scope="col"
                  >
                    Total ({month.length})
                  </motion.th>
                </tr>
                <tr>
                  <motion.th
                    key={`Groceries ${groceries}  ${key}`}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.3 }}
                    scope="col"
                  >
                    {groceries}
                  </motion.th>
                  <motion.th
                    key={`Other ${other}  ${key}`}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.3 }}
                    scope="col"
                  >
                    {other}
                  </motion.th>
                  <motion.th
                    key={`${total}  ${key}`}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.3 }}
                    scope="col"
                  >
                    {total}
                  </motion.th>
                </tr>
              </motion.thead>
              <tbody>
                {month.map((expense) => {
                  return (
                    <TableRow
                      key={"none" + expense._id}
                      expense={expense}
                      onDelete={handleDelete}
                    />
                  );
                })}
              </tbody>
            </motion.table>
          );
        })}
      </AnimatePresence>
    </>
  );
}
