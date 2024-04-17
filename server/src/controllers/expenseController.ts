import express, { Request, Response } from "express";
import mongoose from "mongoose";
import Expense from "../models/expenseModel";
import { isValidDate, isValidNumber, isValidText } from "../utils/validators";
import { type AuthRequest } from "../middleware/requireAuth";

const router = express.Router();

type ErrorProps = {
  description?: string;
  date?: string;
  amount?: string;
  notes?: string;
};

// GET all expenses
export async function getAllExpenses(req: AuthRequest, res: Response) {
  const user = req.user._id.toString();
  const expenses = await Expense.find({ user }).sort({ date: 1 });
  res.status(200).json({ expenses });
}

// validate and POST an expense
export async function createExpense(req: AuthRequest, res: Response) {
  const { description, date, amount, notes, category } = req.body;

  let errors: ErrorProps = {};

  if (!isValidText(description)) {
    errors.description = "Invalid description.";
  }

  if (!isValidDate(date)) {
    errors.date = "Invalid date.";
  }

  if (!isValidNumber(+amount)) {
    errors.amount = "Invalid amount.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: "Adding the expense failed due to validation errors.",
      errors,
    });
  }

  const user = req.user._id.toString();

  try {
    const expense = await Expense.create({
      description,
      date,
      amount,
      notes,
      category,
      user,
    });
    res.status(200).json({ message: "Expense saved.", expense });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error." });
    }
  }
}

// PATCH an expense
export async function updateExpense(req: Request, res: Response) {
  const { id } = req.params;
  const { description, date, amount, notes, category } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Expense to update not found." });
  }

  let errors: ErrorProps = {};

  if (!isValidText(description)) {
    errors.description = "Invalid description.";
  }

  if (!isValidDate(date)) {
    errors.date = "Invalid date.";
  }

  if (!isValidNumber(amount)) {
    errors.amount = "Invalid amount.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: "Updating the expense failed due to validation errors.",
      errors,
    });
  }

  const expense = await Expense.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );

  if (!expense) {
    return res.status(404).json({ error: "Expense to update not found." });
  }

  res.status(200).json(expense);
}

// DELETE an expense
export async function deleteExpense(req: Request, res: Response) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Expense to delete not found." });
  }

  const expense = await Expense.findOneAndDelete({ _id: id });

  if (!expense) {
    return res.status(404).json({ error: "Expense to delete not found." });
  }

  res.status(200).json({ message: "Expense deleted." });
}
