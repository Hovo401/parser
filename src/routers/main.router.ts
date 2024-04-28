import express, { Request, Response } from 'express';

import { parsingnedvizhimost } from '../controllers/parsingParsingnedvizhimost.controller.js';

const router = express();

router.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

router.post('/nedvizhimost', parsingnedvizhimost);

export default router;
