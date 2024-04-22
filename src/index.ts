import puppeteer from 'puppeteer';
import * as XLSX from 'xlsx';
import express, { Request, Response } from 'express';
import { execSync } from 'child_process';
import path from 'path';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const currentDirectory = execSync('pwd').toString().trim();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.get('/generate-xlsx', (req: Request, res: Response) => {
  try {
    // Создание нового Workbook
    const workbook = XLSX.utils.book_new();

    // Создание нового листа в Workbook
    const sheet = XLSX.utils.aoa_to_sheet([
      ['Name', 'Age'],
      ['John', 30],
      ['Doe', 25],
      ['Jane', 28],
    ]);

    // Добавление листа в Workbook
    XLSX.utils.book_append_sheet(workbook, sheet, 'Sheet1');

    // Генерация бинарных данных XLSX файла
    const xlsxFile = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Отправка файла в ответ
    res.set('Content-Disposition', 'attachment; filename="example.xlsx"');
    res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(xlsxFile);
  } catch (error) {
    res.status(500).send('Error generating XLSX file');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

async function run() {
  try {
    console.log('testing');
    console.log('Current directory:', currentDirectory);

    const browser = await puppeteer.launch({
      // Указываем путь к исполняемому файлу Chrome, который идет в комплекте с Puppeteer
      executablePath: puppeteer.executablePath(),
      // Указываем аргументы для браузера
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    // Override geolocation permissions
    const context = browser.defaultBrowserContext();
    await context.overridePermissions('https://arasaca.pp.ua', []);

    // Navigate to a page to see the effect
    await page.goto('https://example.com');

    const screenshotPath = path.join("./", 'result', 'screenshot.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log('Screenshot saved to', screenshotPath);

    await browser.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

run();
