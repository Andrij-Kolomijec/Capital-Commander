"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ratesController_1 = require("../controllers/ratesController");
const requireAuth_1 = __importDefault(require("../middleware/requireAuth"));
const ratesRoutes = express_1.default.Router();
ratesRoutes.use(requireAuth_1.default);
ratesRoutes.get("/", ratesController_1.getRates);
ratesRoutes.post("/", ratesController_1.createRates);
ratesRoutes.patch("/", ratesController_1.updateRates);
exports.default = ratesRoutes;
