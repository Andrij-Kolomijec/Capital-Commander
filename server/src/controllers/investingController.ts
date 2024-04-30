import { Request, Response } from "express";
import puppeteer from "puppeteer-extra";

export async function scrapeTableData(req: Request, res: Response) {
  const { ticker } = req.params;

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
  });

  const page = await browser.newPage();
  await page.goto(process.env.FINVIZ + ticker, {
    waitUntil: "domcontentloaded",
  });

  const tableData = await page.evaluate(() => {
    const items = document.querySelectorAll(
      ".screener_snapshot-table-body .snapshot-td2"
    );
    const data = [...Array(items.length / 2)].map((_, i) => ({
      [items[i * 2].textContent!.trim()]: items[i * 2 + 1].textContent!.trim(),
    }));

    return data;
  });

  await browser.close();

  res.status(200).json(tableData);
}
