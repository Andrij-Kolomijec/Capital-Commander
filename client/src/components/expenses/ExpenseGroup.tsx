import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import classes from "./MonthlyExpenses.module.css";
import { ExpenseItem, deleteExpense, fetchExpenses } from "../../utils/http";
import TableRow from "./TableRow";

type ExpenseGroupProps = {
  group: "housing" | "transportation" | "other";
  summing?: null | string;
  yearly?: boolean;
};

export default function ExpenseGroup({
  group,
  summing = null,
  yearly = false,
}: ExpenseGroupProps) {
  const queryClient = useQueryClient();

  const { data, isFetching } = useQuery({
    queryKey: ["expenses", group],
    queryFn: async () => {
      const response = await fetchExpenses();

      const expenses = response.filter(
        (item) => item.category && item.category === group
      );

      return expenses;
    },
    staleTime: 1000 * 60 * 1,
    placeholderData: [],
  });

  const { mutate } = useMutation({
    mutationFn: deleteExpense,
    // onSuccess: () => {
    //   queryClient.invalidateQueries({
    //     queryKey: ["expenses", "other"],
    //     exact: true,
    //   });
    // },
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({
        queryKey: ["expenses", group],
        exact: true,
      });
      const previousExpenses = queryClient.getQueryData<ExpenseItem[]>([
        "expenses",
        group,
      ]);
      queryClient.setQueryData(
        ["expenses", group],
        previousExpenses!.filter((i) => i._id !== id)
      );
      return { previousExpenses };
    },
    onError: (error, data, context) => {
      queryClient.setQueryData(["expenses", group], context!.previousExpenses);
    },
    // onSettled: () => {
    //   queryClient.invalidateQueries({
    //     queryKey: ["expenses", "none"],
    //     exact: true,
    //   });
    // },
  });

  function handleDelete(id: number) {
    mutate({ id });
  }

  if (isFetching) {
    return <p>Loading...</p>;
  }

  if (!data) {
    return <p>No data available.</p>;
  }

  const sum = data.reduce((total, item) => {
    return total + +item.amount;
  }, 0);

  let sumGroup: number | undefined;
  if (summing) {
    sumGroup = data.reduce((total, item) => {
      return total + +(item.description === summing && item.amount);
    }, 0);
  }

  return (
    <table className={classes.table}>
      <caption>{`${group.charAt(0).toUpperCase()}${group.slice(1)}`}</caption>
      <thead>
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
      </thead>
      <motion.tbody
        variants={{
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.03 },
          },
          hidden: { opacity: 0 },
        }}
        initial="hidden"
        animate="visible"
        layout
      >
        {data.map((expense) => {
          return (
            <TableRow
              key={expense._id}
              expense={expense}
              onDelete={handleDelete}
              housing={yearly}
            />
          );
        })}
      </motion.tbody>
    </table>
  );
}
