import puppeteer from 'puppeteer';
import { createParsingData, ParsingData } from '../ParsingData.js';

class SuperaptekaRu_cardsMudule {
  constructor() {}

  async parsing({
    browser,
    ParsingData,
    url,
  }: {
    browser: puppeteer.Browser;
    ParsingData: ParsingData[];
    url: string;
  }): Promise<void> {
    const delay = Math.floor(500 + Math.random() * 4000);
    await new Promise((resolve) => setTimeout(resolve, delay));
    const page = await browser.newPage();

    ParsingData.push(createParsingData({ url }));

    try {
      await page.goto(url);
      const pageTitle = await page.title();

      const element = await page.$('.sc-afede086-1.caEzpJ');
      const innerHTML = element ? await element.evaluate((el) => el.innerHTML) : undefined;

      console.log(innerHTML);
    } catch (error) {
      console.error('Error occurred while navigating to URL:', error);
    } finally {
      // await page.close();
    }
  }
}

export { SuperaptekaRu_cardsMudule };
