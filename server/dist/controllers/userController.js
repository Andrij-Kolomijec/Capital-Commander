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
exports.userDeletion = exports.userPasswordChange = exports.userSignup = exports.userLogin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function createToken(_id, remember) {
    if (!process.env.SECRET) {
        throw new Error("Secret key is not defined in the environment variables.");
    }
    return jsonwebtoken_1.default.sign({ _id }, process.env.SECRET, {
        expiresIn: `${remember ? "168h" : "12h"}`,
    });
}
function userLogin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password, rememberMe } = req.body;
        try {
            const user = yield userModel_1.default.login(email, password);
            const token = createToken(user._id, rememberMe === "on");
            res.status(200).json({ email, token });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(422).json({ error: error.message });
            }
        }
    });
}
exports.userLogin = userLogin;
function userSignup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password, passwordConfirm, rememberMe } = req.body;
        try {
            if (password !== passwordConfirm) {
                return res.status(422).json({ error: "Passwords must match." });
            }
            const user = yield userModel_1.default.signup(email, password);
            const token = createToken(user._id, rememberMe === "on");
            res.status(200).json({ email, token });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(422).json({ error: error.message });
            }
        }
    });
}
exports.userSignup = userSignup;
function userPasswordChange(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.user._id.toString();
        const { passwordOld, passwordNew, passwordNewConfirm } = req.body;
        if (passwordNew !== passwordNewConfirm) {
            return res.status(422).json({ error: "New passwords must match." });
        }
        try {
            yield userModel_1.default.changePassword(userId, passwordOld, passwordNew);
            res
                .status(200)
                .json({ message: "Success. Your password has been changed." });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(422).json({ error: error.message });
            }
        }
    });
}
exports.userPasswordChange = userPasswordChange;
function userDeletion(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.user._id.toString();
        const user = yield userModel_1.default.findOneAndDelete({ _id: userId });
        if (!user) {
            return res.status(404).json({ error: "User to delete not found." });
        }
        res.status(200).json({ message: "User deleted." });
    });
}
exports.userDeletion = userDeletion;
