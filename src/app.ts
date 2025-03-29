// Assigns variables in .env to process.env. This must be done before any other
// files are imported, since those files may require environment variables.
import * as dotenv from 'dotenv';
dotenv.config();

import express, { NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';

import logger from './logger';
import routes from './routes';

const app = express();

app.use(cookieParser());

app.use(routes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
});
  
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(error);
    return res
        .status(500)
        .send({ error: error.message });
});

export default app;