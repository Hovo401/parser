import express, { Request, Response } from 'express';

import { parsingnedvizhimost } from '../controllers/parsingParsingnedvizhimost.controller.js';
import { getUserInfo, setUserInfo } from '../controllers/userInfo.controller.js';

const router = express();

// router.get('/', (req: Request, res: Response) => {
//   res.send('Hello World!');
// });

router.post('/nedvizhimost', parsingnedvizhimost);

router.get('/getUserInfo', getUserInfo);
router.post('/setUserInfo', setUserInfo);

export default router;
