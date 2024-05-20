import express from "express";

import {
  getFinancials,
  getStockTickers,
} from "../controllers/investingController";
import requireAuth from "../middleware/requireAuth";
import {
  deleteTicker,
  getPortfolio,
  updatePortfolio,
} from "../controllers/portfolioController";

const investingRoutes = express.Router();

investingRoutes.use(requireAuth as any);

investingRoutes.get("/", getPortfolio as any);

investingRoutes.patch("/", updatePortfolio as any);

investingRoutes.delete("/", deleteTicker as any);

investingRoutes.get("/stocks", getStockTickers);

investingRoutes.get("/stocks/:ticker", getFinancials);

export default investingRoutes;
