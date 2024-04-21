import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ratesSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    base: {
      type: String,
      required: true,
    },
    CZK: {
      type: Number,
      required: true,
    },
    EUR: {
      type: Number,
      required: true,
    },
    USD: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Rates = mongoose.model("Rate", ratesSchema);

export default Rates;
