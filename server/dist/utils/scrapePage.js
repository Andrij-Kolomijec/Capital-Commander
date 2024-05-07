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
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeMacrotrends = void 0;
function scrapeMacrotrends(page, browser) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.waitForSelector(".table", { timeout: 30000 });
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
        // && Object.keys(item)[0].slice(5) === "12-31"
        )
            .map((item) => +Object.values(item)[0].replace("%", ""));
        return { tableData, filteredTableData };
    });
}
exports.scrapeMacrotrends = scrapeMacrotrends;
