import puppeteer from 'puppeteer';
import { createParsingData, pushParsingData, ParsingData, ParsingData_ } from '../ParsingData.js';
import { getIndexByClassNameAndInnerHTML } from '../search_functions/search_js_functions.js';

type userData = {
  url: string;
  keywords: string;
};

type dataType = {
  title?: string;
  url?: string;
  regularPrice?: string;
  promotionalPrice?: string;
  form?: string;
  prescription?: string;
  activeIngredient?: string;
  description?: string;
  indications?: string;
  contraindications?: string;
  usageAndDosage?: string;
  manufacturer?: string;
  available?: string;
  // photoUrls?: string[]
};

class AvitoRuMudule {
  public url: string;
  constructor() {
    this.url = '';
  }
  async parsing({
    browser,
    ParsingData,
    userData,
    url,
  }: {
    browser: puppeteer.Browser;
    ParsingData: ParsingData_;
    userData: userData;
    url: string;
  }) {
    try {
      this.url = url;
      const page = await browser.newPage();
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
      );

      await page.setJavaScriptEnabled(false);
      await page.setRequestInterception(true);
      page.on('request', (req) => {
        if (req.resourceType() !== 'document') {
          req.abort();
        } else {
          req.continue();
        }
      });

      await this.task({ page, userData, ParsingData });

      await page.goto('chrome://settings/');
      await page.close();
    } catch (error) {
      console.error(error);
    }
  }

  async task({ page, userData, ParsingData }: { page: puppeteer.Page; userData: userData; ParsingData: ParsingData_ }) {
    try {
      console.log(this.url);
      await page.goto(this.url, { timeout: 100000 });

      const data: dataType[] = await page.evaluate(() => {
        const itemsList = Array.from(document.getElementsByClassName('iva-item-root-_lk9K'));

        const arrOut = [];

        for (const item of itemsList) {
          const title = item.getElementsByClassName('styles-module-root-GKtmM')[0] || 'null';

          const url =
            'https://' +
              window.location.hostname +
              item.querySelector('a.styles-module-root-YeOVk')?.getAttribute('href') || 'null___';

          const price =
            item.querySelector('strong.styles-module-root-bLKnd')?.textContent?.replace(/&nbsp;/g, ' ') || 'null';
          const description = item.querySelector('.iva-item-descriptionStep-C0ty1')?.textContent || 'null';

          arrOut.push({
            title: title?.innerHTML?.replace(/&nbsp;/g, ' '),
            url,
            price,
            description,
          });
        }
        return arrOut;
      });

      // console.log(data);

      // await Promise.all([page.waitForSelector('.sc-f71b115b-1.jpChov')]);

      // const title = await page.$eval('.sc-afede086-1.caEzpJ', (el) => el?.innerHTML);

      // let regularPrice = await page.$eval('.product-price__base-price', (el) => el?.innerHTML);
      // regularPrice = regularPrice.replace('&nbsp;', ' ').replace('<!-- -->', '').replace('&nbsp;', ' ');

      // const available = await page.evaluate(() => {
      //   return (
      //     document
      //       .getElementsByClassName('product-panel__wrapper')[0]
      //       ?.getElementsByClassName('sc-181f0572-2 cnGAiH')[0]?.innerHTML || 'null'
      //   );
      // });
      if (data.length === 0) {
        data.push({ title: 'null' });
      }
      data.forEach((data_) => {
        pushParsingData(data_, ParsingData);
      });
      // console.log(ParsingData)
    } catch (error) {
      pushParsingData({ title: 'null' }, ParsingData);
      console.error('Error occurred while navigating to URL:', error);
    } finally {
      // await page.close();
    }
  }
}

export { AvitoRuMudule };

async function topBarPardingByName(page: puppeteer.Page, name: string): Promise<string> {
  return await page.evaluate((propertyName) => {
    const propertyElement = [...Array.from(document.querySelectorAll('span.cxutsw'))].find((element) =>
      element?.textContent?.trim().startsWith(propertyName),
    );

    if (propertyElement) {
      const valueElement = propertyElement?.nextElementSibling?.querySelector('span[title], a[title]');
      return valueElement ? String(valueElement.getAttribute('title')) : 'null';
    } else {
      return 'null';
    }
  }, name);
}

async function mainPardingByName(page: puppeteer.Page, name: string): Promise<string> {
  return await page.$$eval(
    '.sc-44f276c9-5',
    (nodes, name) => {
      for (const node of nodes) {
        const header = node?.querySelector('.sc-44f276c9-7');
        if (header && header?.textContent?.trim().includes(name)) {
          const content = node?.querySelector('.sc-44f276c9-6')?.textContent?.trim();
          return String(content);
        }
      }
      return 'null';
    },
    name,
  );
}

async function getImagesURLs(page: puppeteer.Page) {
  return await page.evaluate(() => {
    const value = document.querySelector('.sc-aa4bb14d-0.gIGWkk');
    const out = [];
    if (value) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(value.outerHTML, 'text/html');

      // Получение ссылки на изображение
      const imgElement = doc?.querySelectorAll('img');
      for (const el of Array.from(imgElement)) {
        out.push('https://' + window.location.hostname + el.getAttribute('src'));
      }
    }
    return out || [];
  });
}
