import express, { Request, Response } from "express";
import Rates from "../models/ratesModel";

const router = express.Router();

export async function getRates(req: Request, res: Response) {
  const rates = await Rates.find({});
  res.status(200).json({ rates });
}

export async function createRates(req: Request, res: Response) {
  const { date, base, EUR, USD } = req.body;

  try {
    const rates = await Rates.create({ date, base, EUR, USD });
    res.status(200).json({ message: "Currency rates created.", rates });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error." });
    }
  }
}

export async function updateRates(req: Request, res: Response) {
  const rates = await Rates.findOneAndUpdate(
    {},
    {
      ...req.body,
    }
  );

  if (!rates) {
    return res.status(404).json({ error: "Updating currency rates failed." });
  }

  res.status(200).json(rates);
}
