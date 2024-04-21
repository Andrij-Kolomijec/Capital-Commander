import express from "express";

import {
  getRates,
  createRates,
  updateRates,
} from "../controllers/ratesController";
import requireAuth from "../middleware/requireAuth";

const ratesRoutes = express.Router();

ratesRoutes.use(requireAuth as any);

ratesRoutes.get("/", getRates as any);

ratesRoutes.post("/", createRates);

ratesRoutes.patch("/", updateRates);

export default ratesRoutes;
