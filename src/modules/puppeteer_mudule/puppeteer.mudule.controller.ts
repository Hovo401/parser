import puppeteer from 'puppeteer';
import { AvitoRuMudule } from './parsing_modules/AvitoRuMudule.mudule.js';
import { ParsingData, ParsingData_, createParsingData } from './ParsingData.js';
import { getDomainName } from '../../utils/functions.js';
import { CianRuModule } from './parsing_modules/CianRu.module.js';

type searchInfo = {
  url: string;
  keywords: string;
};
type ParsingModules = {
  'www.avito.ru'?: typeof AvitoRuMudule;
  'www.cian.ru'?: typeof CianRuModule;
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
      'www.cian.ru': CianRuModule
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
    searchInfo: searchInfo,
    domainName: keyof ParsingModules,
  ): Promise<void> {
    const parser = this.parsingModules[domainName];
    if (!parser) {
      throw new Error(`No parser found for domain: ${domainName}`);
    }
    switch (domainName) {
      case 'www.avito.ru':
        searchInfo.url =
          'https://' + domainName + '/all/nedvizhimost?q=' + searchInfo?.keywords.replace(/ /g, '+') || ' ';
        break;
      case 'www.cian.ru':
        searchInfo.url =
          'https://' + domainName + '/all/nedvizhimost?q=' + searchInfo?.keywords.replace(/ /g, '+') || ' ';
        break;
    }

    await new parser().parsing({ browser: this.browser, ParsingData, searchInfo });
  }

  public async parsing(searchInfo: searchInfo): Promise<ParsingData_> {
    const parsingData: ParsingData_ = createParsingData();
    const Promiselist: Promise<void>[] = [];
    try {


      Promiselist.push(this.parsing_By_domainName(parsingData, searchInfo, 'www.avito.ru'));
      // for (const key in this.parsingModules) {

      //   Promiselist.push(this.parsing_By_domainName(parsingData, filURLs, key as keyof typeof this.parsingModules));
      // }
      await Promise.all(Promiselist);
      return parsingData;
    } catch (error) {
      return parsingData;
    }
  }
}

export default PuppeteerModule;
