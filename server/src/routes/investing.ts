import express from "express";

import {
  getFinancials,
  getStockTickers,
} from "../controllers/investingController";
import requireAuth from "../middleware/requireAuth";

const investingRoutes = express.Router();

investingRoutes.use(requireAuth as any);

investingRoutes.get("/stocks", getStockTickers);

investingRoutes.get("/stocks/:ticker", getFinancials);

export default investingRoutes;
