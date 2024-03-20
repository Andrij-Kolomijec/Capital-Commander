import express from "express";

import {
  createExpense,
  deleteExpense,
  getAllExpenses,
  updateExpense,
} from "../controllers/expenseController";

const expenseRoutes = express.Router();

expenseRoutes.get("/", getAllExpenses);

expenseRoutes.post("/", createExpense);

expenseRoutes.patch("/:id", updateExpense);

expenseRoutes.delete("/:id", deleteExpense);

export default expenseRoutes;
