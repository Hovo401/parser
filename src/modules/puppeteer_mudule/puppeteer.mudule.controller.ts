import puppeteer from 'puppeteer';
import { SuperaptekaRu_cardsMudule } from './parsing_modules/superaptekaRu_cards.mudule.js';
import { ozerkiRu_cardsMudule } from './parsing_modules/ozerkiRu_card.module.js';
import { ParsingData, createParsingData } from './ParsingData.js';
import { getDomainName } from '../../utils/functions.js';

type URLS = string[];

type domainName = 'superapteka.ru' | 'ozerki.ru';
type ParsingModules = {
  'superapteka.ru'?: typeof SuperaptekaRu_cardsMudule;
  'ozerki.ru'?: typeof ozerkiRu_cardsMudule;
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
      'superapteka.ru':  SuperaptekaRu_cardsMudule,
      'ozerki.ru':  ozerkiRu_cardsMudule,
    };
  }

  public async openBrowser() {
    this.browser = await puppeteer.launch({
      executablePath: puppeteer.executablePath(),
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: false, // включить отображение браузера
    });
  }

  public async parsing_By_domainName(ParsingData: ParsingData[], filURLs: string[], domainName: keyof ParsingModules): Promise<void> {

    const parser = this.parsingModules[domainName];
    if (!parser) {
      throw new Error(`No parser found for domain: ${domainName}`);
    }
  
    await new parser().parsing({browser: this.browser,  ParsingData, URLs: filURLs});

  }
  

  public async parsingURLlist(list: URLS): Promise<ParsingData[]> {
    const result: ParsingData[] = [];
    const Promiselist: Promise<void>[] = [];

    for (const key in this.parsingModules) {
      const filURLs = list.filter((e) => getDomainName(e) === key);
      if(filURLs.length === 0){
        continue;
      }
      console.log(filURLs)
      // Promiselist.push(this.parsing_By_domainName(result, filURLs, key as keyof typeof this.parsingModules));
    }



    await Promise.all(Promiselist);

    return result;
  }
}

export default PuppeteerModule;
