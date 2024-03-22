import { useState } from "react";
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
    <tr
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
    </tr>
  );
}
