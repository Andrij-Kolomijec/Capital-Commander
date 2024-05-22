import { useMutation, useQueryClient } from "@tanstack/react-query";
import classes from "./InputExpense.module.css";
import {
  type ExpenseItem,
  createExpense,
  FetchExpenseError,
} from "../../utils/http/expense";
import Button from "../common/Button";
import { stagger, useAnimate, motion } from "framer-motion";
import { useRef } from "react";

export default function InputExpense({
  multiplier = 1,
}: {
  multiplier: number;
}) {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["expenses"],
        exact: true,
      });
    },
  });

  const [scope, animate] = useAnimate();

  const date = useRef<HTMLInputElement>(null);
  const amount = useRef<HTMLInputElement>(null);
  const description = useRef<HTMLInputElement | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (
      !date.current?.value.trim() ||
      !amount.current?.value.trim() ||
      !description.current?.value.trim()
    ) {
      animate(
        `.required`,
        { x: [-15, 0] },
        {
          type: "spring",
          duration: 0.3,
          delay: stagger(0.1, { startDelay: 0.1 }),
        }
      );
    }

    const formData = new FormData(e.currentTarget);
    // const data = Object.fromEntries(formData);
    const data: ExpenseItem = {
      description: formData.get("description") as string,
      date: new Date(formData.get("date") as string),
      amount: Number(formData.get("amount")) / multiplier,
      notes: formData.get("notes") as string | undefined,
      category: formData.get("category") as string | undefined,
    };

    mutate({ ...data });
  }

  const style = {
    transition: "transform 0.3s",
  };

  // if (isError) {
  //   console.log(error.info.errors);
  // }

  return (
    <form ref={scope} className={classes.form} onSubmit={handleSubmit}>
      {isError && (
        <motion.p
          variants={{
            hidden: { opacity: 0, scale: 0 },
            visible: { opacity: 1, scale: 1 },
          }}
          initial="hidden"
          animate="visible"
          className={classes.error}
        >
          {Object.values((error as FetchExpenseError).info.errors).join(" ")}
        </motion.p>
      )}
      <motion.div layout>
        <label htmlFor="expense-date">Date</label>
        <input
          id="expense-date"
          type="date"
          name="date"
          ref={date}
          className="required"
          style={style}
        />
      </motion.div>
      <motion.div>
        <label htmlFor="expense-amount">Amount</label>
        <input
          id="expense-amount"
          type="number"
          name="amount"
          ref={amount}
          className="required"
          style={style}
        />
      </motion.div>
      <motion.div>
        <label htmlFor="expense-description">Description</label>
        <input
          id="expense-description"
          type="text"
          name="description"
          ref={description}
          className="required"
          style={style}
        />
      </motion.div>
      <div>
        <label htmlFor="expense-notes">Notes</label>
        <input id="expense-notes" type="text" name="notes" title="Optional" />
      </div>
      <div>
        <label htmlFor="expense-category">Category</label>
        <select name="category" id="expense-category" title="Optional">
          <option value="none">--Default--</option>
          <option value="housing">Housing</option>
          <option value="transportation">Transportation</option>
          <option value="other">Miscellaneous</option>
        </select>
      </div>
      <Button disabled={isPending} loader={isPending}>
        {isPending ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}
