import express from 'express';
import mainRouter from './routers/main.router.js';
import PuppeteerModule from './modules/puppeteer_mudule/puppeteer.mudule.controller.js';
import cors from 'cors';
import path from 'path';
import { __srcDirName } from './utils/dirPath.js';

const app = express();

app.use(cors());
app.use(express.static(path.join(__srcDirName, '..', 'static', 'parser_react', 'build')));
app.use(express.json());
app.use(mainRouter);

const PORT = Number(process.env.PORT) || 3000;

const puppeteerModule: PuppeteerModule = new PuppeteerModule();

async function start() {
  try {
    await puppeteerModule.openBrowser();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (e) {
    console.error(e);
  }
}
start();
