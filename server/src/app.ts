import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import expenseRoutes from "./routes/expenses";
import userRoutes from "./routes/users";

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use("/expenses", expenseRoutes);
app.use("/", userRoutes);

const mongoDB = process.env.MONGODB_URI as string;

mongoose
  .connect(mongoDB)
  .then(() => {
    app.listen(port, () => {
      console.log(`Connected to MongoDB & listening on port ${port}.`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
