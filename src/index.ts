import express from 'express';
import { createConnection } from 'typeorm';
import routes from './routes';
import 'reflect-metadata';

createConnection().then(async () => {
  const app = express();

  app.use(routes);

  app.listen(8000, () => console.log('listening...'));
}).catch((error) => console.log(error));
