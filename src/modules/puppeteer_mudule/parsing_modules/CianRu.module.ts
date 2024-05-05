import puppeteer from 'puppeteer';
import { createParsingData, pushParsingData, ParsingData, ParsingData_ } from '../ParsingData.js';
import { getIndexByClassNameAndInnerHTML } from '../search_functions/search_js_functions.js';

type userData = {
  searchinfo: string;
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

class CianRuModule {
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

      // await page.setJavaScriptEnabled(false);
      await page.setRequestInterception(true);
      page.on('request', (request) => {
        if (request.resourceType() === 'image') {
          request.abort();
        } else {
          request.continue();
        }
      });

      await this.task({ page, userData, ParsingData });

      await page.goto('chrome://settings/');
      await page.close();
    } catch (error) {
      // console.error(error);
    }
  }

  async task({ page, userData, ParsingData }: { page: puppeteer.Page; userData: any; ParsingData: ParsingData_ }) {
    try {
      console.log(this.url);

      await page.goto('https://www.cian.ru/', { timeout: 100000 });
      const keywords = userData?.searchInfo?.Cian?.searchKeywords || [];

      const request: any = {
        jsonQuery: {
          _type: (() => {
            let out = '';

            if (keywords[1] === 'Коммерческая') {
              out += 'commercial';
            } else if (keywords[1] === 'Жилая') {
              if (keywords[2] === 'Комнату') {
                out += 'flat';
              } else if (keywords[2] === 'дом') {
                out += 'suburban';
              } else if (keywords[2] === 'гараж') {
                out += 'commercial';
              }
            }

            if (keywords[0] === 'Снять') {
              out += 'rent';
            } else if (keywords[0] === 'Купить') {
              out += 'sale';
            }
            return out;
          })(),
          engine_version: { type: 'term', value: 2 },
          region: { type: 'terms', value: [1] },
          room: { type: 'terms', value: [0] },
          publish_period: { type: 'term', value: -2 },
          page: { type: 'term', value: 0 },
        },
      };

      if (keywords[2] === 'гараж') {
        request.jsonQuery.office_type = { type: 'terms', value: [6] };
      }
      // console.log(request, keywords);

      const data: any = await postreq(page, request);

      const qaunt = (() => {
        if (data?.offerCount / 27 && data?.offerCount / 27 < 10) {
          return data?.offerCount / 27;
        } else {
          return 10;
        }
      })();
      for (let i = 1; i <= qaunt; i++) {
        request.jsonQuery.page = { type: 'term', value: i };
        const data_page: any = await postreq(page, request);
        data?.offersSerialized?.push(...data_page.offersSerialized);
      }

      // console.log(data?.offersSerialized);

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

      if (!data?.offersSerialized || data?.offersSerialized.length === 0) {
        data.offersSerialized = { title: 'null' };
      }
      data?.offersSerialized?.forEach((data_: any) => {
        // const num: any = data_?.user?.phoneNumbers || {};
        const data_in = {
          title: data_?.formattedFullInfo || 'null',
          price: data_?.formattedFullPrice || 'null',
          url: data_?.fullUrl || 'null',
          description: data_?.description || 'null',
          agencyName: data_?.user?.agencyName || 'null',
          // phone: (num[0]?.countryCode || '') + (num[0]?.number || 'null'),
        };
        pushParsingData(data_in, ParsingData, 'cian');
      });
      // console.log(ParsingData);
    } catch (error) {
      pushParsingData({ title: 'null' }, ParsingData, 'cian');
      console.error('Error occurred while navigating to URL:', error);
    } finally {
      // await page.close();
    }
  }
}

export { CianRuModule };

async function postreq(paage: puppeteer.Page, request: any) {
  return await paage.evaluate(async (data: any) => {
    let arrOut: any = {};

    const url = 'https://api.cian.ru/search-offers/v2/search-offers-desktop/';

    const headers = new Headers();
    headers.append('Accept', '*/*');
    headers.append('Accept-Encoding', 'gzip, deflate, br, zstd');
    headers.append('Accept-Language', 'ru-RU,ru;q=0.9,en;q=0.8');
    headers.append('Content-Type', 'application/json');
    // Добавляем заголовки cookie, user-agent и другие, как указано в вашем списке заголовков
    //headers.append('Cookie', '_CIAN_GK=b818e195-f3b6-4f45-95da-0be7d4297e40; _gcl_au=1.1.1040443127.1714239379; tmr_lvid=79b0faebf94d1b64b48965211dddafbe; ...'); // Ваш список cookie
    // headers.append(
    //   'User-Agent',
    //   'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    // ); // Ваш user-agent

    const options = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    arrOut = await response.json();

    return arrOut?.data;
  }, request);
}
