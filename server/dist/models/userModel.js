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
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const validator_1 = __importDefault(require("validator"));
const Schema = mongoose_1.default.Schema;
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    baseCurrency: {
        type: String,
        default: "CZK",
    },
});
userSchema.statics.signup = function (email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!email || !password)
            throw Error("All fields must be filled.");
        if (!validator_1.default.isEmail(email))
            throw Error("Email is not valid.");
        const exists = yield this.findOne({ email });
        if (exists)
            throw Error("Email already in use.");
        if (!validator_1.default.isStrongPassword(password))
            throw Error("Password should have a letter, a capital letter, a number, a special character and be at least 8 characters long.");
        const salt = yield bcrypt_1.default.genSalt(15);
        const hash = yield bcrypt_1.default.hash(password, salt);
        const user = yield this.create({ email, password: hash });
        return user;
    });
};
userSchema.statics.login = function (email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!email || !password)
            throw Error("All fields must be filled.");
        const user = yield this.findOne({ email });
        if (!user)
            throw Error("Incorrect email.");
        const match = yield bcrypt_1.default.compare(password, user.password);
        if (!match)
            throw Error("Incorrect password.");
        return user;
    });
};
userSchema.statics.changePassword = function (id, passwordOld, passwordNew) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!passwordOld || !passwordNew)
            throw Error("All fields must be filled.");
        const user = yield this.findOne({ _id: id });
        const match = yield bcrypt_1.default.compare(passwordOld, user.password);
        if (!match)
            throw Error("Incorrect password.");
        if (!validator_1.default.isStrongPassword(passwordNew))
            throw Error("Password should have a letter, a capital letter, a number, a special character and be at least 8 characters long.");
        const salt = yield bcrypt_1.default.genSalt(15);
        const hash = yield bcrypt_1.default.hash(passwordNew, salt);
        const updatedUser = yield this.findOneAndUpdate({ _id: id }, { password: hash });
        if (!updatedUser)
            throw Error("Error while updating password, try again later.");
        return updatedUser;
    });
};
userSchema.statics.changeBaseCurrency = function (id, baseCurrency) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!id)
            throw Error("Missing user ID.");
        if (!baseCurrency)
            throw Error("Missing base currency.");
        const updatedUser = yield this.findOneAndUpdate({ _id: id }, { baseCurrency });
        if (!updatedUser)
            throw Error("Error while updating base currency, try again later.");
        return updatedUser;
    });
};
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
