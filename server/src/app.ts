// Assigns variables in .env to process.env. This must be done before any other
// files are imported, since those files may require environment variables.
import * as dotenv from 'dotenv';
dotenv.config();

import express, { type NextFunction, type Request, type Response } from 'express';
import cookieParser from 'cookie-parser';

import config from './config/config.js';
import logger from './logger.js';
import routes from './routes/index.js';

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', config.frontendUrl); 
  
  res.setHeader('Access-Control-Allow-Credentials', 'true'); 
  // Allow specific HTTP methods
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS'); 
  
  // Allow headers requested by the client
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle browser OPTIONS preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

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