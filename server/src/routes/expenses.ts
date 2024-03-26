import express from "express";

import {
  createExpense,
  deleteExpense,
  getAllExpenses,
  updateExpense,
} from "../controllers/expenseController";

import requireAuth from "../middleware/requireAuth";

const expenseRoutes = express.Router();

expenseRoutes.use(requireAuth as any);

expenseRoutes.get("/", getAllExpenses);

expenseRoutes.post("/", createExpense);

expenseRoutes.patch("/:id", updateExpense);

expenseRoutes.delete("/:id", deleteExpense);

export default expenseRoutes;
