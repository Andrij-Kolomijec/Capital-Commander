import { Response } from "express";
import { type Document } from "mongoose";
import Portfolio from "../models/portfolioModel";
import { type AuthRequest } from "../middleware/requireAuth";

export async function getPortfolio(req: AuthRequest, res: Response) {
  const user = req.user._id.toString();
  const portfolio = await Portfolio.find({ user });
  res.status(200).json({ portfolio });
}

export async function updatePortfolio(req: AuthRequest, res: Response) {
  const { ticker, avgPrice, quantity } = req.body;
  const user = req.user._id.toString();

  try {
    let portfolio = await Portfolio.findOne({ user });

    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found." });
    }

    const stock = portfolio.stocks.find((stock) => stock.ticker === ticker);
    if (!stock) {
      portfolio.stocks.push({ ticker, avgPrice, quantity });
    } else {
      stock.avgPrice = avgPrice;
      stock.quantity = quantity;
    }
    await portfolio.save();
    res.status(200).json({ message: "Portfolio updated.", portfolio });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error." });
    }
  }
}

type StocksProps = {
  ticker: string;
  avgPrice: number;
  quantity: number;
};

type PortfolioProps = Document & {
  stocks: StocksProps[];
  user: string;
};

export async function deleteTicker(req: AuthRequest, res: Response) {
  const { ticker } = req.body;
  const user = req.user._id.toString();

  try {
    const portfolio = (await Portfolio.findOne({ user })) as PortfolioProps;

    if (!portfolio) {
      return res.status(404).json({ error: "Portfolio not found." });
    }

    const initialLength = portfolio.stocks.length;
    portfolio.stocks = portfolio.stocks.filter(
      (stock) => stock.ticker !== ticker
    );

    if (portfolio.stocks.length === initialLength) {
      return res.status(404).json({ error: "Ticker not found in portfolio." });
    }

    await portfolio.save();
    res.status(200).json({ message: "Ticker removed.", portfolio });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error." });
    }
  }
}
