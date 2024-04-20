"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRates = exports.createRates = exports.getRates = void 0;
const express_1 = __importDefault(require("express"));
const ratesModel_1 = __importDefault(require("../models/ratesModel"));
const router = express_1.default.Router();
function getRates(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const rates = yield ratesModel_1.default.find({});
        res.status(200).json({ rates });
    });
}
exports.getRates = getRates;
function createRates(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { date, base, EUR, USD } = req.body;
        try {
            const rates = yield ratesModel_1.default.create({ date, base, EUR, USD });
            res.status(200).json({ message: "Currency rates created.", rates });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: "Internal server error." });
            }
        }
    });
}
exports.createRates = createRates;
function updateRates(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const rates = yield ratesModel_1.default.findOneAndUpdate({}, Object.assign({}, req.body));
        if (!rates) {
            return res.status(404).json({ error: "Updating currency rates failed." });
        }
        res.status(200).json(rates);
    });
}
exports.updateRates = updateRates;
