import express, { Request, Response } from 'express';

import { parsingPharmacyURLsList } from '../controllers/parsingPharmacyURLsList.controller.js';

const router = express();


router.post('/parsingPharmacyURLsList', parsingPharmacyURLsList);

// router.get('/parsingPharmacyURLsList', (req: Request, res: Response) => {
//   req.body = {
//     URLS: [
//       'https://ozerki.ru/catalog/product/ksamiol-gel-naruzh-fl-60g/',
//       'https://superapteka.ru/catalog/product/nikorette-rezinka-zhevatelnaya-svezhaya-myata-4-mg-30-1/',
//     ],
//   };
//   parsingPharmacyURLsList(req, res);
// });

export default router;
