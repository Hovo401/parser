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
      page.on('request', (req) => {
        if (req.resourceType() !== 'document') {
          req.abort();
        } else {
          req.continue();
        }
      });
      for (const url of URLs) {
        await this.task({ page, url, ParsingData });
      }
      await page.goto('chrome://settings/');
      await page.close();
    } catch (error) {
      // console.error(error);
    }
  }

  async task({ page, url, ParsingData }: { page: puppeteer.Page; url: string; ParsingData: ParsingData_ }) {
    try {
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.1234.56 Safari/537.36',
      );
      await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000));
      await page.goto(url);
      await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000));

      // await Promise.all([page.waitForSelector('.sc-e472fd3d-1.dBgsUk.app-main-title__title')]);

      const title = await page.$eval('.sc-e472fd3d-1.dBgsUk.app-main-title__title', (el) => el?.innerHTML);

      let regularPrice = await page.$eval('.product-price__base-price', (el) => el?.innerHTML);
      regularPrice = regularPrice.replace('&nbsp;', ' ').replace('<!-- -->', '').replace('&nbsp;', ' ');

      const available = await page.evaluate(() => {
        return (
          document
            .getElementsByClassName('product-panel__wrapper')[0]
            ?.getElementsByClassName('sc-181f0572-2 cnGAiH')[0]?.innerHTML || 'null'
        );
      });

      const manufacturer = await topBarPardingByName(page, 'Производитель');
      const form = await topBarPardingByName(page, 'Форма выпуска');
      const activeIngredient = await topBarPardingByName(page, 'Действующее вещество');

      const prescription = await mainPardingByName(page, 'Состав');
      const usageAndDosage = await mainPardingByName(page, 'Режим дозирования');
      const indications = await mainPardingByName(page, 'Показания');
      const contraindications = await mainPardingByName(page, 'Противопоказания к применению');

      const photoUrls = await getImagesURLs(page);

      pushParsingData(
        {
          url,
          title,
          activeIngredient,
          regularPrice,
          form,
          indications,
          contraindications,
          usageAndDosage,
          manufacturer,
          available,
          prescription,
          photoUrls,
        },
        ParsingData,
      );
    } catch (error) {
      console.error('Error occurred while navigating to URL:', error);
    }
  }
}

export { ozerkiRu_cardsMudule };

async function topBarPardingByName(page: puppeteer.Page, name: string): Promise<string> {
  return await page.evaluate((propertyName) => {
    const propertyElement = [...Array.from(document.querySelectorAll('span.fSagyG'))].find((element) =>
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
    '.sc-f6074f52-4',
    (nodes, name) => {
      for (const node of nodes) {
        const header = node?.querySelector('.sc-f6074f52-6');

        if (header && header?.textContent?.trim().includes(name)) {
          const content = node?.querySelector('.sc-f6074f52-5')?.textContent?.trim();
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

      const imgElement = doc.querySelectorAll('img');
      for (const el of Array.from(imgElement)) {
        out.push('https://' + window.location.hostname + el.getAttribute('src'));
      }
    }
    return out || [];
  });
}
