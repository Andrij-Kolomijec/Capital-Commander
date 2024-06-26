import { Request, Response } from "express";
import puppeteer from "puppeteer-extra";
import { type Page } from "puppeteer";
import calculateMedian from "../utils/calculateMedian";
import createPage from "../utils/createPage";
import { scrapeGurufocus, scrapeMacrotrends } from "../utils/scrapePage";

export async function getStockTickers(req: Request, res: Response) {
  try {
    const response = await fetch(process.env.NASDAQ!);

    if (!response.ok) {
      const error = new Error("An error occurred while fetching tickers data.");
      throw error;
    }

    const tickers = await response.json();

    res.status(200).json({ tickers });
  } catch (error) {
    res.status(500).json({ error });
  }
}

async function getPEMedian(req: Request, res: Response) {
  const { ticker } = req.params;

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    ignoreDefaultArgs: ["--disable-extensions"],
  });

  const page: Page = await createPage(browser, "term/pettm/" + ticker);

  try {
    const { tableData } = await scrapeGurufocus(page, browser);
    return { ["PE Ratio (10y Median)"]: tableData };
  } catch (error) {
    console.log(error);
  }
}

async function getROEMedian(req: Request, res: Response) {
  const { ticker } = req.params;

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    ignoreDefaultArgs: ["--disable-extensions"],
  });

  const page: Page = await createPage(browser, ticker + "/ticker/roe");

  try {
    const { tableData, filteredTableData } = await scrapeMacrotrends(
      page,
      browser
    );
    return {
      ROE: tableData,
      ["ROE (10y Median)"]: calculateMedian(filteredTableData),
    };
  } catch (error) {
    console.log(error);
  }
}

async function getRestOfFinancials(req: Request, res: Response) {
  const { ticker } = req.params;

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    ignoreDefaultArgs: ["--disable-extensions"],
  });

  let page: Page = await createPage(browser, "stock/" + ticker + "/financials");

  try {
    try {
      await page.waitForSelector("#data_table_row_18848", { timeout: 60000 });
    } catch (error) {
      page = await createPage(browser, "stock/" + ticker + "/financials", true);
      await page.waitForSelector("#data_table_row_18838", { timeout: 60000 });
    }

    const tableData = await page.evaluate(() => {
      function selectDOMItem(number: string) {
        const title = document.querySelector(
          `#data_table_row_${number} td`
        )?.textContent;
        const value = document.querySelector(
          `#data_table_row_${number} .ttm-value`
        )?.textContent;
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

    await browser.close();

    const keyValuePairs: { [key: string]: string | null | undefined } = {};

    tableData.forEach((item) => {
      const key = Object.keys(item)[0];
      const value = item[key];
      keyValuePairs[key] = value;
    });

    return keyValuePairs;
  } catch (error) {
    console.log("Select DOM item error: ", error);
  }
}

let lastRunTimestamp: number = 0;

export async function getFinancials(req: Request, res: Response) {
  // await new Promise((resolve) => setTimeout(resolve, 10000));
  const currentTime = Date.now();
  const thirtySecondsAgo = currentTime - 30 * 1000;
  if (lastRunTimestamp > thirtySecondsAgo) {
    return res
      .status(429)
      .json({ error: "Too many requests. Please try again later." });
  }
  lastRunTimestamp = currentTime;

  const RestOfFinancials = await getRestOfFinancials(req, res);
  const ROEMedian = await getROEMedian(req, res);
  const PEMedian = await getPEMedian(req, res);
  const financials = { ...PEMedian, ...ROEMedian, ...RestOfFinancials };
  res.status(200).json({ financials });
}
