import puppeteer from 'puppeteer';
import { AvitoRuMudule } from './parsing_modules/AvitoRuMudule.mudule.js';
import { ParsingData, ParsingData_, createParsingData } from './ParsingData.js';
import { getDomainName } from '../../utils/functions.js';
import { CianRuModule } from './parsing_modules/CianRu.module.js';
import { RealtyYaRuModule } from './parsing_modules/realtyYaRu.module.js';

type userData = {
  searchInfo:{
    avito:{
      textarea:string;
    },
    Cian:{
      searchKeywords: string[];
    },
    Yandex:{
      searchKeywords: string[];
    }
  }
};

type ParsingModules = {
  'www.avito.ru'?: typeof AvitoRuMudule;
  'www.cian.ru'?: typeof CianRuModule;
  'realty.ya.ru'?: typeof RealtyYaRuModule;
};

class PuppeteerModule {
  static ex: PuppeteerModule;
  browser!: puppeteer.Browser;

  parsingModules!: ParsingModules;

  constructor() {
    if (!PuppeteerModule.ex) {
      PuppeteerModule.ex = this;
    } else {
      return PuppeteerModule.ex;
    }

    this.parsingModules = {
      'www.avito.ru': AvitoRuMudule,
      'www.cian.ru': CianRuModule,
      'realty.ya.ru': RealtyYaRuModule,
    };
  }

  public async openBrowser() {
    this.browser = await puppeteer.launch({
      executablePath: puppeteer.executablePath(),
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-features=site-per-process'],
      // headless: false, // включить отображение браузера
    });
  }

  public async parsing_By_domainName(
    ParsingData: ParsingData_,
    userData: any,
    domainName: keyof ParsingModules,
  ): Promise<void> {
    const parser = this.parsingModules[domainName];
    if (!parser) {
      throw new Error(`No parser found for domain: ${domainName}`);
    }
    let url = '';
    switch (domainName) {
      case 'www.avito.ru':
        url =
          'https://' +
            domainName +
            '/all/nedvizhimost?q=' +
            userData?.searchInfo?.avito?.textarea?.replace(/ /g, '+') || ' ';
        break;
      case 'www.cian.ru':
        url = 'https://' + domainName + '/';
        break;
    }

    await new parser().parsing({ browser: this.browser, ParsingData, userData, url });
  }

  public async parsing(userData: userData): Promise<ParsingData_> {
    const parsingData: ParsingData_ = createParsingData();
    const Promiselist: Promise<void>[] = [];
    try {

      Promiselist.push(this.parsing_By_domainName(parsingData, userData, 'www.avito.ru'));
      Promiselist.push(this.parsing_By_domainName(parsingData, userData, 'www.cian.ru'));
      Promiselist.push(this.parsing_By_domainName(parsingData, userData, 'realty.ya.ru'));

      // for (const key in this.parsingModules) {
      //   Promiselist.push(this.parsing_By_domainName(parsingData, filURLs, key as keyof typeof this.parsingModules));
      // }
      await Promise.all(Promiselist);

      return parsingData;
    } catch (error) {
      console.error('puppeteer parsing error:', error)
      return parsingData;
    }
  }
}

export default PuppeteerModule;
