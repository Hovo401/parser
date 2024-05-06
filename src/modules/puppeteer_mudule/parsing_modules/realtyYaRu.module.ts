import puppeteer from 'puppeteer';
import { createParsingData, pushParsingData, ParsingData, ParsingData_ } from '../ParsingData.js';
import { getIndexByClassNameAndInnerHTML } from '../search_functions/search_js_functions.js';
import { promises } from 'dns';

type userData = {
  searchinfo: string;
  keywords: string;
};

type dataType = {
  title?: string;
  url?: string;
  price?: string;
  description?: string;
  photoUrls?: string[];
  phone?: string | undefined;
  agencyName?: string | undefined;
};

class RealtyYaRuModule {
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
      console.error(error);
    }
  }

  async task({ page, userData, ParsingData }: { page: puppeteer.Page; userData: any; ParsingData: ParsingData_ }) {
    try {
      // console.log(this.url);

      await page.goto('https://realty.ya.ru/moskva_i_moskovskaya_oblast/kupit/kvartira/', { timeout: 120000 });
      const keywords = userData?.searchInfo?.Yandex?.searchKeywords || [];

      await cliclin({
        page,
        select: `button.Button.Button_js_inited.Button_size_l.Button_side_left.Button_theme_realty.Button_type_button.Select__button`,
      });

      await cliclin({
        page,
        select: `div.Menu__item.Menu__item_js_inited.Menu__item_size_l.Menu__item_theme_realty.Menu__item_mode_radio`,
        innerHTML_: keywords[0],
      });

      if (keywords[1] === 'Жилая') {

        await cliclin({ select: `span.Select__button-text-item`, index: 1, page });

        await cliclin({
          select: `div.Menu__item.Menu__item_js_inited.Menu__item_size_l.Menu__item_theme_realty.Menu__item_mode_radio`,
          page,
          innerHTML_: keywords[2],
        });
      } else if (keywords[1] === 'Коммерческая') {

        await cliclin({ select: `span.Select__button-text-item`, index: 1, page });

        await cliclin({
          select: `div.Menu__item.Menu__item_js_inited.Menu__item_size_l.Menu__item_theme_realty.Menu__item_mode_radio`,
          page,
          innerHTML_: 'Коммерческую',
        });
      }

      // try {
      //   await page.waitForNavigation({ timeout: 80000 });
      // } catch (error) {
      //   // console.error('Произошла ошибка во время ожидания навигации:', error);
      // }
      await new Promise((resolve) => setTimeout(resolve, 7000));

      // parser
      const data_in: dataType[] = await page.evaluate(() => {
        const elements = document.querySelectorAll(
          'li[class*="__list-item_type_offer"]'
        );

        const out = [];

        elements.forEach((el) => {
          out.push({
            title:
              el?.querySelector('span[class*="__title"]')?.textContent || 'null',
            description:
              el?.querySelector('p[class*="__description"]')?.textContent ||
              'null',
            price: el?.querySelector('span.price')?.textContent || 'null',
            url:
              'https://realty.ya.ru' + el?.querySelector('a.Link.Link_js_inited.Link_size_m')?.getAttribute('href') ||
              'null',
          });
        });
        if (out.length === 0) {
          out.push({ title: 'null' });
        }
        return out;
      });

      // console.log(data_in);
      if (data_in.length === 0) {
        data_in.push({ title: 'null' });
      }
      data_in.forEach((e) => {
        pushParsingData(e, ParsingData, 'Yandex');
      });
      // console.log(ParsingData);
    } catch (error) {
      pushParsingData({ title: 'null' }, ParsingData, 'Yandex');
      console.error('Error occurred while navigating to URL:', error);
    } finally {
      // await page.close();
    }
  }
}

export { RealtyYaRuModule };

async function cliclin({
  page,
  select,
  innerHTML_ = '',
  index = 0,
}: {
  page: puppeteer.Page;
  select: string;
  innerHTML_?: string;
  index?: number;
}): Promise<object> {
  const elements = await page.$$(select); // Находим элемент по селектору
  if (!elements[0]) {
    console.error(new Error(`Элемент с селектором '${select}' не найден`));
    return {};
  }

  // Если innerHTML_ пустой, просто кликаем по первому элементу
  if (innerHTML_ === '') {
    const boundingBox = await elements[index].boundingBox();
    if (!boundingBox) {
      console.error(new Error(`Не удалось получить геометрию элемента с селектором '${select}'`));
      return {};
    }

    // Вычисляем центральные координаты элемента
    const centerX = boundingBox.x + boundingBox.width / 2;
    const centerY = boundingBox.y + boundingBox.height / 2;

    // Кликаем по центру элемента
    await page.mouse.click(centerX, centerY);

    return {};
  }

  // Если innerHTML_ не пустой, ищем элемент по внутреннему HTML содержимому
  elements.forEach(async (element) => {
    const innerHTML = await (await element.getProperty('innerHTML')).jsonValue();
    if (innerHTML.toLocaleLowerCase().includes(innerHTML_.toLocaleLowerCase())) {
      // Получаем геометрию элемента
      const boundingBox = await element.boundingBox();
      if (!boundingBox) {
        console.error(new Error(`Не удалось получить геометрию элемента с селектором '${select}'`));
        return {};
      }

      // Вычисляем центральные координаты элемента
      const centerX = boundingBox.x + boundingBox.width / 2;
      const centerY = boundingBox.y + boundingBox.height / 2;

      // Кликаем по центру элемента
      await page.mouse.click(centerX, centerY);

      return {};
    }
  });

  return {};
}
