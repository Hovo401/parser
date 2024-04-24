import { Request, Response } from 'express';
import PuppeteerModule from '../modules/puppeteer_mudule/puppeteer.mudule.controller.js';

const puppeteerModule = new PuppeteerModule();

async function parsingPharmacyURLsList(req: Request, res: Response): Promise<void> {
  const result = await puppeteerModule.parsingURLlist(req.body?.URLS ?? []);
  res.json(result);
}

export { parsingPharmacyURLsList };
