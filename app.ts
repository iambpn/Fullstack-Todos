import * as dotEnv from 'dotenv';
import express from 'express';
import routes from './src/Routes';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import * as path from 'path';
import SeedInit from './src/Seeders/index';

import { initialize_DB } from './src/Models/init';

declare namespace Express {
  export interface Request {
    user?: string;
  }
}

async function connect() {
  dotEnv.config({ path: `${path.join(process.cwd(), '.env')}` });
  const app = express();

  app.use(cors());

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.use(cookieParser(process.env.secret));

  await initialize_DB();

  //seed users
  SeedInit();

  app.use('/api', routes);

  app.listen(8080, () => {
    console.log('Listening on port: 8080');
  });
}

connect();
