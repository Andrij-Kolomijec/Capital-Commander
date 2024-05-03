import express from "express";
import puppeteer from "puppeteer-extra";
import AdblockerPlugin from "puppeteer-extra-plugin-adblocker";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

import {
  getFinancials,
  getStockTickers,
} from "../controllers/investingController";
import requireAuth from "../middleware/requireAuth";

const investingRoutes = express.Router();

investingRoutes.use(requireAuth as any);

puppeteer.use(AdblockerPlugin()).use(StealthPlugin());

investingRoutes.get("/stocks/:ticker", getFinancials);

investingRoutes.get("/stocks", getStockTickers);

export default investingRoutes;
