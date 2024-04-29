import puppeteer from 'puppeteer';
import { createParsingData, pushParsingData, ParsingData, ParsingData_ } from '../ParsingData.js';
import { getIndexByClassNameAndInnerHTML } from '../search_functions/search_js_functions.js';

class ZhivikaRuMudule {
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
      await page.goto(url);

      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.1234.56 Safari/537.36',
      );
      //   const pageTitle = await page.$eval('h1', (e) => e.innerHTML);

      //   if (pageTitle === 'DDoS-Guard') {
      //     await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000));
      //     await page.goto(url);
      //     const pageTitle = await page.$eval('title', (e) => e.innerHTML);
      //     if (pageTitle === 'DDoS-Guard') {
      //       pushParsingData(
      //         {
      //           url,
      //           title: 'DDoS fale',
      //         },
      //         ParsingData,
      //       );
      //       return;
      //     }
      //   }

      const title = await page.evaluate(() => document.getElementsByTagName('h1')[0]?.innerHTML || 'null');

      const regularPrice = await page.$eval('.product-page-big-price', (el) => el?.textContent || 'null');
      //   regularPrice = regularPrice.replace('&nbsp;', ' ').replace('<!-- -->', '').replace('&nbsp;', ' ');

      //   const available = await page.evaluate(() => {
      //     return document
      //       .querySelector('p.loc')
      //       ?.innerHTML?.replace(/[^а-яё0-9\s]/gi, '')
      //       .trim();
      //   });

      //   const manufacturer = await topBarPardingByName(page, 'Производитель');
      //   const form = await topBarPardingByName(page, 'Форма выпуска');
      //   const activeIngredient = await topBarPardingByName(page, 'Действующее вещество');

      //   const description = await page.evaluate(() => {
      //     return document.getElementsByTagName('article')[2]?.textContent || 'null';
      //   });

      const prescription = await mainPardingByName(page, 'Состав');
      const usageAndDosage = await mainPardingByName(page, 'Способ применения');
      const indications = await mainPardingByName(page, 'Показания');
      const contraindications = await mainPardingByName(page, 'Противопоказания');

      //   const photoUrls = await getImagesURLs(page);
      const photoUrls = await page.evaluate(() => {
        return (
          document
            .getElementsByClassName('product-main-block-left__image')[0]
            ?.getElementsByTagName('img')[0]
            ?.src.trim() || 'null'
        );
      });

      pushParsingData(
        {
          url,
          title,
          //   activeIngredient,
          regularPrice,
          //   description,
          //   form,
          indications,
          contraindications,
          usageAndDosage,
          //   manufacturer,
          //   available,
          prescription,
          photoUrls: [photoUrls],
        },
        ParsingData,
      );
    } catch (error) {
      // console.error('Error occurred while navigating to URL:', error);
    } finally {
      // await page.close();
    }
  }
}

export { ZhivikaRuMudule };

// async function topBarPardingByName(page: puppeteer.Page, name: string): Promise<string> {
//   return await page.evaluate((propertyName) => {

//     const propertyElement = [...Array.from(document.getElementsByTagName('article')[0].getElementsByTagName('dl'))].find((element) =>
//       element?.textContent?.trim().startsWith(propertyName),
//     );

//     if (propertyElement) {
//       const valueElement = propertyElement?.nextElementSibling?.querySelector('span[title], a[title]');
//       return valueElement ? String(valueElement.getAttribute('title')) : 'null';
//     } else {
//       return 'null';
//     }
//   }, name);
// }

async function topBarPardingByName(page: puppeteer.Page, name: string): Promise<string> {
  return await page.evaluate((key) => {
    // Поиск элементов <dt>, содержащих указанный ключ
    const dtElements = document.querySelectorAll('dt');
    for (let i = 0; i < dtElements.length; i++) {
      const dtElement = dtElements[i];
      if (dtElement?.textContent?.trim() === key) {
        // Получение соответствующего элемента <dd>
        const ddElement = dtElement?.nextElementSibling;
        if (ddElement) {
          return ddElement?.textContent?.trim() || 'null';
        }
      }
    }
    return 'null'; // Возвращаем null, если ключ не найден
  }, name);
}

async function mainPardingByName(page: puppeteer.Page, name: string): Promise<string> {
  return await page.$$eval(
    '.product-page-instructions__item',
    (nodes, name) => {
      for (const node of nodes) {
        const header = node?.querySelector('.g-standard-title.product-page-instructions__title');
        if (header && header?.textContent?.trim().includes(name)) {
          const content = node?.querySelector('.g-pre-wrap')?.textContent?.trim();
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
