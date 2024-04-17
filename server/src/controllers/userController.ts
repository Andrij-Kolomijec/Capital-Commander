import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel";
import dotenv from "dotenv";
import { AuthRequest } from "../middleware/requireAuth";

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

    res.status(200).json({ email, token });
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

    const token = createToken(user._id, rememberMe === "on");

    res.status(200).json({ email, token });
  } catch (error) {
    if (error instanceof Error) {
      res.status(422).json({ error: error.message });
    }
  }
}

export async function userDeletion(req: AuthRequest, res: Response) {
  const userId = req.user._id.toString();

  const user = await User.findOneAndDelete({ _id: userId });

  if (!user) {
    return res.status(404).json({ error: "User to delete not found." });
  }

  res.status(200).json({ message: "User deleted." });
}
