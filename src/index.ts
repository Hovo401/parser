import express from 'express';
import mainRouter from './routers/main.router.js';
import PuppeteerModule from './modules/puppeteer_mudule/puppeteer.mudule.controller.js';
import cors from 'cors';
import path from 'path';
import { __srcDirName } from './utils/dirPath.js';
import fs from 'fs';
import { jobStart } from './controllers/avtoSave.controller.js';

const app = express();

app.use(cors());
app.use(express.static(path.join(__srcDirName, '..', 'static', 'parser_react', 'build')));
app.use(express.static(path.join(__srcDirName, '..', 'data')));
app.use(express.json());
app.use(mainRouter);

const PORT = Number(process.env.PORT) || 3000;

const puppeteerModule: PuppeteerModule = new PuppeteerModule();

async function start() {
  try {
    await puppeteerModule.openBrowser();
    jobStart();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} \n`);
    });
  } catch (e) {
    console.error(e);
  }
}
start();
