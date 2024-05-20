import { type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/userModel";
import Expense from "../models/expenseModel";
import Portfolio from "../models/portfolioModel";
import { type AuthRequest } from "../middleware/requireAuth";

dotenv.config();

function createToken(_id: String, remember: boolean) {
  if (!process.env.SECRET) {
    throw new Error("Secret key is not defined in the environment variables.");
  }
  return jwt.sign({ _id }, process.env.SECRET, {
    expiresIn: `${remember ? "168h" : "12h"}`,
  });
}

export async function userLogin(req: Request, res: Response) {
  const { email, password, rememberMe } = req.body;

  try {
    const user = await User.login(email, password);

    const token = createToken(user!._id, rememberMe === "on");

    const baseCurrency = user!.baseCurrency;

    res.status(200).json({ email, token, baseCurrency });
  } catch (error) {
    if (error instanceof Error) {
      res.status(422).json({ error: error.message });
    }
  }
}

export async function userSignup(req: Request, res: Response) {
  const { email, password, passwordConfirm, rememberMe } = req.body;
  try {
    if (password !== passwordConfirm) {
      return res.status(422).json({ error: "Passwords must match." });
    }

    const user = await User.signup(email, password);

    const portfolio = await Portfolio.create({
      stocks: [],
      user: user._id,
    });

    const token = createToken(user._id, rememberMe === "on");

    const baseCurrency = user!.baseCurrency;

    res.status(200).json({ email, token, baseCurrency, portfolio });
  } catch (error) {
    if (error instanceof Error) {
      res.status(422).json({ error: error.message });
    }
  }
}

export async function userPasswordChange(req: AuthRequest, res: Response) {
  const userId = req.user._id.toString();
  const { passwordOld, passwordNew, passwordNewConfirm } = req.body;
  if (passwordNew !== passwordNewConfirm) {
    return res.status(422).json({ error: "New passwords must match." });
  }
  try {
    await User.changePassword(userId, passwordOld, passwordNew);
    res
      .status(200)
      .json({ message: "Success. Your password has been changed." });
  } catch (error) {
    if (error instanceof Error) {
      res.status(422).json({ error: error.message });
    }
  }
}

export async function userDeletion(req: AuthRequest, res: Response) {
  const userId = req.user._id.toString();

  const user = await User.findOneAndDelete({ _id: userId });
  const expenses = await Expense.deleteMany({ user: userId });
  const portfolio = await Portfolio.findOneAndDelete({ user: userId });

  if (!user) {
    return res.status(404).json({ error: "User to delete not found." });
  }

  if (!expenses) {
    return res
      .status(404)
      .json({ error: "User's expenses to delete not found." });
  }

  if (!portfolio) {
    return res.status(404).json({ error: "Portfolio to delete not found." });
  }

  res
    .status(200)
    .json({ message: "User, their expenses and portfolio deleted." });
}

export async function userBaseCurrencyChange(req: AuthRequest, res: Response) {
  const userId = req.user._id.toString();
  const { baseCurrency } = req.body;

  try {
    await User.changeBaseCurrency(userId, baseCurrency);
    res
      .status(200)
      .json({ message: "Success. Your base currency has been changed." });
  } catch (error) {
    if (error instanceof Error) {
      res.status(422).json({ error: error.message });
    }
  }
}
