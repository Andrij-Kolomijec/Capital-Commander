import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel";
import dotenv from "dotenv";
// const jwt = require("jsonwebtoken");
// require("dotenv").config();

dotenv.config();

function createToken(_id: String) {
  if (!process.env.SECRET) {
    throw new Error("Secret key is not defined in the environment variables.");
  }
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "12h" });
}

export async function userLogin(req: Request, res: Response) {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    const token = createToken(user!._id);

    res.status(200).json({ email, token });
  } catch (error) {
    if (error instanceof Error) {
      res.status(422).json({ error: error.message });
    }
  }
}

export async function userSignup(req: Request, res: Response) {
  const { email, password, passwordConfirm } = req.body;
  try {
    if (password !== passwordConfirm) {
      return res.status(422).json({ error: "Passwords must match." });
    }

    const user = await User.signup(email, password);

    const token = createToken(user._id);

    res.status(200).json({ email, token });
  } catch (error) {
    if (error instanceof Error) {
      res.status(422).json({ error: error.message });
    }
  }
}
