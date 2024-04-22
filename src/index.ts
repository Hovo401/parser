import puppeteer from 'puppeteer-core';
import * as chromeLauncher from 'chrome-launcher';
import * as XLSX from 'xlsx';

import { execSync } from 'child_process';
const currentDirectory = execSync('pwd').toString().trim();

import express, { Request, Response } from 'express';

const app = express();
const PORT = Number(process.env.PORT) | 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.get('/generate-xlsx', (req: Request, res: Response) => {
  // Создание нового Workbook
  const workbook = XLSX.utils.book_new();

  // Создание нового листа в Workbook
  const sheet = XLSX.utils.aoa_to_sheet([
    ['Name', 'Age', "rgrg"],
    ['John', 30, 50],
    ['Doe', 25, 50 , 50 , 0],
    ['Jane', 28],
  ]);

  sheet['A1'].v = 'Name';
    sheet['B1'].v = 'Age';

  // Добавление листа в Workbook
  XLSX.utils.book_append_sheet(workbook, sheet, 'Sheet1');

  // Генерация бинарных данных XLSX файла
  const xlsxFile = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

  // Отправка файла в ответ
  res.set('Content-Disposition', 'attachment; filename="example.xlsx"');
  res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.send(xlsxFile);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

async function run() {
  console.log('testing');

    const chrome = await chromeLauncher.launch();
    const browser = await puppeteer.connect({
      browserURL: `http://localhost:${chrome.port}`,
      defaultViewport: null,
    });

    const page = await browser.newPage();

    // Navigate to a page to see the effect
    await page.goto('https://example.com');

    const screenshotPath = './result/screenshot.png';
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log('Screenshot saved to', screenshotPath);

    await browser.close();
    await chrome.kill();
}

run();


