import { Request, Response } from 'express';
import PuppeteerModule from '../modules/puppeteer_mudule/puppeteer.mudule.controller.js';
import { transformData, ParsingData } from '../modules/puppeteer_mudule/ParsingData.js';
import { creatFile } from '../modules/XLSX.module.js';

const puppeteerModule = new PuppeteerModule();

async function parsingPharmacyURLsList(req: Request, res: Response): Promise<void> {
  const result = await puppeteerModule.parsingURLlist(req.body?.URLS ?? []);

  const parsedResult = result as ParsingData;

  const fileData = transformData(parsedResult); // Получаем данные файла XLSX

  // Отправляем данные файла в ответе
  // res.attachment('parsedData.xlsx');
  res.json(fileData);
}

export { parsingPharmacyURLsList };
