import puppeteer from 'puppeteer';
import { createParsingData, pushParsingData, ParsingData, ParsingData_ } from '../ParsingData.js';
import { getIndexByClassNameAndInnerHTML } from '../search_functions/search_js_functions.js';

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
      await page.setRequestInterception(true);
      page.on('request', (req)=>{
        if(req.resourceType() !== 'document'){
          req.abort();
        }else{
          req.continue();
        }
      });
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

      await Promise.all([page.waitForSelector('.sc-e472fd3d-1.dBgsUk.app-main-title__title')]);

      const title = await page.$eval('.sc-e472fd3d-1.dBgsUk.app-main-title__title', (el) => el.innerHTML);

      const regularPrice = await page.$eval('.product-price__base-price', (el) => el.innerHTML);

      const form = await page.$$eval('.sc-9ace328a-5.iLfuOW', (el) => {

        const elements = document.getElementsByClassName('sc-9ace328a-4 fSagyG');
        // const filteredElements: Element[] = [];
        let index = 0;
        for(const element of Array.from(elements)){
            
            if (element.innerHTML.includes('Форма выпуска')) {
                break;
            }index++;
        }

        return el[index].getElementsByTagName('span')[0].innerHTML;
      });

      const description = await page.$$eval('.sc-f6074f52-5.keEjdy', el => el[0].innerHTML)

      pushParsingData(
        {
          url,
          title,
          regularPrice,
          form,
          description
        },
        ParsingData,
      );
    } catch (error) {
        console.error('Error occurred while navigating to URL:', error);
    } finally {
      // await page.close();
    }
  }
}

export { ozerkiRu_cardsMudule };
