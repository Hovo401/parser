import puppeteer from 'puppeteer';
import { createParsingData, pushParsingData, ParsingData, ParsingData_ } from '../ParsingData.js';
import { getIndexByClassNameAndInnerHTML } from '../search_functions/search_js_functions.js';

type searchInfo = {
  url: string;
};

type dataType = {
  title: string;
};

class AvitoRuMudule {
  async parsing({
    browser,
    ParsingData,
    searchInfo,
  }: {
    browser: puppeteer.Browser;
    ParsingData: ParsingData_;
    searchInfo: searchInfo;
  }) {
    try {
      const page = await browser.newPage();
      await page.setJavaScriptEnabled(false);
      // await page.setRequestInterception(true);
      // page.on('request', (req) => {
      //   if (req.resourceType() !== 'document') {
      //     req.abort();
      //   } else {
      //     req.continue();
      //   }
      // });

      await this.task({ page, searchInfo, ParsingData });

      // await page.goto('chrome://settings/');
      // await page.close();
    } catch (error) {
      // console.error(error);
    }
  }

  async task({
    page,
    searchInfo,
    ParsingData,
  }: {
    page: puppeteer.Page;
    searchInfo: searchInfo;
    ParsingData: ParsingData_;
  }) {
    try {
      console.log(searchInfo?.url);
      await page.goto(searchInfo?.url);

      const data: dataType[] = await page.evaluate(() => {
        const itemsList = Array.from(
          document.getElementsByClassName(
            'iva-item-root-_lk9K photo-slider-slider-S15A_ iva-item-list-rfgcH iva-item-redesign-rop6P iva-item-responsive-_lbhG items-item-My3ih items-listItem-Gd1jN js-catalog-item-enum',
          ),
        );

        const arrOut = [];

        for (const item of itemsList) {
          const title = item.getElementsByClassName(
            'styles-module-root-GKtmM styles-module-root-YczkZ styles-module-size_l-z_5_p styles-module-size_l_compensated-_l_w8 styles-module-size_l-YMQUP styles-module-ellipsis-a2Uq1 styles-module-weight_bold-jDthB stylesMarningNormal-module-root-S7NIr stylesMarningNormal-module-header-l-iFKq3',
          )[0];

          arrOut.push({
            title: title.innerHTML,
          });
        }
        return arrOut;
      });

      console.log(data);

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

      pushParsingData(
        {
          title: data[0]?.title,
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
