import { useState } from "react";
import { motion } from "framer-motion";
import classes from "./TableRow.module.css";
import closeIcon from "../../assets/close.svg";
import dateFormatter from "../../utils/dateFormatter";
import { ExpenseItem } from "../../utils/http/expense";

type TableRowProps = {
  multiplier: number;
  expense: ExpenseItem;
  onDelete: (id: number) => void;
  housing?: boolean;
};

export default function TableRow({
  multiplier,
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
      transition={{ type: "spring" }}
      layout // makes the moved rows not to pop
      className={classes.row}
      onMouseEnter={() => setMouseHovered(true)}
      onMouseLeave={() => setMouseHovered(false)}
    >
      <motion.td className={classes["icon-container"]}>
        {mouseHovered && (
          <img
            className={classes["close-icon"]}
            src={closeIcon}
            alt="Close Icon"
            onClick={() => onDelete(expense._id!)}
          />
        )}
        {housing ? expense.amount * 12 : dateFormatter(expense)}
      </motion.td>
      <td>{Math.round(expense.amount * multiplier * 100) / 100}</td>
      <td
        className={expense.notes ? classes.notes : undefined}
        title={expense.notes}
      >
        {expense.description}
      </td>
    </motion.tr>
  );
}
