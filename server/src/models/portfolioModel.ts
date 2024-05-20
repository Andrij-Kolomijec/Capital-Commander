import mongoose from "mongoose";

const Schema = mongoose.Schema;

const stockSchema = new Schema({
  ticker: {
    type: String,
    required: true,
  },
  avgPrice: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const portfolioSchema = new Schema({
  stocks: [stockSchema],
  user: {
    type: String,
    required: true,
  },
});

const Expense = mongoose.model("Portfolio", portfolioSchema);

export default Expense;
