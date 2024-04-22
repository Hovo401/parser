import puppeteer from 'puppeteer';
import path from 'path';

async function run() {
  try {
    console.log('testing');

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
    await page.goto('https://arasaca.pp.ua');

    const screenshotPath = path.join("./", 'result', 'screenshot.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log('Screenshot saved to', screenshotPath);

    await browser.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

run();