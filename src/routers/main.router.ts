import express, { Request, Response } from 'express';

import {parsingPharmacyURLsList} from '../controllers/parsingPharmacyURLsList.controller.js';

const router = express();

router.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

router.post('/parsingPharmacyURLsList', parsingPharmacyURLsList);

export default router;
