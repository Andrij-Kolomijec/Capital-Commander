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
exports.scrapeTableData = void 0;
const puppeteer_extra_1 = __importDefault(require("puppeteer-extra"));
function scrapeTableData(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { ticker } = req.params;
        const browser = yield puppeteer_extra_1.default.launch({
            headless: true,
            defaultViewport: null,
        });
        const page = yield browser.newPage();
        yield page.goto(process.env.FINVIZ + ticker, {
            waitUntil: "domcontentloaded",
        });
        const tableData = yield page.evaluate(() => {
            const items = document.querySelectorAll(".screener_snapshot-table-body .snapshot-td2");
            const data = [...Array(items.length / 2)].map((_, i) => ({
                [items[i * 2].textContent.trim()]: items[i * 2 + 1].textContent.trim(),
            }));
            return data;
        });
        yield browser.close();
        res.status(200).json(tableData);
    });
}
exports.scrapeTableData = scrapeTableData;
