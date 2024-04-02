import mongoose from "mongoose";

const Schema = mongoose.Schema;

const expenseSchema = new Schema(
  {
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
      required: false,
    },
    category: {
      type: String,
      required: false,
    },
    user: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;
