import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import classes from "./ExpenseGroup.module.css";
import {
  ExpenseItem,
  deleteExpense,
  fetchExpenses,
} from "../../utils/http/expense";
import TableRow from "./TableRow";
import Loader from "../common/Loader";

type ExpenseGroupProps = {
  multiplier: number;
  group: "housing" | "transportation" | "other";
  summing?: null | string;
  yearly?: boolean;
};

export default function ExpenseGroup({
  multiplier = 1,
  group,
  summing = null,
  yearly = false,
}: ExpenseGroupProps) {
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
        // exact: true,
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

  const expenses = data.filter((item) => item.category === group);

  const sum =
    Math.round(
      expenses.reduce((total, item) => {
        return total + +item.amount;
      }, 0) *
        multiplier *
        100
    ) / 100;

  let sumGroup: number | undefined;
  if (summing) {
    sumGroup =
      Math.round(
        expenses.reduce((total, item) => {
          return total + +(item.description === summing && item.amount);
        }, 0) *
          multiplier *
          100
      ) / 100;
  }

  return (
    <motion.table
      key={group}
      variants={{
        visible: {
          y: 0,
          opacity: 1,
          transition: { staggerChildren: 0.03 },
        },
        hidden: { y: 30, opacity: 0 }, // makes the whole table appear from below in the beginning
      }}
      initial="hidden"
      animate="visible"
      exit="hidden"
      layout="size" // table add and delete rows animation (but distorts)
      className={`${classes.table} ${classes["second-row-table"]}`}
    >
      {/* layout property in both elements below prevents the distortion */}
      <motion.caption layout>
        {group === "other"
          ? "Miscellaneous"
          : `${group.charAt(0).toUpperCase()}${group.slice(1)}`}
      </motion.caption>
      <motion.thead layout>
        <tr>
          <th scope="col">Year</th>
          <th scope="col">Month</th>
          <th scope="col">
            {summing && `${summing.charAt(0).toUpperCase()}${summing.slice(1)}`}
          </th>
        </tr>
        <tr>
          <th scope="col">{yearly ? sum * 12 : sum}</th>
          <th scope="col">{yearly ? sum : (sum / 12).toFixed(0)}</th>
          <th scope="col">{sumGroup}</th>
        </tr>
      </motion.thead>
      <tbody>
        {/* <AnimatePresence> */}
        {expenses.map((expense) => {
          return (
            <TableRow
              key={expense.category! + expense._id}
              multiplier={multiplier}
              expense={expense}
              onDelete={handleDelete}
              housing={yearly}
            />
          );
        })}
        {/* </AnimatePresence> */}
      </tbody>
    </motion.table>
  );
}
