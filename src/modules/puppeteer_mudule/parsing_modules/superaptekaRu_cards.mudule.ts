import puppeteer from 'puppeteer';
import { createParsingData, pushParsingData, ParsingData, ParsingData_ } from '../ParsingData.js';
import { getIndexByClassNameAndInnerHTML } from '../search_functions/search_js_functions.js';

class SuperaptekaRu_cardsMudule {
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
<<<<<<< HEAD
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.1234.56 Safari/537.36',
      );
=======
>>>>>>> 07d8fd584e2d6d4c2e1ef32b25fd2343dc995102
      await page.goto('https://superapteka.ru');
      await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000));
      await page.goto(url);
      await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000));
      // await Promise.all([page.waitForSelector('.sc-f71b115b-1.jpChov')]);

      const pageTitle = await page.$eval('title', (e) => e.innerHTML);

      if (pageTitle === 'DDoS-Guard') {
        await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000));
        await page.goto(url);
        const pageTitle = await page.$eval('title', (e) => e.innerHTML);
        if (pageTitle === 'DDoS-Guard') {
          pushParsingData(
            {
              url,
              title: 'DDoS failure',
            },
            ParsingData,
          );
          return;
        }
      }

      const title = await page.$eval('.sc-afede086-1.caEzpJ', (el) => el?.innerHTML);

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
      const description = await mainPardingByName(page, 'Описание');
      let usageAndDosage = await mainPardingByName(page, 'Режим дозирования');
      if (usageAndDosage === 'null') {
        usageAndDosage = await mainPardingByName(page, 'Применение');
      }
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
          description,
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
    } finally {
      // await page.close();
    }
  }
}

export { SuperaptekaRu_cardsMudule };

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
