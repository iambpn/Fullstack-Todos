import * as dotEnv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
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

  app.use('*', (req: any, res: any, next: NextFunction) => {
    next('404. Route not found.');
  });

  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (req.xhr) {
      return res.status(err.status || 500).json({
        error: {
          type: 'server',
          msg: err.message || err || 'Something went wrong.',
        },
      });
    } else {
      res.set('Content-Type', 'text/html');
      return res
        .status(err.status || 500)
        .send(
          `<h1 style='text-align: center'>${
            err.message || err || 'Something went wrong.'
          }</h1>`
        );
    }
  });

  app.listen(8080, () => {
    console.log('Listening on port: 8080');
  });
}

connect();
