import { type Browser, type Page } from "puppeteer";

export async function scrapeMacrotrends(page: Page, browser: Browser) {
  await page.waitForSelector(".table", { timeout: 30000 });

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
      // && Object.keys(item)[0].slice(5) === "12-31"
    )
    .map((item) => +Object.values(item!)[0]!.replace("%", "")!);

  return { tableData, filteredTableData };
}
