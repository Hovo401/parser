import puppeteer from 'puppeteer';
import { createParsingData, ParsingData_ } from '../ParsingData.js';

class SuperaptekaRu_cardsMudule {
  constructor() {}

  async parsing({
    browser,
    ParsingData,
    URLs,
  }: {
    browser: puppeteer.Browser;
    ParsingData: ParsingData_;
    URLs: string[];
  }): Promise<void> {
    const delay = Math.floor(500 + Math.random() * 4000);
    await new Promise((resolve) => setTimeout(resolve, delay));
    const page = await browser.newPage();

    // ParsingData.push(createParsingData());

    try {
      await page.goto(URLs[0]);
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
