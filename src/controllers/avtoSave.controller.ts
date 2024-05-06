import * as schedule from 'node-schedule';
import * as fs from 'fs';
import path from 'path';
import { __srcDirName } from '../utils/dirPath.js';
import PuppeteerModule from '../modules/puppeteer_mudule/puppeteer.mudule.controller.js';
import { transformData, ParsingData } from '../modules/puppeteer_mudule/ParsingData.js';
import { createFile } from '../modules/XLSX.module.js';

const puppeteerModule = new PuppeteerModule();
// Создаем правило для выполнения действия
const rule = new schedule.RecurrenceRule();
rule.hour = 23; // Устанавливаем час
rule.minute = 0; // Устанавливаем минуту

async function jobFun() {
  try {
    const data = await fs.promises.readFile(path.join(__srcDirName, '..', 'data', 'userSettings.json'), 'utf-8');
    const jsonData = JSON.parse(data);

    console.log(`avto Parsing start date: ${new Date(Date.now())} ;`);

    const result = await puppeteerModule.parsing(jsonData ?? {});
    const parsedResult = result as ParsingData;
    const fileData = transformData(parsedResult);

    const file1Buffer = createFile(fileData);
    const fileName = `parsing_${new Date(Date.now()).toISOString().slice(0, 10)}_${new Date(Date.now()).toLocaleTimeString('en-US', { hour12: false }).replace(/:/g, '-')}.xlsx`;
    fs.writeFileSync(path.join(__srcDirName, '..', 'data', 'parsingData', fileName), Buffer.from(file1Buffer));

    console.log('file saved: name - ' + fileName);
  } catch (error) {
    console.error('avtoSave error: ', error);
  }
}

function jobStart() {
  // Задаем задачу, которая будет выполняться по заданному правилу
  const job = schedule.scheduleJob(rule, jobFun);
  console.log(
    'Задача настроена на выполнение каждый день ' +
      rule.hour +
      ':' +
      (Math.floor(Number( rule.minute) / 10) == 0 ? '0' + rule.minute : rule.minute),
  );
}

export { jobStart };
