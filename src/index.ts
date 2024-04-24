import express from 'express';
import mainRouter from './routers/main.router.js';
import PuppeteerModule from './modules/puppeteer_mudule/puppeteer.mudule.controller.js';

const app = express();
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
