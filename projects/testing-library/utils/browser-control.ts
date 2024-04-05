import puppeteer, { Browser, Page } from "puppeteer";

export async function startBrowser(url: string, headless: boolean) {
    const browser = await puppeteer.launch({ headless });
    const page = await browser.newPage();

    await page.goto(url, { timeout: 60_000 });
    await page.waitForNetworkIdle();

    return { browser, page };
}

export async function stopBrowser(browser: Browser, page: Page) {
    await page.close();
    await browser.close();
}
