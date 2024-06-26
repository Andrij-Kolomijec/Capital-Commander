import express from "express";

import {
  userLogin,
  userSignup,
  userDeletion,
  userPasswordChange,
  userBaseCurrencyChange,
} from "../controllers/userController";
import requireAuth from "../middleware/requireAuth";

const userRoutes = express.Router();

userRoutes.post("/authentication/login", userLogin);

userRoutes.post("/authentication/signup", userSignup);

userRoutes.use(requireAuth as any);

userRoutes.post("/settings", userPasswordChange as any);

userRoutes.delete("/settings", userDeletion as any);

userRoutes.post("/settings/expenses", userBaseCurrencyChange as any);

export default userRoutes;
