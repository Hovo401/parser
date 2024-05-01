import { Request, Response } from 'express';
import * as fs from 'fs';
import path from 'path';
import { __srcDirName } from '../utils/dirPath.js';

async function getParsingDataList(req: Request, res: Response): Promise<void> {

  const parsingDataDir = path.join(__srcDirName, '..', 'data', 'parsingData');
  fs.readdir(parsingDataDir, (err, files) => {
    if (err) {
      return res.status(500).send('Internal Server Error');
    }
    res.json({ files });
  });
  
}
export { getParsingDataList };
