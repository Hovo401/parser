import express, { Request, Response } from 'express';


import * as dirPath from '../utils/dirPath.js';
const app = express();
console.log(dirPath.getDirName(import.meta.url));

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
  });

  // app.get('/generate-xlsx', (req: Request, res: Response) => {

  // });

export default app;