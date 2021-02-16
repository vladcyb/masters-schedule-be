import 'reflect-metadata';
import express, { NextFunction, Request, Response } from 'express';
import { createConnection } from 'typeorm';
import routes from './routes';
import { initializeLocationTypes } from './models/LocationType/initialize';
import { sendError } from './shared/sendError';

createConnection().then(async () => {
  await initializeLocationTypes();
  const app = express();

  app.use(express.json());
  app.use(routes);

  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.name === 'UnauthorizedError') {
      res.status(401).json(sendError('Unauthorized!'));
    }
  });
  app.listen(8000, () => console.log('listening...'));
}).catch((error) => console.log(error));
