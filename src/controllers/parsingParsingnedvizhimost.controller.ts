import { Request, Response } from 'express';
import PuppeteerModule from '../modules/puppeteer_mudule/puppeteer.mudule.controller.js';

const puppeteerModule = new PuppeteerModule();

async function parsingnedvizhimost(req: Request, res: Response): Promise<void> {
  const result = await puppeteerModule.parsing(req.body?.searchInfo ?? {});
  res.json(result);
}

export { parsingnedvizhimost };
