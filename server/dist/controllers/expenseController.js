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
exports.deleteExpense = exports.updateExpense = exports.createExpense = exports.getAllExpenses = void 0;
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const expenseModel_1 = __importDefault(require("../models/expenseModel"));
const validators_1 = require("../utils/validators");
const router = express_1.default.Router();
// GET all expenses
function getAllExpenses(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.user._id.toString();
        const expenses = yield expenseModel_1.default.find({ user }).sort({ date: 1 });
        setTimeout(() => res.status(200).json({ expenses }), 0);
    });
}
exports.getAllExpenses = getAllExpenses;
// validate and POST an expense
function createExpense(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { description, date, amount, notes, category } = req.body;
        let errors = {};
        if (!(0, validators_1.isValidText)(description)) {
            errors.description = "Invalid description.";
        }
        if (!(0, validators_1.isValidDate)(date)) {
            errors.date = "Invalid date.";
        }
        if (!(0, validators_1.isValidNumber)(+amount)) {
            errors.amount = "Invalid amount.";
        }
        if (Object.keys(errors).length > 0) {
            return res.status(422).json({
                message: "Adding the expense failed due to validation errors.",
                errors,
            });
        }
        const user = req.user._id.toString();
        try {
            const expense = yield expenseModel_1.default.create({
                description,
                date,
                amount,
                notes,
                category,
                user,
            });
            res.status(200).json({ message: "Expense saved.", expense });
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
exports.createExpense = createExpense;
// PATCH an expense
function updateExpense(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        const { description, date, amount, notes, category } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: "Expense to update not found." });
        }
        let errors = {};
        if (!(0, validators_1.isValidText)(description)) {
            errors.description = "Invalid description.";
        }
        if (!(0, validators_1.isValidDate)(date)) {
            errors.date = "Invalid date.";
        }
        if (!(0, validators_1.isValidNumber)(amount)) {
            errors.amount = "Invalid amount.";
        }
        if (Object.keys(errors).length > 0) {
            return res.status(422).json({
                message: "Updating the expense failed due to validation errors.",
                errors,
            });
        }
        const expense = yield expenseModel_1.default.findOneAndUpdate({ _id: id }, Object.assign({}, req.body));
        if (!expense) {
            return res.status(404).json({ error: "Expense to update not found." });
        }
        res.status(200).json(expense);
    });
}
exports.updateExpense = updateExpense;
// DELETE an expense
function deleteExpense(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: "Expense to delete not found." });
        }
        const expense = yield expenseModel_1.default.findOneAndDelete({ _id: id });
        if (!expense) {
            return res.status(404).json({ error: "Expense to delete not found." });
        }
        res.status(200).json({ message: "Expense deleted." });
    });
}
exports.deleteExpense = deleteExpense;
