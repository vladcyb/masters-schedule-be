import 'reflect-metadata';
import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import { createConnection } from 'typeorm';
import routes from './routes';
import { initializeLocationTypes } from './models/LocationType/initialize';

createConnection().then(async () => {
  await initializeLocationTypes();
  const app = express();

  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }));
  app.use(cookieParser());

  app.use(express.json());
  app.use(routes);

  app.listen(8000, () => console.log('listening...'));
}).catch((error) => console.log(error));
