import express, { NextFunction, Request, Response } from 'express';
import logger from './logger';

const app = express();

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