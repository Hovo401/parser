import express, { Request, Response } from 'express';

import { parsingnedvizhimost } from '../controllers/parsingParsingnedvizhimost.controller.js';
import { getUserInfo, setUserInfo } from '../controllers/userInfo.controller.js';
import { getParsingDataList } from '../controllers/parsingData.controller.js';

const router = express();

// router.get('/', (req: Request, res: Response) => {
//   res.send('Hello World!');
// });

router.post('/nedvizhimost', parsingnedvizhimost);

router.get('/getUserInfo', getUserInfo);
router.post('/setUserInfo', setUserInfo);

router.get('/getParsingDataList', getParsingDataList);

export default router;
