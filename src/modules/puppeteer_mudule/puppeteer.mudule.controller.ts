import puppeteer from 'puppeteer';
import { SuperaptekaRu_cardsMudule } from './parsing_modules/superaptekaRu_cards.mudule.js';
import { ozerkiRu_cardsMudule } from './parsing_modules/ozerkiRu_card.module.js';
import { ParsingData, ParsingData_, createParsingData } from './ParsingData.js';
import { getDomainName } from '../../utils/functions.js';
import { AsnaRu_cardsMudule } from './parsing_modules/AsnaRu_cards.mudule.js';
import { AloeaptekaRuMudule } from './parsing_modules/AloeaptekaRu.mudule.js';
import { ZhivikaRuMudule } from './parsing_modules/ZhivikaRu.mudule.js';

type URLS = string[];

type ParsingModules = {
  'superapteka.ru'?: typeof SuperaptekaRu_cardsMudule;
  'ozerki.ru'?: typeof ozerkiRu_cardsMudule;
  'www.asna.ru'?: typeof AsnaRu_cardsMudule;
  'aloeapteka.ru'?: typeof AloeaptekaRuMudule;
  'zhivika.ru'?: typeof ZhivikaRuMudule;
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
      'superapteka.ru': SuperaptekaRu_cardsMudule,
      'ozerki.ru': ozerkiRu_cardsMudule,
      'www.asna.ru': AsnaRu_cardsMudule,
      'aloeapteka.ru': AloeaptekaRuMudule,
      'zhivika.ru': ZhivikaRuMudule,
    };
  }

  public async openBrowser() {
    this.browser = await puppeteer.launch({
      executablePath: puppeteer.executablePath(),
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-features=site-per-process'],
      // headless: false,
      // defaultViewport: null,
      // ignoreHTTPSErrors: true
    });
  }

  public async parsing_By_domainName(
    ParsingData: ParsingData_,
    filURLs: string[],
    domainName: keyof ParsingModules,
  ): Promise<void> {
    const parser = this.parsingModules[domainName];
    if (!parser) {
      throw new Error(`No parser found for domain: ${domainName}`);
    }

    await new parser().parsing({ browser: this.browser, ParsingData, URLs: filURLs });
  }

  public async parsingURLlist(list: URLS): Promise<ParsingData_> {
    const parsingData: ParsingData_ = createParsingData();
    const Promiselist: Promise<void>[] = [];
    try {
      for (const key in this.parsingModules) {
        const filURLs = list.filter((e) => getDomainName(e) === key);
        if (filURLs.length === 0) {
          continue;
        }
        Promiselist.push(this.parsing_By_domainName(parsingData, filURLs, key as keyof typeof this.parsingModules));
      }
      await Promise.all(Promiselist);
      return parsingData;
    } catch (error) {
      return parsingData;
    }
  }
}

export default PuppeteerModule;
