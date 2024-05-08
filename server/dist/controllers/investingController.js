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
const axios_1 = __importDefault(require("axios"));
const puppeteer_extra_1 = __importDefault(require("puppeteer-extra"));
const calculateMedian_1 = __importDefault(require("../utils/calculateMedian"));
const createPage_1 = __importDefault(require("../utils/createPage"));
const scrapePage_1 = require("../utils/scrapePage");
function getStockTickers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(process.env.NASDAQ);
            if (response.status !== 200) {
                const error = new Error("An error occurred while fetching data.");
                throw error;
            }
            const tickers = response.data;
            res.status(200).json({ tickers });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            }
        }
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
        const page = yield (0, createPage_1.default)(browser, ticker + "/ticker/pe-ratio");
        try {
            const { filteredTableData } = yield (0, scrapePage_1.scrapeMacrotrends)(page, browser);
            return { ["PE Ratio (10y Median)"]: (0, calculateMedian_1.default)(filteredTableData) };
        }
        catch (error) {
            console.log(error);
        }
    });
}
function getROEMedian(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { ticker } = req.params;
        const browser = yield puppeteer_extra_1.default.launch({
            headless: true,
            defaultViewport: null,
        });
        const page = yield (0, createPage_1.default)(browser, ticker + "/ticker/roe");
        try {
            const { tableData, filteredTableData } = yield (0, scrapePage_1.scrapeMacrotrends)(page, browser);
            return {
                ROE: tableData,
                ["ROE (10y Median)"]: (0, calculateMedian_1.default)(filteredTableData),
            };
        }
        catch (error) {
            console.log(error);
        }
    });
}
function getRestOfFinancials(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { ticker } = req.params;
        const browser = yield puppeteer_extra_1.default.launch({
            headless: true,
            defaultViewport: null,
        });
        const page = yield (0, createPage_1.default)(browser, ticker + "/financials");
        try {
            yield page.waitForSelector("#data_table_row_18848", { timeout: 30000 });
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
                    selectDOMItem("396"),
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
        }
        catch (error) {
            console.log(error);
        }
    });
}
function getFinancials(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // await new Promise((resolve) => setTimeout(resolve, 10000));
        const PEMedian = yield getPEMedian(req, res);
        const RestOfFinancials = yield getRestOfFinancials(req, res);
        const ROEMedian = yield getROEMedian(req, res);
        const financials = Object.assign(Object.assign(Object.assign({}, PEMedian), ROEMedian), RestOfFinancials);
        res.status(200).json({ financials });
    });
}
exports.getFinancials = getFinancials;
