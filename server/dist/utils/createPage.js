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
const puppeteer_extra_1 = __importDefault(require("puppeteer-extra"));
const user_agents_1 = __importDefault(require("user-agents"));
const puppeteer_extra_plugin_adblocker_1 = __importDefault(require("puppeteer-extra-plugin-adblocker"));
const puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
puppeteer_extra_1.default.use((0, puppeteer_extra_plugin_stealth_1.default)()).use((0, puppeteer_extra_plugin_adblocker_1.default)());
function createPage(browser, url) {
    return __awaiter(this, void 0, void 0, function* () {
        const userAgent = new user_agents_1.default();
        const page = yield browser.newPage();
        yield page.setViewport({
            width: 1920 + Math.floor(Math.random() * 100),
            height: 3000 + Math.floor(Math.random() * 100),
            deviceScaleFactor: 1,
            hasTouch: false,
            isLandscape: false,
            isMobile: false,
        });
        yield page.setUserAgent(userAgent.random().toString());
        const navigationPromise = page.waitForNavigation({
            waitUntil: "domcontentloaded",
        });
        //Skip images/styles/fonts loading for performance
        yield page.setRequestInterception(true);
        page.on("request", (req) => {
            if (req.resourceType() == "stylesheet" ||
                req.resourceType() == "font" ||
                req.resourceType() == "image") {
                req.abort();
            }
            else {
                req.continue();
            }
        });
        yield page.goto((url.includes("financials")
            ? process.env.GURUFOCUS
            : process.env.MACROTRENDS) + url, {
            waitUntil: "domcontentloaded",
        });
        yield navigationPromise;
        return page;
    });
}
exports.default = createPage;
