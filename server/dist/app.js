"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const expenses_1 = __importDefault(require("./routes/expenses"));
const users_1 = __importDefault(require("./routes/users"));
const rates_1 = __importDefault(require("./routes/rates"));
const investing_1 = __importDefault(require("./routes/investing"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});
app.use("/expenses", expenses_1.default);
app.use("/currency", rates_1.default);
app.use("/investing", investing_1.default);
app.use("/", users_1.default);
const mongoDB = process.env.MONGODB_URI;
mongoose_1.default
    .connect(mongoDB)
    .then(() => {
    app.listen(port, () => {
        console.log(`Connected to MongoDB & listening on port ${port}.`);
    });
})
    .catch((error) => {
    console.log(error);
});
