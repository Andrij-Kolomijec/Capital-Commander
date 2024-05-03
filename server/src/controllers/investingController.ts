import { Request, Response } from "express";
import puppeteer from "puppeteer-extra";
import calculateMedian from "../utils/calculateMedian";

export async function getStockTickers(req: Request, res: Response) {
  const response = await fetch(
    "https://api.nasdaq.com/api/screener/stocks?tableonly=true&limit=25&offset=0&download=true"
  );

  if (!response.ok) {
    const error = new Error("An error occurred while fetching data.");
    // error.code = response.status;
    // error.info = await response.json();
    throw error;
  }

  const tickers = await response.json();
  res.status(200).json({ tickers });
}

async function getPEMedian(req: Request, res: Response) {
  const { ticker } = req.params;

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
  });

  const page = await browser.newPage();
  const navigationPromise = page.waitForNavigation({
    waitUntil: "domcontentloaded",
  });
  await page.goto(process.env.MACROTRENDS + ticker + "/ticker/pe-ratio", {
    waitUntil: "domcontentloaded",
  });

  await navigationPromise;
  await page.waitForSelector(".table", { timeout: 60000 });

  const tableData = await page.evaluate(() => {
    const table = document.querySelector(".table");
    const items = table!.querySelectorAll("tr");
    return Array.from(items)
      .map((row) => {
        const cells = row.querySelectorAll("td");
        if (cells.length > 0) {
          const date = cells[0].textContent?.trim();
          const value = cells[cells.length - 1].textContent?.trim();
          return { [date!]: value };
        } else {
          return null;
        }
      })
      .filter((item) => item !== null);
  });

  await browser.close();

  const tenYearsAgo = new Date(
    new Date().setFullYear(new Date().getFullYear() - 10)
  ).getFullYear();

  const filteredTableData = tableData
    .filter(
      (item) =>
        new Date(Object.keys(item!)[0]) >= new Date(`${tenYearsAgo}-09-01`)
      // && Object.keys(item)[0].slice(5) === "12-31" // slows UI too much
    )
    .map((item) => +Object.values(item!)[0]!);

  return { ["PE Ratio (10y Median)"]: calculateMedian(filteredTableData) };
}

async function getROEMedian(req: Request, res: Response) {
  const { ticker } = req.params;

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
  });

  const page = await browser.newPage();
  const navigationPromise = page.waitForNavigation({
    waitUntil: "domcontentloaded",
  });
  await page.goto(process.env.MACROTRENDS + ticker + "/ticker/roe", {
    waitUntil: "domcontentloaded",
  });

  await navigationPromise;
  await page.waitForSelector(".table", { timeout: 60000 });

  const tableData = await page.evaluate(() => {
    const table = document.querySelector(".table");
    const items = table!.querySelectorAll("tr");
    return Array.from(items)
      .map((row) => {
        const cells = row.querySelectorAll("td");
        if (cells.length > 0) {
          const date = cells[0].textContent?.trim();
          const value = cells[cells.length - 1].textContent?.trim();
          return { [date!]: value };
        } else {
          return null;
        }
      })
      .filter((item) => item !== null);
  });

  await browser.close();

  return { ROE: tableData };
}

async function getRestOfFinancials(req: Request, res: Response) {
  const { ticker } = req.params;

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
  });

  const page = await browser.newPage();
  const navigationPromise = page.waitForNavigation({
    waitUntil: "domcontentloaded",
  });
  await page.goto(process.env.GURUFOCUS + ticker + "/financials", {
    waitUntil: "domcontentloaded",
  });

  await navigationPromise;
  await page.waitForSelector("#data_table_row_18848", { timeout: 60000 });

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

  await browser.close();

  const keyValuePairs: { [key: string]: string | null | undefined } = {};

  tableData.forEach((item) => {
    const key = Object.keys(item)[0];
    const value = item[key];
    keyValuePairs[key] = value;
  });

  return keyValuePairs;
}

export async function getFinancials(req: Request, res: Response) {
  const PEMedian = await getPEMedian(req, res);
  const ROEMedian = await getROEMedian(req, res);
  const RestOfFinancials = await getRestOfFinancials(req, res);
  const financials = { ...PEMedian, ...ROEMedian, ...RestOfFinancials };
  res.status(200).json({ financials });
}
