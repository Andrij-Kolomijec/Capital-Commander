import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User, { UserDocument } from "../models/userModel";
import dotenv from "dotenv";
// const jwt = require("jsonwebtoken");
// const User = require("../models/userModel");
// require("dotenv").config();

dotenv.config();

export type AuthRequest = Request & {
  user: UserDocument;
};

const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // verify authentication
  const { authorization } = req.headers;
  if (!authorization)
    return res.status(401).json({ error: "Authorization token required." });

  // authorization looks like 'Bearer ...token...' -> needs to be split
  const token = authorization!.split(" ")[1];

  // check the token
  try {
    const payload = jwt.verify(token, process.env.SECRET!) as JwtPayload;
    const _id = payload._id as string;

    req.user = await User.findOne({ _id }).select("_id");
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Request is not authorized." });
  }
};

export default requireAuth;
