"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const requireAuth_1 = __importDefault(require("../middleware/requireAuth"));
const userRoutes = express_1.default.Router();
userRoutes.post("/authentication/login", userController_1.userLogin);
userRoutes.post("/authentication/signup", userController_1.userSignup);
userRoutes.use(requireAuth_1.default);
userRoutes.delete("/settings", userController_1.userDeletion);
exports.default = userRoutes;
