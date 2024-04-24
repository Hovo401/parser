import puppeteer from 'puppeteer';
import { SuperaptekaRu_cardsMudule } from './parsing_modules/superaptekaRu_cards.mudule.js';
import { ozerkiRu_cardsMudule } from './parsing_modules/ozerkiRu_card.module.js';
import { ParsingData, createParsingData } from './ParsingData.js';
import { getDomainName } from '../../utils/functions.js';

type URLS = string[];

type domainName = 'superapteka.ru' | 'ozerki.ru';
type ParsingModules = {
  'superapteka.ru': SuperaptekaRu_cardsMudule;
  'ozerki.ru': ozerkiRu_cardsMudule;
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
      'superapteka.ru': new SuperaptekaRu_cardsMudule(),
      'ozerki.ru': new ozerkiRu_cardsMudule(),
    };
  }

  public async openBrowser() {
    this.browser = await puppeteer.launch({
      executablePath: puppeteer.executablePath(),
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: false, // включить отображение браузера
    });
  }

  public async parsing_By_domainName(ParsingData: ParsingData[], filURLs: string[], domainName: domainName): Promise<void> {
    this.parsingModules[domainName].parsing({ browser: this.browser, ParsingData, URLs: filURLs });
  }

  public async parsingURLlist(list: URLS): Promise<ParsingData[]> {
    const result: ParsingData[] = [];
    const Promiselist: Promise<void>[] = [];

    for (const key in this.parsingModules) {
      const filURLs = list.filter((e) => getDomainName(e) === key);
      Promiselist.push(this.parsing_By_domainName(result, filURLs, domainName as keyof typeof this.parsingModules));
    }

    // list.forEach((url) => {
    //   const domainName = getDomainName(url);
    //   if (domainName in this.parsingModules) {
    //     Promiselist.push(this.parsing_By_domainName(result, url, domainName as keyof typeof this.parsingModules));
    //   } else {
    //     result.push(createParsingData({}));
    //   }
    // });

    await Promise.all(Promiselist);

    return result;
  }
}

export default PuppeteerModule;
