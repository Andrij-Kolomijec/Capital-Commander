import { useState } from "react";
import { motion } from "framer-motion";
import classes from "./TableRow.module.css";
import closeIcon from "../../assets/close.svg";
import dateFormatter from "../../utils/dateFormatter";
import { ExpenseItem } from "../../utils/http";

type TableRowProps = {
  expense: ExpenseItem;
  onDelete: (id: number) => void;
  housing?: boolean;
};

export default function TableRow({
  expense,
  onDelete,
  housing = false,
}: TableRowProps) {
  const [mouseHovered, setMouseHovered] = useState(false);
  return (
    <motion.tr
      key={expense._id}
      variants={{
        hidden: { scale: 0, opacity: 0 },
        visible: {
          opacity: 1,
          scale: [0.8, 1.1, 1],
          transition: { duration: 0.5 },
        },
      }}
      exit={{ scale: 0, opacity: 0, transition: { duration: 0.2 } }}
      // initial={{ height: 0, opacity: 0 }}
      // animate={{ height: "auto", opacity: 1 }}
      // exit={{ height: 0, opacity: 0 }}
      layout // makes the moved rows not to pop
      transition={{ type: "spring" }}
      className={classes.row}
      onMouseEnter={() => setMouseHovered(true)}
      onMouseLeave={() => setMouseHovered(false)}
    >
      <td className={classes["icon-container"]}>
        {mouseHovered && (
          <img
            className={classes["close-icon"]}
            src={closeIcon}
            alt="Close Icon"
            onClick={() => onDelete(expense._id!)}
          />
        )}
        {housing ? expense.amount * 12 : dateFormatter(expense)}
      </td>
      <td>{expense.amount}</td>
      <td
        className={expense.notes ? classes.notes : undefined}
        title={expense.notes}
      >
        {expense.description}
      </td>
    </motion.tr>
  );
}
