"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const expenseController_1 = require("../controllers/expenseController");
const requireAuth_1 = __importDefault(require("../middleware/requireAuth"));
const expenseRoutes = express_1.default.Router();
expenseRoutes.use(requireAuth_1.default);
expenseRoutes.get("/", expenseController_1.getAllExpenses);
expenseRoutes.post("/", expenseController_1.createExpense);
expenseRoutes.patch("/:id", expenseController_1.updateExpense);
expenseRoutes.delete("/:id", expenseController_1.deleteExpense);
exports.default = expenseRoutes;
