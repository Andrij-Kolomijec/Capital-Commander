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
exports.getFinancials = exports.getStockTickers = void 0;
const puppeteer_extra_1 = __importDefault(require("puppeteer-extra"));
const calculateMedian_1 = __importDefault(require("../utils/calculateMedian"));
function getStockTickers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch("https://api.nasdaq.com/api/screener/stocks?tableonly=true&limit=25&offset=0&download=true");
        if (!response.ok) {
            const error = new Error("An error occurred while fetching data.");
            // error.code = response.status;
            // error.info = await response.json();
            throw error;
        }
        const tickers = yield response.json();
        res.status(200).json({ tickers });
    });
}
exports.getStockTickers = getStockTickers;
function getPEMedian(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { ticker } = req.params;
        const browser = yield puppeteer_extra_1.default.launch({
            headless: true,
            defaultViewport: null,
        });
        const page = yield browser.newPage();
        const navigationPromise = page.waitForNavigation({
            waitUntil: "domcontentloaded",
        });
        yield page.goto(process.env.MACROTRENDS + ticker + "/ticker/pe-ratio", {
            waitUntil: "domcontentloaded",
        });
        yield navigationPromise;
        yield page.waitForSelector(".table", { timeout: 60000 });
        const tableData = yield page.evaluate(() => {
            const table = document.querySelector(".table");
            const items = table.querySelectorAll("tr");
            return Array.from(items)
                .map((row) => {
                var _a, _b;
                const cells = row.querySelectorAll("td");
                if (cells.length > 0) {
                    const date = (_a = cells[0].textContent) === null || _a === void 0 ? void 0 : _a.trim();
                    const value = (_b = cells[cells.length - 1].textContent) === null || _b === void 0 ? void 0 : _b.trim();
                    return { [date]: value };
                }
                else {
                    return null;
                }
            })
                .filter((item) => item !== null);
        });
        yield browser.close();
        const tenYearsAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 10)).getFullYear();
        const filteredTableData = tableData
            .filter((item) => new Date(Object.keys(item)[0]) >= new Date(`${tenYearsAgo}-09-01`)
        // && Object.keys(item)[0].slice(5) === "12-31" // slows UI too much
        )
            .map((item) => +Object.values(item)[0]);
        return { ["PE Ratio (10y Median)"]: (0, calculateMedian_1.default)(filteredTableData) };
    });
}
function getROEMedian(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { ticker } = req.params;
        const browser = yield puppeteer_extra_1.default.launch({
            headless: true,
            defaultViewport: null,
        });
        const page = yield browser.newPage();
        const navigationPromise = page.waitForNavigation({
            waitUntil: "domcontentloaded",
        });
        yield page.goto(process.env.MACROTRENDS + ticker + "/ticker/roe", {
            waitUntil: "domcontentloaded",
        });
        yield navigationPromise;
        yield page.waitForSelector(".table", { timeout: 60000 });
        const tableData = yield page.evaluate(() => {
            const table = document.querySelector(".table");
            const items = table.querySelectorAll("tr");
            return Array.from(items)
                .map((row) => {
                var _a, _b;
                const cells = row.querySelectorAll("td");
                if (cells.length > 0) {
                    const date = (_a = cells[0].textContent) === null || _a === void 0 ? void 0 : _a.trim();
                    const value = (_b = cells[cells.length - 1].textContent) === null || _b === void 0 ? void 0 : _b.trim();
                    return { [date]: value };
                }
                else {
                    return null;
                }
            })
                .filter((item) => item !== null);
        });
        yield browser.close();
        return { ROE: tableData };
    });
}
function getRestOfFinancials(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { ticker } = req.params;
        const browser = yield puppeteer_extra_1.default.launch({
            headless: true,
            defaultViewport: null,
        });
        const page = yield browser.newPage();
        const navigationPromise = page.waitForNavigation({
            waitUntil: "domcontentloaded",
        });
        yield page.goto(process.env.GURUFOCUS + ticker + "/financials", {
            waitUntil: "domcontentloaded",
        });
        yield navigationPromise;
        yield page.waitForSelector("#data_table_row_18848", { timeout: 60000 });
        const tableData = yield page.evaluate(() => {
            function selectDOMItem(number) {
                var _a, _b;
                const title = (_a = document.querySelector(`#data_table_row_${number} td`)) === null || _a === void 0 ? void 0 : _a.textContent;
                const value = (_b = document.querySelector(`#data_table_row_${number} .ttm-value`)) === null || _b === void 0 ? void 0 : _b.textContent;
                return { [title || "N/A"]: value };
            }
            return [
                selectDOMItem("18848"),
                selectDOMItem("18838"),
                selectDOMItem("245"),
                selectDOMItem("346"),
                selectDOMItem("3090"),
                selectDOMItem("120"),
                selectDOMItem("164"),
                selectDOMItem("248"),
                selectDOMItem("260"),
                selectDOMItem("290"),
                selectDOMItem("217"),
                selectDOMItem("3051"),
                selectDOMItem("221"),
                selectDOMItem("3083"),
                selectDOMItem("3206"),
                selectDOMItem("18769"),
                selectDOMItem("42"),
                selectDOMItem("297"),
                selectDOMItem("56"),
                selectDOMItem("172"),
                selectDOMItem("446"),
                selectDOMItem("430"),
                selectDOMItem("431"),
            ];
        });
        yield browser.close();
        const keyValuePairs = {};
        tableData.forEach((item) => {
            const key = Object.keys(item)[0];
            const value = item[key];
            keyValuePairs[key] = value;
        });
        return keyValuePairs;
    });
}
function getFinancials(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const PEMedian = yield getPEMedian(req, res);
        const ROEMedian = yield getROEMedian(req, res);
        const RestOfFinancials = yield getRestOfFinancials(req, res);
        const financials = Object.assign(Object.assign(Object.assign({}, PEMedian), ROEMedian), RestOfFinancials);
        res.status(200).json({ financials });
    });
}
exports.getFinancials = getFinancials;
