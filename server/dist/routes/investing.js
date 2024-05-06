"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const investingController_1 = require("../controllers/investingController");
const requireAuth_1 = __importDefault(require("../middleware/requireAuth"));
const investingRoutes = express_1.default.Router();
investingRoutes.use(requireAuth_1.default);
investingRoutes.get("/stocks", investingController_1.getStockTickers);
investingRoutes.get("/stocks/:ticker", investingController_1.getFinancials);
exports.default = investingRoutes;
