"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const puppeteer_extra_1 = __importDefault(require("puppeteer-extra"));
const puppeteer_extra_plugin_adblocker_1 = __importDefault(require("puppeteer-extra-plugin-adblocker"));
const puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
const investingController_1 = require("../controllers/investingController");
const investingRoutes = express_1.default.Router();
// investingRoutes.use(requireAuth as any);
puppeteer_extra_1.default.use((0, puppeteer_extra_plugin_adblocker_1.default)()).use((0, puppeteer_extra_plugin_stealth_1.default)());
investingRoutes.get("/:ticker", investingController_1.scrapeTableData);
exports.default = investingRoutes;
