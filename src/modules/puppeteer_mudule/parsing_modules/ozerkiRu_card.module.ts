import puppeteer from 'puppeteer';
import { createParsingData, ParsingData } from '../ParsingData.js';

class ozerkiRu_cardsMudule {
    private TaskList: string[]; 

  constructor() {
    this.TaskList = [];
  }

  async parsingInit({
    browser,
    ParsingData,
    URLs,
  }: {
    browser: puppeteer.Browser;
    ParsingData: ParsingData[];
    URLs: string[];
  }): Promise<void> {
    
    this.TaskList = URLs;
  }

  async parsing ({browser, ParsingData, URLs}:{browser: puppeteer.Browser, ParsingData:ParsingData[],  URLs:string[]}){

    const delay = Math.floor(10 + Math.random() * 200);
    await new Promise((resolve) => setTimeout(resolve, delay));

    const page = await browser.newPage();

    ParsingData.push(createParsingData({  }));

    try {
      await page.goto(URLs[0]);

      const element = await page.$('.sc-e472fd3d-1.dBgsUk.app-main-title__title');
      const innerHTML = element ? await element.evaluate((el) => el.innerHTML) : undefined;
      console.log(innerHTML);
    } catch (error) {
      //   console.error('Error occurred while navigating to URL:', error);
    } finally {
      // await page.close();
    }
  }
}

export { ozerkiRu_cardsMudule };
