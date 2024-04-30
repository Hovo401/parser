import { Request, Response } from 'express';
import * as fs from 'fs';
import path from 'path';
import { __srcDirName } from '../utils/dirPath.js';

async function getUserInfo(req: Request, res: Response): Promise<void> {
    try {
        // Чтение содержимого файла
        const data = await fs.promises.readFile(path.join(__srcDirName, '..', 'data', 'userSettings.json'), 'utf-8');
        
        // Парсинг JSON
        const jsonData = JSON.parse(data);
        
        // Отправка JSON как ответа
        res.json(jsonData);
      } catch (err) {
        // Обработка ошибок
        console.error('Ошибка при чтении файла:', err);
        res.status(500).json({ error: 'Ошибка при чтении файла' });
    }
}
async function setUserInfo(req: Request, res: Response): Promise<void>{
  try {
    const userData = req.body; // Предположим, что данные приходят в виде JSON в теле запроса
    
    // Преобразование данных в строку JSON
    const jsonData = JSON.stringify(userData);
    
    // Запись данных в файл
    await fs.promises.writeFile(path.join(__srcDirName, '..', 'data', 'userSettings.json'), jsonData, 'utf-8');
    
    // Отправка подтверждения
    res.json({ message: 'Данные успешно записаны' });

  } catch (err) {
    // Обработка ошибок
    console.error('Ошибка', err);
    res.status(500).json({ error: 'Ошибка' });
  }
}
export {getUserInfo, setUserInfo}