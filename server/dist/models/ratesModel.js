"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const ratesSchema = new Schema({
    date: {
        type: Date,
        required: true,
    },
    base: {
        type: String,
        required: true,
    },
    EUR: {
        type: Number,
        required: true,
    },
    USD: {
        type: Number,
        required: true,
    },
}, { timestamps: true });
const Rates = mongoose_1.default.model("Rate", ratesSchema);
exports.default = Rates;
