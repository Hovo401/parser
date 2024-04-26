import puppeteer from 'puppeteer';
import { createParsingData, pushParsingData, ParsingData, ParsingData_ } from '../ParsingData.js';

class ozerkiRu_cardsMudule {
  async parsing({
    browser,
    ParsingData,
    URLs,
  }: {
    browser: puppeteer.Browser;
    ParsingData: ParsingData_;
    URLs: string[];
  }) {
    try {
      const page = await browser.newPage();
      await page.setJavaScriptEnabled(false);
      for (const url of URLs) {
        await this.task({ page, url, ParsingData });
      }
      // const delay = Math.floor(10 + Math.random() * 200);
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      await page.goto('chrome://settings/');
      await page.close();
    } catch (error) {
      // console.error(error);
    }
  }

  async task({ page, url, ParsingData }: { page: puppeteer.Page; url: string; ParsingData: ParsingData_ }) {
    // const delay = Math.floor(10 + Math.random() * 200);
    // await new Promise((resolve) => setTimeout(resolve, delay));

    // ParsingData.push(createParsingData({}));

    try {
      page.goto(url);

      // const element = await page.waitForSelector('.sc-e472fd3d-1.dBgsUk.app-main-title__title');

      await Promise.all([page.waitForSelector('.sc-e472fd3d-1.dBgsUk.app-main-title__title')]);

      const title = await page.$eval('.sc-e472fd3d-1.dBgsUk.app-main-title__title', (el) => el.innerHTML);

      const regularPrice = await page.$eval('.product-price__base-price', (el) => el.innerHTML);

      // const title = await page.$('.sc-e472fd3d-1.dBgsUk.app-main-title__title');
      // const title_innerHTML = title ? await title.evaluate((el) => el.innerHTML) : undefined;

      pushParsingData(
        {
          url,
          title,
          regularPrice,
        },
        ParsingData,
      );
    } catch (error) {
      //   console.error('Error occurred while navigating to URL:', error);
    } finally {
      // await page.close();
    }
  }
}

export { ozerkiRu_cardsMudule };
