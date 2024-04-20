import express from "express";

import {
  getRates,
  createRates,
  updateRates,
} from "../controllers/ratesController";

const ratesRoutes = express.Router();

ratesRoutes.get("/", getRates);

ratesRoutes.post("/", createRates);

ratesRoutes.patch("/", updateRates);

export default ratesRoutes;
