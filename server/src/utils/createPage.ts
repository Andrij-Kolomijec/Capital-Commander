import puppeteer from "puppeteer-extra";
import UserAgent from "user-agents";
import AdblockerPlugin from "puppeteer-extra-plugin-adblocker";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { type Browser, type Page } from "puppeteer";

puppeteer.use(StealthPlugin()).use(AdblockerPlugin());

export default async function createPage(
  browser: Browser,
  url: string
): Promise<Page> {
  const userAgent = new UserAgent();

  const page = await browser.newPage();

  await page.setViewport({
    width: 1920 + Math.floor(Math.random() * 100),
    height: 3000 + Math.floor(Math.random() * 100),
    deviceScaleFactor: 1,
    hasTouch: false,
    isLandscape: false,
    isMobile: false,
  });

  await page.setUserAgent(userAgent.random().toString());

  const navigationPromise = page.waitForNavigation({
    waitUntil: "domcontentloaded",
  });

  //Skip images/styles/fonts loading for performance
  await page.setRequestInterception(true);
  page.on("request", (req) => {
    if (
      req.resourceType() == "stylesheet" ||
      req.resourceType() == "font" ||
      req.resourceType() == "image"
    ) {
      req.abort();
    } else {
      req.continue();
    }
  });

  if (url.includes("financials")) {
    await gurufocusLogin(page);
  }

  await page.goto(
    (url.includes("financials") || url.includes("term/pettm/")
      ? process.env.GURUFOCUS
      : process.env.MACROTRENDS) + url,
    {
      waitUntil: "domcontentloaded",
    }
  );

  await navigationPromise;

  return page;
}

const timeout = 60000;

async function gurufocusLogin(page: Page) {
  try {
    await page.goto(process.env.GURUFOCUS + "login", {
      waitUntil: "domcontentloaded",
      timeout,
    });

    await page.waitForSelector("#login-dialog-name-input", { timeout });
    await page.focus("#login-dialog-name-input");
    await page.keyboard.type(process.env.GURUFOCUS_USERNAME!);

    // await page.$eval(
    //   "#login-dialog-name-input",
    //   (el, username) => {
    //     (el as HTMLInputElement).value = username;
    //   },
    //   process.env.GURUFOCUS_USERNAME!
    // );

    // await page.type("#login-dialog-name-input", process.env.GURUFOCUS_USERNAME!);

    await page.waitForSelector("#login-dialog-pass-input", { timeout });
    await page.focus("#login-dialog-pass-input");
    await page.keyboard.type(process.env.GURUFOCUS_PASSWORD!);

    // await page.$eval(
    //   "#login-dialog-pass-input",
    //   (el, password) => {
    //     (el as HTMLInputElement).value = password;
    //   },
    //   process.env.GURUFOCUS_PASSWORD!
    // );

    // await page.type("#login-dialog-pass-input", process.env.GURUFOCUS_PASSWORD!);

    await page.click(".el-button--submit");

    await page.waitForNavigation();
  } catch (error) {
    console.error("Error during login:", error);
  }
}
