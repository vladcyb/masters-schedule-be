import express from 'express';
import { createConnection } from 'typeorm';
import 'reflect-metadata';
import routes from './routes';

createConnection().then(async () => {
  const app = express();

  app.use(routes);

  app.listen(8000, () => console.log('listening...'));
}).catch((error) => console.log(error));
